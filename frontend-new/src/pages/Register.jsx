import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

const roleHome = { student: "/app/student", parent: "/app/student", tutor: "/app/tutor" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", grade: "Year 10", country: "Australia" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await register(form);
    setBusy(false);
    if (res.ok) {
      toast.success(`Welcome to RynSpire, ${res.user.name}!`);
      navigate(roleHome[res.user.role] || "/app/student");
    } else {
      setError(res.error);
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container-x py-16 grid lg:grid-cols-2 gap-16 items-center max-w-5xl">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Get started</p>
          <h1 className="mt-3 font-display text-4xl lg:text-5xl leading-[1.05]">Create your RynSpire account.</h1>
          <p className="mt-4 text-muted-foreground">Free 30-minute consultation. No credit card required.</p>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8" data-testid="register-form">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center"><GraduationCap size={16} /></span>
            <span className="font-display text-lg">Create account</span>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={(e) => setField("name", e.target.value)} className="mt-1.5 rounded-xl" data-testid="register-name-input" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-1.5 rounded-xl" data-testid="register-email-input" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => setField("password", e.target.value)} className="mt-1.5 rounded-xl" data-testid="register-password-input" />
              <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>I am a</Label>
                <Select value={form.role} onValueChange={(v) => setField("role", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl" data-testid="register-role-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Country</Label>
                <Select value={form.country} onValueChange={(v) => setField("country", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl" data-testid="register-country-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.role === "student" && (
              <div>
                <Label>Grade</Label>
                <Select value={form.grade} onValueChange={(v) => setField("grade", v)}>
                  <SelectTrigger className="mt-1.5 rounded-xl" data-testid="register-grade-select"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Kindergarten", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"].map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {error && <p className="text-sm text-destructive" data-testid="register-error">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full pill-btn bg-primary hover:bg-accent hover:text-accent-foreground" data-testid="register-submit-btn">
              {busy ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-accent hover:underline" data-testid="register-login-link">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
