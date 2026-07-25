import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/auth/set-password", { token, password });
      toast.success(`Welcome, ${data.name.split(" ")[0]}! Your account is ready.`);
      if (refresh) await refresh();
      const dest = data.role === "tutor" ? "/app/tutor" : data.role === "admin" || data.role === "owner" || data.role === "coordinator" ? "/app/admin" : "/app/student";
      navigate(dest);
    } catch (e) {
      toast.error(e.response?.data?.detail || "This link is invalid or has expired.");
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <section className="container-x py-24 text-center max-w-md mx-auto">
          <h1 className="font-display text-2xl">Missing setup link</h1>
          <p className="mt-2 text-muted-foreground text-sm">This page needs a valid setup link from your welcome email. Already have an account?</p>
          <Button asChild className="mt-6 pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            <Link to="/login">Log in</Link>
          </Button>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-14 pb-24 max-w-md mx-auto">
        <h1 className="font-display text-3xl text-center">Set up your account</h1>
        <p className="mt-2 text-muted-foreground text-sm text-center">Choose a password to access your RynSpireEdu dashboard.</p>

        <form onSubmit={submit} className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 rounded-xl" data-testid="setpw-password" />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5 rounded-xl" data-testid="setpw-confirm" />
          </div>
          <Button type="submit" disabled={busy} className="w-full pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="setpw-submit">
            {busy ? (<><Loader2 size={14} className="mr-1.5 animate-spin" /> Setting up…</>) : (<><ShieldCheck size={14} className="mr-1.5" /> Set password &amp; continue</>)}
          </Button>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
