"use client";

import Image from "next/image";

export default function JourneySection() {
  return (
    <section className="py-16 sm:py-20 bg-[var(--surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text)] text-center mb-4">
          A Clear Learning Journey — Not Guesswork
        </h2>

        <p className="text-center text-[var(--muted)] max-w-3xl mx-auto mb-10">
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

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          This transformation begins with finding the gaps — not random practice.
        </p>

        <div className="text-center mt-8">
          <a
            href="https://wa.me/917396669430?text=Hi%20I%27m%20interested%20in%20tuition"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Start the Transformation
          </a>
        </div>

      </div>
    </section>
  );
}
