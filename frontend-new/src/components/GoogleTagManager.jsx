import { useEffect } from "react";
import { getConsent } from "@/lib/cookieConsent";

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
    if (getConsent().analytics) loadGtm();

    const onChange = (e) => {
      if (e.detail?.analytics) loadGtm();
    };
    window.addEventListener("rse-consent-changed", onChange);
    return () => window.removeEventListener("rse-consent-changed", onChange);
  }, []);

  return null;
}
