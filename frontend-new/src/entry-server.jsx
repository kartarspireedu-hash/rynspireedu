// SSR entry point used ONLY by the build-time prerender step
// (scripts/prerender.mjs). Not part of the normal client app bundle —
// Vite compiles this separately via `vite build --ssr`.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/context/AuthContext";

import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import ContactUs from "@/pages/ContactUs";
import FAQ from "@/pages/FAQ";
import BookDemo from "@/pages/BookDemo";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import TermsOfUse from "@/pages/TermsOfUse";
import CancellationPolicy from "@/pages/CancellationPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import ChildProtection from "@/pages/ChildProtection";

const PAGES = {
  "/": Landing,
  "/about": About,
  "/pricing": Pricing,
  "/contact": ContactUs,
  "/faq": FAQ,
  "/book-demo": BookDemo,
  "/privacy-policy": PrivacyPolicy,
  "/terms": Terms,
  "/terms-of-use": TermsOfUse,
  "/cancellation-policy": CancellationPolicy,
  "/refund-policy": RefundPolicy,
  "/child-protection": ChildProtection,
};

export function render(path) {
  const Component = PAGES[path];
  if (!Component) throw new Error(`No page mapped for path ${path}`);
  return renderToString(
    <StaticRouter location={path}>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <Component />
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </StaticRouter>
  );
}
