import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Send, ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { validateEmail, validatePhoneForCountry } from "@/lib/validators";
import { DIAL_CODES } from "@/lib/dialCodes";
import { COUNTRIES_WORLD, isoToFlag, cityOfZone, utcOffset } from "@/lib/world";
import {
  COUNTRIES, CITIES_BY_COUNTRY, CLASSES, SUBJECTS, TIME_SLOTS,
  tzForLocation, nextOpenDays, isBookableDate, isClosedDay, ymd, slotsTooSoon,
  todayInTz, maxBookableDate,
} from "@/lib/demoConfig";

const WHATSAPP_NUMBER = "61480851790"; // +61 480 851 790
const WA_TEXT = "Hi RynSpireEdu! I'd like to know more about your tutoring.";
const waUrl = (text = WA_TEXT) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const DIAL_ISO = { Australia: "AU", "New Zealand": "NZ", "United States": "US", Canada: "CA" };

const fmtDay = (d) => d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

const WaGlyph = ({ size = 30 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="white" aria-hidden="true">
    <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.24.622 4.42 1.803 6.32L4 29l7.86-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.94 0-3.84-.52-5.5-1.5l-.395-.235-4.66 1.05 1.08-4.53-.257-.41A9.66 9.66 0 0 1 6.3 15c0-5.36 4.35-9.7 9.704-9.7 5.354 0 9.7 4.34 9.7 9.7 0 5.36-4.346 9.7-9.7 9.7Zm5.33-7.27c-.29-.145-1.72-.85-1.99-.945-.267-.097-.462-.145-.656.145-.194.29-.75.945-.92 1.14-.17.194-.34.218-.63.073-.29-.146-1.224-.451-2.332-1.44-.862-.769-1.444-1.719-1.613-2.01-.17-.29-.018-.447.127-.591.13-.13.29-.34.435-.51.146-.17.194-.29.29-.485.097-.194.049-.364-.024-.51-.073-.145-.656-1.58-.9-2.164-.237-.568-.478-.491-.656-.5l-.559-.01c-.194 0-.51.073-.777.364-.267.29-1.02.997-1.02 2.432s1.044 2.822 1.19 3.017c.146.194 2.055 3.14 4.98 4.404.696.3 1.238.48 1.662.615.698.222 1.334.19 1.836.115.56-.084 1.72-.703 1.963-1.382.243-.68.243-1.262.17-1.383-.073-.121-.267-.194-.558-.34Z" />
  </svg>
);


const Chip = ({ onClick, children, primary }) => (
  <button type="button" onClick={onClick}
    className={`rounded-full border px-3.5 py-2 text-sm text-left transition-colors ${primary ? "bg-primary text-primary-foreground border-primary hover:bg-accent hover:text-accent-foreground" : "border-primary/40 text-primary bg-background hover:bg-primary/10"}`}>
    {children}
  </button>
);

export default function ChatAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [msgs, setMsgs] = useState([]);
  const [step, setStep] = useState(null);
  const [a, setA] = useState({}); // answers
  const [history, setHistory] = useState([]); // [{step, msgs, a}] for the Back button
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [times, setTimes] = useState(null); // null = loading
  const [otherFor, setOtherFor] = useState(null); // "city" | "student_class" | "subject" when typing a custom value
  const [pickDate, setPickDate] = useState(false);
  const [done, setDone] = useState(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  const tz = a.tz || tzForLocation(a.country, a.city === "Other" ? undefined : a.city);
  const dialCode = DIAL_CODES.find((d) => d.iso === (a.iso || DIAL_ISO[a.country]))?.dial || "+61";
  const countryName = a.country === "Other" ? a.country_other : a.country;
  const tzName = cityOfZone(tz);
  const matches = (() => {
    const q = text.trim().toLowerCase();
    if (!q) return COUNTRIES_WORLD.slice(0, 8);
    return COUNTRIES_WORLD.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  })();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, step, times, pickDate, done]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [step, open, otherFor]);

  const say = useCallback((lines, nextStep, extra) => {
    const arr = Array.isArray(lines) ? lines : [lines];
    setStep(null);
    arr.forEach((t, i) => {
      timers.current.push(setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: t }]), 350 * (i + 1)));
    });
    timers.current.push(setTimeout(() => { setStep(nextStep); extra?.(); }, 350 * arr.length + 50));
  }, []);

  const remember = () => setHistory((h) => [...h, { step, msgs, a, otherFor }]);
  const user = (t) => setMsgs((m) => [...m, { from: "user", text: t }]);

  const begin = () => {
    setMsgs([]); setA({}); setHistory([]); setDone(null); setOtherFor(null); setPickDate(false); setTimes(null);
    say(["Hi! 👋 I'm RynSpireEdu's automated assistant.", "Are you interested in a free 25-minute 1-to-1 demo with one of our tutors?"], "start");
  };

  const openPanel = () => {
    setOpen(true); setUnread(false);
    if (!msgs.length) begin();
  };

  const goBack = () => {
    const h = history[history.length - 1];
    if (!h) return;
    timers.current.forEach(clearTimeout);
    setHistory((x) => x.slice(0, -1));
    setMsgs(h.msgs); setA(h.a); setStep(h.step); setOtherFor(h.otherFor || null); setPickDate(false); setText(""); setDone(null);
  };

  // ---- step handlers -------------------------------------------------
  const choose = (label, fn) => { remember(); user(label); fn(); };

  const onStart = (yes) => choose(yes ? "Yes, book a free demo" : "No, I have a question", () => {
    if (yes) say("Great! Let's get it booked. First — which country are you in?", "country");
    else say("No problem! What would you like to know?", "faq");
  });

  const onFaq = (key) => {
    const label = { pricing: "Pricing", demo: "How the free demo works", subjects: "Subjects & grades", person: "Talk to a person" }[key];
    choose(label, () => {
      if (key === "pricing") say("You can see all our plans and prices on the Pricing page — it shows the currency for your region.", "faq_after", () => setA((x) => ({ ...x, link: "/pricing" })));
      else if (key === "demo") say(["The demo is a free 25-minute 1-to-1 session with a real tutor. No payment or card is needed.", "Our team confirms the exact slot within about 12 hours of your booking."], "faq_after");
      else if (key === "subjects") say(`We teach Kindergarten to Grade 12, including ${SUBJECTS.filter((s) => s !== "Other").slice(0, 8).join(", ")} and more.`, "faq_after");
      else say("Of course — you can message our team directly on WhatsApp.", "faq_after");
    });
  };

  const onCountry = (c) => choose(c, () => {
    setA((x) => ({ ...x, country: c, city: undefined }));
    say(`Thanks! Which city in ${c}?`, "city");
  });

  const onOtherCountry = (c) => {
    // Any other country: phone code + timezone come from the world list.
    choose(`${isoToFlag(c.iso)} ${c.name}`, () => {
      setText("");
      setA((x) => ({ ...x, country: "Other", country_other: c.name, iso: c.iso, city: undefined, city_other: "", tz: c.zones.length === 1 ? c.zones[0] : undefined, zones: c.zones }));
      if (c.zones.length === 1) {
        setOtherFor("city");
        say(`Thanks! Which city in ${c.name}? Please type it.`, "city");
      } else {
        say(`${c.name} has more than one timezone. Which one is yours?`, "zone");
      }
    });
  };

  const onZone = (z) => choose(`${cityOfZone(z)} (${utcOffset(z)})`, () => {
    setA((x) => ({ ...x, tz: z }));
    setOtherFor("city");
    say("Thanks! Which city are you in? Please type it.", "city");
  });

  const onCity = (c) => {
    if (c === "Other") { remember(); user("Other"); setOtherFor("city"); say("No worries — please type your city.", "city"); return; }
    choose(c, () => {
      const t = tzForLocation(a.country, c);
      setA((x) => ({ ...x, city: c, city_other: "" }));
      say(`Got it. Pick a day for the demo (times are in your local time — ${t.split("/")[1].replace(/_/g, " ")}). We're closed on Sundays.`, "date");
    });
  };

  const onDate = (d) => {
    if (isClosedDay(d)) { say("We're closed on Sundays — please choose another day.", "date"); return; }
    if (!isBookableDate(d, tz)) { say("That date isn't available. Demos can be booked from today up to 2 months ahead.", "date"); return; }
    choose(fmtDay(d), () => {
      setPickDate(false); setTimes(null);
      setA((x) => ({ ...x, date: ymd(d), dateLabel: fmtDay(d), time: undefined }));
      say("And what time suits you best?", "time", () => loadTimes(ymd(d)));
    });
  };

  const loadTimes = async (dateKey) => {
    setTimes(null);
    let booked = [];
    try { booked = (await api.get("/demos/availability", { params: { date: dateKey } })).data.booked_times || []; } catch { booked = []; }
    const tooSoon = slotsTooSoon(tz, dateKey);
    setTimes(TIME_SLOTS.filter((t) => !booked.includes(t) && !tooSoon.includes(t)));
  };

  const onTime = (t) => choose(t, () => {
    setA((x) => ({ ...x, time: t }));
    say("Lovely. What's the parent's / guardian's full name?", "parent_name");
  });

  const onText = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    if (step === "country_other") { if (matches[0]) onOtherCountry(matches[0]); return; }
    if (otherFor) {
      remember(); user(v); setText("");
      const field = otherFor; setOtherFor(null);
      if (field === "city") {
        setA((x) => ({ ...x, city: "Other", city_other: v }));
        say(`Thanks! Pick a day for the demo (times are in your local time — ${tzName}). We're closed on Sundays.`, "date");
      } else if (field === "student_class") {
        setA((x) => ({ ...x, student_class: "Other", class_other: v }));
        say("And which subject would you like the demo in?", "subject");
      } else {
        setA((x) => ({ ...x, subject: "Other", subject_other: v }));
        say("Anything else the tutor should know? (optional — e.g. topics, exam, learning needs)", "notes");
      }
      return;
    }
    if (step === "parent_name") {
      if (v.length < 2) return say("Please enter the parent's name.", "parent_name");
      remember(); user(v); setText(""); setA((x) => ({ ...x, parent_name: v }));
      say("Thanks! And the student's name?", "student_name");
    } else if (step === "student_name") {
      if (v.length < 2) return say("Please enter the student's name.", "student_name");
      remember(); user(v); setText(""); setA((x) => ({ ...x, student_name: v }));
      say("What email address should we send the confirmation to?", "email");
    } else if (step === "email") {
      const err = validateEmail(v);
      if (err) return say(err, "email");
      remember(); user(v); setText(""); setA((x) => ({ ...x, email: v }));
      say(`And a phone number we can reach you on? (${dialCode} is added automatically)`, "phone");
    } else if (step === "phone") {
      const err = validatePhoneForCountry(dialCode, v);
      if (err) return say(err, "phone");
      remember(); user(`${dialCode} ${v}`); setText(""); setA((x) => ({ ...x, phone: v }));
      say("Which class / grade is the student in?", "student_class");
    } else if (step === "notes") {
      remember(); user(v); setText(""); setA((x) => ({ ...x, notes: v }));
      toConfirm({ ...a, notes: v });
    }
  };

  const onClass = (c) => {
    if (c === "Other") { remember(); user("Other"); setOtherFor("student_class"); say("Please type the class / grade.", "student_class"); return; }
    choose(c, () => { setA((x) => ({ ...x, student_class: c, class_other: "" })); say("And which subject would you like the demo in?", "subject"); });
  };
  const onSubject = (s) => {
    if (s === "Other") { remember(); user("Other"); setOtherFor("subject"); say("Please type the subject.", "subject"); return; }
    choose(s, () => { setA((x) => ({ ...x, subject: s, subject_other: "" })); say("Anything else the tutor should know? (optional — e.g. topics, exam, learning needs)", "notes"); });
  };
  const skipNotes = () => choose("Skip", () => { setA((x) => ({ ...x, notes: "" })); toConfirm({ ...a, notes: "" }); });

  const toConfirm = (ans) => {
    const city = ans.city === "Other" ? ans.city_other : ans.city;
    const cls = ans.student_class === "Other" ? ans.class_other : ans.student_class;
    const sub = ans.subject === "Other" ? ans.subject_other : ans.subject;
    say([
      `Here's your booking:\n• ${ans.dateLabel} at ${ans.time} (${tzName} time)\n• Student: ${ans.student_name} · ${cls} · ${sub}\n• Parent: ${ans.parent_name}\n• ${ans.email} · ${dialCode} ${ans.phone}\n• ${city}, ${countryName}`,
      "If everything looks right, tap the button below to confirm.",
    ], "confirm");
  };

  const submit = async () => {
    remember(); user("I agree — book my demo"); setBusy(true); setStep(null);
    try {
      const { data } = await api.post("/demos", {
        parent_name: a.parent_name, student_name: a.student_name, email: a.email,
        phone: `${dialCode} ${a.phone}`.trim(),
        country: a.country, country_other: a.country === "Other" ? a.country_other : "", city: a.city, city_other: a.city_other || "",
        student_class: a.student_class, class_other: a.class_other || "",
        subject: a.subject, subject_other: a.subject_other || "",
        demo_date: a.date, demo_time: a.time, timezone: tz,
        additional_notes: a.notes || "", accepted_terms: true,
      });
      if (window.fbq) window.fbq("track", "Schedule", { content_name: "free_demo_class", content_category: "demo_booking" });
      setDone({ id: data.booking_number || data.id });
      setMsgs((m) => [...m, { from: "bot", text: `🎉 You're booked! Your free demo is on ${a.dateLabel} at ${a.time}. A confirmation is on its way to ${a.email}. Booking #${data.booking_number || data.id}.` }]);
      setStep("finished");
    } catch (e) {
      const detail = e.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map((x) => x.msg).join(" · ") : detail || "Something went wrong.";
      if (e.response?.status === 409) {
        setA((x) => ({ ...x, time: undefined }));
        say(`${msg} Let's pick another time.`, "time", () => loadTimes(a.date));
      } else {
        say(`Sorry — ${msg} You can try again, or message us on WhatsApp and we'll book it for you.`, "confirm");
      }
    } finally {
      setBusy(false);
    }
  };

  // ---- hide on pages where a chat bubble would get in the way ---------
  const p = location.pathname;
  if (p.startsWith("/book-demo") || p === "/checkout" || p === "/login" || p.startsWith("/app/") || p.startsWith("/session/") || p.startsWith("/pay/") || p === "/payment-success") return null;


  const showText = (!otherFor && ["parent_name", "student_name", "email", "phone", "notes"].includes(step)) || step === "country_other";
  const textPlaceholder = { country_other: "Type your country…", parent_name: "Parent's full name", student_name: "Student's full name", email: "name@example.com", phone: "Phone number", notes: "Type a note, or tap Skip" }[step] || "";

  return (
    <>
      {!open && (
        <button type="button" onClick={openPanel} aria-label="Chat with us — book a free demo" data-testid="floating-whatsapp"
          className="fixed z-[60] left-4 bottom-24 sm:bottom-6 h-14 w-14 rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.45)] grid place-items-center hover:scale-105 active:scale-95 transition-transform">
          <WaGlyph />
          {unread && <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[11px] font-semibold grid place-items-center border-2 border-background">1</span>}
        </button>
      )}

      {open && (
        <div role="dialog" aria-label="RynSpireEdu chat assistant" data-testid="chat-assistant"
          className="fixed z-[110] inset-x-2 bottom-2 sm:inset-x-auto sm:left-4 sm:bottom-6 sm:w-[390px] h-[min(620px,calc(100dvh-1rem))] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
            <span className="h-9 w-9 rounded-full bg-[#25D366] grid place-items-center shrink-0"><WaGlyph size={20} /></span>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm leading-tight">RynSpireEdu</div>
              <div className="text-[11px] text-white/80 leading-tight">Automated assistant · replies instantly</div>
            </div>
            {history.length > 0 && step !== "finished" && (
              <button type="button" onClick={goBack} aria-label="Go back one step" className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/10"><ArrowLeft size={18} /></button>
            )}
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/10"><X size={18} /></button>
          </div>

          <div ref={bodyRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-[#ECE5DD] dark:bg-secondary/40">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line shadow-sm ${m.from === "user" ? "bg-[#DCF8C6] text-black rounded-br-sm" : "bg-white text-black rounded-bl-sm"}`}>{m.text}</div>
              </div>
            ))}
            {(busy || (!step && msgs.length > 0)) && (
              <div className="flex justify-start"><div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 shadow-sm flex gap-1" aria-label="Typing">
                {[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />)}
              </div></div>
            )}
          </div>

          <div className="border-t border-border bg-card px-3 py-3 max-h-[45%] overflow-y-auto">
            {step === "start" && <div className="flex flex-wrap gap-2"><Chip primary onClick={() => onStart(true)}>Yes, book a free demo</Chip><Chip onClick={() => onStart(false)}>No, I have a question</Chip></div>}
            {step === "faq" && <div className="flex flex-wrap gap-2">
              <Chip onClick={() => onFaq("pricing")}>Pricing</Chip><Chip onClick={() => onFaq("demo")}>How the free demo works</Chip>
              <Chip onClick={() => onFaq("subjects")}>Subjects &amp; grades</Chip><Chip onClick={() => onFaq("person")}>Talk to a person</Chip>
            </div>}
            {step === "faq_after" && <div className="flex flex-wrap gap-2">
              {a.link && <Link to={a.link} onClick={() => setOpen(false)} className="rounded-full border border-primary/40 text-primary px-3.5 py-2 text-sm hover:bg-primary/10">View pricing</Link>}
              <Chip primary onClick={() => choose("Yes, book a free demo", () => say("Great! First — which country are you in?", "country"))}>Book a free demo</Chip>
              <Chip onClick={() => choose("Another question", () => say("Sure — what else would you like to know?", "faq"))}>Another question</Chip>
            </div>}
            {step === "country" && <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => <Chip key={c} onClick={() => onCountry(c)}>{c}</Chip>)}
              <Chip onClick={() => choose("🌍 Another country", () => { setText(""); say("Which country are you in? Start typing its name.", "country_other"); })}>🌍 Another country</Chip>
            </div>}
            {step === "country_other" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">{matches.map((c) => <Chip key={c.iso} onClick={() => onOtherCountry(c)}>{isoToFlag(c.iso)} {c.name}</Chip>)}</div>
                {matches.length === 0 && <p className="text-xs text-muted-foreground mb-2">No match — check the spelling.</p>}
              </div>
            )}
            {step === "zone" && <div className="flex flex-wrap gap-2">{(a.zones || []).map((z) => <Chip key={z} onClick={() => onZone(z)}>{cityOfZone(z)} ({utcOffset(z)})</Chip>)}</div>}
            {step === "city" && !otherFor && <div className="flex flex-wrap gap-2">{(CITIES_BY_COUNTRY[a.country] || ["Other"]).map((c) => <Chip key={c} onClick={() => onCity(c)}>{c}</Chip>)}</div>}
            {step === "date" && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {nextOpenDays(tz, 6).map((d) => <Chip key={ymd(d)} onClick={() => onDate(d)}>{fmtDay(d)}</Chip>)}
                  <Chip onClick={() => setPickDate((v) => !v)}>Another date…</Chip>
                </div>
                {pickDate && (
                  <input type="date" aria-label="Pick another date" min={ymd(todayInTz(tz))} max={ymd(maxBookableDate(tz))}
                    onChange={(e) => { const [y, m, d] = e.target.value.split("-").map(Number); if (y) onDate(new Date(y, m - 1, d)); }}
                    className="mt-2 w-full h-11 rounded-xl border border-input bg-background px-3 text-base" />
                )}
              </div>
            )}
            {step === "time" && (times === null
              ? <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Checking available times…</div>
              : times.length === 0
                ? <div><p className="text-sm text-muted-foreground">No free slots left on that day.</p><div className="mt-2"><Chip onClick={() => { setStep("date"); say("Please pick another day.", "date"); }}>Pick another day</Chip></div></div>
                : <div className="flex flex-wrap gap-2">{times.map((t) => <Chip key={t} onClick={() => onTime(t)}>{t}</Chip>)}</div>)}
            {step === "student_class" && !otherFor && <div className="flex flex-wrap gap-2">{CLASSES.map((c) => <Chip key={c} onClick={() => onClass(c)}>{c}</Chip>)}</div>}
            {step === "subject" && !otherFor && <div className="flex flex-wrap gap-2">{SUBJECTS.map((s) => <Chip key={s} onClick={() => onSubject(s)}>{s}</Chip>)}</div>}
            {step === "notes" && !otherFor && <div className="mb-2"><Chip onClick={skipNotes}>Skip</Chip></div>}
            {step === "confirm" && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">I agree to be contacted at the details above and accept the <Link to="/terms" target="_blank" className="text-primary underline">Terms &amp; Conditions</Link> and <Link to="/privacy-policy" target="_blank" className="text-primary underline">Privacy Policy</Link>.</p>
                <div className="flex flex-wrap gap-2"><Chip primary onClick={submit}>I agree — book my demo</Chip><Chip onClick={() => choose("Cancel", () => say("No problem — nothing has been booked. Tap the back arrow to change anything, or message us on WhatsApp.", "faq_after"))}>Cancel</Chip></div>
              </div>
            )}
            {step === "finished" && <div className="flex flex-wrap gap-2"><Chip onClick={() => setOpen(false)}>Close</Chip></div>}

            {(showText || otherFor) && (
              <form onSubmit={onText} className="flex items-center gap-2">
                {step === "phone" && <span className="text-sm text-muted-foreground shrink-0">{dialCode}</span>}
                <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder={otherFor ? "Type here…" : textPlaceholder}
                  inputMode={step === "phone" ? "tel" : step === "email" ? "email" : "text"} autoComplete={step === "email" ? "email" : step === "phone" ? "tel-national" : "off"}
                  aria-label={textPlaceholder || "Your answer"} className="flex-1 min-w-0 h-11 rounded-full border border-input bg-background px-4 text-base" />
                <button type="submit" aria-label="Send" className="h-11 w-11 shrink-0 rounded-full bg-[#25D366] text-white grid place-items-center"><Send size={18} /></button>
              </form>
            )}

            <a href={waUrl()} target="_blank" rel="noopener noreferrer" data-testid="chat-whatsapp-link"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-[#25D366] text-[#128C7E] px-4 py-2.5 text-sm font-medium hover:bg-[#25D366]/10">
              <svg viewBox="0 0 32 32" width="18" height="18" fill="#25D366" aria-hidden="true"><path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.24.622 4.42 1.803 6.32L4 29l7.86-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Z" /></svg> Chat directly on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
