import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const updated = "25 July 2026";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Legal</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <p>
            This Terms of Use governs general access to and browsing of the website rynspireedu.com (the
            "Website"), operated by SpireEdu Services under the trading name RynSpireEdu ("we", "us",
            "our"). It is distinct from, and supplements, our{" "}
            <a href="/terms" className="text-primary underline">Payment Terms &amp; Conditions</a>, which
            govern the purchase of tutoring Plans specifically.
          </p>

          <div>
            <h2 className="font-display text-xl">1. Acceptance</h2>
            <p className="mt-3">
              By accessing or browsing the Website, you agree to be bound by this Terms of Use. If you do
              not agree, please discontinue use of the Website.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. Permitted Use</h2>
            <p className="mt-3">You may access and use the Website for lawful, personal, non-commercial purposes connected with evaluating or receiving our tutoring Services. You agree not to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>copy, scrape, reproduce, or redistribute any content from the Website without our prior written consent;</li>
              <li>use any automated system (including bots or scrapers) to access the Website in a manner that sends more requests than a human could reasonably produce;</li>
              <li>attempt to gain unauthorised access to any part of the Website, our servers, or any connected systems;</li>
              <li>introduce any virus, malware, or other harmful code to the Website;</li>
              <li>use the Website in any way that breaches applicable law or infringes the rights of any third party.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Intellectual Property</h2>
            <p className="mt-3">
              All content on the Website, including text, graphics, logos, and design, is owned by or
              licensed to SpireEdu Services and is protected by applicable intellectual property law. No
              licence is granted to you other than to view the Website for its intended purpose.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Third-Party Links and Services</h2>
            <p className="mt-3">
              The Website may contain links to, or embed, third-party services (including payment
              processing, live chat, and advertising measurement tools). We are not responsible for the
              content, accuracy, or practices of third-party websites or services, and your use of them is
              subject to their own terms and privacy policies.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Availability and Disclaimers</h2>
            <p className="mt-3">
              We aim to keep the Website available and error-free but do not guarantee uninterrupted or
              error-free access, and we may suspend, withdraw, or restrict availability of all or part of
              the Website at any time. Content on the Website is provided for general informational purposes
              and does not constitute professional advice.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
              or consequential loss arising from your use of, or inability to use, the Website, save to the
              extent such liability cannot be excluded under applicable law.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">7. Changes</h2>
            <p className="mt-3">
              We may amend this Terms of Use from time to time by posting an updated version on this page.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">8. Governing Law</h2>
            <p className="mt-3">
              This Terms of Use is governed by the laws of India, and the courts of Chandigarh, Punjab shall
              have exclusive jurisdiction over any dispute arising in connection with it, without prejudice
              to any non-excludable statutory right available to you under the law of your place of
              residence.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">9. Contact</h2>
            <p className="mt-3">
              Questions about this Terms of Use? Email{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
