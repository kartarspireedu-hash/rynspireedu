import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, ArrowRight, CalendarIcon, CheckCircle2, Sparkles, Clock, Mail } from "lucide-react";
import api from "@/lib/api";

const COUNTRIES = [
  "Australia", "New Zealand", "United States", "United Kingdom", "Canada",
  "Singapore", "India", "United Arab Emirates", "Ireland", "Germany", "Other",
];

const CITIES_BY_COUNTRY = {
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Gold Coast", "Hobart", "Darwin", "Other"],
  "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin", "Palmerston North", "Other"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Francisco", "Seattle", "Boston", "Other"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Edinburgh", "Bristol", "Other"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Other"],
  "Singapore": ["Singapore", "Other"],
  "India": ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Chandigarh", "Ludhiana", "Amritsar", "Other"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Other"],
  "Ireland": ["Dublin", "Cork", "Galway", "Limerick", "Other"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Other"],
  "Other": ["Other"],
};

const CLASSES = [
  "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
];

const SUBJECTS = [
  "Mathematics", "English", "Science", "Physics", "Chemistry", "Biology",
  "Computer Science", "Coding & AI", "Economics", "Business Studies",
  "Social Studies", "IELTS", "PTE", "SAT", "ACT", "Other",
];

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

// Australia & New Zealand are our primary service area — shown first and
// highlighted. All other timezones stay available but visually de-emphasised.
const TZ_PRIMARY = ["Australia/Sydney", "Australia/Melbourne", "Australia/Perth", "Australia/Brisbane", "Australia/Adelaide", "Pacific/Auckland"];
const TZ_OTHER = ["Asia/Kolkata", "Asia/Singapore", "Asia/Dubai", "Europe/London", "Europe/Dublin", "Europe/Berlin", "America/New_York", "America/Los_Angeles", "America/Toronto"];

