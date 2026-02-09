declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtagEvent(action: string, params: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", action, params);
}

export function trackWhatsAppClick() {
  gtagEvent("click_whatsapp", { method: "whatsapp" });
  gtagEvent("conversion", { send_to: `${process.env.NEXT_PUBLIC_ADS_ID}/whatsapp_click` });
}

export function trackCallClick() {
  gtagEvent("click_call", { method: "tel" });
  gtagEvent("conversion", { send_to: `${process.env.NEXT_PUBLIC_ADS_ID}/call_click` });
}
