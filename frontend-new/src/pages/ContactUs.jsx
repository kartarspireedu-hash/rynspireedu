import { useState } from "react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/contact", form);
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

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-6" data-testid="contact-success">
              <div className="mx-auto h-14 w-14 rounded-full bg-accent/25 grid place-items-center">
                <CheckCircle2 size={26} className="text-primary" />
              </div>
              <h2 className="mt-4 font-display text-2xl">Message sent!</h2>
              <p className="mt-2 text-muted-foreground text-sm">Thanks, {form.name.split(" ")[0]}. We'll get back to you within 24 hours.</p>
              <Button variant="outline" className="mt-6 pill-btn" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4" data-testid="contact-form">
              <div>
                <Label htmlFor="c-name">Name *</Label>
                <Input id="c-name" required value={form.name} onChange={(e) => setField("name", e.target.value)} className="mt-1.5 rounded-xl" data-testid="contact-name" />
              </div>
              <div>
                <Label htmlFor="c-phone">Phone (optional)</Label>
                <Input id="c-phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="mt-1.5 rounded-xl" data-testid="contact-phone" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-email">Email *</Label>
                <Input id="c-email" required type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-1.5 rounded-xl" data-testid="contact-email" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-message">Message *</Label>
                <Textarea id="c-message" required className="mt-1.5 rounded-xl min-h-32" placeholder="How can we help?" value={form.message} onChange={(e) => setField("message", e.target.value)} data-testid="contact-message" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
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
