import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const updated = "17 July 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Legal</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <p>
            RynSpireEdu (a brand of SpireEdu Services, "we", "us", "our") provides online tutoring
            services to families in Australia, New Zealand and worldwide. This Privacy Policy explains
            what personal information we collect, how we use it, and the choices you have.
          </p>

          <div>
            <h2 className="font-display text-xl">1. Information we collect</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Parent/guardian and student name, email address and phone number.</li>
              <li>Country and city, so we can match you with an appropriately timed tutor.</li>
              <li>Student grade/class and subject of interest.</li>
              <li>Demo booking details (preferred date, time and timezone).</li>
              <li>Messages you send us via our contact form or live chat.</li>
              <li>Payment details processed securely by our payment partner, Razorpay — we never see or store your full card number.</li>
              <li>Basic usage data (pages visited, general location) via cookies and analytics/advertising pixels.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">2. How we use your information</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>To schedule and deliver free demo sessions and paid tutoring plans.</li>
              <li>To communicate with you about bookings, payments and support.</li>
              <li>To improve our website, curriculum and tutor matching.</li>
              <li>To measure the effectiveness of our marketing (e.g. via Meta/Facebook Pixel).</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Third parties we share data with</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Razorpay</strong> — for processing payments securely.</li>
              <li><strong>Google Sheets/Workspace</strong> — for internal booking and enquiry management.</li>
              <li><strong>Tawk.to</strong> — for live chat support.</li>
              <li><strong>Meta (Facebook) Pixel</strong> — for measuring ad performance. You can opt out of personalised ads via your Meta ad settings.</li>
              <li>Email delivery providers, solely to send booking and account-related emails.</li>
            </ul>
            <p className="mt-3">We do not sell your personal information to third parties.</p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Children's information</h2>
            <p className="mt-3">
              Our tutoring is designed for K-12 students. Information about a student is always
              submitted to us by a parent or guardian, who confirms they have the authority to do so.
              If you believe a child has provided us information without appropriate parental consent,
              please contact us and we will promptly remove it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Data retention</h2>
            <p className="mt-3">
              We retain booking, enquiry and payment records for as long as needed to provide our
              services and meet legal/accounting obligations, after which they are deleted or anonymised.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Your rights</h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of your personal information at any
              time by emailing <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
              Depending on where you live, you may have additional rights under local privacy law
              (e.g. the Australian Privacy Act 1988, the NZ Privacy Act 2020, or the EU GDPR).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">7. Cookies</h2>
            <p className="mt-3">
              We use cookies and similar technologies to keep the site working smoothly and to
              understand how visitors use it. You can control cookies through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">8. Changes to this policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. Material changes will be reflected
              by updating the "Last updated" date above.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">9. Contact us</h2>
            <p className="mt-3">
              Questions about this policy? Email <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
