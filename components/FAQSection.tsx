"use client";

import { useState } from "react";

type FAQItem = { q: string; a: string };

type FAQSectionProps = {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
};

export default function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Quick answers to common questions.",
  items,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{subtitle}</p>
        </div>

        <div className="mt-8 grid gap-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={[
                  "rounded-2xl border border-[var(--border)] overflow-hidden transition",
                  isOpen ? "bg-[var(--surface)]" : "bg-white hover:bg-black/[0.02]",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex((v) => (v === i ? null : i))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-base font-semibold text-[var(--text)] sm:text-lg">{item.q}</span>
                  <span
                    className={[
                      "grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-white text-[var(--text)] transition-transform duration-200",
                      isOpen ? "rotate-45" : "rotate-0",
                    ].join(" ")}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-base leading-relaxed text-[var(--muted)]">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
