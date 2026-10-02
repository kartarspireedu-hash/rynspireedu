import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Plus, Ban } from "lucide-react";
import api from "@/lib/api";

const CURRENCIES = ["USD", "AUD", "NZD", "GBP", "EUR", "CAD", "SGD", "AED", "CNY"];

const STATUS_STYLES = {
  paid: "text-emerald-600 bg-emerald-50 border-emerald-200",
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  expired: "text-muted-foreground bg-secondary border-border",
  revoked: "text-destructive bg-destructive/10 border-destructive/30",
  paid_but_revoked: "text-destructive bg-destructive/10 border-destructive/30",
  signature_mismatch: "text-destructive bg-destructive/10 border-destructive/30",
};

// Live "mm:ss until expiry" — ticks every second, same component used
// here (admin list) and on the payer-facing /pay/:token page, so both
// sides always show the same countdown.
function ExpiryCountdown({ expiresAt, status }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (status !== "pending") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [status]);

  if (status !== "pending" || !expiresAt) return null;
  const remainingMs = new Date(expiresAt).getTime() - now;
  if (remainingMs <= 0) return <span className="text-xs text-muted-foreground">Expired</span>;
  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000);
  return <span className="text-xs font-mono text-muted-foreground">Expires in {mm}:{String(ss).padStart(2, "0")}</span>;
}

export default function CustomQuotesPanel() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const loadQuotes = () => {
    setLoadingList(true);
    api.get("/admin/custom-quotes")
      .then(({ data }) => setQuotes(data))
      .catch(() => toast.error("Could not load past quotes"))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => { loadQuotes(); }, []);

  const createQuote = async () => {
    const numeric = parseFloat(amount);
    if (!numeric || numeric <= 0) return toast.error("Enter a valid amount.");
    if (!customerName.trim()) return toast.error("Parent/customer name is required.");
    if (!customerEmail.trim()) return toast.error("Customer email is required.");
    if (!childName.trim()) return toast.error("Child's name is required.");
    if (!childGrade.trim()) return toast.error("Child's grade is required.");
    setBusy(true);
    try {
      const minorAmount = Math.round(numeric * 100);
      const { data } = await api.post("/admin/custom-quotes", {
        amount: minorAmount, currency,
        customer_name: customerName || undefined,
        customer_email: customerEmail || undefined,
        child_name: childName || undefined,
        child_grade: childGrade || undefined,
        note: note || undefined,
      });
      toast.success("Payment link created — expires in 15 minutes");
      setAmount(""); setCustomerName(""); setCustomerEmail(""); setChildName(""); setChildGrade(""); setNote("");
      loadQuotes();
      navigator.clipboard?.writeText(data.url).catch(() => {});
      toast.info("Link copied to clipboard");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not create payment link");
    } finally {
      setBusy(false);
    }
  };

  const copy = (url) => {
    navigator.clipboard?.writeText(url).then(() => toast.info("Link copied"));
  };

  const revoke = async (q) => {
    if (!window.confirm(`Revoke this payment link (${displayAmount(q.amount, q.currency)})? The customer will no longer be able to pay through it.`)) return;
    try {
      await api.patch(`/admin/custom-quotes/${q.token}/revoke`);
      toast.success("Link revoked");
      loadQuotes();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not revoke link");
    }
  };

  const displayAmount = (minorAmount, curr) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: curr }).format(minorAmount / 100);

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Create a one-off, custom-priced payment link for a specific client. Not listed anywhere on the public
        site — only people you send the link to can find it. The charged amount is locked server-side, so the
        link can't be tampered with.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cq-amount">Amount *</Label>
            <Input id="cq-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 rounded-xl" placeholder="e.g. 49.99" />
          </div>
          <div>
            <Label htmlFor="cq-currency">Currency *</Label>
            <select id="cq-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="cq-name">Parent/customer name *</Label>
            <Input id="cq-name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="cq-email">Customer email *</Label>
            <Input id="cq-email" required type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="cq-child-name">Child's name *</Label>
            <Input id="cq-child-name" required value={childName} onChange={(e) => setChildName(e.target.value)} className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="cq-child-grade">Child's grade *</Label>
            <Input id="cq-child-grade" required value={childGrade} onChange={(e) => setChildGrade(e.target.value)} className="mt-1.5 rounded-xl" placeholder="e.g. Grade 8" />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="cq-note">Note (optional — shown to the customer, e.g. plan description)</Label>
          <Input id="cq-note" value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5 rounded-xl" placeholder="e.g. Custom 6-month Physics plan" />
        </div>
        <Button onClick={createQuote} disabled={busy} className="mt-6 pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
          {busy ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Plus size={14} className="mr-1.5" />} Create payment link
        </Button>
        <p className="mt-2 text-[11px] text-muted-foreground">Links expire automatically 15 minutes after creation.</p>
      </div>

      <h3 className="mt-10 font-display text-lg">Recent links</h3>
      {loadingList && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
      {!loadingList && quotes.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No custom links created yet.</p>}
      <div className="mt-3 space-y-2">
        {quotes.map((q) => {
          const canRevoke = q.display_status === "pending";
          return (
            <div key={q.token} className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <div className="font-medium">{displayAmount(q.amount, q.currency)} {q.note ? `· ${q.note}` : ""}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {q.customer_name || q.customer_email || "No customer info"}
                  {q.child_name ? ` · For ${q.child_name}${q.child_grade ? ` (${q.child_grade})` : ""}` : ""}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[q.display_status] || ""}`}>
                    {q.display_status.replace(/_/g, " ")}
                  </span>
                  <ExpiryCountdown expiresAt={q.expires_at} status={q.display_status} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="sm" onClick={() => copy(q.url)}>
                  <Copy size={13} className="mr-1" /> Copy
                </Button>
                {canRevoke && (
                  <Button variant="ghost" size="sm" onClick={() => revoke(q)} title="Revoke this link">
                    <Ban size={13} className="text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
