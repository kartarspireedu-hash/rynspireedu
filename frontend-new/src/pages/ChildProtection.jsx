import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ShieldCheck } from "lucide-react";

const updated = "25 July 2026";

export default function ChildProtection() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 flex items-center gap-2"><ShieldCheck size={14} /> Legal &amp; Safety</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Child Protection &amp; Online Safety</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <p>
            RynSpireEdu is committed to providing a safe, respectful, and appropriate learning environment
            for every student. As we work with children and young people, we take our responsibility for
            their safety and wellbeing seriously. This policy sets out the measures we take, and what to do
            if you have a concern.
          </p>

          <div>
            <h2 className="font-display text-xl">1. Tutor Screening</h2>
            <p className="mt-3">
              We take reasonable steps to verify the identity, academic qualifications, and suitability of
              Tutors before they are permitted to deliver Sessions, and we provide guidance to Tutors on
              expected standards of conduct when working with students.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. Sessions Are Conducted Online, With Parental Oversight Encouraged</h2>
            <p className="mt-3">
              All Sessions are delivered live, online, via video conferencing (such as Google Meet or Zoom).
              We encourage parents and guardians to remain reasonably contactable and, where practical, to
              be aware of when Sessions are taking place, particularly for younger students. Parents may
              request to observe or join a Session.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Standards of Conduct</h2>
            <p className="mt-3">Tutors are expected at all times to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>conduct Sessions in a professional, respectful, and age-appropriate manner;</li>
              <li>communicate with students only through official, monitored channels associated with their Session, not personal social media or messaging accounts;</li>
              <li>avoid any private, one-on-one contact with a student outside of scheduled Sessions;</li>
              <li>immediately report any safeguarding concern to our team.</li>
            </ul>
            <p className="mt-3">
              Any breach of these standards is treated seriously and may result in a Tutor's immediate
              removal from the platform.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Recording and Monitoring</h2>
            <p className="mt-3">
              We may, from time to time, review or request recordings of Sessions for quality assurance and
              safeguarding purposes. Students and parents should not share Session recordings publicly, and
              any request to record a Session for personal use should be directed to us in advance.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Online Safety Guidance for Families</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Ensure the device used for Sessions is in a shared or visible space within the home where practical.</li>
              <li>Do not share account passwords or Session links with anyone outside your household.</li>
              <li>Encourage your child to tell you if anything said or shown during a Session makes them uncomfortable.</li>
              <li>Report any concerning behaviour to us immediately — do not wait for a scheduled check-in.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Reporting a Concern</h2>
            <p className="mt-3">
              If you have any concern about a Tutor's conduct, a Session, or your child's safety in
              connection with our Services, please contact us immediately at{" "}
              <a className="text-primary underline" href="mailto:care@rynspireedu.com">care@rynspireedu.com</a>.
              We treat all safeguarding concerns seriously and confidentially, and will investigate promptly.
              Where a concern involves suspected harm to a child, you should also contact your local police
              or child protection authority without delay.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">7. Data Relating to Children</h2>
            <p className="mt-3">
              Our collection and handling of information about students is governed by our{" "}
              <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>, including our
              consent and data-minimisation practices in respect of children's information.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">8. Review of This Policy</h2>
            <p className="mt-3">
              We review this policy periodically and may update it to reflect improvements to our
              safeguarding practices.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