function fmtDate(d) {
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default function BookDemo() {
  const [step, setStep] = useState(1); // 1=schedule, 2=details, 3=review, 4=success
  const [date, setDate] = useState(() => {
    let d = new Date(Date.now() + 24 * 3600 * 1000);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip Sunday
    return d;
  });
  const [time, setTime] = useState("16:00");
  const [tz, setTz] = useState("Australia/Sydney");

  const [form, setForm] = useState({
    parent_name: "", student_name: "", email: "", phone: "",
    country: "Australia", country_other: "", city: "Sydney", city_other: "",
    student_class: "Grade 8", subject: "Mathematics", subject_other: "",
    additional_notes: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const pixelFiredRef = useRef(false);

  const dateKey = date.toISOString().slice(0, 10);

  useEffect(() => {
    let cancelled = false;
    api.get("/demos/availability", { params: { date: dateKey } })
      .then(({ data }) => { if (!cancelled) setBookedTimes(data.booked_times || []); })
      .catch(() => { if (!cancelled) setBookedTimes([]); });
    return () => { cancelled = true; };
  }, [dateKey]);

  useEffect(() => {
    if (bookedTimes.includes(time)) {
      const firstFree = TIME_SLOTS.find((t) => !bookedTimes.includes(t));
      if (firstFree) setTime(firstFree);
    }
  }, [bookedTimes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step === 4 && !pixelFiredRef.current) {
      pixelFiredRef.current = true;
      if (window.fbq) {
        window.fbq('track', 'Schedule', {
          content_name: 'free_demo_class',
          content_category: 'demo_booking'
        });
      }
    }
  }, [step]);

  const cities = useMemo(() => CITIES_BY_COUNTRY[form.country] || ["Other"], [form.country]);

  const setField = (k, v) => setForm((f) => {
    const next = { ...f, [k]: v };
    if (k === "country") next.city = (CITIES_BY_COUNTRY[v] || ["Other"])[0];
    return next;
  });

  const displayCountry = form.country === "Other" && form.country_other ? form.country_other : form.country;
  const displayCity = form.city === "Other" && form.city_other ? form.city_other : form.city;
  const displaySubject = form.subject === "Other" && form.subject_other ? form.subject_other : form.subject;

  const detailsValid = form.parent_name.trim().length >= 2 && form.student_name.trim().length >= 2
    && form.email.trim() && form.phone.trim()
    && (form.country !== "Other" || form.country_other.trim())
    && (form.city !== "Other" || form.city_other.trim())
    && (form.subject !== "Other" || form.subject_other.trim());

  const submit = async () => {
    setBusy(true);
    try {
      const payload = {
        ...form,
        demo_date: date.toISOString().slice(0, 10),
        demo_time: time,
        timezone: tz,
        accepted_terms: agreed,
      };
      const { data } = await api.post("/demos", payload);
      setBookingId(data.id);
      setStep(4);
      toast.success("Demo booked! Confirmation sent to your email.");
    } catch (e) {
      const detail = e.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map((x) => x.msg || JSON.stringify(x)).join(" · ") : (detail || "Could not book demo");
      toast.error(msg);
      if (e.response?.status === 409) {
        setBookedTimes((prev) => Array.from(new Set([...prev, time])));
        setStep(1);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo
        title="Book a Free Demo - RynSpireEdu"
        description="Book a free 25-minute 1-to-1 online tutoring demo session with RynSpireEdu. No payment needed."
      />
      <SiteHeader />

      <section className="container-x pt-10 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]">
            {[
              { n: 1, l: "Schedule" },
              { n: 2, l: "Your details" },
              { n: 3, l: "Review" },
              { n: 4, l: "Confirmed" },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className={`h-7 w-7 grid place-items-center rounded-full text-xs ${step >= s.n ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{s.n}</div>
                <span className={step >= s.n ? "text-foreground" : "text-muted-foreground"}>{s.l}</span>
                {i < arr.length - 1 && <span className="w-8 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <BrandMark size="lg" />
            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
              Book your <span className="gold-underline">free 25-minute demo.</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              1-to-1 with a real tutor. No payment needed. See how RynSpireEdu will work for your child.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-xl">Pick a date & time</h2>
                <p className="text-sm text-muted-foreground mt-1">Our team will confirm the exact slot in the next 12 hours.</p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Preferred date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full mt-1.5 rounded-xl justify-start font-normal" data-testid="demo-date-btn">
                          <CalendarIcon size={14} className="mr-2" />
                          {fmtDate(date)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComp
                          mode="single"
                          selected={date}
                          onSelect={(d) => d && setDate(d)}
                          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d.getDay() === 0}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">We're closed on Sundays.</p>
                  </div>
                  <div>
                    <Label className="text-xs">Preferred time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger className="mt-1.5 rounded-xl" data-testid="demo-time-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((t) => (
                          <SelectItem key={t} value={t} disabled={bookedTimes.includes(t)}>
                            {t}{bookedTimes.includes(t) ? " · Booked" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bookedTimes.length === TIME_SLOTS.length && (
                      <p className="mt-1.5 text-xs text-destructive">All slots are full on this date — please pick another date.</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Your timezone</Label>
                    <Select value={tz} onValueChange={setTz}>
                      <SelectTrigger className="mt-1.5 rounded-xl" data-testid="demo-tz-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="text-primary">Australia &amp; New Zealand</SelectLabel>
                          {TZ_PRIMARY.map((t) => (
                            <SelectItem key={t} value={t} className="font-medium">{t.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel className="text-muted-foreground">Other timezones</SelectLabel>
                          {TZ_OTHER.map((t) => (
                            <SelectItem key={t} value={t} className="text-muted-foreground">{t.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock size={12} /> 25-minute free demo · No card required</p>
                  <Button onClick={() => setStep(2)} disabled={bookedTimes.length === TIME_SLOTS.length} className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="demo-next-btn">
                    Next: Your details <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8" data-testid="demo-form">
                <button type="button" onClick={() => setStep(1)} className="text-xs text-muted-foreground flex items-center gap-1 mb-2 hover:text-foreground" data-testid="demo-back-btn">
                  <ArrowLeft size={12} /> Back to date/time
                </button>
                <h2 className="font-display text-xl">Tell us about the student</h2>
                <p className="text-sm text-muted-foreground mt-1">All fields are dropdowns where possible for speed.</p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parent_name">Parent name *</Label>
                    <Input id="parent_name" required value={form.parent_name} onChange={(e) => setField("parent_name", e.target.value)} className="mt-1.5 rounded-xl" data-testid="demo-parent-name" />
                  </div>
                  <div>
                    <Label htmlFor="student_name">Student name *</Label>
                    <Input id="student_name" required value={form.student_name} onChange={(e) => setField("student_name", e.target.value)} className="mt-1.5 rounded-xl" data-testid="demo-student-name" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone number (with country code) *</Label>
                    <Input id="phone" required inputMode="tel" placeholder="+61 400 000 000" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="mt-1.5 rounded-xl" data-testid="demo-phone" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" required type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-1.5 rounded-xl" data-testid="demo-email" />
                  </div>
                  <div>
                    <Label>Country *</Label>
                    <Select value={form.country} onValueChange={(v) => setField("country", v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl" data-testid="demo-country"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {form.country === "Other" && (
                      <Input className="mt-2 rounded-xl" placeholder="Please specify your country" value={form.country_other} onChange={(e) => setField("country_other", e.target.value)} data-testid="demo-country-other" />
                    )}
                  </div>
                  <div>
                    <Label>City *</Label>
                    <Select value={form.city} onValueChange={(v) => setField("city", v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl" data-testid="demo-city"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {form.city === "Other" && (
                      <Input className="mt-2 rounded-xl" placeholder="Please specify your city" value={form.city_other} onChange={(e) => setField("city_other", e.target.value)} data-testid="demo-city-other" />
                    )}
                  </div>
                  <div>
                    <Label>Student class *</Label>
                    <Select value={form.student_class} onValueChange={(v) => setField("student_class", v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl" data-testid="demo-class"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Subject for demo *</Label>
                    <Select value={form.subject} onValueChange={(v) => setField("subject", v)}>
                      <SelectTrigger className="mt-1.5 rounded-xl" data-testid="demo-subject"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {form.subject === "Other" && (
                      <Input className="mt-2 rounded-xl" placeholder="Please specify the subject" value={form.subject_other} onChange={(e) => setField("subject_other", e.target.value)} data-testid="demo-subject-other" />
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Anything else we should know?</Label>
                    <Textarea id="notes" className="mt-1.5 rounded-xl min-h-24" placeholder="Topics, upcoming exams, learning goals, difficulty areas…" value={form.additional_notes} onChange={(e) => setField("additional_notes", e.target.value)} data-testid="demo-notes" />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <Button
                    onClick={() => detailsValid ? setStep(3) : toast.error("Please fill in all required fields.")}
                    className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                    data-testid="demo-review-btn"
                  >
                    Review booking <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8" data-testid="demo-review">
                <button type="button" onClick={() => setStep(2)} className="text-xs text-muted-foreground flex items-center gap-1 mb-2 hover:text-foreground" data-testid="demo-back-to-details-btn">
                  <ArrowLeft size={12} /> Back to details
                </button>
                <h2 className="font-display text-xl">Review your booking</h2>
                <p className="text-sm text-muted-foreground mt-1">Double-check everything looks right before confirming.</p>

                <div className="mt-6 rounded-2xl bg-secondary/60 border border-border p-5 text-sm space-y-2">
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Parent</span><span className="font-medium">{form.parent_name}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Student</span><span className="font-medium">{form.student_name}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Email</span><span className="font-medium">{form.email}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Phone</span><span className="font-medium">{form.phone}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Location</span><span className="font-medium">{displayCity}, {displayCountry}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Class</span><span className="font-medium">{form.student_class}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Subject</span><span className="font-medium">{displaySubject}</span></div>
                  <div className="flex justify-between py-1 border-t border-border mt-2 pt-2"><span className="text-muted-foreground">Date &amp; time</span><span className="font-medium">{fmtDate(date)} at {time} ({tz.replace("_", " ")})</span></div>
                  {form.additional_notes && (
                    <div className="pt-2 border-t border-border mt-2"><span className="text-muted-foreground block mb-1">Notes</span><span>{form.additional_notes}</span></div>
                  )}
                </div>

                <label className="mt-5 flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                  <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" data-testid="demo-terms-checkbox" />
                  <span>
                    I agree to be contacted at the details above and accept the{" "}
                    <Link to="/terms" target="_blank" className="text-primary underline">Terms &amp; Conditions</Link>
                    {" "}and{" "}
                    <Link to="/privacy-policy" target="_blank" className="text-primary underline">Privacy Policy</Link>.
                  </span>
                </label>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail size={12} /> We'll email you to confirm your demo session.</p>
                  <Button
                    onClick={submit}
                    disabled={busy || !agreed}
                    className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                    data-testid="demo-submit-btn"
                  >
                    {busy ? "Booking…" : (<>Confirm free demo <Sparkles size={14} className="ml-1.5" /></>)}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-10 rounded-3xl border border-accent/40 bg-gradient-to-br from-secondary via-background to-accent/10 p-8 sm:p-10 text-center" data-testid="demo-success">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="mx-auto h-16 w-16 rounded-full bg-accent/25 grid place-items-center"
                >
                  <CheckCircle2 size={32} className="text-primary" />
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-5 font-display text-3xl">
                  You&apos;re all set, {form.parent_name.split(" ")[0]}!
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-2 text-muted-foreground">
                  We'll email <strong>{form.email}</strong> to confirm your demo session. Once confirmed, get ready to experience a great tutoring session with RynSpireEdu!
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-6 mx-auto max-w-md rounded-2xl bg-background/70 backdrop-blur-sm border border-border p-5 text-left text-sm">
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Student</span><span>{form.student_name}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Subject</span><span>{displaySubject}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Class</span><span>{form.student_class}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Date</span><span>{fmtDate(date)}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Time</span><span>{time} ({tz.replace("_", " ")})</span></div>
                  <div className="flex justify-between py-1 border-t border-border mt-2 pt-2"><span className="text-muted-foreground">Booking ID</span><span className="font-mono text-xs">{bookingId.slice(0, 8)}…</span></div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild variant="outline" className="pill-btn" data-testid="demo-home-btn"><Link to="/">Back to home</Link></Button>
                  <Button asChild className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="demo-pricing-btn"><Link to="/pricing">Explore plans <ArrowRight size={14} className="ml-1.5" /></Link></Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
