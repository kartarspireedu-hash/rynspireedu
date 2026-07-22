import SiteHeader from "@/components/SiteHeader";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTA from "@/components/FloatingCTA";
import MobileStickyBar from "@/components/MobileStickyBar";
import BrandMark from "@/components/BrandMark";

export default function About() {
  return (
    <div className="min-h-screen">
      <Seo
        title="About RynSpireEdu | Online Tutoring for Australia & New Zealand"
        description="RynSpireEdu delivers premium 1-to-1 online tutoring for K-12 students across Australia and New Zealand, expanding soon to the US, Canada, UK, Europe and the Middle East."
      />
      <SiteHeader />
      <FloatingCTA />
      <section className="container-x py-20 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">About</p>
        <div className="mt-3 mb-6"><BrandMark size="lg" withLogo={false} /></div>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05]">
          A studio of educators. A platform built for outcomes.
        </h1>
        <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            RynSpireEdu was founded on a simple belief: the future of education is deeply personal.
            We do not sell recorded courses. We do not run a marketplace of freelancers. We build
            long-term relationships between one student and one exceptional tutor.
          </p>
          <p>
            Our tutors are curated, trained and supported by an academic panel with experience teaching
            in leading schools. Every plan is bespoke. Every parent is kept in the loop, with weekly
            progress updates and full visibility into how their child is learning.
          </p>
          <p>
            Today, RynSpireEdu is focused on delivering an outstanding K–12 tutoring experience for
            families across <strong className="text-foreground">Australia and New Zealand</strong>.
            As we grow, we plan to bring the same 1-to-1, human-first approach to students in the
            <strong className="text-foreground"> United States, Canada, the Middle East, the United Kingdom and Europe</strong>.
          </p>
          <p className="text-sm">
            For anything — questions, feedback, partnerships — email <a href="mailto:care@rynspireedu.com" className="text-primary hover:underline">care@rynspireedu.com</a>. You&apos;ll hear back within 24 hours.
          </p>
        </div>
      </section>
      <SiteFooter />
      <MobileStickyBar />
    </div>
  );
}
