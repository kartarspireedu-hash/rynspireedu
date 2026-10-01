import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle, Lock, CreditCard, Clock, Ban } from "lucide-react";
import api from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { validateEmail } from "@/lib/validators";

// Live "mm:ss until expiry" the payer can see too — not just the admin
// dashboard. Once it hits zero, the pay button disables itself below.
function ExpiryCountdown({ expiresAt, onExpire }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const remainingMs = new Date(expiresAt).getTime() - now;
  useEffect(() => { if (remainingMs <= 0) onExpire?.(); }, [remainingMs <= 0]);
  if (remainingMs <= 0) return null;
  const mm = Math.floor(remainingMs / 60000);
  const ss = Math.floor((remainingMs % 60000) / 1000);
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
      <Clock size={12} /> This link expires in <span className="font-mono font-medium text-foreground">{mm}:{String(ss).padStart(2, "0")}</span>
    </div>
  );
}

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
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [paid, setPaid] = useState(false);
  const [expiredNow, setExpiredNow] = useState(false);

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
    if (!agreed) return toast.error("Please agree to the Terms, Cancellation and Refund policies to continue.");
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

  const isExpired = expiredNow || quote?.status === "expired";
  const isRevoked = quote?.status === "revoked";
  const isBlocked = isExpired || isRevoked;

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

        {!loadError && !paid && quote && isRevoked && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center" data-testid="custom-pay-revoked">
            <Ban className="mx-auto text-destructive" size={28} />
            <h1 className="mt-3 font-display text-xl">This link is no longer active</h1>
            <p className="mt-2 text-sm text-muted-foreground">This payment link was disabled. Please contact us for a new one.</p>
            <Button asChild className="mt-5 pill-btn bg-primary text-primary-foreground">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        )}

        {!loadError && !paid && quote && isExpired && !isRevoked && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center" data-testid="custom-pay-expired">
            <Clock className="mx-auto text-muted-foreground" size={28} />
            <h1 className="mt-3 font-display text-xl">This link has expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">For your security, payment links are only valid for 15 minutes. Please ask for a new one.</p>
            <Button asChild className="mt-5 pill-btn bg-primary text-primary-foreground">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        )}

        {!loadError && !paid && quote && !isBlocked && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8" data-testid="custom-pay-form">
            <h1 className="font-display text-2xl">Complete your payment</h1>
            {quote.note && <p className="mt-1 text-sm text-muted-foreground">{quote.note}</p>}
            {quote.child_name && (
              <p className="mt-1 text-sm text-muted-foreground">For: {quote.child_name}{quote.child_grade ? ` (${quote.child_grade})` : ""}</p>
            )}

            <div className="mt-6 rounded-2xl bg-secondary/60 border border-border p-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount due</span>
              <span className="font-semibold price-amount text-xl">{displayAmount(quote.amount, quote.currency)}</span>
            </div>

            {quote.expires_at && (
              <div className="mt-3">
                <ExpiryCountdown expiresAt={quote.expires_at} onExpire={() => setExpiredNow(true)} />
              </div>
            )}

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

            <div className="mt-5 flex items-start gap-2.5">
              <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" data-testid="custom-pay-terms-checkbox" />
              <label className="text-xs text-muted-foreground leading-relaxed">
                I agree to RynSpireEdu's{" "}
                <Link to="/terms-of-use" target="_blank" className="text-primary underline underline-offset-2">Terms of Use</Link>,{" "}
                <Link to="/cancellation-policy" target="_blank" className="text-primary underline underline-offset-2">Cancellation Policy</Link> and{" "}
                <Link to="/refund-policy" target="_blank" className="text-primary underline underline-offset-2">Refund Policy</Link>.
              </label>
            </div>

            <Button
              onClick={payNow}
              disabled={busy || !agreed}
              className="mt-5 w-full pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              data-testid="custom-pay-submit"
            >
              {busy ? (<><Loader2 size={14} className="mr-1.5 animate-spin" /> Opening secure payment…</>) : (<><ShieldCheck size={14} className="mr-1.5" /> Pay {displayAmount(quote.amount, quote.currency)}</>)}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px]"><Lock size={12} /> 256-bit encrypted</span>
              <span className="flex items-center gap-1 text-[11px]"><CreditCard size={12} /> All major cards accepted</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground text-center">Payments are processed securely by Razorpay. We never see your card details.</p>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
