import { useEffect } from "react";

const GTM_ID = "GTM-TP47JM7K";

function loadGtm() {
  if (window.__gtmLoaded || document.getElementById("gtm-script")) return;
  window.__gtmLoaded = true;
  /* eslint-disable */
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.id='gtm-script';
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', GTM_ID);
  /* eslint-enable */
}

export default function GoogleTagManager() {
  useEffect(() => {
    // Advanced Consent Mode: GTM now loads immediately for every visitor.
    // What it's allowed to actually do is controlled by the consent signal
    // set in index.html (default) and cookieConsent.js (update) — not by
    // whether the script itself loads. No tracking cookies are set and no
    // personal data is sent until the visitor accepts.
    loadGtm();
  }, []);

  return null;
}
