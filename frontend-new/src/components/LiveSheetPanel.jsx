import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, RefreshCw, Search, AlertTriangle, ExternalLink } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const REFRESH_MS = 30000;
const SHEET_ID = "1bmhcaxOLiRzbn05MNBYbXNJuuIYtOtNdHlEfadRPI2c";

// Find a column by loose header name so this works however the sheet's
// headers are worded ("Tutor", "Assigned Tutor", "Tutor Name"...).
const findCol = (headers, re) => headers.find((h) => re.test(h));

const statusTone = (v) => {
  const t = String(v || "").toLowerCase();
  if (/(done|complete|attended|happened|yes|held|taken|paid)/.test(t)) return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
  if (/(cancel|no.?show|missed|declin|reject|no$)/.test(t)) return "bg-destructive/10 text-destructive border-destructive/30";
  if (/(pending|new|await|schedul|confirm|booked)/.test(t)) return "bg-amber-500/10 text-amber-700 border-amber-500/30";
  return "bg-secondary border-border";
};

export default function LiveSheetPanel() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState({}); // expanded mobile cards
  const tabRef = useRef(null);
  tabRef.current = tab;

  const load = async ({ force } = {}) => {
    if (force) setRefreshing(true);
    try {
      const { data: d } = await api.get("/admin/sheet", { params: { tab: tabRef.current || undefined, refresh: force ? true : undefined } });
      setData(d);
      setError("");
      if (!tabRef.current) setTab(d.tab);
    } catch (e) {
      setError(e.response?.data?.detail || "Could not load the sheet.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { setLoading(true); load(); /* eslint-disable-next-line */ }, [tab]);
  useEffect(() => {
    const t = setInterval(() => load(), REFRESH_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, []);

  const headers = data?.headers || [];
  const statusCol = findCol(headers, /status/i);
  const nameCol = findCol(headers, /student/i) || findCol(headers, /^name/i) || findCol(headers, /name/i) || headers[0];
  const tutorCol = findCol(headers, /tutor|teacher/i);
  const happenedCol = findCol(headers, /(demo).*(happen|done|held|taken|attend|complet)|(happen|held|attend)/i);
  const dateCol = findCol(headers, /demo.*date|date/i);
  const timeCol = findCol(headers, /time/i);
  const headline = [nameCol, tutorCol, statusCol, happenedCol].filter((v, i, a) => v && a.indexOf(v) === i);

  const statusValues = useMemo(() => {
    if (!statusCol || !data) return [];
    return Array.from(new Set(data.rows.map((r) => String(r[statusCol] || "").trim()).filter(Boolean)));
  }, [data, statusCol]);

  const rows = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return [...data.rows].reverse().filter((r) => {
      if (statusFilter !== "all" && String(r[statusCol] || "").trim() !== statusFilter) return false;
      if (!needle) return true;
      return headers.some((h) => String(r[h] || "").toLowerCase().includes(needle));
    });
  }, [data, q, statusFilter, statusCol, headers]);

  const counts = useMemo(() => {
    const c = {};
    (data?.rows || []).forEach((r) => {
      const v = String(r[statusCol] || "").trim() || "—";
      c[v] = (c[v] || 0) + 1;
    });
    return c;
  }, [data, statusCol]);

  if (loading && !data) {
    return <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading your Google Sheet…</div>;
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:p-6 text-sm" data-testid="sheet-error">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">The live sheet isn't connected yet</p>
            <p className="mt-1 text-muted-foreground">{error}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => { setLoading(true); load({ force: true }); }}>
          <RefreshCw size={13} className="mr-1.5" /> Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6" data-testid="live-sheet">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl">Live Google Sheet</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Read straight from your sheet · refreshes every 30s{data?.fetched_at ? ` · updated ${new Date(data.fetched_at).toLocaleTimeString()}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm"><a href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={13} className="mr-1.5" /> Open sheet</a></Button>
          <Button variant="outline" size="sm" onClick={() => load({ force: true })} disabled={refreshing}>
            <RefreshCw size={13} className={`mr-1.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-destructive">{error} (showing last loaded data)</p>}

      {data?.tabs?.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Sheet tabs">
          {data.tabs.map((t) => (
            <button key={t} role="tab" aria-selected={t === data.tab} onClick={() => { setStatusFilter("all"); setQ(""); setTab(t); }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${t === data.tab ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}>
              {t}
            </button>
          ))}
        </div>
      )}

      {statusCol && Object.keys(counts).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setStatusFilter("all")} className={`rounded-full border px-3 py-1 text-xs ${statusFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>All · {data.rows.length}</button>
          {statusValues.map((v) => (
            <button key={v} onClick={() => setStatusFilter(v)} className={`rounded-full border px-3 py-1 text-xs ${statusFilter === v ? "bg-primary text-primary-foreground border-primary" : statusTone(v)}`}>{v} · {counts[v]}</button>
          ))}
        </div>
      )}

      <div className="mt-4 relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search any column (student, tutor, email…)" className="pl-9 rounded-xl h-11 text-base" aria-label="Search sheet" />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{rows.length} of {data?.rows.length || 0} rows · newest first</p>

      {/* Mobile / small tablet: cards */}
      <div className="mt-3 space-y-3 lg:hidden" data-testid="sheet-cards">
        {rows.map((r) => {
          const expanded = !!open[r._row];
          const rest = headers.filter((h) => !headline.includes(h));
          return (
            <div key={r._row} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium break-words">{r[nameCol] || "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {[dateCol && r[dateCol], timeCol && timeCol !== dateCol && r[timeCol]].filter(Boolean).join(" · ")}
                  </div>
                </div>
                {statusCol && r[statusCol] && <Badge variant="outline" className={`shrink-0 ${statusTone(r[statusCol])}`}>{r[statusCol]}</Badge>}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                {[tutorCol, happenedCol].filter(Boolean).map((h) => (
                  <div key={h}><dt className="text-muted-foreground">{h}</dt><dd className="break-words">{r[h] || "—"}</dd></div>
                ))}
              </dl>
              {expanded && (
                <dl className="mt-3 pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  {rest.filter((h) => ![dateCol, timeCol].includes(h)).map((h) => (
                    <div key={h}><dt className="text-muted-foreground">{h}</dt><dd className="break-words">{r[h] || "—"}</dd></div>
                  ))}
                </dl>
              )}
              <button className="mt-3 text-xs text-primary underline underline-offset-2" onClick={() => setOpen((o) => ({ ...o, [r._row]: !expanded }))}>
                {expanded ? "Show less" : "Show all details"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Desktop: full table with every column */}
      <div className="mt-3 hidden lg:block overflow-x-auto rounded-xl border border-border" data-testid="sheet-table">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              <th className="px-3 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap">#</th>
              {headers.map((h) => <th key={h} className="px-3 py-2 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._row} className="border-t border-border align-top">
                <td className="px-3 py-2 text-xs text-muted-foreground">{r._row}</td>
                {headers.map((h) => (
                  <td key={h} className="px-3 py-2 max-w-[260px] break-words">
                    {h === statusCol && r[h] ? <Badge variant="outline" className={statusTone(r[h])}>{r[h]}</Badge> : (r[h] || <span className="text-muted-foreground">—</span>)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="mt-6 text-center text-sm text-muted-foreground">No rows match.</p>}
    </div>
  );
}
