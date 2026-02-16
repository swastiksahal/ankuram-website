import { Metadata } from "next";
import {
  MessageCircle,
  Phone,
  ClipboardCheck,
  FileText,
  Route,
  TrendingUp,
  Search,
  Undo2,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";
import {
  WHATSAPP_URL,
  PHONE_URL,
  DIAGNOSTIC_FEE,
  EXPERIENCE_YEARS,
} from "@/lib/constants";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

export const metadata: Metadata = {
  title: "Book a Diagnostic Assessment | Ankuram Tuition Centre, Jubilee Hills",
  description:
    "Find out exactly where your child stands in Maths & Physics. 45-60 minute diagnostic assessment at our Jubilee Hills centre. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/diagnostic",
  },
  openGraph: {
    title: "Book a Diagnostic Assessment | Ankuram Tuition Centre, Jubilee Hills",
    description:
      "Find out exactly where your child stands in Maths & Physics. 45-60 minute diagnostic assessment at our Jubilee Hills centre. Call +91 7396669430",
    url: "https://ankuramtuition.in/diagnostic",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

export default function DiagnosticPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-16 lg:py-24 bg-navy relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,168,83,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              {DIAGNOSTIC_FEE} fully credited when you enroll
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Find Exactly Where Your Child&apos;s Understanding Broke — in 60 Minutes
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-relaxed mb-8">
              This isn&apos;t a test your child can fail. It&apos;s a 60-minute expert-led session that pinpoints the exact gaps holding them back — and gives you a clear plan to fix them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedCTALink trackingType="whatsapp"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Book on WhatsApp — {DIAGNOSTIC_FEE}
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

      {/* WHAT YOU GET */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">The Process</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
            What Happens in 60 Minutes
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
            Four steps. One session. Complete clarity on where your child stands.
          </p>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: ClipboardCheck,
                step: "1",
                title: "Expert Assessment",
                description: "A qualified teacher evaluates your child one-on-one. We assess conceptual understanding, not just speed or accuracy.",
              },
              {
                icon: FileText,
                step: "2",
                title: "Gap Identification",
                description: "We identify exactly where gaps exist — which concepts are solid, shaky, or missing. Often, we trace problems back 2-3 years.",
              },
              {
                icon: Route,
                step: "3",
                title: "Written Report",
                description: "You receive a detailed report: what your child understands well, where the gaps are, and what\u2019s causing current difficulties.",
              },
              {
                icon: TrendingUp,
                step: "4",
                title: "Recovery Plan",
                description: "A personalised learning roadmap tailored to your child\u2019s specific needs. Not a generic syllabus — a plan built around real findings.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent mb-1">Step {item.step}</p>
                    <h3 className="text-xl font-semibold text-navy mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className="py-12 bg-navy animate-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg sm:text-xl text-white font-semibold mb-2">
            Think of it as Day 1 of tuition — not a separate test.
          </p>
          <p className="text-white/50 mb-6">
            {DIAGNOSTIC_FEE} is fully credited toward tuition fees if you choose to enroll.
          </p>
          <TrackedCTALink trackingType="whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg text-base"
          >
            <MessageCircle className="w-5 h-5" />
            Book on WhatsApp
          </TrackedCTALink>
        </div>
      </section>

      {/* WHAT THE REPORT INCLUDES */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4 text-center">Your Report</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
              What the Written Report Includes
            </h2>
            <p className="text-center text-gray-500 mb-10">
              This is what you&apos;re paying {DIAGNOSTIC_FEE} for &mdash; and it&apos;s worth every rupee.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Topic-by-Topic Analysis",
                  description: "Each topic assessed with a clear indication of whether understanding is solid, partial, or missing.",
                },
                {
                  title: "Gap Identification with Chapter References",
                  description: "We don\u2019t just say \u2018algebra is weak.\u2019 We tell you exactly which chapter and concept from which class caused the gap.",
                },
                {
                  title: "Recommended Recovery Timeline",
                  description: "A realistic estimate of how long it will take to address each gap, based on your child\u2019s current level.",
                },
                {
                  title: "Priority Ranking of Concepts",
                  description: "Which gaps to fix first for maximum impact \u2014 because not all gaps are equally urgent.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES THIS DIFFERENT */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Why Different</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
            This Isn&apos;t an Automated Test
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
            Here&apos;s how our diagnostic is different from every other assessment you&apos;ve seen.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {[
                {
                  icon: Search,
                  title: "Expert-Led, Not Machine-Generated",
                  description: "A qualified teacher conducts the assessment. We watch HOW your child approaches problems, not just whether they get the right answer.",
                },
                {
                  icon: Undo2,
                  title: "We Go Back to Find the Root",
                  description: "If a Class 10 student struggles with trigonometry, we check if ratio concepts from Class 7 are solid. Most tutors never look this far back.",
                },
                {
                  icon: BarChart3,
                  title: "Analysis, Not Just Scoring",
                  description: "We don\u2019t give you a percentage and send you home. We explain exactly which concepts need attention and why.",
                },
                {
                  icon: CalendarCheck,
                  title: "Not a Sales Pitch",
                  description: `You get a genuine assessment and actionable report regardless of whether you enroll. The ${DIAGNOSTIC_FEE} is for the expert\u2019s time — and it\u2019s credited if you join.`,
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnostic Card */}
            <div className="bg-navy rounded-2xl p-6 sm:p-8 border border-navy-light">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <h3 className="text-lg font-semibold text-white">Sample Diagnostic Results</h3>
              </div>

              <div className="space-y-5 mb-6">
                {[
                  { label: "Algebra", value: 78, color: "bg-accent" },
                  { label: "Geometry", value: 62, color: "bg-white/60" },
                  { label: "Trigonometry", value: 41, color: "bg-white/30" },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">{bar.label}</span>
                      <span className="font-mono text-white/70 font-medium">{bar.value}%</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-sm text-gray-400 italic leading-relaxed">
                  &ldquo;Gap identified: Ratio concepts from Class 7 affecting trigonometric understanding. Recommend rebuilding proportional reasoning before advancing.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE TEST */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-4">Coverage</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
              What the Assessment Covers
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
              Tailored to your child&apos;s grade and curriculum
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "Number Systems",
              "Algebra",
              "Geometry",
              "Trigonometry",
              "Statistics",
              "Mensuration",
              "Calculus",
              "& More",
            ].map((topic, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl border text-center ${
                  index === 6
                    ? "bg-accent/5 border-accent/20"
                    : index === 7
                    ? "bg-gray-50 border-dashed border-gray-300"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className={`font-medium ${index === 7 ? "text-gray-400" : "text-navy"}`}>
                  {topic}
                </p>
                {index === 6 && (
                  <p className="text-xs text-gray-400 mt-1">Senior students</p>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Every assessment is customised to your child&apos;s specific grade, curriculum, and current syllabus.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 lg:py-28 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-6">Book Now</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
            Book Your Child&apos;s Diagnostic Assessment
          </h2>

          <div className="flex flex-col items-center gap-4 mb-8">
            {[
              "60-minute one-on-one session",
              `Conducted by an expert with ${EXPERIENCE_YEARS} years experience`,
              "Written gap analysis report included",
              "Personalised recovery plan",
              "Available offline (Jubilee Hills) or online",
              `${DIAGNOSTIC_FEE} — fully credited when you enroll`,
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-white/70 text-base sm:text-lg">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <TrackedCTALink trackingType="whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Book on WhatsApp
            </TrackedCTALink>
            <TrackedCTALink trackingType="phone"
              href={PHONE_URL}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-medium border-2 border-white/20 text-white hover:bg-white/5 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </TrackedCTALink>
          </div>
        </div>
      </section>
    </>
  );
}
