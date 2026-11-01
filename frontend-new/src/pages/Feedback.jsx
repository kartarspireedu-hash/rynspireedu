import { useState } from "react";
import { toast } from "sonner";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { validateEmail } from "@/lib/validators";
import { SUBJECTS } from "@/lib/demoConfig";

function Stars({ value, onChange, label }) {
  return (
    <div className="mt-1.5 flex items-center gap-1" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="h-11 w-11 grid place-items-center rounded-xl hover:bg-secondary"
        >
          <Star size={26} className={n <= value ? "fill-accent text-accent" : "text-muted-foreground/40"} />
        </button>
      ))}
    </div>
  );
}

export default function Feedback() {
  const [f, setF] = useState({
    who: "parent", name: "", email: "", student_name: "", tutor_name: "", subject: "",
    rating: 0, tutor_rating: 0, liked: "", improve: "", would_continue: "yes", allow_testimonial: false,
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast.error("Please enter your name.");
    if (f.email.trim()) {
      const err = validateEmail(f.email);
      if (err) return toast.error(err);
    }
    if (!f.rating) return toast.error("Please give an overall rating.");
    setBusy(true);
    try {
      await api.post("/feedback", {
        ...f,
        email: f.email.trim() || undefined,
        tutor_rating: f.tutor_rating || undefined,
      });
      setDone(true);
    } catch (err) {
      const d = err.response?.data?.detail;
      toast.error(Array.isArray(d) ? d.map((x) => x.msg).join(" · ") : d || "Could not send feedback. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo title="Share Your Feedback - RynSpireEdu" description="Tell us how your RynSpireEdu session went." />
      <SiteHeader />
      <section className="container-x pt-10 pb-20 max-w-2xl mx-auto">
        {done ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center" data-testid="feedback-success">
            <CheckCircle2 className="mx-auto text-accent" size={32} />
            <h1 className="mt-3 font-display text-2xl">Thank you!</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your feedback has reached our team and helps us improve every session.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-5 sm:p-8" data-testid="feedback-form">
            <h1 className="font-display text-3xl">How did we do?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Two minutes, and it goes straight to our team.</p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <Label>I'm a</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {["parent", "student"].map((w) => (
                    <button key={w} type="button" onClick={() => set("who", w)}
                      className={`h-11 rounded-xl border text-sm capitalize ${f.who === w ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background"}`}>{w}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="fb-name">Your name *</Label>
                <Input id="fb-name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" />
              </div>
              <div>
                <Label htmlFor="fb-email">Email (optional)</Label>
                <Input id="fb-email" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" />
              </div>
              <div>
                <Label htmlFor="fb-student">Student's name</Label>
                <Input id="fb-student" value={f.student_name} onChange={(e) => set("student_name", e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" />
              </div>
              <div>
                <Label htmlFor="fb-tutor">Tutor's name</Label>
                <Input id="fb-tutor" value={f.tutor_name} onChange={(e) => set("tutor_name", e.target.value)} className="mt-1.5 rounded-xl h-11 text-base" />
              </div>
              <div>
                <Label htmlFor="fb-subject">Subject</Label>
                <select id="fb-subject" value={f.subject} onChange={(e) => set("subject", e.target.value)} className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-3 text-base">
                  <option value="">Select…</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div><Label>Overall experience *</Label><Stars value={f.rating} onChange={(n) => set("rating", n)} label="Overall experience" /></div>
              <div><Label>Your tutor</Label><Stars value={f.tutor_rating} onChange={(n) => set("tutor_rating", n)} label="Tutor rating" /></div>
            </div>

            <div className="mt-6">
              <Label htmlFor="fb-liked">What went well?</Label>
              <Textarea id="fb-liked" rows={3} maxLength={1500} value={f.liked} onChange={(e) => set("liked", e.target.value)} className="mt-1.5 rounded-xl text-base" />
            </div>
            <div className="mt-4">
              <Label htmlFor="fb-improve">What could we do better?</Label>
              <Textarea id="fb-improve" rows={3} maxLength={1500} value={f.improve} onChange={(e) => set("improve", e.target.value)} className="mt-1.5 rounded-xl text-base" />
            </div>

            <div className="mt-6">
              <Label>Would you continue with RynSpireEdu?</Label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {[["yes", "Yes"], ["maybe", "Maybe"], ["no", "No"]].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => set("would_continue", v)}
                    className={`h-11 rounded-xl border text-sm ${f.would_continue === v ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background"}`}>{l}</button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2.5">
              <Checkbox id="fb-quote" checked={f.allow_testimonial} onCheckedChange={(v) => set("allow_testimonial", !!v)} className="mt-0.5 h-5 w-5" />
              <label htmlFor="fb-quote" className="text-xs text-muted-foreground leading-relaxed">You may quote my feedback (first name only) on the RynSpireEdu website.</label>
            </div>

            <Button type="submit" disabled={busy} className="mt-6 w-full h-12 pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              {busy ? <><Loader2 size={14} className="mr-1.5 animate-spin" /> Sending…</> : "Send feedback"}
            </Button>
          </form>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
