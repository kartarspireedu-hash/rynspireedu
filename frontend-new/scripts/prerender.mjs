// Prerendering for SEO/AEO crawlability.
//
// Runs AFTER `npm run build:ssr` (which Vite-compiles src/entry-server.jsx
// into dist-ssr/entry-server.js) and AFTER `vite build` (the normal client
// build into dist/). For each public route below, it uses the compiled
// entry to server-render the real page content, then writes it as static
// HTML next to the built app. Real visitors still get the exact same
// interactive React app — this only changes what the very first response
// contains, so crawlers that don't run JavaScript (most AI answer engines,
// and slower-path Google indexing) see real content instead of an empty
// shell.
//
// This script does NOT modify any component or page file. It only reads
// the already-built dist/index.html and writes new HTML files alongside
// it, plus overwrites dist/index.html itself with the homepage's
// prerendered version (same file, same <script> tags — just with content
// already inside <div id="root">).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const ssrDir = join(__dirname, "..", "dist-ssr");

// ------------------------------------------------------------------
// Minimal browser-global shim. Some existing context providers
// (ThemeContext, CurrencyContext) read window.localStorage synchronously
// on first render — this exists purely so that code runs without
// crashing under Node, and is intentionally NOT a full DOM: nothing here
// changes app behavior, it just no-ops browser-only calls during the
// build step.
// ------------------------------------------------------------------
const memoryStore = new Map();
globalThis.window = globalThis.window || {
  localStorage: {
    getItem: (k) => (memoryStore.has(k) ? memoryStore.get(k) : null),
    setItem: (k, v) => memoryStore.set(k, String(v)),
    removeItem: (k) => memoryStore.delete(k),
  },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  addEventListener() {},
  removeEventListener() {},
  location: { pathname: "/" },
};
globalThis.localStorage = globalThis.window.localStorage;
globalThis.document = globalThis.document || {
  documentElement: { classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, style: {} },
  createElement: () => ({ setAttribute() {}, appendChild() {}, style: {} }),
  createTextNode: (text) => ({ nodeValue: text }),
  querySelector: () => null,
  head: { appendChild() {} },
  addEventListener() {},
  removeEventListener() {},
};

const { render } = await import(join(ssrDir, "entry-server.js"));

const ROUTES = [
  { path: "/", title: "RynSpireEdu - Best Online Tutoring Platform in Australia, New Zealand, US & Canada", description: "Live, 1-to-1 online tutoring for K-12 students in Australia, New Zealand, the United States and Canada. Book a free 25-minute demo class today with RynSpireEdu." },
  { path: "/about", title: "About RynSpireEdu | Online Tutoring for Australia, NZ, US & Canada", description: "RynSpireEdu delivers premium 1-to-1 online tutoring for K-12 students across Australia, New Zealand, the United States and Canada, expanding soon to the UK, Europe and the Middle East." },
  { path: "/pricing", title: "Pricing - RynSpireEdu | Online Tutoring Plans for K-12", description: "Transparent pricing for 1-to-1 online tutoring plans. Monthly, quarterly, half-yearly and yearly plans for K-12 students in Australia, New Zealand, the US and Canada." },
  { path: "/contact", title: "Contact Us - RynSpireEdu", description: "Questions about tutoring plans or billing? Contact RynSpireEdu by form or email at care@rynspireedu.com." },
  { path: "/book-demo", title: "Book a Free Demo - RynSpireEdu", description: "Book a free 25-minute 1-to-1 online tutoring demo session with RynSpireEdu. No payment needed." },
  { path: "/privacy-policy", title: "Privacy Policy - RynSpireEdu", description: "How RynSpireEdu collects, uses and protects your personal information." },
  { path: "/terms", title: "Payment Terms & Conditions - RynSpireEdu", description: "Payment terms and conditions for RynSpireEdu tutoring plans and services." },
  { path: "/terms-of-use", title: "Terms of Use - RynSpireEdu", description: "Terms of use governing access to and use of the RynSpireEdu website and services." },
  { path: "/cancellation-policy", title: "Cancellation Policy - RynSpireEdu", description: "RynSpireEdu's policy on cancelling tutoring plans and sessions." },
  { path: "/refund-policy", title: "Refund Policy - RynSpireEdu", description: "RynSpireEdu's policy on refunds for tutoring plans and sessions." },
  { path: "/child-protection", title: "Child Protection Policy - RynSpireEdu", description: "RynSpireEdu's commitment to child safety and protection in all tutoring interactions." },
];

function buildHtml(template, { title, description, bodyHtml }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  if (/<meta\s+name="description"/i.test(html)) {
    html = html.replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${description.replace(/"/g, "&quot;")}" />`);
  } else {
    html = html.replace(/<title>[\s\S]*?<\/title>/, (m) => `${m}\n    <meta name="description" content="${description.replace(/"/g, "&quot;")}" />`);
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  return html;
}

const template = readFileSync(join(distDir, "index.html"), "utf-8");

let ok = 0;
let failed = 0;

for (const route of ROUTES) {
  try {
    const bodyHtml = render(route.path);
    const html = buildHtml(template, { title: route.title, description: route.description, bodyHtml });

    if (route.path === "/") {
      // Homepage: overwrite dist/index.html directly — same file that
      // already serves both "/" and the SPA fallback, now with real
      // content already inside <div id="root">.
      writeFileSync(join(distDir, "index.html"), html, "utf-8");
    } else {
      const outDir = join(distDir, route.path.replace(/^\//, ""));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, "index.html"), html, "utf-8");
    }
    ok++;
    console.log(`  \u2713 prerendered ${route.path}`);
  } catch (err) {
    failed++;
    console.error(`  \u2717 FAILED to prerender ${route.path}:`, err.message);
  }
}

console.log(`\nPrerender complete: ${ok} succeeded, ${failed} failed.`);
if (failed > 0) {
  console.error("One or more routes failed to prerender — check errors above before deploying.");
  process.exit(1);
}

