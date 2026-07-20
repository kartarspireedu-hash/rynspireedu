import { useNavigate, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTA from "@/components/FloatingCTA";
import MobileStickyBar from "@/components/MobileStickyBar";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { PLANS, PLAN_INCLUDES } from "@/lib/plans";

export default function Pricing() {
  const { format } = useCurrency();
  const navigate = useNavigate();

  const goToCheckout = (plan) => navigate("/checkout", { state: { planKey: plan.key } });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <FloatingCTA />
      <section className="container-x pt-14 sm:pt-16 pb-12">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Pricing</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            One-to-one tutoring, <span className="gold-underline">priced with clarity.</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            All plans include live 1-to-1 lessons, a personal tutor, and progress reports. Cancel or pause anytime.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-xs text-muted-foreground">Prices shown in</span>
            <CurrencySwitcher />
          </div>
        </div>

        {/* PLANS — all 5, one consistent grid, ordered smallest to largest commitment */}
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
          {PLANS.map((p) => {
            const perSession = p.perSessionUsd ? format(p.perSessionUsd, { showDecimals: true }) : null;
            return (
              <div
                key={p.key}
                data-testid={`plan-${p.key}`}
                className={`rounded-3xl border p-6 flex flex-col bg-card card-lift relative ${
                  p.highlight
                    ? "border-accent shadow-[0_18px_60px_rgba(212,175,55,0.18)] ring-1 ring-accent/30 lg:-translate-y-2"
                    : "border-border"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-accent text-accent-foreground shadow">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl">{p.name}</h3>
                </div>
                {p.tag && (
                  <span className={`mt-2 w-fit text-[11px] px-2 py-1 rounded-full border ${p.highlight ? "bg-accent/25 border-accent/60 text-accent-foreground" : "bg-secondary border-border text-primary"}`}>
                    {p.tag}
                  </span>
                )}

                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="price-amount text-3xl sm:text-4xl">{format(p.priceUsd)}</span>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-[0.1em]">{p.perLabel}</span>
                  </div>
                  {perSession && (
                    <p className="mt-1.5 text-xs text-muted-foreground">≈ {perSession}/class · {p.sessions} total</p>
                  )}
                </div>

                <ul className="mt-4 space-y-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 size={14} className="text-accent mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                  {p.saveUsd && (
                    <li className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 size={14} className="text-accent mt-0.5 shrink-0" />
                      Save <strong className="ml-0.5">{format(p.saveUsd)}</strong>
                    </li>
                  )}
                </ul>

                <Button
                  onClick={() => goToCheckout(p)}
                  className={`mt-6 pill-btn text-sm ${p.highlight
                    ? "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"}`}
                  data-testid={`plan-cta-${p.key}`}
                >
                  Choose {p.name}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Every plan includes — full-width band */}
        <div className="mt-8 rounded-3xl border border-primary/30 bg-gradient-to-br from-secondary via-background to-accent/10 p-7">
          <div className="flex items-center gap-2 text-primary"><Sparkles size={14} className="text-accent" /><p className="text-xs uppercase tracking-[0.2em]">Every plan includes</p></div>
          <h3 className="mt-2 font-display text-2xl">The full RynSpireEdu experience</h3>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {PLAN_INCLUDES.map((f) => (
              <div key={f} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> {f}</div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"><Link to="/book-demo"><Sparkles size={14} className="mr-1.5" /> Book Free Demo First</Link></Button>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          Base prices in USD. Local prices are indicative and refreshed periodically. Final charge shown at checkout in your selected currency.
        </p>
      </section>
      <SiteFooter />
      <MobileStickyBar />
    </div>
  );
}
