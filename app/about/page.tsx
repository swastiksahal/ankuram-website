import { Metadata } from "next";
import {
  MessageCircle,
  Phone,
  CheckCircle2,
} from "lucide-react";
import {
  WHATSAPP_URL,
  PHONE_URL,
  DIAGNOSTIC_FEE,
} from "@/lib/constants";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

export const metadata: Metadata = {
  title: "About Ankuram | Diagnostic-First Maths Tuition in Jubilee Hills",
  description:
    "Ankuram is a diagnostic-driven maths tuition centre in Jubilee Hills, Hyderabad. 13+ years experience, small batches of 3-5, all major curricula.",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-16 lg:py-24 bg-navy relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,168,83,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-label mb-6">About Us</p>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Founded on One Belief: Every Child Can Excel at Maths
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-relaxed">
              Ankuram isn&apos;t a coaching factory. It&apos;s a focused, diagnostic-driven tuition centre built for students who need more than just &lsquo;more practice.&rsquo;
            </p>
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-label mb-4">Our Story</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-8">
              Why Ankuram Exists
            </h2>
            <div className="space-y-6 text-gray-500 text-base sm:text-lg leading-relaxed">
              <p>
                After 13+ years of teaching mathematics and physics, one pattern kept repeating — students weren&apos;t struggling because they were weak. They were struggling because somewhere along the way, a foundational concept was missed. Nobody caught it. And year after year, the gap widened.
              </p>
              <p>
                Ankuram was built to fix that. Not with more worksheets. Not with longer hours. But by going back to the exact point where understanding broke — and rebuilding from there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Our Approach</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-14 text-center">
            What Makes Us Different
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                title: "Diagnostic First, Always",
                description: "We don\u2019t start teaching until we know exactly where the gaps are. Every student begins with a comprehensive diagnostic assessment.",
              },
              {
                title: "Small Batches Only",
                description: "Maximum 3-5 students per batch. Your child isn\u2019t a face in a crowd.",
              },
              {
                title: "Foundation Before Syllabus",
                description: "We fix the root cause before chasing the current chapter. Once the foundation is solid, the syllabus moves faster.",
              },
              {
                title: "All Major Curricula",
                description: "CBSE, ICSE, IB MYP, IB DP, IGCSE, Cambridge A-Levels. One centre, every board.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 lg:p-10 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT A TYPICAL WEEK LOOKS LIKE */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4 text-center">In Practice</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10 text-center">
              What a Typical Week Looks Like
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: "Session 1: Diagnostic Review",
                  description:
                    "Every student starts with a diagnostic assessment. We review findings, identify the exact gaps, and plan the recovery roadmap. This session sets the direction for everything that follows.",
                },
                {
                  title: "Session 2: Concept Building",
                  description:
                    "We go back to the source of the gap and rebuild understanding. If your child struggles with quadratics, we might trace it to factorisation or even basic algebraic identities. Every concept is derived, not memorized.",
                },
                {
                  title: "Session 3: Practice & Application",
                  description:
                    "Once the concept clicks, we apply it. Problems increase in difficulty, and we watch HOW your child approaches them \u2014 not just whether they get the right answer. This is where confidence builds.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-navy mb-2">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
              Frequency varies by student \u2014 typically 2\u20133 sessions per week based on diagnostic findings.
            </p>
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-4 text-center">Ideal Student</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-10 text-center">
              Ankuram Is For Students Who...
            </h2>

            <div className="space-y-5">
              {[
                "Score well in some topics but inexplicably fail in others",
                "Have tried multiple tutors without lasting improvement",
                "Need someone to go back to basics without judgment",
                "Are in competitive curricula (IB, IGCSE) and need conceptual depth",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-28 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-6">Take the First Step</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Start With a Diagnostic Assessment
          </h2>
          <p className="text-base sm:text-lg text-white/60 mb-8">
            {DIAGNOSTIC_FEE} · 60-minute expert session · Fully credited when you enroll
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <TrackedCTALink
              trackingType="whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Book Diagnostic Assessment
            </TrackedCTALink>
            <TrackedCTALink
              trackingType="phone"
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
