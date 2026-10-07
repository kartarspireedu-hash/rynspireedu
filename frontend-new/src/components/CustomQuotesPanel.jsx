import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Plus, Ban, Share2, MessageCircle } from "lucide-react";
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

// Clipboard write that works on phones/tablets too. navigator.clipboard is
// often blocked after an async call (the tap "gesture" is gone) or in
// in-app browsers, so fall back to a hidden textarea + execCommand.
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to legacy path */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// Native share sheet (WhatsApp, SMS, email…) where the device supports it.
async function shareLink(url, text) {
  if (navigator.share) {
    try { await navigator.share({ title: "RynSpireEdu payment link", text, url }); return true; } catch { return false; }
  }
  return false;
}

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
  const [newLink, setNewLink] = useState(null); // last created link, shown with Copy / Share / WhatsApp

  const loadQuotes = ({ showSpinner } = {}) => {
    if (showSpinner) setLoadingList(true);
    api.get("/admin/custom-quotes")
      .then(({ data }) => setQuotes(data))
      .catch(() => toast.error("Could not load past quotes"))
      .finally(() => { if (showSpinner) setLoadingList(false); });
  };

  useEffect(() => {
    loadQuotes({ showSpinner: true });
    // Same auto-refresh pattern as the rest of the admin dashboard, so a
    // newly completed payment shows up without a manual page reload.
    // Background refreshes don't show the spinner — only the first load.
    const interval = setInterval(() => loadQuotes(), 20000);
    return () => clearInterval(interval);
  }, []);

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
      setNewLink(data.url);
      if (await copyText(data.url)) toast.info("Link copied to clipboard");
      else toast.info("Link created — tap Copy below");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not create payment link");
    } finally {
      setBusy(false);
    }
  };

  const copy = async (url) => {
    if (await copyText(url)) toast.info("Link copied");
    else toast.error("Could not copy — press and hold the link to copy it");
  };

  const share = async (url) => {
    const shared = await shareLink(url, "Here is your secure payment link (valid for 15 minutes):");
    if (!shared) copy(url);
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

      <div className="mt-6 rounded-3xl border border-border bg-card p-4 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cq-amount">Amount *</Label>
            <Input id="cq-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" placeholder="e.g. 49.99" />
          </div>
          <div>
            <Label htmlFor="cq-currency">Currency *</Label>
            <select id="cq-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-base">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="cq-name">Parent/customer name *</Label>
            <Input id="cq-name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" />
          </div>
          <div>
            <Label htmlFor="cq-email">Customer email *</Label>
            <Input id="cq-email" required type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" />
          </div>
          <div>
            <Label htmlFor="cq-child-name">Child's name *</Label>
            <Input id="cq-child-name" required value={childName} onChange={(e) => setChildName(e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" />
          </div>
          <div>
            <Label htmlFor="cq-child-grade">Child's grade *</Label>
            <Input id="cq-child-grade" required value={childGrade} onChange={(e) => setChildGrade(e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" placeholder="e.g. Grade 8" />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="cq-note">Note (optional — shown to the customer, e.g. plan description)</Label>
          <Input id="cq-note" value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" placeholder="e.g. Custom 6-month Physics plan" />
        </div>
        <Button onClick={createQuote} disabled={busy} className="mt-6 w-full sm:w-auto h-11 pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
          {busy ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Plus size={14} className="mr-1.5" />} Create payment link
        </Button>
        <p className="mt-2 text-[11px] text-muted-foreground">Links expire automatically 15 minutes after creation.</p>

        {newLink && (
          <div className="mt-5 rounded-2xl border border-accent/40 bg-accent/10 p-4" data-testid="new-link-box">
            <p className="text-xs font-medium">Your new payment link</p>
            <input
              readOnly
              value={newLink}
              onFocus={(e) => e.target.select()}
              className="mt-2 w-full rounded-xl border border-input bg-background px-3 h-11 text-base sm:text-sm font-mono"
              aria-label="New payment link"
            />
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button variant="outline" className="h-11" onClick={() => copy(newLink)}><Copy size={14} className="mr-1.5" /> Copy</Button>
              <Button variant="outline" className="h-11" onClick={() => share(newLink)}><Share2 size={14} className="mr-1.5" /> Share</Button>
              <Button asChild variant="outline" className="h-11">
                <a href={`https://wa.me/?text=${encodeURIComponent(newLink)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} className="mr-1.5" /> WhatsApp</a>
              </Button>
            </div>
          </div>
        )}
      </div>

      <h3 className="mt-10 font-display text-lg">Recent links</h3>
      {loadingList && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
      {!loadingList && quotes.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No custom links created yet.</p>}
      <div className="mt-3 space-y-2">
        {quotes.map((q) => {
          const canRevoke = q.display_status === "pending";
          return (
            <div key={q.token} className="rounded-xl border border-border bg-card/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <div className="font-medium break-words">{displayAmount(q.amount, q.currency)} {q.note ? `· ${q.note}` : ""}</div>
                <div className="text-xs text-muted-foreground break-words">
                  {q.customer_name || q.customer_email || "No customer info"}
                  {q.child_name ? ` · For ${q.child_name}${q.child_grade ? ` (${q.child_grade})` : ""}` : ""}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[q.display_status] || ""}`}>
                    {q.display_status.replace(/_/g, " ")}
                  </span>
                  <ExpiryCountdown expiresAt={q.expires_at} status={q.display_status} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:shrink-0">
                <Button variant="outline" size="sm" className="h-10 flex-1 sm:flex-none" onClick={() => copy(q.url)}>
                  <Copy size={13} className="mr-1" /> Copy
                </Button>
                {canRevoke && (
                  <Button variant="ghost" size="sm" className="h-10 w-10" onClick={() => revoke(q)} title="Revoke this link" aria-label="Revoke link">
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
