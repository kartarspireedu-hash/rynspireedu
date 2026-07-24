import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { getConsent, setConsent, acceptAll, rejectNonEssential } from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ analytics: false });

  useEffect(() => {
    const c = getConsent();
    if (!c.decided) setVisible(true);
    setDraft({ analytics: c.analytics });

    // Allow re-opening from the footer "Cookie preferences" link
    const reopen = () => {
      const cur = getConsent();
      setDraft({ analytics: cur.analytics });
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener("rse-open-cookie-prefs", reopen);
    return () => window.removeEventListener("rse-open-cookie-prefs", reopen);
  }, []);

  if (!visible) return null;

  const close = () => setVisible(false);

  return (
    <div className="fixed inset-x-0 sm:inset-x-auto sm:left-4 bottom-0 sm:bottom-4 z-[100] p-3 sm:p-0 sm:max-w-sm" data-testid="cookie-consent-banner">
      <div className="mx-auto sm:mx-0 max-w-md sm:max-w-sm rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2.5">
            <Cookie size={18} className="text-accent shrink-0" />
            <p className="text-sm font-medium">We use cookies</p>
          </div>

          {expanded && (
            <div className="mt-3 space-y-2.5 border-t border-border pt-3">
              <label className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium">Essential</span>
                <input type="checkbox" checked disabled className="h-4 w-4 accent-primary opacity-60" />
              </label>
              <label className="flex items-center justify-between gap-3 text-xs cursor-pointer">
                <span className="font-medium">Custom</span>
                <input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft({ analytics: e.target.checked })} className="h-4 w-4 accent-primary" data-testid="cookie-toggle-analytics" />
              </label>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!expanded ? (
              <>
                <Button size="sm" className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => { acceptAll(); close(); }} data-testid="cookie-accept-all">
                  Accept
                </Button>
                <Button size="sm" variant="outline" className="pill-btn" onClick={() => { rejectNonEssential(); close(); }} data-testid="cookie-reject-all">
                  Decline
                </Button>
                <button className="ml-auto text-[11px] text-muted-foreground underline hover:text-foreground" onClick={() => setExpanded(true)} data-testid="cookie-customize">
                  Customize
                </button>
              </>
            ) : (
              <>
                <Button size="sm" className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => { setConsent(draft); close(); }} data-testid="cookie-save-prefs">
                  Save
                </Button>
                <button className="ml-auto text-[11px] text-muted-foreground underline hover:text-foreground" onClick={() => setExpanded(false)}>
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
