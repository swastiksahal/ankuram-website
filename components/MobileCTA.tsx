"use client";

import { MessageCircle, Phone } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { trackWhatsAppClick, trackPhoneCall } from "@/lib/tracking";

export default function MobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden safe-area-bottom">
      <div className="bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-5 gap-2">
          <a
            href={BRAND.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className="col-span-3 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 text-sm font-bold text-navy shadow-sm transition active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Book Diagnostic
          </a>
          <a
            href={BRAND.phoneHref}
            onClick={trackPhoneCall}
            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-navy bg-white px-4 py-3.5 text-sm font-bold text-navy shadow-sm transition active:scale-[0.98]"
          >
            <Phone className="w-5 h-5" />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
