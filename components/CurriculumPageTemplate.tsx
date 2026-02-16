import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, AlertCircle } from "lucide-react";
import { WHATSAPP_NUMBER, PHONE_URL, CURRICULA, GRADES } from "@/lib/constants";
import FAQSection from "./FAQSection";
import CTABanner from "./CTABanner";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

export interface CurriculumPageData {
  curriculumName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  painPoints: string[];
  howWeTeachHeading: string;
  howWeTeachContent: React.ReactNode;
  whatMakesDifferentHeading: string;
  whatMakesDifferentContent: React.ReactNode;
  commonGaps: { category: string; items: string[] }[];
  diagnosticContent: React.ReactNode;
  subjectsContent: React.ReactNode;
  faqs: { question: string; answer: string }[];
}

export default function CurriculumPageTemplate({
  data,
}: {
  data: CurriculumPageData;
}) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi, I want to book a diagnostic assessment for my child studying ${data.curriculumName}`
  )}`;

  return (
    <>
      {/* 1. Hero */}
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

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {data.heroTitle}
            </h1>

            <p className="text-lg text-white/60 mb-6 max-w-2xl leading-relaxed">
              {data.heroSubtitle}
            </p>

            <div className="mb-8">
              <span className="inline-block bg-accent/15 text-accent text-sm font-medium px-4 py-1.5 rounded-full">
                {data.heroBadge}
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

      {/* 2. Is This Your Child? */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4 text-center">Sound Familiar?</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-12">
              Is This Your Child?
            </h2>
            <div className="space-y-4">
              {data.painPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-100"
                >
                  <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. How We Teach */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">Our Method</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10">
              {data.howWeTeachHeading}
            </h2>
            <div>{data.howWeTeachContent}</div>
          </div>
        </div>
      </section>

      {/* 4. What Makes Different */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">The Difference</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10">
              {data.whatMakesDifferentHeading}
            </h2>
            <div>{data.whatMakesDifferentContent}</div>
          </div>
        </div>
      </section>

      {/* 5. Common Gaps We Fix */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">What We Fix</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-14">
            Common Gaps We Fix
          </h2>
          <div
            className={`grid gap-6 lg:gap-8 ${
              data.commonGaps.length === 3
                ? "md:grid-cols-2 lg:grid-cols-3"
                : data.commonGaps.length >= 2
                ? "md:grid-cols-2"
                : ""
            }`}
          >
            {data.commonGaps.map((gap, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-navy mb-5">
                  {gap.category}
                </h3>
                <ul className="space-y-3">
                  {gap.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-gray-500"
                    >
                      <ArrowRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. The Diagnostic */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4 text-center">Day 1</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-10">
              The Diagnostic
            </h2>
            <div className="bg-gray-50 p-8 lg:p-10 rounded-2xl border border-gray-100">
              {data.diagnosticContent}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Subjects & Grades */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4">What We Teach</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10">
              Subjects & Grades
            </h2>
            <div>{data.subjectsContent}</div>
          </div>
        </div>
      </section>

      {/* 8. Related Grade Pages */}
      {(() => {
        const curriculum = CURRICULA.find((c) => c.name === data.curriculumName);
        if (!curriculum) return null;
        const [min, max] = curriculum.grades.split("-").map(Number);
        const relevantGrades = GRADES.filter(
          (g) => g.grade >= min && g.grade <= max
        );
        if (relevantGrades.length === 0) return null;
        return (
          <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="section-label mb-4 text-center">By Grade</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
                {data.curriculumName} Tuition by Grade
              </h2>
              <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
                Looking for {data.curriculumName} tuition near me for a specific grade? Explore our grade-specific pages for detailed information on how we teach each level.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {relevantGrades.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/${g.slug}/`}
                    className="group flex flex-col items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all"
                  >
                    <span className="text-2xl font-bold text-navy group-hover:text-accent transition-colors">
                      Class {g.grade}
                    </span>
                    <span className="text-sm text-gray-400 mt-1">
                      {g.subjects.join(" & ")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 9. FAQ */}
      <FAQSection
        title={`Common Questions from ${data.curriculumName} Parents`}
        items={data.faqs.map((f) => ({ q: f.question, a: f.answer }))}
      />

      {/* 9. Final CTA */}
      <CTABanner
        title="Start With a Diagnostic"
        subtitle="A 45-60 minute assessment that finds exactly where your child stands — and what to do about it. ₹750, fully credited when you enroll."
      />
    </>
  );
}
