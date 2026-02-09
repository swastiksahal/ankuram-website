import Link from "next/link";
import {
  MessageCircle,
  Phone,
  EyeOff,
  FastForward,
  HelpCircle,
  ClipboardCheck,
  FileText,
  Route,
  Layers,
  Users,
  GraduationCap,
  Building,
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  WHATSAPP_URL,
  PHONE_URL,
  EXPERIENCE_YEARS,
  DIAGNOSTIC_FEE,
  CURRICULA,
  TESTIMONIALS,
  HOMEPAGE_FAQS,
  BRAND_NAME,
  PHONE,
} from "@/lib/constants";
import TestimonialCard from "@/components/TestimonialCard";
import FAQSection from "@/components/FAQSection";
import JourneySection from "@/components/JourneySection";

export default function Home() {
  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-6">
            Maths &amp; Physics Tuition in Jubilee Hills
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Small-batch tuition (3–5 students) for Classes 8–12. CBSE, ICSE, IB MYP, IB DP, IGCSE &amp; A-Levels. We focus on concept clarity and strong foundations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="https://wa.me/917396669430?text=Hi%20I%27m%20interested%20in%20tuition"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-4 rounded-lg font-medium hover:bg-navy-light transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Enquire on WhatsApp
            </a>
            <a
              href="tel:+917396669430"
              className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy px-6 py-4 rounded-lg font-medium hover:bg-navy hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              13+ years experience
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              3–5 students per batch
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Jubilee Hills, Hyderabad
            </span>
          </div>
        </div>
      </section>

      {/* JOURNEY VISUAL */}
      <JourneySection />

      {/* SECTION 2: WHAT WE TEACH */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-12">
            Maths &amp; Physics for Classes 8–12
          </h2>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-navy mb-4">Mathematics</h3>
              <ul className="space-y-3">
                {[
                  "Algebra & Equations",
                  "Geometry & Trigonometry",
                  "Coordinate Geometry",
                  "Calculus (Class 11–12)",
                  "Statistics & Probability",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold text-navy mb-4">Physics</h3>
              <ul className="space-y-3">
                {[
                  "Mechanics & Motion",
                  "Electricity & Magnetism",
                  "Optics & Waves",
                  "Thermodynamics",
                  "Modern Physics (Class 12)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8">
            All major boards: CBSE, ICSE, IB MYP, IB DP, IGCSE, Cambridge A-Levels
          </p>
        </div>
      </section>

      {/* SECTION 3: THE PROBLEM */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-12">
            Common Challenges Students Face
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-5">
                <EyeOff className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">
                The Gaps Are Hidden
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your child can&apos;t solve quadratic equations — not because they haven&apos;t practised enough, but because they missed algebraic manipulation in Class 7. No amount of Class 10 practice fixes a Class 7 gap.
              </p>
            </div>

            <div className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-5">
                <FastForward className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">
                The Syllabus Won&apos;t Wait
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Schools move fast. By the time you realise something&apos;s wrong, the syllabus has moved three chapters ahead. The gap keeps widening.
              </p>
            </div>

            <div className="bg-gray-50 p-6 lg:p-8 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-5">
                <HelpCircle className="w-6 h-6 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">
                Practice Without Diagnosis Is Guesswork
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Doing 50 more sums of the wrong type doesn&apos;t help. You need to know exactly which concept broke before you can fix it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE SERVICE EXPERIENCE */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
              Experience How We Teach Before You Commit
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              A report is useless without a roadmap. We don&apos;t just hand you a score.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Search className="w-5 h-5 text-navy" />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Our experts analyse <span className="font-semibold text-navy">HOW</span> your child attempts the problem to find the logic gaps.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Route className="w-5 h-5 text-navy" />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  The product isn&apos;t a paper — it&apos;s the <span className="font-semibold text-navy">clarity and the recovery plan</span> our teacher provides.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5 text-navy" />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Think of it as <span className="font-semibold text-navy">Day 1 of tuition</span>, not a separate test.
                </p>
              </div>
            </div>

            {/* Diagnostic Results Card */}
            <div className="bg-navy rounded-2xl p-5 sm:p-8 border border-navy-light">
              <div className="flex items-center gap-2 mb-6">
                <ClipboardCheck className="w-5 h-5 text-accent-light" />
                <h3 className="text-lg font-semibold text-white">Diagnostic Results</h3>
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
                  &ldquo;Gap identified: Ratio concepts from Class 7 affecting trigonometric understanding...&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE ANKURAM METHOD */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            How We Teach
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: ClipboardCheck,
                title: "Diagnostic Assessment",
                description: "40-60 minute expert-led evaluation. We test conceptual understanding, not just problem-solving speed.",
              },
              {
                step: "02",
                icon: FileText,
                title: "Gap Analysis",
                description: "We identify exactly where gaps exist — which concepts are solid, which are shaky, and which are missing. Often from years earlier.",
              },
              {
                step: "03",
                icon: Route,
                title: "Custom Recovery Plan",
                description: "A personalised learning roadmap built around what the assessment revealed. Not a generic syllabus.",
              },
              {
                step: "04",
                icon: Layers,
                title: "Foundation-First Teaching",
                description: "We fix the root, then the current syllabus moves 2x faster. Everything becomes an equation.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-sm font-mono text-accent font-medium mb-4 block">
                  {item.step}
                </span>
                <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: NOT A COACHING FACTORY */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            This Isn&apos;t a Coaching Factory
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Users,
                title: "3-5 Students Per Batch",
                description: "Your child asks questions, gets heard, gets corrected in real time.",
              },
              {
                icon: GraduationCap,
                title: "One Expert, Every Curriculum",
                description: `${EXPERIENCE_YEARS} years across CBSE, ICSE, IB, IGCSE, A-Levels. No rotating junior tutors.`,
              },
              {
                icon: Layers,
                title: "Foundation Before Syllabus",
                description: "We go back to fix the root. Once solid, the current chapter clicks.",
              },
              {
                icon: Building,
                title: "All Curricula, One Centre",
                description: "CBSE, ICSE, IB MYP, IB DP, IGCSE, Cambridge A-Levels under one roof.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CURRICULA SERVED */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-12 text-center">
            Curricula We Cover
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURRICULA.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="group bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-navy mb-1">
                      {c.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{c.shortDesc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: THE VALUE PROPOSITION */}
      <section className="py-16 lg:py-20 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Step 1: The Diagnostic Assessment
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Why do we charge for this? Because this isn&apos;t an automated test. It&apos;s 60 minutes of dedicated analysis by a subject-matter expert.
          </p>

          <div className="flex flex-col items-center gap-4 mb-8">
            {[
              "40-60 minute expert-led assessment",
              "Written gap analysis report",
              "Personalised recovery plan",
              `${DIAGNOSTIC_FEE} — 60-minute diagnostic session`,
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-300 text-base sm:text-lg">
                <CheckCircle2 className="w-6 h-6 text-accent-light flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <p className="text-lg sm:text-xl font-semibold text-white mb-8">
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

      {/* SECTION 8: TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Google Reviews header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-[var(--text)] mb-4">
              What Parents Say
            </h2>
            <div className="flex items-center justify-center gap-3 text-lg">
              <span className="text-yellow-400 font-semibold">4.8<span className="ml-1">★</span></span>
              <span className="text-[var(--muted)]">rating on Google</span>
              <span className="text-[var(--muted)] opacity-50">&bull;</span>
              <span className="font-semibold text-[var(--text)]">465+ reviews</span>
            </div>
            <a
              href="https://www.google.com/maps/place/Ankuram+Tuition+Centre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm font-medium text-[var(--accent)] underline underline-offset-4 hover:no-underline"
            >
              Read all reviews on Google &rarr;
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, index) => (
              <TestimonialCard
                key={index}
                quote={t.review}
                name={t.name}
                detail={t.context}
              />
            ))}
          </div>

          {/* Google Maps embed */}
          <div className="mt-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8421489094358!2d78.39763627445339!3d17.419361383473262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb95a38d079133%3A0xd70d61a4ba6957b!2sAnkuram%20Tuition%20Centre%20%7C%20Math%20Tuition%20%7C%20Science%20Tuition!5e0!3m2!1sen!2sin!4v1770439951554!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ankuram Tuition Centre on Google Maps"
            />
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <FAQSection items={HOMEPAGE_FAQS.map(f => ({ q: f.question, a: f.answer }))} />

      {/* SECTION 10: FINAL CTA */}
      <section className="py-16 lg:py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Talk to us about your child&apos;s learning needs.
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

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: BRAND_NAME,
            description: "Expert Maths tuition for Grades 8-12 in Jubilee Hills, Hyderabad. Diagnostic-first approach with small batches of 3-5 students.",
            url: "https://ankuramtuition.in",
            telephone: `+91${PHONE}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Prashasan Nagar",
              addressLocality: "Jubilee Hills",
              addressRegion: "Telangana",
              postalCode: "500033",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "17.4325",
              longitude: "78.4073",
            },
            openingHours: "Mo-Sa 09:00-20:00",
            priceRange: "$$",
          }),
        }}
      />
    </>
  );
}
