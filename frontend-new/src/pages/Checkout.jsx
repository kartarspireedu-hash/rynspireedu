import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useCurrency, FX } from "@/context/CurrencyContext";
import { PLANS } from "@/lib/plans";
import api from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";

// Note: since we no longer offer INR pricing to visitors, everyone is charged
// in one of these currencies. If your Razorpay account does not have
// International Payments enabled, only USD may work reliably — talk to
// Razorpay support if non-INR charges fail with "authentication failed".
const RAZORPAY_SUPPORTED_CURRENCIES = ["USD", "AUD", "NZD", "GBP", "EUR", "CAD", "SGD", "AED", "CNY"];

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currency, format } = useCurrency();
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const plan = PLANS.find((p) => p.key === state?.planKey);

  if (!plan) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <section className="container-x py-24 text-center max-w-md mx-auto">
          <h1 className="font-display text-2xl">No plan selected</h1>
          <p className="mt-2 text-muted-foreground text-sm">Please choose a plan from our Pricing page to continue to checkout.</p>
          <Button asChild className="mt-6 pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            <Link to="/pricing">View plans</Link>
          </Button>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const payNow = async () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      toast.error("Please enter your name and email so we can send your receipt.");
      return;
    }
    if (!agreed) {
      toast.error("Please accept the Payment Terms & Conditions to continue.");
      return;
    }
    const chargeCurrency = RAZORPAY_SUPPORTED_CURRENCIES.includes(currency) ? currency : "USD";
    const fx = FX[chargeCurrency];
    const minorAmount = Math.round(plan.priceUsd * fx.rate * 100);
    setBusy(true);
    try {
      const { data: order } = await api.post("/payments/create-order", {
        plan_key: plan.key,
        amount: minorAmount,
        currency: chargeCurrency,
      });
      await openRazorpayCheckout({
        keyId: order.key_id,
        order,
        planKey: plan.name,
        customer: { name: customerName, email: customerEmail },
        onSuccess: async (resp) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              plan_key: plan.key,
              customer_email: customerEmail,
              customer_name: customerName,
            });
            navigate("/payment-success", {
              state: {
                planName: plan.name,
                paymentId: resp.razorpay_payment_id,
                amountDisplay: format(plan.priceUsd),
              },
            });
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
      <section className="container-x pt-10 pb-20 max-w-xl mx-auto">
        <Link to="/pricing" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground w-fit">
          <ArrowLeft size={12} /> Back to plans
        </Link>

        <h1 className="mt-4 font-display text-3xl sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-muted-foreground text-sm">Review your order, then proceed to secure payment.</p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8" data-testid="checkout-summary">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">{plan.name}</h2>
            {plan.tag && <span className="text-xs px-2 py-1 rounded-full bg-secondary border border-border text-primary">{plan.tag}</span>}
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="price-amount text-4xl">{format(plan.priceUsd)}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-[0.15em]">{plan.perLabel}</span>
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2"><CheckCircle2 size={15} className="text-accent mt-0.5 shrink-0" /> {f}</li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-secondary/60 border border-border p-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total due today</span>
            <span className="font-semibold price-amount text-xl">{format(plan.priceUsd)}</span>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkout-name">Your name *</Label>
              <Input id="checkout-name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1.5 rounded-xl" data-testid="checkout-name" />
            </div>
            <div>
              <Label htmlFor="checkout-email">Email (for your receipt) *</Label>
              <Input id="checkout-email" required type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1.5 rounded-xl" data-testid="checkout-email" />
            </div>
          </div>

          <label className="mt-6 flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" data-testid="checkout-terms-checkbox" />
            <span>
              I have read and accept the{" "}
              <Link to="/terms" target="_blank" className="text-primary underline">Payment Terms &amp; Conditions</Link>
              {" "}and{" "}
              <Link to="/privacy-policy" target="_blank" className="text-primary underline">Privacy Policy</Link>.
            </span>
          </label>

          <Button
            onClick={payNow}
            disabled={busy}
            className="mt-6 w-full pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="checkout-pay-btn"
          >
            {busy ? (<><Loader2 size={14} className="mr-1.5 animate-spin" /> Opening secure payment…</>) : (<><ShieldCheck size={14} className="mr-1.5" /> Proceed to Payment</>)}
          </Button>
          <p className="mt-3 text-[11px] text-muted-foreground text-center">Payments are processed securely by Razorpay. We never see your card details.</p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
