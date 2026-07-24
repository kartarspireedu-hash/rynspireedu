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
            These Terms and Conditions (together, the "Terms", this "Agreement") set out the terms upon
            which access to and use of the website rynspireedu.com (the "Website") and the online tutoring
            services made available thereby (the "Services") are granted by SpireEdu Services, operating
            under the trading name RynSpireEdu ("we", "us", "our", the "Company"), to the person accessing
            or using the same (the "Customer", "you", "your", being the parent, legal guardian, or adult
            learner availing of the Services). This Agreement constitutes a legally binding contract as
            between the Customer and the Company.
          </p>
          <p>
            By accessing the Website, submitting a booking for a Demo Session, or procuring a Plan, the
            Customer thereby represents and warrants that they have read, understood, and agree to be bound
            by this Agreement, together with the Company's{" "}
            <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a> and any other
            policy incorporated herein by reference. Should the Customer not agree to be so bound, the
            Customer shall not access or make use of the Website or the Services.
          </p>
          <p>The Customer warrants that they are of not less than eighteen (18) years of age where booking Services on behalf of a student.</p>
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
              The availability of Sessions, subjects offered, and scheduling windows are subject to Tutor
              availability and our standard operating calendar, as may be published or made available via
              the booking interface of the Website from time to time. We reserve the right, in our sole
              discretion, to determine, vary, restrict, or amend such operating calendar, minimum advance
              booking periods, subjects offered, or the format in which Sessions are delivered, at any time
              and without liability to you, provided that reasonable notice shall be given where practicable
              in respect of any material adverse variation affecting a confirmed booking.
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
              We make available, at our sole discretion, a complimentary, no-payment Demo Session for the
              purpose of enabling prospective Customers to evaluate our teaching methodology prior to
              procuring a Plan. The booking of a Demo Session shall not, of itself, constitute or give rise
              to any obligation on the part of the Customer to procure a Plan, and no payment instrument
              shall be required to effect such booking.
            </p>
            <p>
              Demo Sessions are made available subject to such scheduling parameters, minimum notice
              periods, and calendar availability as are displayed via the booking interface of the Website
              from time to time, which parameters we may vary at our sole discretion without prior notice.
              We further reserve the right to limit the number of Demo Sessions extended to any household or
              individual, or to decline any request where capacity is unavailable. By submitting a booking
              for a Demo Session, you consent to being contacted by our representatives in respect of your
              enquiry, in accordance with our Privacy Policy.
            </p>
          </Sec>

          <Sec n="5" title="Plans, Fees and Payment">
            <p>
              The prices applicable to Plans are displayed on the Pricing page of the Website in the
              currency selected by the Customer, for informational convenience only; the amount to be
              charged shall be confirmed at the point of checkout prior to the effecting of payment.
              Payments hereunder are processed by the Company's third-party payment processor, Razorpay,
              and the Company does not, at any time, store or retain the Customer's full card credentials.
            </p>
            <p>
              Each Plan shall entitle the Customer to a fixed number of Sessions, to be availed of within
              the validity period stipulated for such Plan (whether monthly, quarterly, half-yearly, or
              annual, as applicable). Sessions shall be scheduled by mutual agreement between the Customer
              and the assigned Tutor, subject always to availability. Sessions not availed of within the
              stipulated validity period shall not, save as otherwise agreed by the Company in writing,
              carry over to any subsequent period.
            </p>
            <p>
              Where a Plan is subject to automatic, recurring renewal, such fact shall be disclosed to the
              Customer at the point of purchase, and it shall remain the Customer's responsibility to
              review the applicable renewal terms prior to procuring the same.
            </p>
          </Sec>

          <Sec n="6" title="Cancellations, Rescheduling and Refunds">
            <ul className="space-y-2 list-disc pl-5">
              <li>Individual Sessions may be rescheduled upon not less than twelve (12) hours' prior notice, subject to Tutor availability.</li>
              <li>Sessions not attended in the absence of adequate notice, or in circumstances where the student is unavailable at the scheduled time, shall not be eligible for refund or substitution, save where the Company, in its sole discretion, agrees otherwise.</li>
              <li>Requests for refund in respect of Sessions not yet delivered shall be considered on a case-by-case basis and may be granted at the Company's sole discretion, net of any payment processing fees already incurred.</li>
              <li>No refund shall be made in respect of Sessions already delivered.</li>
              <li>Where a refund is due to the Customer, the same shall be remitted to the original payment instrument within a reasonable period.</li>
            </ul>
          </Sec>

          <Sec n="7" title="Your Obligations">
            <p>In availing of the Services, the Customer covenants and agrees to:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>furnish accurate particulars concerning the student's learning requirements, grade level, and subject preferences;</li>
              <li>ensure that the student has access to a reasonably stable internet connection and a device suitable for the conduct of the Session;</li>
              <li>ensure the student's punctual attendance and conduct in a manner respectful towards the Tutor;</li>
              <li>refrain from recording, redistributing, or publicly disseminating Session content absent the Company's and the Tutor's prior written consent;</li>
              <li>make use of the Website and the Services solely for lawful, personal, and familial educational purposes.</li>
            </ul>
          </Sec>

          <Sec n="8" title="Our Service Standards; No Guarantee of Results">
            <p>
              The Company shall exercise reasonable care and skill in the selection and coordination of
              Tutors, and shall use reasonable endeavours to match students with a Tutor suited to their
              learning style, curriculum, and pace of study. Notwithstanding the foregoing, the Company does
              not warrant or guarantee any particular grade, examination outcome, or academic result, the
              same being dependent upon numerous factors beyond the Company's control, including without
              limitation student engagement, pre-existing academic standing, and external circumstance.
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
              This Agreement, and any dispute or claim arising out of or in connection with it or its
              subject matter (including non-contractual disputes or claims), shall be governed by and
              construed in accordance with the laws of India, and the parties irrevocably agree that the
              courts of Chandigarh, Punjab shall have exclusive jurisdiction to settle any such dispute or
              claim, without regard to conflict of law principles. Nothing in this clause shall operate to
              exclude or limit any non-excludable statutory right or protection to which a Customer may be
              entitled under the mandatory consumer protection legislation of the jurisdiction in which the
              Customer is ordinarily resident, including, without limitation, the Australian Consumer Law or
              the Consumer Guarantees Act 1993 (New Zealand), to the extent such legislation applies and
              cannot lawfully be excluded or limited by agreement between the parties.
            </p>
            <p>
              Prior to the commencement of any formal proceedings, the parties agree to make reasonable,
              good-faith efforts to resolve any dispute informally by contacting{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
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
