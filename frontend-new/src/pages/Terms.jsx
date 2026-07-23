import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const updated = "24 July 2026";

function Sec({ n, title, children }) {
  return (
    <div id={`term-${n}`}>
      <h2 className="font-display text-xl">{n}. {title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Legal</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-8 space-y-3 text-sm leading-relaxed text-foreground/90">
          <p>
            These Terms and Conditions ("Terms", "Agreement") govern your access to and use of the
            website rynspireedu.com (the "Website") and the online tutoring services made available
            through it (the "Services"), operated by <strong>SpireEdu Services</strong> under the brand{" "}
            <strong>RynSpireEdu</strong> ("we", "us", "our"). This is a legally binding agreement between
            you (the "Customer", "you", "your" — being the parent, guardian, or adult learner using our
            Services) and us.
          </p>
          <p>
            By accessing the Website, booking a free demo session, or purchasing a tutoring plan, you
            confirm that you have read, understood, and agree to be bound by these Terms, our{" "}
            <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>, and any
            policies referenced within them. If you do not agree, please do not use the Website or our
            Services.
          </p>
          <p>You must be at least 18 years old to book Services on behalf of a student.</p>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-xl">About us</h2>
          <p className="mt-3 text-sm text-foreground/90">
            RynSpireEdu is a brand operated by SpireEdu Services. We provide live, 1-to-1 online tutoring
            for K-12 students, primarily serving families in Australia and New Zealand.
          </p>
          <p className="mt-2 text-sm text-foreground/90">You can contact us:</p>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
            <li>By email at <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a></li>
            <li>Via our <a className="text-primary underline" href="/contact">Contact Us</a> page</li>
          </ul>
        </div>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground/90">

          <Sec n="1" title="Definitions and Interpretation">
            <p>In these Terms, the following words have the following meanings:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>"Account"</strong> means a registered login on the Website used to access Services, a dashboard, or session materials.</li>
              <li><strong>"Customer" / "you"</strong> means the parent, legal guardian, or adult learner who books a Demo Session or purchases a Plan.</li>
              <li><strong>"Demo Session"</strong> means the free, no-payment trial tutoring session offered via our Book Free Demo page.</li>
              <li><strong>"Plan"</strong> means a paid tutoring package (e.g. monthly, quarterly, half-yearly, yearly, or single-session) as described on our Pricing page.</li>
              <li><strong>"Session"</strong> means an individual live, 1-to-1 online tutoring class delivered under a Plan or as a Demo Session.</li>
              <li><strong>"Tutor"</strong> means an individual engaged by us to deliver Sessions to Customers.</li>
              <li><strong>"Website"</strong> means rynspireedu.com and any associated subdomains or applications.</li>
            </ul>
            <p>Headings are for reference only and do not affect interpretation. Words such as "including" are not limiting.</p>
          </Sec>

          <Sec n="2" title="Description of our Services">
            <p>
              RynSpireEdu directly engages and coordinates Tutors to deliver live, 1-to-1 online tutoring
              Sessions to Customers, primarily via video conferencing tools such as Google Meet or Zoom.
              Unlike a marketplace or directory, we are not merely introducing you to an independent
              third party — we coordinate the matching, scheduling, and quality of the Sessions delivered
              under your Plan.
            </p>
            <p>
              Session availability, subjects offered, and scheduling are subject to Tutor availability and
              our operating hours, which currently exclude Sundays. We reserve the right to change our
              operating days/hours, subjects offered, or the format of Sessions at our discretion, with
              reasonable notice where practicable.
            </p>
          </Sec>

          <Sec n="3" title="Eligibility and Account Registration">
            <p>By booking a Demo Session, purchasing a Plan, or creating an Account, you represent that:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>you are at least 18 years old, or are booking as the parent/legal guardian of the student;</li>
              <li>the information you provide (name, contact details, student details) is accurate and complete;</li>
              <li>you have the authority to consent to the collection and use of the student's information as described in our Privacy Policy;</li>
              <li>you will keep your Account credentials (where applicable) confidential and are responsible for activity under your Account.</li>
            </ul>
            <p>
              We may suspend or terminate an Account that provides false or misleading information, or is
              used in a manner inconsistent with these Terms.
            </p>
          </Sec>

          <Sec n="4" title="Free Demo Sessions">
            <p>
              We offer a free, no-payment-required Demo Session so families can experience our teaching
              style before committing to a Plan. Booking a Demo Session does not obligate you to purchase
              any Plan, and no payment details are required to book one.
            </p>
            <p>
              Demo Sessions must be booked at least 1 hour in advance and are not available on Sundays. We
              reserve the right to limit the number of Demo Sessions offered per household or to decline a
              request where slots are unavailable. By booking a Demo Session you consent to being contacted
              by our team regarding your enquiry, in accordance with our Privacy Policy.
            </p>
          </Sec>

          <Sec n="5" title="Plans, Fees and Payment">
            <p>
              Prices for Plans are displayed on our Pricing page in your selected currency for convenience;
              the amount actually charged is confirmed at checkout before payment. Payments are processed
              securely by our payment partner, Razorpay. We do not store your full card details.
            </p>
            <p>
              Each Plan includes a fixed number of Sessions to be used within the stated validity period
              (e.g. monthly, quarterly, half-yearly, yearly). Sessions are scheduled by mutual agreement
              between you and the assigned Tutor, subject to availability. Unused Sessions do not carry
              over automatically beyond a Plan's stated validity period unless we agree otherwise in writing.
            </p>
            <p>
              Where a Plan renews on a recurring basis, we will make this clear at the point of purchase.
              You are responsible for reviewing your Plan's renewal terms before purchase.
            </p>
          </Sec>

          <Sec n="6" title="Cancellations, Rescheduling and Refunds">
            <ul className="space-y-2 list-disc pl-5">
              <li>Individual Sessions may be rescheduled with at least 12 hours' notice, subject to Tutor availability.</li>
              <li>Sessions missed without adequate notice, or where the student is unavailable at the scheduled time, are not eligible for refund or make-up unless agreed by us at our discretion.</li>
              <li>Refund requests for Sessions not yet delivered are reviewed on a case-by-case basis and may be granted at our discretion, less any payment processing fees already incurred.</li>
              <li>No refunds are provided for Sessions already completed.</li>
              <li>Where you are entitled to a refund, it will be issued to the original payment method within a reasonable period.</li>
            </ul>
          </Sec>

          <Sec n="7" title="Your Obligations">
            <p>When using our Services, you agree to:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>provide accurate information about the student's learning needs, class/grade level, and subject requirements;</li>
              <li>ensure the student has a reasonably stable internet connection and a suitable device for the Session;</li>
              <li>ensure the student attends Sessions punctually and behaves respectfully towards the Tutor;</li>
              <li>not record, redistribute, or publicly share Session content without our prior written consent and the Tutor's consent;</li>
              <li>use the Website and Services only for lawful, personal/family educational purposes.</li>
            </ul>
          </Sec>

          <Sec n="8" title="Our Service Standards; No Guarantee of Results">
            <p>
              We select and coordinate Tutors with reasonable care and skill, and aim to match students
              with a Tutor suited to their learning style, curriculum, and pace. However, we do not
              guarantee specific grades, exam outcomes, or results, as these depend on many factors outside
              our control, including student engagement, prior academic level, and external circumstances.
            </p>
          </Sec>

          <Sec n="9" title="Intellectual Property">
            <p>
              All content on the Website — including our logo, branding, design, text, and any proprietary
              teaching materials we provide — is owned by or licensed to SpireEdu Services and protected by
              applicable intellectual property laws. You may not copy, reproduce, distribute, or create
              derivative works from our content without our prior written consent, except for your personal,
              non-commercial use in connection with your Plan.
            </p>
          </Sec>

          <Sec n="10" title="Data Protection and Privacy">
            <p>
              Our collection and use of your personal information, and information about your child, is
              governed by our <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>,
              which forms part of these Terms. This includes our handling of information in accordance
              with the Australian Privacy Principles, the New Zealand Privacy Act 2020 where applicable,
              and our overseas data handling practices as disclosed there.
            </p>
          </Sec>

          <Sec n="11" title="Prohibited Conduct">
            <p>You agree not to:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>use the Website or Services for any unlawful, harmful, or fraudulent purpose;</li>
              <li>harass, abuse, or behave inappropriately towards any Tutor or member of our team;</li>
              <li>attempt to gain unauthorised access to our systems, other users' accounts, or data;</li>
              <li>upload or transmit any virus, malicious code, or attempt to disrupt the Website;</li>
              <li>misrepresent your identity or the student's information;</li>
              <li>contract directly with a Tutor introduced via our Services to bypass our Plans, during your engagement with us and for 12 months after it ends.</li>
            </ul>
            <p>
              We may suspend or terminate access, without refund of remaining Sessions, in cases of abusive
              behaviour, harassment, fraud, or material misuse of the Website.
            </p>
          </Sec>

          <Sec n="12" title="Limitation of Liability">
            <p>
              Nothing in these Terms limits or excludes our liability for death or personal injury caused
              by our negligence, fraud, or any other liability which cannot be limited or excluded under
              applicable law (including any non-excludable consumer guarantees under the Australian
              Consumer Law or New Zealand Consumer Guarantees Act, where applicable to you).
            </p>
            <p>
              Subject to the above, to the maximum extent permitted by law: (a) we exclude all conditions,
              warranties, and representations not expressly set out in these Terms; and (b) our aggregate
              liability to you arising from or in connection with these Terms and the Services will not
              exceed the total amount you paid to us for the Plan giving rise to the claim in the twelve
              (12) months preceding the event.
            </p>
            <p>
              We will not be liable for indirect or consequential loss, loss of opportunity, or loss arising
              from circumstances outside our reasonable control (including internet outages, device failure,
              or Tutor illness — in which case we will make reasonable efforts to reschedule affected Sessions).
            </p>
          </Sec>

          <Sec n="13" title="Indemnity">
            <p>
              You agree to indemnify and hold us harmless from any claims, losses, damages, and expenses
              (including reasonable legal fees) arising from your breach of these Terms, misuse of the
              Website, or provision of inaccurate information to us, except to the extent caused by our
              own negligence or breach of these Terms.
            </p>
          </Sec>

          <Sec n="14" title="Suspension and Termination">
            <p>
              We may suspend or terminate your access to the Services, without refund of unused Sessions,
              where you materially breach these Terms, provide false information, or engage in conduct we
              reasonably consider harmful to us, our Tutors, or other Customers. You may stop using our
              Services at any time by ceasing to book Sessions and notifying us if you wish to close your
              Account.
            </p>
          </Sec>

          <Sec n="15" title="Complaints">
            <p>
              If you have a complaint about our Services, billing, or a Tutor's conduct, please email{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>{" "}
              with details. We aim to acknowledge complaints within 2 business days and provide a substantive
              response within 7 business days. If we require further information, we will let you know.
            </p>
          </Sec>

          <Sec n="16" title="Governing Law and Dispute Resolution">
            <p>
              These Terms are governed by the laws of New South Wales, Australia, without regard to its
              conflict of law principles. For Customers located in New Zealand, nothing in this clause
              limits any mandatory protections available to you under New Zealand law.
            </p>
            <p>
              If a dispute arises, we encourage you to first contact us at{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>{" "}
              so we can attempt to resolve it informally. Nothing in this clause prevents you from exercising
              any non-excludable statutory rights available in your jurisdiction, including under the
              Australian Consumer Law.
            </p>
          </Sec>

          <Sec n="17" title="General Provisions">
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Changes to these Terms:</strong> we may update these Terms from time to time. Material changes will be reflected by updating the "Last updated" date above; continued use of the Services after changes take effect constitutes acceptance.</li>
              <li><strong>Assignment:</strong> you may not transfer your rights or obligations under these Terms without our written consent. We may transfer our rights and obligations to another entity, including in connection with a business transfer.</li>
              <li><strong>Severability:</strong> if any provision of these Terms is found invalid or unenforceable, the remaining provisions continue in full force.</li>
              <li><strong>No Waiver:</strong> our failure to enforce any provision of these Terms is not a waiver of our right to do so later.</li>
              <li><strong>Force Majeure:</strong> we are not liable for delays or failures in performance resulting from causes beyond our reasonable control, including internet/utility outages, natural disasters, or governmental action.</li>
              <li><strong>Entire Agreement:</strong> these Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Services, superseding any prior agreements on the same subject.</li>
              <li><strong>Notices:</strong> we may provide notices to you via email or by posting on the Website. Please ensure your contact details are kept up to date.</li>
            </ul>
          </Sec>

          <Sec n="18" title="Contact Us">
            <p>
              Questions about these Terms? Email us at{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
            </p>
          </Sec>

        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
