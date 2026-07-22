import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calculator, Atom, BookOpen, FlaskConical, Leaf, Cpu, Code2, Languages, GraduationCap, Trophy, TrendingUp, Zap, CheckCircle2, Star, ShieldCheck, Users, Video, Sparkles, Coins, HeartHandshake, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiveStudentTicker from "@/components/LiveStudentTicker";
import FloatingCTA from "@/components/FloatingCTA";
import MobileStickyBar from "@/components/MobileStickyBar";
import BrandMark from "@/components/BrandMark";
import Seo from "@/components/Seo";

const HERO_IMG = "https://images.unsplash.com/photo-1601097874965-f940d4f012b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwzfHxzdHVkZW50JTIwbGVhcm5pbmclMjBsYXB0b3B8ZW58MHx8fHwxNzgzNTU2MDA4fDA&ixlib=rb-4.1.0&q=85";
const PARENT_IMG = "https://images.unsplash.com/photo-1758687126864-96b61e1b3af0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHw0fHxzbWlsaW5nJTIwcGFyZW50JTIwcG9ydHJhaXR8ZW58MHx8fHwxNzgzNTU2MDA4fDA&ixlib=rb-4.1.0&q=85";

const subjects = [
  { icon: Calculator, name: "Mathematics" }, { icon: Atom, name: "Physics" },
  { icon: FlaskConical, name: "Chemistry" }, { icon: Leaf, name: "Biology" },
  { icon: BookOpen, name: "English" }, { icon: Cpu, name: "Computer Science" },
  { icon: Code2, name: "Coding & AI" }, { icon: Languages, name: "IELTS · PTE" },
  { icon: Trophy, name: "SAT · ACT" }, { icon: TrendingUp, name: "Economics" },
  { icon: GraduationCap, name: "Study Skills" }, { icon: Zap, name: "Custom Subjects" },
];

const testimonials = [
  { q: "Emma jumped two grades in six months. The tutor understands exactly how she learns.", a: "Rachel M.", r: "Parent · Sydney" },
  { q: "I got a Band 8.5 in IELTS. The personal study plan was a game changer.", a: "Arjun S.", r: "Student · Melbourne" },
  { q: "Weekly reports keep me involved without being intrusive. Absolutely brilliant.", a: "Jonathan P.", r: "Parent · Auckland" },
  { q: "My son went from failing Chemistry to top of his class in one term.", a: "Priya K.", r: "Parent · Brisbane" },
  { q: "The whiteboard sessions feel like being in the same room. I actually look forward to lessons.", a: "Zoe T.", r: "Student · Wellington" },
  { q: "Best decision we made for our daughter's NCEA prep. Genuinely caring tutors.", a: "David & Sarah W.", r: "Parents · Christchurch" },
  { q: "Selective schools test — cracked it thanks to RynSpireEdu's structured plan.", a: "Meera R.", r: "Parent · Perth" },
  { q: "The parent portal is incredible. I always know what's happening academically.", a: "Michael O.", r: "Parent · Adelaide" },
  { q: "I love that my tutor remembers everything from last week. It's actually one-to-one.", a: "Liam A.", r: "Student · Hamilton" },
  { q: "SAT prep for uni admissions — went from 1310 to 1480. Life-changing.", a: "Anaya P.", r: "Student · Gold Coast" },
  { q: "As a working mum, the flexibility and transparency is priceless.", a: "Fiona C.", r: "Parent · Canberra" },
  { q: "Coding lessons that actually made my kid a builder — he shipped his first app!", a: "Kabir S.", r: "Parent · Auckland" },
];

const businessSteps = [
  { icon: Users, t: "Parents enrol", d: "Families choose a plan that fits their child's goals — monthly, quarterly or yearly." },
  { icon: HeartHandshake, t: "We match a tutor", d: "Our academic panel personally selects the best tutor for personality, curriculum and pace." },
  { icon: Video, t: "Live lessons run", d: "Every week, your child meets their tutor 1-to-1 online — homework, feedback, and reports flow." },
  { icon: Coins, t: "Everyone wins", d: "Great tutors are rewarded for their craft, our coordinators are backed with real support, and the business scales in a way that lasts." },
];

