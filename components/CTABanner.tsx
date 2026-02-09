import Link from "next/link";
import { BRAND } from "@/lib/constants";

type CTA = { label: string; href: string };

type CTABannerProps = {
  title?: string;
  subtitle?: string;
  primary?: CTA;
  secondary?: CTA;
  bullets?: string[];
};

export default function CTABanner({
  title = "Ready to find the gaps?",
  subtitle = "A 60-minute diagnostic that pinpoints exactly what to fix — with a clear recovery plan.",
  primary = { label: "Book Diagnostic", href: "/diagnostic" },
  secondary = { label: "WhatsApp Us", href: BRAND.whatsappHref },
  bullets = ["60-minute expert assessment", "Written gap analysis report", "Personalised recovery plan"],
}: CTABannerProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(180deg,#111935,#081830)] p-8 text-white shadow-[0_22px_70px_rgba(8,24,48,0.30)] sm:p-12">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[rgba(48,112,240,0.22)] blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">{subtitle}</p>

              <ul className="mt-6 grid gap-2 text-sm text-white/80 sm:grid-cols-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-5 w-5 rounded-full bg-white/10 ring-1 ring-white/15" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl bg-white/5 p-4 ring-1 ring-white/15">
              <div className="grid gap-2">
                <Link
                  href={primary.href}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[var(--brand)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {primary.label}
                </Link>
                <a
                  href={secondary.href}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
                >
                  {secondary.label}
                </a>
                <div className="pt-2 text-center text-xs text-white/70">
                  Or call: <a className="font-semibold text-white underline-offset-4 hover:underline" href={BRAND.phoneHref}>{BRAND.phoneDisplay}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
