import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  ArrowRight,
  CheckCircle2,
  X,
  MapPin,
} from "lucide-react";
import {
  WHATSAPP_URL,
  PHONE_URL,
  EXPERIENCE_YEARS,
  DIAGNOSTIC_FEE,
  CURRICULA,
  GRADES,
  TESTIMONIALS,
  HOMEPAGE_FAQS,
} from "@/lib/constants";
import TestimonialCard from "@/components/TestimonialCard";
import FAQSection from "@/components/FAQSection";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

export const metadata: Metadata = {
  title: "Tuition Centre Near Me in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
  description:
    "Expert Maths & Physics tuition for Grades 6-12 in Jubilee Hills, Hyderabad. CBSE, ICSE, IB MYP, IB DP, IGCSE, A-Levels. Small batches of 3-5 students. Foundation-first methodology. 13+ years experience. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in",
  },
  openGraph: {
    title: "Tuition Centre Near Me in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
    description:
      "Expert Maths & Physics tuition for Grades 6-12 in Jubilee Hills, Hyderabad. CBSE, ICSE, IB MYP, IB DP, IGCSE, A-Levels. Small batches of 3-5 students. Foundation-first methodology. 13+ years experience. Call +91 7396669430",
    url: "https://ankuramtuition.in",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  name: "Ankuram Tuition Centre",
  description:
    "Expert Maths & Physics tuition for Grades 6-12 in Jubilee Hills, Hyderabad",
  url: "https://ankuramtuition.in",
  telephone: "+917396669430",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 229, Road No. 72, Prashasan Nagar",
    addressLocality: "Jubilee Hills",
    addressRegion: "Telangana",
    postalCode: "500033",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.4325,
    longitude: 78.4073,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "21:00",
  },
  priceRange: "₹₹₹",
  areaServed: [
    "Jubilee Hills",
    "Banjara Hills",
    "Gachibowli",
    "Financial District",
    "HITEC City",
    "Kondapur",
    "Madhapur",
    "Manikonda",
    "Narsingi",
  ],
  subjects: ["Mathematics", "Physics"],
  sameAs: [],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ─── SECTION 1: DARK HERO ─── */}
      <section className="relative bg-navy py-20 lg:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,168,83,0.08),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-6">Jubilee Hills, Hyderabad</p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 text-balance">
            Tuition Centre Near Me in Jubilee Hills, Hyderabad
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            Looking for the best tuition centre near me in Hyderabad? Ankuram offers diagnostic-first Maths &amp; Physics tuition for Classes 8–12 in Jubilee Hills. Small batches of 3–5 students across CBSE, ICSE, IB MYP, IB DP, IGCSE &amp; Cambridge A-Levels. {EXPERIENCE_YEARS} years of experience. One expert teacher — no rotating juniors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <TrackedCTALink trackingType="whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg text-base"
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

          <p className="text-sm text-white/50">
            {DIAGNOSTIC_FEE} · 60 minutes · Fully credited when you enroll
          </p>
        </div>
      </section>

      {/* ─── SECTION 2: THE PROBLEM ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">The Real Problem</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy text-center mb-4">
            Sound Familiar?
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
            These are the patterns we see every week from parents across Jubilee Hills and Banjara Hills.
          </p>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "The Gaps Are Hidden",
                description: "Your child can\u2019t solve quadratic equations — not because they haven\u2019t practised enough, but because they missed algebraic manipulation in Class 7. No amount of Class 10 practice fixes a Class 7 gap.",
              },
              {
                title: "The Syllabus Won\u2019t Wait",
                description: "Schools move fast. By the time you realise something\u2019s wrong, the syllabus has moved three chapters ahead. The gap keeps widening with every passing week.",
              },
              {
                title: "More Practice Isn\u2019t the Answer",
                description: "Doing 50 more sums of the wrong type doesn\u2019t help. You need to know exactly which concept broke before you can fix it.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 p-8 lg:p-10 rounded-2xl border border-gray-100"
              >
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

      {/* ─── SECTION 3: THE ANKURAM METHOD ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Our Method</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-14 text-center">
            The Ankuram Method
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Diagnostic Assessment",
                description: "60-minute expert-led evaluation. We test conceptual understanding, not just problem-solving speed.",
              },
              {
                step: "02",
                title: "Gap Analysis",
                description: "We identify exactly where gaps exist — which concepts are solid, shaky, or missing. Often from years earlier.",
              },
              {
                step: "03",
                title: "Custom Recovery Plan",
                description: "A personalised learning roadmap built around what the assessment revealed. Not a generic syllabus.",
              },
              {
                step: "04",
                title: "Foundation-First Teaching",
                description: "We fix the root, then the current syllabus moves faster. Understanding replaces memorisation.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-2xl border border-gray-100">
                <span className="text-3xl font-mono text-accent/40 font-semibold mb-4 block">
                  {item.step}
                </span>
                <h3 className="text-xl font-semibold text-navy mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: DIAGNOSTIC PRE-SELL ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">The Diagnostic</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
            See How We Teach Before You Commit
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
            A report is useless without a roadmap. We don&apos;t just hand you a score.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                "Our expert analyses HOW your child attempts the problem — not just whether they get the right answer.",
                "The product isn\u2019t a paper — it\u2019s the clarity and the recovery plan our teacher provides.",
                `Think of it as Day 1 of tuition, not a separate test. ${DIAGNOSTIC_FEE} fully credited when you enroll.`,
              ].map((text, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-gray-600 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Diagnostic Results Card */}
            <div className="bg-navy rounded-2xl p-6 sm:p-8 border border-navy-light">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <h3 className="text-lg font-semibold text-white">Diagnostic Results</h3>
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

      {/* ─── SECTION 5: CURRICULA GRID ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Curricula</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
            All Major Boards. One Expert Tuition Centre.
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
            We offer expert <Link href="/cbse-maths-tuition" className="text-accent hover:underline">CBSE maths tuition</Link>, <Link href="/icse-maths-tuition" className="text-accent hover:underline">ICSE tuition</Link>, <Link href="/ib-myp-maths-tuition" className="text-accent hover:underline">IB MYP tuition</Link>, <Link href="/ib-dp-maths-tuition" className="text-accent hover:underline">IB DP tuition</Link>, <Link href="/igcse-maths-tuition" className="text-accent hover:underline">IGCSE tuition</Link>, and <Link href="/a-levels-maths-tuition" className="text-accent hover:underline">A-Levels tuition</Link> in Jubilee Hills, Hyderabad.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURRICULA.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="group bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-navy mb-1">
                      {c.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{c.fullName}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{c.shortDesc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5b: GRADES ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Grades</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
            Maths &amp; Physics Tuition Near Me for Every Grade
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
            Whether your child is in <Link href="/class-8-tuition" className="text-accent hover:underline">Class 8</Link> building foundations or in <Link href="/class-12-tuition" className="text-accent hover:underline">Class 12</Link> preparing for boards, we have a proven approach for every grade.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {GRADES.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}/`}
                className="group bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all text-center"
              >
                <h3 className="text-2xl font-bold text-navy mb-1 group-hover:text-accent transition-colors">
                  Class {g.grade}
                </h3>
                <p className="text-sm text-gray-400">{g.subjects.join(" & ")}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: COMPARISON ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Why Ankuram</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-14 text-center">
            Not All Tuition Centres Near Me Are the Same
          </h2>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Typical Tuition */}
            <div className="bg-gray-50 p-8 lg:p-10 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-400 mb-6 uppercase tracking-wider text-sm">Typical Tuition</h3>
              <ul className="space-y-4">
                {[
                  "Teaches current chapter only",
                  "20–30 students per batch",
                  "Junior tutors rotate frequently",
                  "Practice-based, quantity over quality",
                  "Generic worksheets for everyone",
                  "No gap identification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-400">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ankuram */}
            <div className="bg-navy p-8 lg:p-10 rounded-2xl border border-accent/20">
              <h3 className="text-lg font-semibold text-accent mb-6 uppercase tracking-wider text-sm">Ankuram</h3>
              <ul className="space-y-4">
                {[
                  "Finds and fixes the root gap first",
                  "3–5 students per batch maximum",
                  `One expert teacher, ${EXPERIENCE_YEARS} years`,
                  "Diagnostic-first, concept-driven",
                  "Personalised recovery plan",
                  "Every student starts with gap analysis",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: SOCIAL PROOF ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Testimonials</p>
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
              What Parents &amp; Students Say
            </h2>
            <div className="flex items-center justify-center gap-3 text-lg">
              <span className="text-accent font-semibold">4.8<span className="ml-1">★</span></span>
              <span className="text-gray-500">on Google</span>
              <span className="text-gray-300">&bull;</span>
              <span className="font-semibold text-navy">465+ reviews</span>
            </div>
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
        </div>
      </section>

      {/* ─── SECTION 8: FAQ ─── */}
      <FAQSection items={HOMEPAGE_FAQS.map(f => ({ q: f.question, a: f.answer }))} />

      {/* ─── SECTION 9: AREAS WE SERVE ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4 text-center">Location</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-center">
            Nearest Tuition Centre for Students Across Hyderabad
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
            Our tuition centre in Jubilee Hills is conveniently located for students across western and central Hyderabad. Parents looking for a coaching centre near me trust Ankuram for personalised, foundation-first maths and physics tuition.
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              "Jubilee Hills", "Banjara Hills", "Gachibowli", "Financial District",
              "HITEC City", "Kondapur", "Madhapur", "Manikonda", "Narsingi",
              "Film Nagar", "Shaikpet", "Tolichowki", "Yousufguda", "Punjagutta",
              "Somajiguda", "Ameerpet", "Kukatpally", "KPHB", "Kokapet", "Begumpet",
              "Secunderabad",
            ].map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                {area}
              </span>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8 max-w-2xl mx-auto">
            Students from Jubilee Hills, Banjara Hills, Gachibowli, Financial District, HITEC City, Kondapur, Madhapur, Manikonda, Narsingi, Film Nagar, Shaikpet, Tolichowki, Yousufguda, Punjagutta, Somajiguda, Ameerpet, Kukatpally, KPHB, Kokapet, Begumpet, and Secunderabad attend our tuition centre. We also offer live online tuition classes for students outside Hyderabad.
          </p>
        </div>
      </section>

      {/* ─── SECTION 10: FINAL CTA ─── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-label mb-6">Take the First Step</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Every Week You Wait, the Gap Grows
          </h2>
          <p className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            A 60-minute diagnostic tells you exactly where your child stands — and what to do about it. {DIAGNOSTIC_FEE}, fully credited when you enroll.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <TrackedCTALink trackingType="whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Book Diagnostic Assessment
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
