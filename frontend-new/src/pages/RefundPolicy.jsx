import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const updated = "25 July 2026";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Legal</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Refund Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <p>
            This Refund Policy explains when a refund may be available for a Plan purchased from
            RynSpireEdu. It forms part of, and should be read together with, our{" "}
            <a href="/terms" className="text-primary underline">Payment Terms &amp; Conditions</a> and our{" "}
            <a href="/cancellation-policy" className="text-primary underline">Cancellation Policy</a>.
          </p>

          <div>
            <h2 className="font-display text-xl">1. Demo Sessions</h2>
            <p className="mt-3">
              Demo Sessions are provided free of charge. As no payment is taken, no refund is applicable.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. Sessions Not Yet Delivered</h2>
            <p className="mt-3">
              Where you request cancellation of a Plan, any Sessions not yet delivered may be eligible for a
              refund, considered on a case-by-case basis at our discretion, calculated pro-rata to the
              number of Sessions remaining, less any payment processing fees already incurred by us in
              connection with your payment.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Sessions Already Delivered</h2>
            <p className="mt-3">
              No refund is available in respect of Sessions that have already been delivered, or Sessions
              which are treated as delivered under our{" "}
              <a href="/cancellation-policy" className="text-primary underline">Cancellation Policy</a>{" "}
              (for example, late cancellations or no-shows).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Service Quality Concerns</h2>
            <p className="mt-3">
              If you are dissatisfied with the quality of a Session or Tutor, please contact us at{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>{" "}
              within 7 days of the Session. We will investigate and, where we consider it appropriate, may
              offer a replacement Session with an alternative Tutor, a partial refund, or another remedy at
              our discretion.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. How Refunds Are Processed</h2>
            <p className="mt-3">
              Approved refunds are issued to the original payment method used at checkout, via our payment
              processor, Razorpay. Refunds are typically processed within 7-10 business days, though the
              time for funds to appear in your account depends on your bank or card issuer.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Non-Excludable Rights</h2>
            <p className="mt-3">
              Nothing in this Refund Policy limits any non-excludable statutory right or consumer guarantee
              to which you may be entitled under the mandatory consumer protection law of your jurisdiction
              of residence, including the Australian Consumer Law or the Consumer Guarantees Act 1993 (New
              Zealand), where applicable.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">7. Contact</h2>
            <p className="mt-3">
              To request a refund, email{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>{" "}
              with your booking or order reference.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
