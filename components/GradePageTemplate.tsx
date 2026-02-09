import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_NUMBER, PHONE_URL, EXPERIENCE_YEARS, BATCH_SIZE, CURRICULA } from "@/lib/constants";
import FAQSection from "./FAQSection";
import CTABanner from "./CTABanner";

export interface GradePageData {
  gradeNumber: number;
  heroTitle: string;
  heroSubtitle: string;
  badge?: string;
  topicsHeading: string;
  topics: { category: string; items: string[] }[];
  struggles: { title: string; description: string }[];
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy mb-6"
            >
              &larr; Back to Home
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-navy">
                {data.heroTitle}
              </h1>
              {data.badge && (
                <span className="inline-block text-xs font-bold tracking-wide uppercase text-white bg-accent px-3 py-1 rounded-full">
                  {data.badge}
                </span>
              )}
            </div>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed">
              {data.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
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
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-4 rounded-lg font-medium hover:bg-navy-light transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Book Diagnostic Assessment
              </a>
              <a
                href={PHONE_URL}
                className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy px-6 py-4 rounded-lg font-medium hover:bg-navy hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What This Year Covers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10">
            {data.topicsHeading}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {data.topics.map((group, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-navy mb-4">
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <ArrowRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Struggles */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-12">
            Common Struggles in Class {data.gradeNumber}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {data.struggles.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 lg:p-8 rounded-xl border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help (Ankuram Method) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            How Ankuram Helps Class {data.gradeNumber} Students
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Diagnostic First",
                description: `We test across Class ${data.gradeNumber} topics and prerequisites to find exactly where understanding broke down.`,
              },
              {
                title: "Fix the Gaps",
                description:
                  "Before touching current syllabus, we rebuild the missing foundations from earlier classes.",
              },
              {
                title: "Concept-First Teaching",
                description:
                  "Every formula is taught with understanding first. No moving forward without genuine comprehension.",
              },
              {
                title: "Exam-Ready Confidence",
                description:
                  "Once foundations are solid, we build speed, accuracy, and paper-solving strategy for exams.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <span className="text-sm font-mono text-accent font-medium mb-4 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curricula We Cover */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
            Curricula We Cover for Class {data.gradeNumber}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            We teach Class {data.gradeNumber} students across all these boards:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {applicableCurricula.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-navy">{c.name}</h3>
                  <p className="text-sm text-gray-500">{c.fullName}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        title={`Class ${data.gradeNumber} Tuition FAQs`}
        items={data.faqs.map(f => ({ q: f.question, a: f.answer }))}
      />

      {/* CTA */}
      <CTABanner />
    </>
  );
}
