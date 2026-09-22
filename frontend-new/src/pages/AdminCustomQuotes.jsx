import { useEffect, useState } from "react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Plus } from "lucide-react";
import api from "@/lib/api";

// Deliberately not linked anywhere in the site nav or admin dashboard —
// reachable only at this exact URL, and still requires admin/owner login
// (ProtectedRoute in App.jsx) since an unlisted link alone is not real
// access control.
const CURRENCIES = ["USD", "AUD", "NZD", "GBP", "EUR", "CAD", "SGD", "AED", "CNY"];

export default function AdminCustomQuotes() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
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
    setBusy(true);
    try {
      const minorAmount = Math.round(numeric * 100);
      const { data } = await api.post("/admin/custom-quotes", {
        amount: minorAmount, currency,
        customer_name: customerName || undefined,
        customer_email: customerEmail || undefined,
        note: note || undefined,
      });
      toast.success("Payment link created");
      setAmount(""); setCustomerName(""); setCustomerEmail(""); setNote("");
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

  const displayAmount = (minorAmount, curr) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: curr }).format(minorAmount / 100);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-10 pb-20 max-w-2xl mx-auto">
        <h1 className="font-display text-2xl">Custom payment links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a one-off, custom-priced payment link for a specific client. Not listed anywhere on the site — only
          people you send the link to can find it. The charged amount is locked server-side, so the link can't be tampered with.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
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
              <Label htmlFor="cq-name">Customer name (optional)</Label>
              <Input id="cq-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="cq-email">Customer email (optional)</Label>
              <Input id="cq-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="cq-note">Note (shown to the customer, e.g. plan description)</Label>
            <Input id="cq-note" value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5 rounded-xl" placeholder="e.g. Custom 6-month Physics plan" />
          </div>
          <Button onClick={createQuote} disabled={busy} className="mt-6 pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            {busy ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Plus size={14} className="mr-1.5" />} Create payment link
          </Button>
        </div>

        <h2 className="mt-10 font-display text-lg">Recent links</h2>
        {loadingList && <p className="mt-3 text-sm text-muted-foreground">Loading…</p>}
        {!loadingList && quotes.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No custom links created yet.</p>}
        <div className="mt-3 space-y-2">
          {quotes.map((q) => (
            <div key={q.token} className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <div className="font-medium">{displayAmount(q.amount, q.currency)} {q.note ? `· ${q.note}` : ""}</div>
                <div className="text-xs text-muted-foreground truncate">{q.customer_name || q.customer_email || "No customer info"} · {q.status}</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => copy(q.url)} className="shrink-0">
                <Copy size={13} className="mr-1" /> Copy link
              </Button>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
