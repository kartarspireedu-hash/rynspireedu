import { useEffect } from "react";

/**
 * Loads the Tawk.to live chat widget site-wide.
 * Configure via Railway environment variables on the frontend service:
 *   VITE_TAWK_PROPERTY_ID  -> your Property ID
 *   VITE_TAWK_WIDGET_ID    -> your Widget ID
 * Both are found in Tawk.to dashboard -> Administration -> Chat Widget -> Widget code.
 * If either is missing, the widget simply does not load (no errors).
 */
export default function TawkChat() {
  useEffect(() => {
    const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID;
    const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID;
    if (!propertyId || !widgetId) return;
    if (document.getElementById("tawk-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s = document.createElement("script");
    s.id = "tawk-script";
    s.async = true;
    s.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }, []);

  return null;
}
