import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import FloatingCTA from "@/components/FloatingCTA";
import { BLOG_ARTICLES } from "@/data/blogArticles";

export default function BlogIndex() {
  return (
    <div className="min-h-screen">
      <Seo
        title="Blog - Tutoring Guides & Advice - RynSpireEdu"
        description="Practical guides on tutoring costs, choosing a tutor, HSC vs VCE vs NCEA, SAT vs ACT, NAPLAN, and more — for parents across Australia, New Zealand, the US and Canada."
      />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "RynSpireEdu Blog",
        "url": "https://rynspireedu.com/blog",
        "publisher": { "@type": "EducationalOrganization", "name": "RynSpireEdu" },
      })}</script>

      <SiteHeader />
      <FloatingCTA />

      <section className="container-x pt-12 pb-20 max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Guides</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Tutoring guides for parents.</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          Straight answers on cost, curricula, test prep and choosing the right tutor — for
          families across Australia, New Zealand, the US and Canada.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {BLOG_ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to={`/blog/${a.slug}`}
              data-testid={`blog-card-${a.slug}`}
              className="group block rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-primary/40"
            >
              <h2 className="font-display text-lg leading-snug group-hover:text-primary transition-colors">
                {a.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.tldr}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock size={12} /> {a.readingTimeMin} min read</span>
                <span className="inline-flex items-center gap-1 text-primary group-hover:gap-1.5 transition-all">
                  Read guide <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
