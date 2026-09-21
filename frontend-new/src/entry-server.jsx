// SSR entry point used ONLY by the build-time prerender step
// (scripts/prerender.mjs). Not part of the normal client app bundle —
// Vite compiles this separately via `vite build --ssr`.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/context/AuthContext";

import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import ContactUs from "@/pages/ContactUs";
import FAQ from "@/pages/FAQ";
import BlogIndex from "@/pages/BlogIndex";
import BlogArticle from "@/pages/BlogArticle";
import BookDemo from "@/pages/BookDemo";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import TermsOfUse from "@/pages/TermsOfUse";
import CancellationPolicy from "@/pages/CancellationPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import ChildProtection from "@/pages/ChildProtection";

// pattern: the react-router path pattern to match against (so useParams()
// resolves correctly for dynamic routes like /blog/:slug).
const ROUTE_DEFS = [
  { pattern: "/", Component: Landing },
  { pattern: "/about", Component: About },
  { pattern: "/pricing", Component: Pricing },
  { pattern: "/contact", Component: ContactUs },
  { pattern: "/faq", Component: FAQ },
  { pattern: "/blog", Component: BlogIndex },
  { pattern: "/blog/:slug", Component: BlogArticle },
  { pattern: "/book-demo", Component: BookDemo },
  { pattern: "/privacy-policy", Component: PrivacyPolicy },
  { pattern: "/terms", Component: Terms },
  { pattern: "/terms-of-use", Component: TermsOfUse },
  { pattern: "/cancellation-policy", Component: CancellationPolicy },
  { pattern: "/refund-policy", Component: RefundPolicy },
  { pattern: "/child-protection", Component: ChildProtection },
];

// Renders whichever route pattern matches `path` (exact match for static
// routes, param match for /blog/:slug), via a real <Routes> so useParams()
// works the same way it does in the client app.
export function render(path) {
  return renderToString(
    <StaticRouter location={path}>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <Routes>
              {ROUTE_DEFS.map(({ pattern, Component }) => (
                <Route key={pattern} path={pattern} element={<Component />} />
              ))}
            </Routes>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </StaticRouter>
  );
}
