import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { validateEmail } from "@/lib/validators";

/**
 * Email OTP verification widget.
 * Props:
 *   email          - current email value from the parent form
 *   verifyToken    - parent's state holding the verify_token (or "")
 *   onVerified(tok)- called with the token once verified
 *   onReset()      - called when the email changes after being verified (parent should clear its token)
 */
export default function EmailOtpField({ email, verifyToken, onVerified, onReset }) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busySend, setBusySend] = useState(false);
  const [busyVerify, setBusyVerify] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const lastVerifiedEmail = useRef("");

  // If the email changes after verification, the token is no longer valid for it.
  useEffect(() => {
    if (verifyToken && lastVerifiedEmail.current && lastVerifiedEmail.current !== email.trim().toLowerCase()) {
      onReset?.();
      setSent(false);
      setCode("");
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async () => {
    const err = validateEmail(email);
    if (err) {
      toast.error(err);
      return;
    }
    setBusySend(true);
    try {
      await api.post("/otp/send", { email: email.trim().toLowerCase() });
      setSent(true);
      setCooldown(45);
      toast.success("Verification code sent — check your email.");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not send verification code.");
    } finally {
      setBusySend(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    setBusyVerify(true);
    try {
      const { data } = await api.post("/otp/verify", { email: email.trim().toLowerCase(), code: code.trim() });
      lastVerifiedEmail.current = email.trim().toLowerCase();
      onVerified(data.verify_token);
      toast.success("Email verified!");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Incorrect or expired code.");
    } finally {
      setBusyVerify(false);
    }
  };

  if (verifyToken) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1.5" data-testid="otp-verified">
        <CheckCircle2 size={14} /> Email verified
      </div>
    );
  }

  return (
    <div className="mt-2">
      {!sent ? (
        <Button type="button" variant="outline" size="sm" onClick={sendCode} disabled={busySend} className="pill-btn h-8 text-xs" data-testid="otp-send-btn">
          {busySend ? (<><Loader2 size={12} className="mr-1.5 animate-spin" /> Sending…</>) : (<><ShieldCheck size={12} className="mr-1.5" /> Verify Email</>)}
        </Button>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="rounded-xl h-8 w-32 text-sm"
            data-testid="otp-code-input"
          />
          <Button type="button" size="sm" onClick={verifyCode} disabled={busyVerify} className="pill-btn h-8 text-xs bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="otp-verify-btn">
            {busyVerify ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
          </Button>
          <button
            type="button"
            onClick={sendCode}
            disabled={cooldown > 0 || busySend}
            className="text-xs text-muted-foreground hover:text-primary disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      )}
    </div>
  );
}