function Eyebrow({ children }) {
  return <p className="text-xs uppercase tracking-[0.25em] text-primary/80">{children}</p>;
}

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div className="min-h-screen">
      <Seo
        title="RynSpireEdu - Best Online Tutoring Platform in Australia and New Zealand"
        description="Live, 1-to-1 online tutoring for K-12 students in Australia, New Zealand and worldwide. Book a free 25-minute demo class today with RynSpireEdu."
      />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "RynSpireEdu",
        "url": "https://rynspireedu.com",
        "description": "Live, 1-to-1 online tutoring for K-12 students across Australia, New Zealand and worldwide.",
        "areaServed": ["Australia", "New Zealand"],
        "email": "care@rynspireedu.com",
      })}</script>
      <SiteHeader />
      <FloatingCTA />

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden noise">
        <div className="aurora" />
        <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 -z-10">
          <img src={HERO_IMG} alt="Student learning with RynSpireEdu" className="w-full h-full object-cover opacity-25" />
          <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-background" />
        </motion.div>

        <div className="container-x pt-16 lg:pt-24 pb-16 text-center">
          <motion.div style={{ y: textY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-6 flex justify-center"><BrandMark size="xl" /></div>

            <Badge variant="outline" className="rounded-full px-3 py-1 border-accent/60 text-primary bg-accent/10" data-testid="hero-badge">
              <Sparkles size={12} className="mr-1.5 text-accent" /> Premium 1-to-1 Online Tutoring · K–12
            </Badge>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-4xl mx-auto">
              A <span className="gold-underline">tutor</span> as devoted <br className="hidden sm:inline" />
              to your child as you are.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Live, one-to-one lessons designed around your child. Personalised study plans, weekly progress reports, and full parent transparency<br className="hidden sm:inline" />
              — built for Australia, New Zealand and beyond.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-7 shadow-[0_10px_40px_rgba(107,33,168,0.25)]" data-testid="hero-cta-demo">
                <Link to="/book-demo"><Sparkles size={16} className="mr-1.5" /> Book Free 25-min Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="pill-btn px-7" data-testid="hero-cta-pricing">
                <Link to="/pricing">See Pricing <ArrowRight size={14} className="ml-1.5" /></Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-5 text-sm text-muted-foreground justify-center flex-wrap">
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary" /> Privacy compliant</div>
              <div className="flex items-center gap-2"><Star size={16} className="text-accent fill-accent" /> 4.9 avg tutor rating</div>
              <div className="flex items-center gap-2"><Clock size={16} className="text-primary" /> 25-min free demo</div>
            </div>
          </motion.div>
        </div>

        <div className="container-x pb-14 relative z-10">
          <LiveStudentTicker />
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="container-x py-16 sm:py-20 text-center border-t border-border">
        <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">Every subject. Every stage.</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Specialists for HSC, VCE, NCEA, IB, IGCSE, A-Levels, and US Common Core — from foundational literacy to competitive exams.
        </p>
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              data-testid={`subject-${i}`}
              className="card-lift group rounded-2xl border border-border p-5 bg-card flex items-center gap-3 text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center group-hover:bg-accent/25 transition-colors">
                <s.icon size={18} className="text-primary group-hover:text-accent-foreground" />
              </div>
              <span className="text-sm font-medium">{s.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-x py-16 sm:py-20 text-center border-t border-border">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl max-w-3xl mx-auto">Four steps to your first breakthrough lesson.</h2>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: "01", t: "Book a free demo", d: "Pick a slot in 30 seconds. Free 25-minute session, no card needed." },
            { n: "02", t: "Matched tutor", d: "A specialist chosen for personality, style and subject fit." },
            { n: "03", t: "Live 1-to-1 lessons", d: "HD video, interactive whiteboard, session recordings." },
            { n: "04", t: "Weekly reports", d: "Progress, homework, and next steps — visible to parents." },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border p-6 bg-card card-lift text-left"
            >
              <span className="font-mono text-xs text-accent">{s.n}</span>
              <h3 className="mt-3 font-display text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="relative py-20 sm:py-24 border-t border-border overflow-hidden">
        <div className="aurora" />
        <div className="container-x text-center">
          <Eyebrow>Who we build for</Eyebrow>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl max-w-3xl mx-auto">Built around students — funded by parents who care.</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We&apos;re not a freelancer marketplace. Every family that joins us is investing directly in their child&apos;s progress, and in return we run a real teaching studio — carefully matched tutors, a supported team, and a business built to last for the long run.
          </p>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {businessSteps.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative rounded-2xl p-6 border border-white/50 dark:border-white/10 bg-card/70 backdrop-blur-md card-lift"
              >
                <div className="h-11 w-11 rounded-xl bg-accent/20 grid place-items-center">
                  <s.icon size={18} className="text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-16 sm:py-20 border-t border-border">
        <div className="text-center">
          <Eyebrow>Loved by families</Eyebrow>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">Results, in their own words.</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Real feedback from parents and students across Australia and New Zealand.</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={`${t.a}-${t.r}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              data-testid={`testimonial-${i}`}
              className="relative rounded-2xl border border-border p-6 bg-card card-lift"
            >
              <div className="flex gap-1 mb-3">
                {["s1", "s2", "s3", "s4", "s5"].map((sid) => (<Star key={sid} size={14} className="text-accent fill-accent" />))}
              </div>
              <p className="font-display text-lg leading-snug">&ldquo;{t.q}&rdquo;</p>
              <footer className="mt-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">{t.a} — {t.r}</footer>
              <span className="absolute top-4 right-5 font-display text-4xl leading-none text-accent/40 select-none" aria-hidden>&ldquo;</span>
            </motion.blockquote>
          ))}
        </div>

        {/* FINAL CTA */}
        <div className="mt-14 relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-br from-secondary via-background to-accent/10 p-10 text-center max-w-4xl mx-auto">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" aria-hidden />
          <Heart size={22} className="mx-auto text-accent" />
          <p className="mt-4 font-display text-3xl lg:text-4xl">Ready to see your child thrive?</p>
          <p className="mt-3 text-sm text-muted-foreground">Book a free 25-minute demo. No credit card required.</p>
          <Button asChild size="lg" className="mt-6 pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-7" data-testid="footer-cta">
            <Link to="/book-demo">Book Free Demo <ArrowRight size={14} className="ml-1.5" /></Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
      <MobileStickyBar />
    </div>
  );
}
