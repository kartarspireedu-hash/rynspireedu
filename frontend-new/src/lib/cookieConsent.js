// Simple cookie-consent state manager. No cookie library needed — consent
// itself is stored in localStorage (this alone is considered "essential"
// and doesn't require consent to set).
const KEY = "rse_cookie_consent";

const DEFAULT_CONSENT = {
  essential: true,      // always on, can't be disabled — site can't function without it
  analytics: false,     // ad measurement / marketing pixel
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

// Tells Google's Consent Mode (defaults set in index.html) whether this
// visitor has granted or denied tracking. GTM/GA4/Ads read this signal
// directly, live — no page reload needed.
function pushConsentUpdate(analyticsGranted) {
  try {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
    window.gtag('consent', 'update', {
      'ad_storage': analyticsGranted ? 'granted' : 'denied',
      'analytics_storage': analyticsGranted ? 'granted' : 'denied',
      'ad_user_data': analyticsGranted ? 'granted' : 'denied',
      'ad_personalization': analyticsGranted ? 'granted' : 'denied',
    });
  } catch {}
}

export function setConsent(partial) {
  const next = { ...getConsent(), ...partial, decided: true };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  pushConsentUpdate(next.analytics);
  window.dispatchEvent(new CustomEvent("rse-consent-changed", { detail: next }));
  return next;
}

export function acceptAll() {
  return setConsent({ analytics: true });
}

export function rejectNonEssential() {
  return setConsent({ analytics: false });
}
