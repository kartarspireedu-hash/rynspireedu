import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function FeedbackPanel() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => api.get("/admin/feedback").then(({ data }) => { setRows(data); setError(""); }).catch((e) => setError(e.response?.data?.detail || "Could not load feedback"));
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  if (error && !rows) return <p className="text-sm text-destructive">{error}</p>;
  if (!rows) return <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading feedback…</div>;

  const avg = rows.length ? (rows.reduce((a, r) => a + (r.rating || 0), 0) / rows.length).toFixed(1) : "—";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6" data-testid="feedback-panel">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl">Feedback</h3>
        <Badge variant="outline" className="border-accent/40">{rows.length} responses · avg {avg}/5</Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Also saved to the "Feedback" tab of your Google Sheet.</p>
      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No feedback yet. Share rynspireedu.com/feedback with families after their sessions.</p>}
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">{r.name} <span className="text-xs text-muted-foreground font-normal">({r.who}{r.student_name ? ` · ${r.student_name}` : ""})</span></div>
              <div className="flex items-center gap-0.5" aria-label={`${r.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={14} className={n <= r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"} />)}
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {[r.tutor_name && `Tutor: ${r.tutor_name}`, r.subject, `Would continue: ${r.would_continue}`, r.allow_testimonial === "yes" && "OK to quote", new Date(r.created_at).toLocaleString()].filter(Boolean).join(" · ")}
            </div>
            {r.liked && <p className="mt-2"><span className="text-muted-foreground">Went well:</span> {r.liked}</p>}
            {r.improve && <p className="mt-1"><span className="text-muted-foreground">To improve:</span> {r.improve}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
