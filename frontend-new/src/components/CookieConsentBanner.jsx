import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { getConsent, setConsent, acceptAll, rejectNonEssential } from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, chat: false });

  useEffect(() => {
    const c = getConsent();
    if (!c.decided) setVisible(true);
    setDraft({ analytics: c.analytics, chat: c.chat });

    // Allow re-opening from the footer "Cookie preferences" link
    const reopen = () => {
      const cur = getConsent();
      setDraft({ analytics: cur.analytics, chat: cur.chat });
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener("rse-open-cookie-prefs", reopen);
    return () => window.removeEventListener("rse-open-cookie-prefs", reopen);
  }, []);

  if (!visible) return null;

  const close = () => setVisible(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4" data-testid="cookie-consent-banner">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Cookie size={20} className="text-accent mt-0.5 shrink-0" />
            <div className="flex-1 text-sm">
              <p className="font-medium">We use cookies</p>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                We use essential cookies to make the site work, plus optional cookies for ad measurement
                (Meta Pixel) and our live chat widget (Tawk.to). See our{" "}
                <Link to="/privacy-policy" className="text-primary underline">Privacy Policy</Link> for details.
              </p>
            </div>
          </div>

          {expanded && (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <label className="flex items-center justify-between gap-3 text-xs">
                <span>
                  <span className="font-medium">Essential</span>
                  <span className="block text-muted-foreground">Required for the site to function. Always on.</span>
                </span>
                <input type="checkbox" checked disabled className="h-4 w-4 accent-primary opacity-60" />
              </label>
              <label className="flex items-center justify-between gap-3 text-xs cursor-pointer">
                <span>
                  <span className="font-medium">Analytics &amp; Ad measurement</span>
                  <span className="block text-muted-foreground">Meta Pixel — helps us measure ad performance.</span>
                </span>
                <input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))} className="h-4 w-4 accent-primary" data-testid="cookie-toggle-analytics" />
              </label>
              <label className="flex items-center justify-between gap-3 text-xs cursor-pointer">
                <span>
                  <span className="font-medium">Live Chat</span>
                  <span className="block text-muted-foreground">Tawk.to — powers the chat bubble in the corner.</span>
                </span>
                <input type="checkbox" checked={draft.chat} onChange={(e) => setDraft((d) => ({ ...d, chat: e.target.checked }))} className="h-4 w-4 accent-primary" data-testid="cookie-toggle-chat" />
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!expanded ? (
              <>
                <Button size="sm" className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => { acceptAll(); close(); }} data-testid="cookie-accept-all">
                  Accept all
                </Button>
                <Button size="sm" variant="outline" className="pill-btn" onClick={() => { rejectNonEssential(); close(); }} data-testid="cookie-reject-all">
                  Reject non-essential
                </Button>
                <button className="ml-auto text-xs text-muted-foreground underline hover:text-foreground" onClick={() => setExpanded(true)} data-testid="cookie-customize">
                  Customize
                </button>
              </>
            ) : (
              <>
                <Button size="sm" className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => { setConsent(draft); close(); }} data-testid="cookie-save-prefs">
                  Save preferences
                </Button>
                <button className="ml-auto text-xs text-muted-foreground underline hover:text-foreground" onClick={() => setExpanded(false)}>
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
