import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const updated = "22 July 2026";

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
            RynSpireEdu ("we", "us", "our") is a trading name of SpireEdu Services, a business based in
            India, which provides live, one-to-one online tutoring services principally to families
            resident in Australia and New Zealand. This Privacy Policy sets forth the manner in which
            personal information is collected, used, stored, disclosed, and safeguarded by us, together with
            the rights available to individuals in respect thereof.
          </p>
          <p>
            We endeavour to handle personal information in a manner consistent with the Australian Privacy
            Principles (APPs) constituted under the Privacy Act 1988 (Cth), the Privacy Act 2020 (New
            Zealand) insofar as applicable, and such data protection law as may from time to time be
            applicable in India.
          </p>
          <p>
            By making use of the Website, submitting an enquiry, or effecting a booking for a Demo Session
            — whether via the Website, a Facebook or Instagram lead form, or otherwise — the individual
            concerned thereby signifies their agreement to the practices set out in this Privacy Policy.
          </p>

          <div>
            <h2 className="font-display text-xl">1. Information we collect</h2>
            <p className="mt-3">We collect the following categories of personal information:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Contact details:</strong> your name, email address, and phone number.</li>
              <li><strong>Information about your child:</strong> their year level, subjects, and learning goals, which you provide as their parent or legal guardian.</li>
              <li><strong>Enquiry details:</strong> your preferred start timing, tutoring goals, and any messages you send us.</li>
              <li><strong>Technical and usage data:</strong> IP address, browser type, device information, pages visited, and referring source, collected automatically through cookies and similar technologies (see Section 8).</li>
            </ul>
            <p className="mt-3">
              We do not knowingly collect information directly from children. Information about a child is
              provided by, and collected from, the responsible parent or guardian.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. How we collect information</h2>
            <p className="mt-3">We collect personal information:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>directly from you when you complete a form on our website, a Meta (Facebook/Instagram) lead form, or our booking page;</li>
              <li>when you contact us by phone, email, or messaging;</li>
              <li>automatically through cookies, our website analytics, and the Meta Pixel when you visit our site.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Why we collect and use your information</h2>
            <p className="mt-3">We use your personal information solely to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>respond to your enquiry and arrange your free demo session;</li>
              <li>match your child with a suitable tutor and deliver tutoring services;</li>
              <li>contact you about your enquiry, booking, and our services;</li>
              <li>improve our website, services, and marketing;</li>
              <li>meet our legal and record-keeping obligations.</li>
            </ul>
            <p className="mt-3">We will not use your personal information for unrelated purposes, and we will not sell your personal information.</p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Consent regarding children's information</h2>
            <p className="mt-3">
              Our services relate to tutoring for school-age children. Where you provide information about
              your child, you confirm that you are the child's parent or legal guardian and that you consent
              to us collecting and using that information for the purposes described in this policy.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Overseas disclosure of personal information</h2>
            <p className="mt-3">
              RynSpireEdu is operated from India. When you submit personal information to us, it is
              transferred to, stored, and processed on systems located in India. By providing your
              information, you acknowledge that it will be disclosed to and handled by our team in India.
              We take reasonable steps to ensure any overseas recipient handles your information consistently
              with the Australian Privacy Principles. However, once disclosed overseas, your information may
              also be subject to the laws of India, which may differ from Australian or New Zealand privacy law.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Disclosure to third parties</h2>
            <p className="mt-3">We may disclose your personal information to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>our tutors and staff, to deliver the services you request;</li>
              <li>service providers who support our operations (for example, scheduling, communications, hosting, and analytics providers), under confidentiality obligations;</li>
              <li>advertising and technology platforms such as Meta, where you interact with our ads or forms (see Section 8);</li>
              <li>authorities or third parties where required or permitted by law.</li>
            </ul>
            <p className="mt-3">We do not disclose your personal information to third parties for their own independent marketing purposes without your consent.</p>
          </div>

          <div>
            <h2 className="font-display text-xl">7. How we store and protect your information</h2>
            <p className="mt-3">
              We take reasonable technical and organisational steps to protect your personal information from
              misuse, loss, and unauthorised access, modification, or disclosure. We retain personal
              information only for as long as necessary to fulfil the purposes described in this policy or as
              required by law, after which it is securely deleted or de-identified.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">8. Cookies, analytics, and the Meta Pixel</h2>
            <p className="mt-3">
              We use cookies and similar technologies, categorised as follows:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Essential cookies</strong> — required for the Website to function (e.g. remembering your cookie preferences) and cannot be disabled.</li>
              <li><strong>Analytics &amp; ad-measurement cookies</strong> — including the Meta Pixel, which allows us to measure the effectiveness of our advertising on Facebook and Instagram and understand actions taken on our site.</li>
              <li><strong>Live chat cookies</strong> — used by our chat provider, Tawk.to, to operate the chat widget and maintain your conversation.</li>
            </ul>
            <p className="mt-3">
              On your first visit, you will be presented with a cookie banner allowing you to accept all
              cookies, reject all non-essential cookies, or customise your preferences by category. You may
              change your preferences at any time via the "Cookie Preferences" link in the website footer,
              and you can further manage ad preferences through the settings on Facebook and Instagram.
              Disabling non-essential cookies may affect some website functionality (for example, the live
              chat widget will not load).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">9. Your rights</h2>
            <p className="mt-3">You may:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>request access to the personal information we hold about you;</li>
              <li>request correction of information that is inaccurate or out of date;</li>
              <li>request deletion of your personal information;</li>
              <li>withdraw consent or opt out of marketing communications at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
              We will respond within a reasonable period.
            </p>
            <p className="mt-3">
              If you are in Australia and are not satisfied with our response, you may lodge a complaint with
              the Office of the Australian Information Commissioner (OAIC) at{" "}
              <a className="text-primary underline" href="https://oaic.gov.au" target="_blank" rel="noreferrer">oaic.gov.au</a>.
              If you are in New Zealand, you may contact the Office of the Privacy Commissioner at{" "}
              <a className="text-primary underline" href="https://privacy.org.nz" target="_blank" rel="noreferrer">privacy.org.nz</a>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">10. Changes to this policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. The current version will always be
              available on this page, with the "Last updated" date revised accordingly.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">11. Contact us</h2>
            <p className="mt-3">
              For any questions about this Privacy Policy or how we handle your personal information:<br />
              <strong>SpireEdu Services</strong><br />
              Email: <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
