import { MessageCircle, Phone } from "lucide-react";
import { BRAND, DIAGNOSTIC_FEE } from "@/lib/constants";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

type CTABannerProps = {
  title?: string;
  subtitle?: string;
};

export default function CTABanner({
  title = "Every Week You Wait, the Gap Grows",
  subtitle = `A 60-minute diagnostic tells you exactly where your child stands — and what to do about it. ${DIAGNOSTIC_FEE}, fully credited when you enroll.`,
}: CTABannerProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white shadow-xl sm:p-12">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto">
            <p className="section-label mb-4">Take the First Step</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/60">{subtitle}</p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <TrackedCTALink
                trackingType="whatsapp"
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-navy shadow-lg transition hover:bg-accent-light"
              >
                <MessageCircle className="w-5 h-5" />
                Book Diagnostic Assessment
              </TrackedCTALink>
              <TrackedCTALink
                trackingType="phone"
                href={BRAND.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-6 py-4 text-base font-medium text-white transition hover:bg-white/5"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </TrackedCTALink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
