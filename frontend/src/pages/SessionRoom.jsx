import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Video, Mic, MonitorUp, PenTool, MessageSquare, Users, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SessionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/bookings/me");
        setBooking(data.find((b) => b.id === id) || null);
      } finally { setLoading(false); }
    })();
  }, [id]);

  const complete = async () => {
    try {
      await api.patch(`/bookings/${id}/status`, null, { params: { status: "completed" } });
      toast.success("Session marked as completed");
      const home = user?.role === "tutor" ? "/app/tutor" : "/app/student";
      navigate(home);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not complete session");
    }
  };

  if (loading) return <div className="min-h-screen grid place-items-center bg-background"><div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>;

  if (!booking) return (
    <div className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="text-center">
        <h2 className="font-display text-2xl">Session not found</h2>
        <Button asChild className="mt-4 pill-btn" data-testid="session-back-btn"><Link to="/">Go home</Link></Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="border-b border-white/10">
        <div className="container-x flex items-center justify-between h-16">
          <button onClick={() => navigate(-1)} className="text-xs flex items-center gap-1.5 opacity-70 hover:opacity-100" data-testid="session-back">
            <ArrowLeft size={12} /> Leave room
          </button>
          <div className="text-center">
            <p className="text-xs opacity-60 uppercase tracking-[0.2em]">Live class</p>
            <p className="font-display text-lg capitalize">{booking.subject.replace("-", " ")}</p>
          </div>
          <Badge className="bg-accent text-accent-foreground border-0" data-testid="session-live">● LIVE</Badge>
        </div>
      </div>

      <div className="container-x py-8 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Video area */}
        <div>
          <div className="aspect-video rounded-3xl bg-slate-900 border border-white/10 grid place-items-center relative overflow-hidden">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-accent/20 grid place-items-center">
                <Video size={30} className="text-accent" />
              </div>
              <p className="mt-4 font-display text-2xl">Room ready</p>
              <p className="text-sm opacity-60 mt-1">HD video, whiteboard & recording launching in v2.</p>
            </div>
            <div className="absolute bottom-4 left-4 rounded-xl bg-black/60 backdrop-blur-sm px-3 py-2 text-xs flex items-center gap-2">
              <Users size={12} /> {booking.tutor_name} · {booking.student_name}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Mic, label: "Mic", key: "mic" },
              { icon: Video, label: "Camera", key: "cam" },
              { icon: MonitorUp, label: "Share", key: "share" },
              { icon: PenTool, label: "Whiteboard", key: "wb" },
              { icon: MessageSquare, label: "Chat", key: "chat" },
            ].map((c) => (
              <button
                key={c.key}
                data-testid={`session-ctrl-${c.key}`}
                className="pill-btn h-12 w-12 grid place-items-center border border-white/15 hover:bg-white/10 transition-colors"
                title={c.label}
              >
                <c.icon size={16} />
              </button>
            ))}
            <Button onClick={complete} className="pill-btn bg-accent text-accent-foreground hover:bg-white hover:text-primary ml-2" data-testid="session-complete-btn">
              End & mark complete
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 h-fit">
          <p className="text-xs uppercase tracking-[0.2em] opacity-60">Session details</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="opacity-60">Tutor</dt><dd>{booking.tutor_name}</dd></div>
            <div className="flex justify-between"><dt className="opacity-60">Student</dt><dd>{booking.student_name}</dd></div>
            <div className="flex justify-between"><dt className="opacity-60">Subject</dt><dd className="capitalize">{booking.subject.replace("-", " ")}</dd></div>
            <div className="flex justify-between"><dt className="opacity-60">Duration</dt><dd>{booking.duration_minutes} min</dd></div>
            <div className="flex justify-between"><dt className="opacity-60">Scheduled</dt><dd className="flex items-center gap-1"><Clock size={12} /> {new Date(booking.scheduled_at).toLocaleString()}</dd></div>
          </dl>
          {booking.notes && (
            <>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] opacity-60">Notes</p>
              <p className="mt-2 text-sm opacity-90">{booking.notes}</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
