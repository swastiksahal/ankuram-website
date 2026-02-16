// ── Tracking IDs (hardcoded — no env vars) ──
export const GA_ID = "G-MQRSS8DKLE";
export const ADS_ID = "AW-10954184691";
export const CLARITY_ID = "uir8kpny76";

// ── Conversion labels ──
export const WHATSAPP_CONVERSION_LABEL =
  "AW-10954184691/jucWCNPv3OAbEPOvruco";
export const PHONE_CONVERSION_LABEL =
  "AW-10954184691/NGIFCNbv3OAbEPOvruco";
export const PHONE_CALL_CONFIG =
  "AW-10954184691/t7fbCMLEsM4bEPOvruco";
export const TRACKED_PHONE_NUMBER = "+917396669430";

// ── Helpers ──

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.gtag?.(...args);
}

/** Fire GA4 custom event + Google Ads conversion for WhatsApp clicks */
export function trackWhatsAppClick() {
  gtag("event", "click_whatsapp", { method: "whatsapp" });
  gtag("event", "conversion", {
    send_to: WHATSAPP_CONVERSION_LABEL,
  });
}

/** Fire GA4 custom event + Google Ads conversion for phone calls */
export function trackPhoneCall() {
  gtag("event", "click_call", { method: "tel" });
  gtag("event", "conversion", {
    send_to: PHONE_CONVERSION_LABEL,
  });
}

/** Fire GA4 page_view for SPA navigations */
export function trackPageView(url: string) {
  gtag("config", GA_ID, { page_path: url });
}
