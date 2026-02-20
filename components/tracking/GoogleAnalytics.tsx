"use client";

import Script from "next/script";
import {
  GA_ID,
  ADS_ID,
  CLARITY_ID,
  PHONE_CALL_CONFIG,
  TRACKED_PHONE_NUMBER,
} from "@/lib/tracking";

export default function GoogleAnalytics() {
  return (
    <>
      {/* Load gtag.js — keyed to the Ads ID so conversions fire immediately */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
        strategy="lazyOnload"
      />

      {/* Initialise dataLayer, configure Ads + GA4 + phone call tracking */}
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ADS_ID}');
          gtag('config', '${GA_ID}');
          gtag('config', '${PHONE_CALL_CONFIG}', {
            phone_conversion_number: '${TRACKED_PHONE_NUMBER}'
          });
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="clarity-init" strategy="lazyOnload">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_ID}");
        `}
      </Script>
    </>
  );
}
