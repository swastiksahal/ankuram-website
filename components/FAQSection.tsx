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
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600">{subtitle}</p>
        </div>

        <div className="mt-8 grid gap-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={[
                  "rounded-xl border border-gray-100 overflow-hidden transition-colors duration-200",
                  isOpen ? "bg-gray-50" : "bg-white hover:bg-gray-50/50",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex((v) => (v === i ? null : i))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-base font-semibold text-navy sm:text-lg">{item.q}</span>
                  <span
                    className={[
                      "grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl border border-gray-100 bg-white text-accent transition-transform duration-200",
                      isOpen ? "rotate-45" : "rotate-0",
                    ].join(" ")}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                <div
                  className={[
                    "grid transition-all duration-200 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5">
                      <p className="text-base leading-relaxed text-gray-600">{item.a}</p>
                    </div>
                  </div>
                </div>
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
