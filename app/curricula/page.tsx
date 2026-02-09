import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { CURRICULA, WHATSAPP_URL, PHONE_URL, EXPERIENCE_YEARS, BATCH_SIZE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curricula We Cover | Ankuram Tuition Centre",
  description:
    "Expert Maths & Physics tuition across CBSE, ICSE, IB MYP, IB DP, IGCSE, and Cambridge A-Levels. One centre, every board.",
};

export default function CurriculaPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-6">
              All Major Curricula. One Expert Centre.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              {EXPERIENCE_YEARS} years of teaching across CBSE, ICSE, IB MYP, IB DP, IGCSE, and Cambridge A-Levels. Small batches of {BATCH_SIZE} students. No rotating junior tutors.
            </p>
          </div>
        </div>
      </section>

      {/* CURRICULA GRID */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURRICULA.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="group bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-navy">{c.name}</h2>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
                <p className="text-sm text-gray-500 mb-4">{c.fullName}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{c.shortDesc}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-navy group-hover:text-accent transition-colors">
                  Grades {c.grades}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Not Sure Which Board Fits?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a diagnostic assessment. We&apos;ll evaluate your child&apos;s understanding regardless of the curriculum.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a
              href={PHONE_URL}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border-2 border-white text-white hover:bg-white hover:text-navy transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
