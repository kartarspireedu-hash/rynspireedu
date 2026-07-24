import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const updated = "25 July 2026";

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Legal</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Cancellation Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <p>
            This Cancellation Policy explains how you may cancel or reschedule a Demo Session or an
            individual Session under a Plan with RynSpireEdu. It should be read together with our{" "}
            <a href="/terms" className="text-primary underline">Payment Terms &amp; Conditions</a> and our{" "}
            <a href="/refund-policy" className="text-primary underline">Refund Policy</a>.
          </p>

          <div>
            <h2 className="font-display text-xl">1. Cancelling a Demo Session</h2>
            <p className="mt-3">
              Demo Sessions may be cancelled or rescheduled at any time prior to the scheduled start time by
              contacting <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>{" "}
              or via our live chat. As Demo Sessions are provided free of charge, no fees or penalties apply.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. Rescheduling a Paid Session</h2>
            <p className="mt-3">
              Individual Sessions under an active Plan may be rescheduled with at least 12 hours' notice
              prior to the scheduled start time, subject to Tutor availability. To reschedule, contact your
              coordinator or email <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>{" "}
              with your preferred alternative time.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Late Cancellations and No-Shows</h2>
            <p className="mt-3">
              Sessions cancelled with less than 12 hours' notice, or where the student is not available or
              does not join at the scheduled time, will ordinarily be treated as delivered and deducted from
              your Plan, as our Tutors reserve that time exclusively for your child. We may make an exception
              at our discretion in genuine emergency circumstances.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Cancelling a Plan</h2>
            <p className="mt-3">
              Where a Plan is a fixed-term package (e.g. monthly, quarterly, half-yearly, or yearly), it may
              be cancelled at any time by written request to{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
              Cancellation takes effect from the date of our written acknowledgement. Any entitlement to a
              refund for Sessions not yet delivered is governed by our{" "}
              <a href="/refund-policy" className="text-primary underline">Refund Policy</a>.
            </p>
            <p className="mt-3">
              Where a Plan is set to renew automatically, cancellation must be requested prior to the
              renewal date to prevent the next billing cycle from being charged.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Cancellations Initiated by Us</h2>
            <p className="mt-3">
              We will make reasonable efforts to reschedule any Session that we are unable to deliver due to
              Tutor unavailability, illness, or technical disruption on our part, at no additional cost to
              you and without deduction from your Plan.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Contact</h2>
            <p className="mt-3">
              For any cancellation or rescheduling request, email{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
