import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight } from "lucide-react";
import useHasPurchased from "@/lib/useHasPurchased";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();
  const hasPurchased = useHasPurchased();

  useEffect(() => {
    const onScroll = () => {
      if (dismissed) return;
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  // Hide on booking + auth pages, and for visitors who've already purchased
  if (hasPurchased || location.pathname.startsWith("/book-demo") || location.pathname === "/login" || location.pathname === "/register") return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed z-40 bottom-24 right-4 sm:bottom-8 sm:right-8"
          data-testid="floating-cta"
        >
          <div className="relative group">
            <span className="absolute -inset-2 rounded-full bg-accent/50 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden />
            <Link
              to="/book-demo"
              data-testid="floating-cta-link"
              className="relative flex items-center gap-2 rounded-full bg-primary text-primary-foreground pl-4 pr-5 py-3 border border-accent/50 shadow-[0_20px_50px_rgba(107,33,168,0.35)] hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Sparkles size={14} className="text-accent group-hover:text-accent-foreground" />
              <span className="text-sm font-medium">Book Free 25-min Demo</span>
              <ArrowRight size={14} className="ml-0.5" />
            </Link>
            <button
              onClick={() => { setDismissed(true); setVisible(false); }}
              aria-label="Dismiss"
              data-testid="floating-cta-dismiss"
              className="absolute -top-2 -right-2 h-6 w-6 grid place-items-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground"
            >
              <X size={11} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
