import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, Clock, ExternalLink, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import FloatingCTA from "@/components/FloatingCTA";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BLOG_ARTICLES } from "@/data/blogArticles";

// Pull a bare URL out of a "Publisher: "Title" - Date - https://..." source
// string, so we can render it as a real link instead of plain text.
function extractUrl(sourceText) {
  const m = sourceText.match(/https?:\/\/\S+/);
  return m ? m[0].replace(/[).,]+$/, "") : null;
}

function ArticleBody({ blocks }) {
  return (
    <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/85">
      {blocks.map((b, i) => {
        if (b.type === "heading") {
          return (
            <h2 key={i} className="font-display text-xl sm:text-2xl !mt-12 !mb-1">
              {b.text}
            </h2>
          );
        }
        if (b.type === "list") {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}

export default function BlogArticle() {
  const { slug } = useParams();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) return <Navigate to="/blog" replace />;

  const hasFaqs = article.faqs?.length > 0;
  const url = `https://rynspireedu.com/blog/${article.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.metaDescription,
      "url": url,
      "mainEntityOfPage": url,
      "datePublished": article.datePublished,
      "dateModified": article.datePublished,
      "publisher": { "@type": "EducationalOrganization", "name": "RynSpireEdu", "url": "https://rynspireedu.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rynspireedu.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://rynspireedu.com/blog" },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": url },
      ],
    },
  ];
  if (hasFaqs) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a },
      })),
    });
  }

  return (
    <div className="min-h-screen">
      <Seo title={article.metaTitle} description={article.metaDescription} />
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}

      <SiteHeader />
      <FloatingCTA />

      <article className="container-x pt-12 pb-20 max-w-2xl mx-auto">
        <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/blog" className="hover:text-primary">Guides</Link>
          <span className="mx-1.5">/</span>
          <span>{article.title}</span>
        </nav>

        <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.1]">{article.title}</h1>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={12} /> {article.readingTimeMin} min read
        </div>

        {article.tldr && (
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-foreground/85">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary/80 mb-1.5">In short</p>
            {article.tldr}
          </div>
        )}

        <ArticleBody blocks={article.body} />

        {hasFaqs && (
          <div className="mt-12">
            <h2 className="font-display text-xl sm:text-2xl mb-2">Frequently asked questions</h2>
            <Accordion type="single" collapsible>
              {article.faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-foreground/80">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {article.sources?.length > 0 && (
          <div className="mt-12 border-t border-border pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3">Sources</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {article.sources.map((s, i) => {
                const link = extractUrl(s);
                const label = s.replace(/\s*-?\s*https?:\/\/\S+\s*$/, "").trim();
                return (
                  <li key={i}>
                    {link ? (
                      <a href={link} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-start gap-1 hover:text-primary">
                        <span>{label}</span> <ExternalLink size={11} className="shrink-0 mt-0.5" />
                      </a>
                    ) : (
                      s
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-14 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
          <p className="font-display text-lg">Ready to see your child thrive?</p>
          <p className="mt-1 text-sm text-muted-foreground">Book a free 25-minute demo. No credit card required.</p>
          <Button asChild size="lg" className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground px-7 mt-4">
            <Link to="/book-demo"><Sparkles size={16} className="mr-1.5" /> Book Free Demo</Link>
          </Button>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
