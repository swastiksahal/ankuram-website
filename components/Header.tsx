"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { trackWhatsAppClick, trackPhoneCall } from "@/lib/tracking";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = useMemo(() => NAV_LINKS, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/images/logo.avif"
            alt="Ankuram Tuition Centre"
            width={120}
            height={48}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  active ? "bg-accent/10 text-navy" : "text-gray-500 hover:bg-gray-50 hover:text-navy",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={BRAND.phoneHref}
            onClick={trackPhoneCall}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Call
          </a>
          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-navy shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-accent-light"
          >
            Book Diagnostic
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white p-2 shadow-sm"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-1">
              {links.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-semibold transition",
                      active ? "bg-accent/10 text-navy" : "hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={BRAND.whatsappHref}
                onClick={trackWhatsAppClick}
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-navy shadow-sm"
              >
                WhatsApp
              </a>
              <Link
                href="/diagnostic"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-navy shadow-sm"
              >
                Book Diagnostic
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
