import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import useHasPurchased from "@/lib/useHasPurchased";

export default function MobileStickyBar() {
  const location = useLocation();
  const hasPurchased = useHasPurchased();
  if (hasPurchased || location.pathname.startsWith("/book-demo") || location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/app/") || location.pathname.startsWith("/session/")) return null;

  return (
    <div className="mobile-sticky lg:hidden px-4 py-3" data-testid="mobile-sticky-bar">
      <Link
        to="/book-demo"
        className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3.5 font-medium text-sm shadow-[0_10px_30px_rgba(107,33,168,0.25)] border border-accent/50 hover:bg-accent hover:text-accent-foreground transition-colors"
        data-testid="mobile-sticky-cta"
      >
        <Sparkles size={14} className="text-accent" />
        Book Free 25-min Demo
      </Link>
    </div>
  );
}
