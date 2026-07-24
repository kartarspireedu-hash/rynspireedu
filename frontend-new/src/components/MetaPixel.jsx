import { useEffect } from "react";
import { getConsent } from "@/lib/cookieConsent";

const PIXEL_ID = "981430641389145";

function loadPixel() {
  if (window.fbq || document.getElementById("meta-pixel-script")) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;t.id='meta-pixel-script';
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

export default function MetaPixel() {
  useEffect(() => {
    if (getConsent().analytics) loadPixel();

    const onChange = (e) => {
      if (e.detail?.analytics) loadPixel();
    };
    window.addEventListener("rse-consent-changed", onChange);
    return () => window.removeEventListener("rse-consent-changed", onChange);
  }, []);

  return null;
}
