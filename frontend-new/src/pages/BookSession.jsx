import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardShell from "@/components/DashboardShell";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LayoutDashboard, Calendar, ArrowLeft, Star, CalendarIcon, Check } from "lucide-react";

const nav = [
  { to: "/app/student", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/student/book", label: "Book Session", icon: Calendar },
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

export default function BookSession() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [subject, setSubject] = useState("");
  const [selectedTutorId, setSelectedTutorId] = useState("");
  const [date, setDate] = useState(new Date(Date.now() + 24 * 3600 * 1000));
  const [time, setTime] = useState("16:00");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, t] = await Promise.all([api.get("/subjects"), api.get("/tutors")]);
      setSubjects(s.data);
      setTutors(t.data);
      if (s.data.length) setSubject(s.data[0].key);
    })();
  }, []);

  const filteredTutors = useMemo(
    () => (subject ? tutors.filter((t) => t.subjects.includes(subject)) : tutors),
    [subject, tutors]
  );

  useEffect(() => {
    if (filteredTutors.length && !filteredTutors.find((t) => t.id === selectedTutorId)) {
      setSelectedTutorId(filteredTutors[0].id);
    }
  }, [filteredTutors, selectedTutorId]);

  const confirm = async () => {
    if (!selectedTutorId || !subject) return toast.error("Pick a subject and tutor");
    setBusy(true);
    try {
      const [h, m] = time.split(":").map(Number);
      const dt = new Date(date);
      dt.setHours(h, m, 0, 0);
      await api.post("/bookings", {
        tutor_id: selectedTutorId,
        subject,
        scheduled_at: dt.toISOString(),
        duration_minutes: 60,
        notes,
      });
      toast.success("Session booked! We'll see you soon.");
      navigate("/app/student");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Booking failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardShell nav={nav} title="Book a session">
      <button onClick={() => navigate(-1)} className="text-xs text-muted-foreground flex items-center gap-1 mb-4 hover:text-foreground" data-testid="book-back-btn">
        <ArrowLeft size={12} /> Back
      </button>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          <h3 className="font-display text-xl">1. Choose a subject</h3>
          <div className="mt-4 max-w-sm">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="rounded-xl" data-testid="book-subject-select"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.key} value={s.key}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <h3 className="font-display text-xl mt-8">2. Pick your tutor</h3>
          {filteredTutors.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">No tutors available for this subject yet.</p>
          )}
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {filteredTutors.map((t) => {
              const active = selectedTutorId === t.id;
              return (
                <button
                  key={t.id}
                  data-testid={`select-tutor-${t.id}`}
                  onClick={() => setSelectedTutorId(t.id)}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    active ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.country} · {t.experience_years}y</p>
                    </div>
                    {active && <Check size={14} className="text-accent" />}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center gap-1 text-xs"><Star size={12} className="text-accent fill-accent" /> {t.rating.toFixed(1)}</span>
                    <span className="text-sm font-display">A${t.hourly_rate}<span className="text-xs text-muted-foreground">/hr</span></span>
                  </div>
                </button>
              );
            })}
          </div>

          <h3 className="font-display text-xl mt-8">3. Pick a date & time</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full mt-1.5 rounded-xl justify-start font-normal" data-testid="book-date-btn">
                    <CalendarIcon size={14} className="mr-2" />
                    {date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComp
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="mt-1.5 rounded-xl" data-testid="book-time-select"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <h3 className="font-display text-xl mt-8">4. Notes for your tutor</h3>
          <Textarea
            className="mt-3 rounded-xl min-h-24"
            placeholder="Topics you'd like to cover, upcoming tests, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            data-testid="book-notes-input"
          />
        </div>

        {/* Summary */}
        <aside className="rounded-2xl border border-accent/40 bg-accent/5 p-6 h-fit lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Session summary</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subject</span><span className="capitalize font-medium">{subject?.replace("-", " ") || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tutor</span><span className="font-medium">{tutors.find((t) => t.id === selectedTutorId)?.name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">When</span><span className="font-medium">{date.toLocaleDateString()} · {time}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">60 min</span></div>
          </div>
          <div className="mt-6 pt-6 border-t border-accent/30">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Session credit</span>
              <span className="font-display text-2xl">1 lesson</span>
            </div>
            <Badge variant="outline" className="mt-2 border-accent/40 text-accent">Trial pack applied</Badge>
          </div>
          <Button onClick={confirm} disabled={busy || !selectedTutorId} className="w-full mt-6 pill-btn bg-primary hover:bg-accent hover:text-accent-foreground" data-testid="book-confirm-btn">
            {busy ? "Booking..." : "Confirm booking"}
          </Button>
        </aside>
      </div>
    </DashboardShell>
  );
}
