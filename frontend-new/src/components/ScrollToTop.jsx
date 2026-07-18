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
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
