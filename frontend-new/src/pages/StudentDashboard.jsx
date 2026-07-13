import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Calendar, BookOpen, Video, TrendingUp, MessageSquare, Award, ArrowRight, Clock } from "lucide-react";

const nav = [
  { to: "/app/student", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/student/book", label: "Book Session", icon: Calendar },
];

function fmt(dt) {
  const d = new Date(dt);
  return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/bookings/me");
        setBookings(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upcoming = bookings.filter((b) => b.status === "scheduled");
  const stats = [
    { label: "Upcoming sessions", value: upcoming.length, icon: Calendar },
    { label: "Completed lessons", value: bookings.filter((b) => b.status === "completed").length, icon: Award },
    { label: "Homework due", value: 0, icon: BookOpen },
    { label: "Attendance", value: "100%", icon: TrendingUp },
  ];

  return (
    <DashboardShell nav={nav} title={`Welcome, ${user?.name?.split(" ")[0]}`}>
      <div className="grid gap-6">
        {/* Hero card */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 grid lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Your journey</p>
            <h2 className="font-display text-2xl lg:text-3xl mt-2">Ready for your next lesson?</h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg">Book a session with one of our expert tutors — matched to your grade, subjects and goals.</p>
            <Button asChild className="mt-5 pill-btn bg-primary hover:bg-accent hover:text-accent-foreground" data-testid="student-book-cta">
              <Link to="/app/student/book">Book a session <ArrowRight size={14} className="ml-1.5" /></Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-accent/10 border border-accent/30 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Grade</p>
            <p className="font-display text-2xl mt-1">{user?.grade || "—"}</p>
            <p className="text-xs text-muted-foreground mt-3">{user?.country}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl border border-border bg-card p-5 card-lift">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
                <s.icon size={16} className="text-accent" />
              </div>
              <p className="font-display text-3xl mt-3">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Upcoming sessions */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl">Upcoming sessions</h3>
            <Button asChild variant="outline" size="sm" className="pill-btn"><Link to="/app/student/book">+ New</Link></Button>
          </div>
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && upcoming.length === 0 && (
            <div className="text-center py-10 border border-dashed border-border rounded-xl" data-testid="no-upcoming">
              <Calendar size={24} className="mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No sessions booked yet.</p>
              <Button asChild size="sm" className="mt-4 pill-btn bg-primary hover:bg-accent hover:text-accent-foreground">
                <Link to="/app/student/book">Book your first session</Link>
              </Button>
            </div>
          )}
          <div className="grid gap-3">
            {upcoming.map((b) => (
              <div key={b.id} data-testid={`upcoming-${b.id}`} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-accent/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-medium capitalize truncate">{b.subject.replace("-", " ")} · <span className="text-muted-foreground text-sm">with {b.tutor_name}</span></p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock size={12} /> {fmt(b.scheduled_at)} · {b.duration_minutes} min</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/20 text-accent-foreground border border-accent/40">Scheduled</Badge>
                  <Button asChild size="sm" className="pill-btn bg-primary hover:bg-accent hover:text-accent-foreground" data-testid={`join-${b.id}`}>
                    <Link to={`/session/${b.id}`}><Video size={14} className="mr-1.5" /> Join</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholders row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Homework</h3>
              <BookOpen size={16} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Your tutor hasn&apos;t assigned homework yet. New tasks will appear here.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Tutor messages</h3>
              <MessageSquare size={16} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">No new messages. In-app messaging launches in v2.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
