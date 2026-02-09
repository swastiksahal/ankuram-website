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

export const metadata: Metadata = {
  title: "Diagnostic Assessment | Ankuram Tuition Jubilee Hills",
  description:
    "Book a diagnostic assessment at Ankuram. 40-60 minute expert-led evaluation, written gap report, personalised recovery plan. ₹750.",
};

export default function DiagnosticPage() {
  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-6">
              The Diagnostic Assessment
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              This isn&apos;t a test your child can fail. It&apos;s a 60-minute expert-led evaluation designed to find exactly where understanding broke — so we can fix it.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: ClipboardCheck,
                label: "40-60 minutes",
                title: "Assessment",
                description: "Comprehensive evaluation testing conceptual understanding, not just problem-solving speed. We assess what your child actually knows — not what grade they're in.",
              },
              {
                icon: FileText,
                label: "Our analysis",
                title: "Gap Analysis",
                description: "We identify exactly where gaps exist — which concepts are solid, which are shaky, and which are missing. Often, we find gaps from years earlier.",
              },
              {
                icon: Route,
                label: "You receive",
                title: "Written Report",
                description: "Detailed report explaining our findings: what your child understands well, where gaps are, and what's causing current difficulties.",
              },
              {
                icon: TrendingUp,
                label: "Next steps",
                title: "Recommended Plan",
                description: "A personalised learning roadmap tailored to your child's specific needs. Not a generic syllabus — a plan built around what the assessment revealed.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-mono text-accent mb-1">{item.label}</p>
                    <h3 className="text-xl font-semibold text-navy mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT MAKES THIS DIFFERENT */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            This Isn&apos;t an Automated Test
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              {[
                {
                  icon: Search,
                  title: "Expert-Led, Not Machine-Generated",
                  description: "A qualified teacher conducts the assessment, not a computer. We watch HOW your child approaches problems, not just whether they get the right answer.",
                },
                {
                  icon: Undo2,
                  title: "We Go Back to Find the Root",
                  description: "If a Class 10 student struggles with trigonometry, we check if ratio concepts from Class 7 are solid. Most tutors never look this far back.",
                },
                {
                  icon: BarChart3,
                  title: "Analysis, Not Just Scoring",
                  description: "We don't give you a percentage and send you home. We explain exactly which concepts need attention and why.",
                },
                {
                  icon: CalendarCheck,
                  title: "It's Day 1 of Tuition",
                  description: `Think of the diagnostic as your first session with us, not a separate product. ${DIAGNOSTIC_FEE} for 60 minutes of expert assessment.`,
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Diagnostic Card */}
            <div className="bg-navy rounded-2xl p-5 sm:p-8 border border-navy-light">
              <div className="flex items-center gap-2 mb-6">
                <ClipboardCheck className="w-5 h-5 text-accent-light" />
                <h3 className="text-lg font-semibold text-white">Sample Diagnostic Results</h3>
              </div>

              <div className="space-y-5 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Algebra</span>
                    <span className="font-mono text-accent-light font-medium">78%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-light rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Geometry</span>
                    <span className="font-mono text-white font-medium">62%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/60 rounded-full" style={{ width: "62%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Trigonometry</span>
                    <span className="font-mono text-white/50 font-medium">41%</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30 rounded-full" style={{ width: "41%" }} />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;Gap identified: Ratio concepts from Class 7 affecting trigonometric understanding. Recommend rebuilding proportional reasoning before advancing.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT WE TEST */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
              What the Assessment Covers
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
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
                className={`p-4 rounded-xl border text-center ${
                  index === 6
                    ? "bg-navy/5 border-navy/20"
                    : index === 7
                    ? "bg-gray-50 border-dashed border-gray-300"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className={`font-medium ${index === 7 ? "text-gray-400" : "text-navy"}`}>
                  {topic}
                </p>
                {index === 6 && (
                  <p className="text-xs text-gray-500 mt-1">Senior students</p>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Every assessment is customised to your child&apos;s specific grade, curriculum, and current syllabus.
          </p>
        </div>
      </section>

      {/* SECTION 5: PRICING & CTA */}
      <section className="py-16 lg:py-20 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
            Book Your Child&apos;s Diagnostic Assessment
          </h2>

          <div className="flex flex-col items-center gap-4 mb-8">
            {[
              "40-60 minute one-on-one session",
              `Conducted by an expert with ${EXPERIENCE_YEARS} years experience`,
              "Written gap analysis report included",
              "Personalised recovery plan",
              "Available offline (Jubilee Hills) or online",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-300 text-base sm:text-lg">
                <CheckCircle2 className="w-6 h-6 text-accent-light flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <p className="text-xl sm:text-2xl font-bold text-white mb-3">
            {DIAGNOSTIC_FEE} · 60-minute diagnostic session
          </p>
          <p className="text-lg sm:text-xl font-semibold text-gray-300 mb-8">
            Book now to find exactly where the gaps are.
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
