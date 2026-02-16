"use client";

import Image from "next/image";
import { WHATSAPP_URL } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/tracking";
import { MessageCircle } from "lucide-react";

export default function JourneySection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <p className="section-label mb-4 text-center">The Journey</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-navy text-center mb-4">
          A Clear Learning Journey — Not Guesswork
        </h2>

        <p className="text-center text-gray-500 max-w-3xl mx-auto mb-10">
          Most students don&apos;t struggle because they&apos;re &ldquo;weak&rdquo; — they struggle because
          a gap from years ago was never found and fixed.
        </p>

        <div className="relative group">
          <Image
            src="/images/journey-before-after.png"
            alt="Before and after learning journey showing student confusion transforming to confidence and improving grades"
            width={1400}
            height={700}
            className="rounded-2xl shadow-lg mx-auto"
            priority
          />
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          This transformation begins with finding the gaps — not random practice.
        </p>

        <div className="text-center mt-8">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsAppClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-navy shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-accent-light"
          >
            <MessageCircle className="w-4 h-4" />
            Start the Transformation
          </a>
        </div>

      </div>
    </section>
  );
}
