import { useLocation, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const { state } = useLocation();
  const planName = state?.planName || "your plan";
  const paymentId = state?.paymentId || "";
  const amountDisplay = state?.amountDisplay || "";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="container-x flex-1 flex items-center justify-center py-20">
        <div className="max-w-lg w-full text-center rounded-3xl border border-border bg-card p-10">
          <CheckCircle2 size={56} className="mx-auto text-accent" />
          <h1 className="mt-5 font-display text-3xl">Payment successful!</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for choosing <strong>{planName}</strong>{amountDisplay ? ` — ${amountDisplay} paid.` : "."} Our team will reach out shortly to help you get started.
          </p>
          {paymentId && (
            <p className="mt-4 text-xs text-muted-foreground">
              Payment reference: <code>{paymentId}</code>
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              <Link to="/">Back to Home <ArrowRight size={14} className="ml-1.5" /></Link>
            </Button>
            <Button asChild variant="outline" className="pill-btn">
              <Link to="/book-demo">Book a Free Demo</Link>
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
