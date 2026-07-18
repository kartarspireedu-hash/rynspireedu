import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const updated = "17 July 2026";

export default function Terms() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Legal</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Payment Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <p>
            These Terms govern your purchase of tutoring plans from RynSpireEdu, a brand of
            SpireEdu Services ("we", "us", "our"). By proceeding to payment, you agree to these Terms.
          </p>

          <div>
            <h2 className="font-display text-xl">1. Our services</h2>
            <p className="mt-3">
              We provide live, 1-to-1 online tutoring for K-12 students in subjects including English,
              Mathematics, Science and others as listed on our Pricing page. A free demo session is
              available before any purchase, with no payment required.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. Pricing and currency</h2>
            <p className="mt-3">
              Prices are set in USD and shown in your selected local currency for convenience only;
              displayed local-currency amounts are indicative and may vary slightly with exchange
              rates. The amount actually charged is confirmed on the checkout screen before you pay.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Payment processing</h2>
            <p className="mt-3">
              Payments are processed securely by Razorpay. We do not store your full card details.
              By paying, you also agree to Razorpay's own terms of service for payment processing.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Plan validity &amp; scheduling</h2>
            <p className="mt-3">
              Each plan includes a fixed number of 60-minute sessions to be used within the stated
              period (e.g. monthly, quarterly). Sessions are scheduled by mutual agreement between the
              family and assigned tutor, subject to tutor availability.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Cancellations, rescheduling &amp; refunds</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Individual sessions may be rescheduled with at least 12 hours' notice, subject to tutor availability.</li>
              <li>Unused sessions do not carry over automatically beyond the plan's stated validity period unless agreed in writing.</li>
              <li>Refund requests are reviewed on a case-by-case basis and may be granted at our discretion for sessions not yet delivered, less any payment processing fees already incurred.</li>
              <li>No refunds are provided for sessions already completed or missed without adequate notice.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">6. No guarantee of results</h2>
            <p className="mt-3">
              While our tutors are committed to helping students improve, we cannot guarantee specific
              grades, exam outcomes or results, as these depend on many factors outside our control.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">7. Acceptable use</h2>
            <p className="mt-3">
              Sessions must be conducted respectfully. We reserve the right to suspend or terminate
              access, without refund of remaining sessions, in cases of abusive behaviour, harassment,
              or misuse of the platform.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">8. Limitation of liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, our liability to you arising from these Terms is
              limited to the amount you paid for the plan giving rise to the claim.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">9. Changes to these Terms</h2>
            <p className="mt-3">
              We may update these Terms from time to time. Continued use of our services after an
              update constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">10. Contact</h2>
            <p className="mt-3">
              Questions about billing or these Terms? Email <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
