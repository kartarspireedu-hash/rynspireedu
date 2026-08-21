import { useState, useEffect } from "react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import Seo from "@/components/Seo";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { validateEmail, validatePhoneForCountry } from "@/lib/validators";
import { isoToFlag, DIAL_CODES } from "@/lib/dialCodes";

const REASONS = [
  "Parent / Student Enquiry",
  "Tutor Application",
  "Billing / Payment Support",
  "Business / Partnership",
  "Media / Press",
  "Advertising / Promotion",
  "General Enquiry",
  "Other",
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "", reason_other: "", subject: "", message: "" });
  const [dialCode, setDialCode] = useState("+61");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    api.get("/geo").then(({ data }) => {
      if (cancelled) return;
      const match = DIAL_CODES.find((d) => d.iso === data?.country);
      if (match) setDialCode(match.dial);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (form.phone.trim()) {
      const phoneErr = validatePhoneForCountry(dialCode, form.phone);
      if (phoneErr) errs.phone = phoneErr;
    }
    if (!form.reason) errs.reason = "Please select a reason.";
    if (form.reason === "Other" && !form.reason_other.trim()) errs.reason_other = "Please specify.";
    if (!form.subject.trim()) errs.subject = "Please enter a subject.";
    if (!form.message.trim()) errs.message = "Please enter a message.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const reason = form.reason === "Other" && form.reason_other.trim() ? form.reason_other.trim() : form.reason;
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone.trim() ? `${dialCode} ${form.phone}`.trim() : "",
        subject: `[${reason}] ${form.subject}`,
        message: form.message,
      });
      setSent(true);
      toast.success("Message sent! We'll reply within 24 hours.");
    } catch (e) {
      const detail = e.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map((x) => x.msg || JSON.stringify(x)).join(" · ") : (detail || "Could not send message");
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo
        title="Contact Us - RynSpireEdu"
        description="Questions about tutoring plans or billing? Contact RynSpireEdu by form or email at care@rynspireedu.com."
      />
      <SiteHeader />
      <section className="container-x pt-12 pb-20 max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 text-center">Get in touch</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl text-center">Contact Us</h1>
        <p className="mt-3 text-muted-foreground text-center">
          Questions about tutoring plans, billing, or anything else? Send us a message, or email us
          directly at{" "}
          <a href="mailto:care@rynspireedu.com" className="text-primary underline inline-flex items-center gap-1">
            <Mail size={13} /> care@rynspireedu.com
          </a>.
        </p>

        <a
          href="https://wa.me/61480851790?text=Hi%20RynSpireEdu!%20I'd%20like%20to%20know%20more%20about%20your%20tutoring%20plans."
          target="_blank"
          rel="noopener noreferrer"
          data-testid="contact-whatsapp-card"
          className="mt-8 flex items-center justify-between gap-4 rounded-3xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/15 transition-colors p-5 sm:p-6"
        >
          <div className="flex items-center gap-4">
            <span className="h-12 w-12 shrink-0 rounded-full bg-[#25D366] grid place-items-center">
              <svg viewBox="0 0 32 32" width="24" height="24" fill="white" aria-hidden="true">
                <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.24.622 4.42 1.803 6.32L4 29l7.86-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.94 0-3.84-.52-5.5-1.5l-.395-.235-4.66 1.05 1.08-4.53-.257-.41A9.66 9.66 0 0 1 6.3 15c0-5.36 4.35-9.7 9.704-9.7 5.354 0 9.7 4.34 9.7 9.7 0 5.36-4.346 9.7-9.7 9.7Zm5.33-7.27c-.29-.145-1.72-.85-1.99-.945-.267-.097-.462-.145-.656.145-.194.29-.75.945-.92 1.14-.17.194-.34.218-.63.073-.29-.146-1.224-.451-2.332-1.44-.862-.769-1.444-1.719-1.613-2.01-.17-.29-.018-.447.127-.591.13-.13.29-.34.435-.51.146-.17.194-.29.29-.485.097-.194.049-.364-.024-.51-.073-.145-.656-1.58-.9-2.164-.237-.568-.478-.491-.656-.5l-.559-.01c-.194 0-.51.073-.777.364-.267.29-1.02.997-1.02 2.432s1.044 2.822 1.19 3.017c.146.194 2.055 3.14 4.98 4.404.696.3 1.238.48 1.662.615.698.222 1.334.19 1.836.115.56-.084 1.72-.703 1.963-1.382.243-.68.243-1.262.17-1.383-.073-.121-.267-.194-.558-.34Z" />
              </svg>
            </span>
            <div>
              <p className="font-display text-lg">Chat with us on WhatsApp</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5"><span aria-hidden>🇦🇺</span> +61 480 851 790 · Fastest way to reach us</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-primary shrink-0" />
        </a>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-6" data-testid="contact-success">
              <div className="mx-auto h-14 w-14 rounded-full bg-accent/25 grid place-items-center">
                <CheckCircle2 size={26} className="text-primary" />
              </div>
              <h2 className="mt-4 font-display text-2xl">Message sent!</h2>
              <p className="mt-2 text-muted-foreground text-sm">Thanks, {form.name.split(" ")[0]}. We'll get back to you within 24 hours.</p>
              <Button variant="outline" className="mt-6 pill-btn" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", reason: "", reason_other: "", subject: "", message: "" }); }}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4" data-testid="contact-form">
              <div>
                <Label htmlFor="c-name">Name *</Label>
                <Input id="c-name" required value={form.name} onChange={(e) => setField("name", e.target.value)} className="mt-1.5 rounded-xl" data-testid="contact-name" />
                {fieldErrors.name && <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>}
              </div>
              <div>
                <Label htmlFor="c-email">Email *</Label>
                <Input id="c-email" required type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-1.5 rounded-xl" data-testid="contact-email" />
                {fieldErrors.email && <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>}
              </div>
              <div>
                <Label htmlFor="c-phone">Phone (Optional)</Label>
                <div className="mt-1.5 flex gap-2">
                  <Select value={dialCode} onValueChange={setDialCode}>
                    <SelectTrigger className="rounded-xl w-[6.5rem] shrink-0" data-testid="contact-dial-code"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DIAL_CODES.map((d) => (
                        <SelectItem key={d.iso} value={d.dial}>{isoToFlag(d.iso)} {d.dial}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input id="c-phone" inputMode="tel" placeholder="400 000 000" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="rounded-xl flex-1" data-testid="contact-phone" />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-xs text-destructive">{fieldErrors.phone}</p>}
              </div>
              <div>
                <Label>Reason for Contacting *</Label>
                <Select value={form.reason} onValueChange={(v) => setField("reason", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl" data-testid="contact-reason"><SelectValue placeholder="Select a reason" /></SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                {form.reason === "Other" && (
                  <Input className="mt-2 rounded-xl" placeholder="Please specify" value={form.reason_other} onChange={(e) => setField("reason_other", e.target.value)} data-testid="contact-reason-other" />
                )}
                {fieldErrors.reason && <p className="mt-1 text-xs text-destructive">{fieldErrors.reason}</p>}
                {fieldErrors.reason_other && <p className="mt-1 text-xs text-destructive">{fieldErrors.reason_other}</p>}
              </div>
              <div>
                <Label htmlFor="c-subject">Subject *</Label>
                <Input id="c-subject" required value={form.subject} onChange={(e) => setField("subject", e.target.value)} placeholder="What's this about?" className="mt-1.5 rounded-xl" data-testid="contact-subject" />
                {fieldErrors.subject && <p className="mt-1 text-xs text-destructive">{fieldErrors.subject}</p>}
              </div>
              <div>
                <Label htmlFor="c-message">Message *</Label>
                <Textarea id="c-message" required className="mt-1.5 rounded-xl min-h-32" placeholder="How can we help?" value={form.message} onChange={(e) => setField("message", e.target.value)} data-testid="contact-message" />
                {fieldErrors.message && <p className="mt-1 text-xs text-destructive">{fieldErrors.message}</p>}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={busy} className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="contact-submit-btn">
                  {busy ? (<><Loader2 size={14} className="mr-1.5 animate-spin" /> Sending…</>) : (<>Send Message <Send size={14} className="ml-1.5" /></>)}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
