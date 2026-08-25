import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Every answer here is grounded in something already verified elsewhere on
// the site (Pricing, BookDemo, legal pages) — nothing here states a new,
// unverified claim about ratings, counts, or tutor credentials.
const FAQS = [
  {
    q: "What is RynSpireEdu?",
    a: "RynSpireEdu is a live, 1-to-1 online tutoring platform for students from Kindergarten to Year 12, currently serving families in Australia, New Zealand, the United States and Canada.",
  },
  {
    q: "What subjects do you tutor?",
    a: "We cover core subjects including Mathematics, English, Science, Physics, Chemistry, Biology, Computer Science, Coding & AI, Economics, Business Studies and Social Studies, as well as test prep for IELTS, PTE, SAT and ACT. If your subject isn't listed, let us know when booking a demo — we'll do our best to match you with a suitable tutor.",
  },
  {
    q: "How does the free demo session work?",
    a: "You can book a free, no-payment-required 25-minute 1-to-1 demo session directly on our website. Choose your subject, preferred date and time, and we'll confirm your booking.",
  },
  {
    q: "What plans and pricing do you offer?",
    a: "We offer monthly, quarterly, half-yearly and yearly tutoring plans. Visit our Pricing page for full details and current rates.",
  },
  {
    q: "Which countries and time zones do you support?",
    a: "We currently serve families in Australia, New Zealand, the United States and Canada, with sessions scheduled around your local time zone.",
  },
  {
    q: "How do I cancel or get a refund?",
    a: "Our Cancellation Policy and Refund Policy pages set out the full terms for pausing, cancelling, or requesting a refund on a tutoring plan.",
  },
  {
    q: "How do you protect my child's safety online?",
    a: "Child safety is a core part of how we operate. Our Child Protection Policy explains the safeguards we follow for every tutoring session.",
  },
  {
    q: "How can I get in touch?",
    a: "You can reach us through our Contact Us page, by email at care@rynspireedu.com, or via WhatsApp using the button on our website.",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Frequently Asked Questions - RynSpireEdu"
        description="Answers to common questions about RynSpireEdu's online tutoring: subjects, pricing, demo sessions, countries served, cancellations, refunds and child safety."
      />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a,
          },
        })),
      })}</script>

      <SiteHeader />

      <section className="container-x pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Help</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Common questions about tutoring with RynSpireEdu. Can't find what you're looking for?{" "}
          <Link to="/contact" className="text-primary underline underline-offset-2">Contact us</Link>.
        </p>

        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} data-testid={`faq-item-${i}`}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/80">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SiteFooter />
    </div>
  );
}
