"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { trackWhatsAppClick, trackCallClick } from "@/lib/tracking";

export default function MobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl border border-[var(--border)] bg-white/90 p-2 shadow-[0_18px_50px_rgba(8,24,48,0.20)] backdrop-blur">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/diagnostic"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Book Diagnostic
            </Link>
            <a
              href="https://wa.me/917396669430?text=Hi%20I%27m%20interested%20in%20tuition"
              onClick={trackWhatsAppClick}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              WhatsApp
            </a>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-[var(--muted)]">
            <a
              className="underline-offset-4 hover:underline"
              href="tel:+917396669430"
              onClick={trackCallClick}
            >
              Call: {BRAND.phoneDisplay}
            </a>
            <span className="opacity-50">&bull;</span>
            <Link className="underline-offset-4 hover:underline" href="/contact">
              Enquire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
