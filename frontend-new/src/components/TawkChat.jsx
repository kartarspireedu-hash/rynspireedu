import { useEffect } from "react";
import { getConsent } from "@/lib/cookieConsent";

/**
 * Loads the Tawk.to live chat widget site-wide (only once the visitor has
 * consented to "Live Chat" cookies), and forwards pre-chat form submissions
 * to our backend so they land in the "Tawk Enquiries" tab of the Google Sheet.
 *
 * IDs can be overridden via Railway env vars VITE_TAWK_PROPERTY_ID /
 * VITE_TAWK_WIDGET_ID, but default to the real widget already set up.
 */
const DEFAULT_PROPERTY_ID = "6a5512c6f9a2241d47e6e34d";
const DEFAULT_WIDGET_ID = "1jte52mol";

function loadTawk() {
  const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID || DEFAULT_PROPERTY_ID;
  const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID || DEFAULT_WIDGET_ID;
  if (!propertyId || !widgetId) return;
  if (document.getElementById("tawk-script")) return;

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  // Move the chat bubble up from the bottom-right corner so it sits closer
  // to the middle of the right edge, clearing the "Book Free Demo" sticky
  // bar on mobile and the floating CTA on desktop.
  window.Tawk_API.customStyle = {
    visibility: {
      desktop: { position: "br", xOffset: 20, yOffset: 220 },
      mobile: { position: "br", xOffset: 10, yOffset: 160 },
    },
  };

  // Fires when a visitor submits the pre-chat form (name/email/etc).
  window.Tawk_API.onPrechatSubmit = function (data) {
    try {
      const apiBase = import.meta.env.VITE_BACKEND_URL || "";
      fetch(`${apiBase}/api/tawk-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data || {}),
      }).catch(() => {});
    } catch (e) {
      // fail silently, never block the chat widget
    }
  };

  const s = document.createElement("script");
  s.id = "tawk-script";
  s.async = true;
  s.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
  s.charset = "UTF-8";
  s.setAttribute("crossorigin", "*");
  document.body.appendChild(s);
}

export default function TawkChat() {
  useEffect(() => {
    if (getConsent().chat) loadTawk();

    const onChange = (e) => {
      if (e.detail?.chat) loadTawk();
    };
    window.addEventListener("rse-consent-changed", onChange);
    return () => window.removeEventListener("rse-consent-changed", onChange);
  }, []);

  return null;
}
