import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

const roleHome = { student: "/app/student", parent: "/app/student", tutor: "/app/tutor", admin: "/app/admin", owner: "/app/admin" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (res.ok) {
      toast.success(`Welcome back, ${res.user.name}`);
      const target = location.state?.from || roleHome[res.user.role] || "/app/student";
      navigate(target);
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
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Welcome back</p>
          <h1 className="mt-3 font-display text-4xl lg:text-5xl leading-[1.05]">Sign in to your RynSpire dashboard.</h1>
          <p className="mt-4 text-muted-foreground">Continue your lessons, track progress and message your tutor.</p>
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm">
            <p className="font-medium">Demo credentials</p>
            <p className="text-muted-foreground text-xs mt-1">student@rynspire.com · Student@2026</p>
            <p className="text-muted-foreground text-xs">admin@rynspire.com · Admin@RynSpire2026</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8" data-testid="login-form">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center"><GraduationCap size={16} /></span>
            <span className="font-display text-lg">Sign in</span>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 rounded-xl" data-testid="login-email-input" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 rounded-xl" data-testid="login-password-input" />
            </div>
            {error && <p className="text-sm text-destructive" data-testid="login-error">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full pill-btn bg-primary hover:bg-accent hover:text-accent-foreground" data-testid="login-submit-btn">
              {busy ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              New to RynSpire? <Link to="/register" className="text-accent hover:underline" data-testid="login-register-link">Create an account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
