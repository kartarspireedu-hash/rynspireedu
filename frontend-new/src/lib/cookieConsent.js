// Simple cookie-consent state manager. No cookie library needed — consent
// itself is stored in localStorage (this alone is considered "essential"
// and doesn't require consent to set).
const KEY = "rse_cookie_consent";

const DEFAULT_CONSENT = {
  essential: true,      // always on, can't be disabled — site can't function without it
  analytics: false,     // Meta Pixel / ad measurement
  chat: false,           // Tawk.to live chat widget
  decided: false,        // has the visitor made an explicit choice yet?
};

export function getConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    return { ...DEFAULT_CONSENT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

export function setConsent(partial) {
  const next = { ...getConsent(), ...partial, decided: true };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  window.dispatchEvent(new CustomEvent("rse-consent-changed", { detail: next }));
  return next;
}

export function acceptAll() {
  return setConsent({ analytics: true, chat: true });
}

export function rejectNonEssential() {
  return setConsent({ analytics: false, chat: false });
}
