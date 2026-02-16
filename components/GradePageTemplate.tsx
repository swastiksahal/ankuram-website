import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_NUMBER, PHONE_URL, EXPERIENCE_YEARS, BATCH_SIZE, CURRICULA } from "@/lib/constants";
import FAQSection from "./FAQSection";
import CTABanner from "./CTABanner";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

export interface GradePageData {
  gradeNumber: number;
  heroTitle: string;
  heroSubtitle: string;
  badge?: string;
  whyItMatters: React.ReactNode;
  howWeTeach: React.ReactNode;
  subjects: string[];
  curriculaDescription?: string;
  parentInsight?: {
    heading: string;
    content: React.ReactNode;
  };
  faqs: { question: string; answer: string }[];
}

export default function GradePageTemplate({ data }: { data: GradePageData }) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I want to book a diagnostic assessment for my Class ${data.gradeNumber} child`)}`;

  const applicableCurricula = CURRICULA.filter((c) => {
    const [min, max] = c.grades.split("-").map(Number);
    return data.gradeNumber >= min && data.gradeNumber <= max;
  });

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-navy relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,168,83,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
            >
              &larr; Back to Home
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                {data.heroTitle}
              </h1>
              {data.badge && (
                <span className="inline-block text-xs font-bold tracking-wide uppercase text-navy bg-accent px-3 py-1 rounded-full">
                  {data.badge}
                </span>
              )}
            </div>

            <p className="text-lg text-white/60 mb-8 max-w-2xl leading-relaxed">
              {data.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50 mb-8">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {EXPERIENCE_YEARS} Years Experience
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {BATCH_SIZE} Students Per Batch
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                All Curricula
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedCTALink trackingType="whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Book Diagnostic Assessment
              </TrackedCTALink>
              <TrackedCTALink trackingType="phone"
                href={PHONE_URL}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/5 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </TrackedCTALink>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Grade Matters */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">Why It Matters</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-8">
              Why Class {data.gradeNumber} Matters
            </h2>
            <div className="bg-gray-50 p-8 lg:p-10 rounded-2xl border border-gray-100">
              {data.whyItMatters}
            </div>
          </div>
        </div>
      </section>

      {/* How We Teach */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">Our Method</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10">
              How We Teach Class {data.gradeNumber}
            </h2>
            <div>{data.howWeTeach}</div>
          </div>
        </div>
      </section>

      {/* Subjects Available */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">What We Teach</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-8">
              Subjects Available
            </h2>
            <div className="space-y-4">
              {data.subjects.map((subject, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
                >
                  <p className="text-gray-700 font-medium">{subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curricula We Cover */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4">Boards</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
            Curricula We Cover for Class {data.gradeNumber}
          </h2>
          {data.curriculaDescription && (
            <p className="text-lg text-gray-500 mb-10 max-w-3xl leading-relaxed">
              {data.curriculaDescription}
            </p>
          )}
          {!data.curriculaDescription && (
            <p className="text-lg text-gray-500 mb-10">
              We teach Class {data.gradeNumber} students across all these boards:
            </p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {applicableCurricula.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-navy">{c.name}</h3>
                  <p className="text-sm text-gray-400">{c.fullName}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Insight (optional) */}
      {data.parentInsight && (
        <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <p className="section-label mb-4 text-center">From Experience</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-8">
                {data.parentInsight.heading}
              </h2>
              <div className="bg-gray-50 p-8 lg:p-10 rounded-2xl border border-gray-100">
                {data.parentInsight.content}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection
        title={`Class ${data.gradeNumber} Tuition FAQs`}
        items={data.faqs.map((f) => ({ q: f.question, a: f.answer }))}
      />

      {/* CTA */}
      <CTABanner />
    </>
  );
}
