import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router does not scroll to top on navigation by default.
 * This ensures every internal link (header, footer, buttons) lands
 * the user at the top of the new page instead of wherever they
 * scrolled to on the previous page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollNow = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollNow();
    // Mobile menus sometimes hold a scroll-lock for a moment after navigation;
    // a follow-up scroll on the next frame (and a short delay) catches that.
    const raf = requestAnimationFrame(scrollNow);
    const t = setTimeout(scrollNow, 60);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [pathname]);

  return null;
}
