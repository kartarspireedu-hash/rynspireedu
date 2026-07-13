import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTA from "@/components/FloatingCTA";
import MobileStickyBar from "@/components/MobileStickyBar";
import BrandMark from "@/components/BrandMark";

export default function About() {
  return (
    <div className="min-h-screen">
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
            RynSpireEdu — a brand of <strong className="text-foreground">SpireEdu Services</strong> — was founded on a simple belief:
            the future of education is deeply personal. We do not sell recorded courses. We do not run a marketplace of freelancers.
            We build long-term relationships between one student and one exceptional tutor.
          </p>
          <p>
            Our tutors are curated, trained and supported by an academic panel that has taught in leading schools across
            Australia, New Zealand, Singapore and the United Kingdom. Every plan is bespoke. Every parent is kept in the loop.
          </p>
          <p>
            We start with K–12 in Australia and New Zealand, expanding to the USA, Canada, UK, Singapore and the Middle East.
            Beyond schooling, we grow into competitive exams, language learning, coding and adult upskilling —
            with the same commitment to premium, human-first teaching.
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
