import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { validateEmail } from "@/lib/validators";

// Not linked anywhere in navigation, the footer, or the sitemap — only
// reachable by whoever has the exact /pay/<token> link an admin generated.
// The charged amount always comes from the server-stored quote, never
// from anything in this page, so the link can't be tampered with.
export default function CustomPay() {
  const { token } = useParams();
  const [quote, setQuote] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    api.get(`/custom-quotes/${token}`)
      .then(({ data }) => {
        setQuote(data);
        if (data.customer_name) setName(data.customer_name);
        if (data.status === "paid") setPaid(true);
      })
      .catch((e) => setLoadError(e.response?.data?.detail || "This payment link is invalid or has expired."));
  }, [token]);

  const displayAmount = (minorAmount, currency) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(minorAmount / 100);

  const payNow = async () => {
    if (!name.trim()) return toast.error("Please enter your name.");
    const emailError = validateEmail(email);
    if (emailError) return toast.error(emailError);
    setBusy(true);
    try {
      const { data: order } = await api.post(`/custom-quotes/${token}/create-order`);
      await openRazorpayCheckout({
        keyId: order.key_id,
        order,
        planKey: quote?.note || "Custom Payment",
        customer: { name, email },
        onSuccess: async (resp) => {
          try {
            await api.post(`/custom-quotes/${token}/verify`, {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            setPaid(true);
          } catch (e) {
            toast.error(e.response?.data?.detail || "Payment verification failed");
          }
        },
        onDismiss: () => toast.info("Payment cancelled"),
        onError: (err) => toast.error(err?.description || err?.message || "Payment failed"),
      });
    } catch (e) {
      toast.error(e.response?.data?.detail || e.message || "Could not start checkout");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-10 pb-20 max-w-md mx-auto">
        {loadError && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
            <AlertCircle className="mx-auto text-destructive" size={28} />
            <h1 className="mt-3 font-display text-xl">Link not valid</h1>
            <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
            <Button asChild className="mt-5 pill-btn bg-primary text-primary-foreground">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        )}

        {!loadError && paid && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center" data-testid="custom-pay-success">
            <CheckCircle2 className="mx-auto text-accent" size={28} />
            <h1 className="mt-3 font-display text-xl">Payment received</h1>
            <p className="mt-2 text-sm text-muted-foreground">Thank you! We'll be in touch shortly to confirm next steps.</p>
          </div>
        )}

        {!loadError && !paid && quote && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8" data-testid="custom-pay-form">
            <h1 className="font-display text-2xl">Complete your payment</h1>
            {quote.note && <p className="mt-1 text-sm text-muted-foreground">{quote.note}</p>}

            <div className="mt-6 rounded-2xl bg-secondary/60 border border-border p-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount due</span>
              <span className="font-semibold price-amount text-xl">{displayAmount(quote.amount, quote.currency)}</span>
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <Label htmlFor="pay-name">Your name *</Label>
                <Input id="pay-name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="pay-email">Email *</Label>
                <Input id="pay-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 rounded-xl" />
              </div>
            </div>

            <Button
              onClick={payNow}
              disabled={busy}
              className="mt-6 w-full pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {busy ? (<><Loader2 size={14} className="mr-1.5 animate-spin" /> Opening secure payment…</>) : (<><ShieldCheck size={14} className="mr-1.5" /> Pay {displayAmount(quote.amount, quote.currency)}</>)}
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">Payments are processed securely by Razorpay. We never see your card details.</p>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
