import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, Calendar, DollarSign, Star, ArrowRight, Video, Clock } from "lucide-react";

const nav = [{ to: "/app/tutor", label: "Overview", icon: LayoutDashboard, end: true }];

function fmt(dt) {
  return new Date(dt).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TutorDashboard() {
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

  const scheduled = bookings.filter((b) => b.status === "scheduled");
  const uniqueStudents = new Set(bookings.map((b) => b.student_id)).size;

  const stats = [
    { label: "Sessions this week", value: scheduled.length, icon: Calendar },
    { label: "Students", value: uniqueStudents, icon: Users },
    { label: "Rating", value: "4.9", icon: Star },
    { label: "Est. income (mo)", value: "A$0", icon: DollarSign },
  ];

  return (
    <DashboardShell nav={nav} title={`Hello, ${user?.name?.split(" ")[0]}`}>
      <div className="grid gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 grid lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Today at RynSpire</p>
            <h2 className="font-display text-2xl lg:text-3xl mt-2">Your teaching studio.</h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg">Manage lessons, review students, and prepare notes — everything one calm space away.</p>
          </div>
          <div className="rounded-2xl bg-accent/10 border border-accent/30 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subjects</p>
            <p className="mt-2 text-sm capitalize">{(user?.subjects || []).map((s) => s.replace("-", " ")).join(", ") || "Update your profile"}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 card-lift">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
                <s.icon size={16} className="text-accent" />
              </div>
              <p className="font-display text-3xl mt-3">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl">Upcoming lessons</h3>
          </div>
          {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {!loading && scheduled.length === 0 && (
            <div className="text-center py-10 border border-dashed border-border rounded-xl">
              <Calendar size={24} className="mx-auto text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No sessions scheduled. Students will book you soon.</p>
            </div>
          )}
          <div className="grid gap-3">
            {scheduled.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:border-accent/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-medium capitalize truncate">{b.subject.replace("-", " ")} · <span className="text-muted-foreground text-sm">{b.student_name}</span></p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock size={12} /> {fmt(b.scheduled_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/20 text-accent-foreground border border-accent/40">Scheduled</Badge>
                  <Button asChild size="sm" className="pill-btn bg-primary hover:bg-accent hover:text-accent-foreground">
                    <Link to={`/session/${b.id}`}><Video size={14} className="mr-1.5" /> Enter room</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-xl">Homework to review</h3>
            <p className="mt-3 text-sm text-muted-foreground">The homework grading queue arrives in v2.</p>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6">
            <h3 className="font-display text-xl">Complete your tutor profile</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add subjects, bio and rate so families can find you.</p>
            <Button asChild className="mt-4 pill-btn bg-primary hover:bg-accent hover:text-accent-foreground">
              <Link to="/tutors">View public profile <ArrowRight size={14} className="ml-1.5" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
