import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTA from "@/components/FloatingCTA";
import MobileStickyBar from "@/components/MobileStickyBar";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { PLANS, PLAN_INCLUDES } from "@/lib/plans";

export default function Pricing() {
  const { format } = useCurrency();
  const navigate = useNavigate();
  const subscriptionPlans = useMemo(() => PLANS.filter((p) => p.key !== "hourly"), []);

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

        {/* PLANS */}
        <div className="mt-12 grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {subscriptionPlans.map((p) => {
            const perSession = p.perSessionUsd ? format(p.perSessionUsd, { showDecimals: true }) : null;
            return (
              <div
                key={p.key}
                data-testid={`plan-${p.key}`}
                className={`rounded-3xl border p-7 flex flex-col bg-card card-lift ${
                  p.highlight
                    ? "border-accent shadow-[0_18px_60px_rgba(212,175,55,0.18)] ring-1 ring-accent/30"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  {p.tag && (
                    <span className={`text-xs px-2 py-1 rounded-full border ${p.highlight ? "bg-accent/25 border-accent/60 text-accent-foreground" : "bg-secondary border-border text-primary"}`}>
                      {p.tag}
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline gap-2">
                    <span className="price-amount text-5xl sm:text-6xl">{format(p.priceUsd)}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-[0.15em]">{p.perLabel}</span>
                  </div>
                  {perSession && (
                    <p className="mt-2 text-xs text-muted-foreground">≈ {perSession} <span className="opacity-70">per class · {p.sessions} classes total</span></p>
                  )}
                </div>

                <ul className="mt-5 space-y-2.5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                  {p.saveUsd && (
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
                      You save <strong className="ml-0.5">{format(p.saveUsd)}</strong>
                    </li>
                  )}
                </ul>

                <Button
                  onClick={() => goToCheckout(p)}
                  className={`mt-7 pill-btn ${p.highlight
                    ? "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                    : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"}`}
                  data-testid={`plan-cta-${p.key}`}
                >
                  Choose {p.name} <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Hourly + Includes */}
        <div className="mt-8 grid lg:grid-cols-[1fr_1.2fr] gap-5">
          <div className="rounded-3xl border border-border bg-card p-7 flex flex-col card-lift">
            <span className="text-xs px-2 py-1 rounded-full bg-secondary border border-border w-fit">{PLANS[0].tag}</span>
            <h3 className="mt-3 font-display text-2xl">Hourly Plan</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="price-amount text-5xl">{format(PLANS[0].priceUsd, { showDecimals: true })}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.15em]">{PLANS[0].perLabel}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm flex-1">
              {PLANS[0].features.map((f) => (<li key={f} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-accent mt-1 shrink-0" /> {f}</li>))}
            </ul>
            <Button onClick={() => goToCheckout(PLANS[0])} variant="outline" className="mt-5 pill-btn" data-testid="plan-cta-hourly">
              Buy 1 class
            </Button>
          </div>

          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-secondary via-background to-accent/10 p-7">
            <div className="flex items-center gap-2 text-primary"><Sparkles size={14} className="text-accent" /><p className="text-xs uppercase tracking-[0.2em]">Every plan includes</p></div>
            <h3 className="mt-2 font-display text-2xl">The full RynSpireEdu experience</h3>
            <div className="mt-5 grid sm:grid-cols-2 gap-2 text-sm">
              {PLAN_INCLUDES.map((f) => (
                <div key={f} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> {f}</div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"><Link to="/book-demo"><Sparkles size={14} className="mr-1.5" /> Book Free Demo First</Link></Button>
            </div>
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
