import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_URL, PHONE_URL } from "@/lib/constants";
import FAQSection from "./FAQSection";
import CTABanner from "./CTABanner";
import StepCard from "./StepCard";

export interface CurriculumPageData {
  heroTitle: string;
  heroSubtitle: string;
  trustBadges: string[];
  challengeHeading: string;
  challenges: { title: string; description: string }[];
  approachHeading: string;
  approachSteps: { title: string; description: string }[];
  subjectsHeading: string;
  subjects: { name: string; topics: string[] }[];
  gradesHeading: string;
  grades: { name: string; href: string; highlight?: string }[];
  faqHeading: string;
  faqs: { question: string; answer: string }[];
}

export default function CurriculumPageTemplate({ data }: { data: CurriculumPageData }) {
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

            <h1 className="text-4xl lg:text-5xl font-bold text-navy mb-4">
              {data.heroTitle}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed">
              {data.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
              {data.trustBadges.map((badge, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_URL}
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

      {/* Challenge */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-12">
            {data.challengeHeading}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {data.challenges.map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100"
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

      {/* Approach (Ankuram Method) */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            {data.approachHeading}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.approachSteps.map((step, i) => (
              <StepCard
                key={i}
                stepNumber={String(i + 1).padStart(2, "0")}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10">
            {data.subjectsHeading}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {data.subjects.map((subject, i) => (
              <div
                key={i}
                className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-navy mb-4">
                  {subject.name}
                </h3>
                <ul className="space-y-2">
                  {subject.topics.map((topic, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      <ArrowRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grades */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10 text-center">
            {data.gradesHeading}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.grades.map((grade, i) => (
              <Link
                key={i}
                href={`${grade.href}/`}
                className="group bg-white p-6 rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all text-center"
              >
                <h3 className="text-lg font-semibold text-navy mb-1">
                  {grade.name}
                </h3>
                {grade.highlight && (
                  <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    {grade.highlight}
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-accent mx-auto mt-3 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection title={data.faqHeading} items={data.faqs.map(f => ({ q: f.question, a: f.answer }))} />

      {/* CTA */}
      <CTABanner />
    </>
  );
}
