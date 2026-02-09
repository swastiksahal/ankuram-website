import { Metadata } from "next";
import {
  MessageCircle,
  Phone,
  ClipboardCheck,
  Users,
  Layers,
  Building,
  CheckCircle2,
} from "lucide-react";
import {
  WHATSAPP_URL,
  PHONE_URL,
  DIAGNOSTIC_FEE,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Ankuram | Diagnostic-First Maths Tuition in Jubilee Hills",
  description:
    "Ankuram is a diagnostic-driven maths tuition centre in Jubilee Hills, Hyderabad. 13+ years experience, small batches of 3-5, all major curricula.",
};

export default function AboutPage() {
  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-6">
              Founded on One Belief: Every Child Can Excel at Maths
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Ankuram isn&apos;t a coaching factory. It&apos;s a focused, diagnostic-driven tuition centre built for students who need more than just &lsquo;more practice.&rsquo;
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE STORY */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-8">
              Why Ankuram Exists
            </h2>
            <div className="space-y-6 text-gray-600 text-base sm:text-lg leading-relaxed">
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

      {/* SECTION 3: WHAT MAKES US DIFFERENT */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            What Makes Us Different
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: ClipboardCheck,
                title: "Diagnostic First, Always",
                description: "We don't start teaching until we know exactly where the gaps are. Every student begins with a comprehensive diagnostic assessment.",
              },
              {
                icon: Users,
                title: "Small Batches Only",
                description: "Maximum 3-5 students per batch. Your child isn't a face in a crowd.",
              },
              {
                icon: Layers,
                title: "Foundation Before Syllabus",
                description: "We fix the root cause before chasing the current chapter. Once the foundation is solid, the syllabus moves 2x faster.",
              },
              {
                icon: Building,
                title: "All Major Curricula",
                description: "CBSE, ICSE, IB MYP, IB DP, IGCSE, Cambridge A-Levels. One centre, every board.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 lg:p-8 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-navy" />
                </div>
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

      {/* SECTION 4: WHO THIS IS FOR */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
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
                <div key={index} className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="py-16 lg:py-20 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Start With a Diagnostic Assessment
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-8">
            {DIAGNOSTIC_FEE} · 60-minute expert diagnostic session
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
