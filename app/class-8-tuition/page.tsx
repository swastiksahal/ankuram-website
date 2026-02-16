import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 8 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
  description:
    "Class 8 Maths & Physics tuition in Jubilee Hills. CBSE, ICSE, IB, IGCSE. The foundation year that decides Classes 9-12 success. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/class-8-tuition",
  },
  openGraph: {
    title: "Class 8 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
    description:
      "Class 8 Maths & Physics tuition in Jubilee Hills. CBSE, ICSE, IB, IGCSE. The foundation year that decides Classes 9-12 success. Call +91 7396669430",
    url: "https://ankuramtuition.in/class-8-tuition",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const class8Data: GradePageData = {
  gradeNumber: 8,
  heroTitle: "Class 8 Tuition in Jubilee Hills, Hyderabad",
  heroSubtitle:
    "The year that decides whether your child will love Maths & Science \u2014 or fear it.",

  whyItMatters: (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">
        Class 8 is the most underestimated year in a student&rsquo;s academic
        life. It&rsquo;s the bridge between primary maths and secondary maths.
        Algebraic expressions, exponents, factorisation, linear equations
        &mdash; every single one of these becomes the backbone of Classes 9-12.
        A student who doesn&rsquo;t truly understand algebraic manipulation in
        Class 8 will struggle with quadratic equations in Class 9, trigonometry
        in Class 10, and calculus in Class 11. We&rsquo;ve seen it hundreds of
        times.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Physics enters the picture seriously in Class 8. Force, pressure,
        friction, sound, light &mdash; these aren&rsquo;t just chapters to
        memorise. They require mathematical thinking. Students who can&rsquo;t
        convert units or solve equations will find Physics impossible later.
      </p>
      <p className="text-gray-600 leading-relaxed">
        At Ankuram, we treat Class 8 as the foundation year. Get this right, and
        Classes 9-12 become significantly easier.
      </p>
    </div>
  ),

  howWeTeach: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Phase 1 &mdash; Diagnostic Assessment
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We start by testing your child across foundational topics: integers,
          fractions, decimals, ratios, basic algebra, and geometry. We&rsquo;re
          looking for gaps from Classes 5-7 that are silently holding them back.
          Most parents are surprised by what the diagnostic reveals.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Phase 2 &mdash; Foundation Rebuild
        </h3>
        <p className="text-gray-600 leading-relaxed">
          If there are gaps, we fix them first. A child who can&rsquo;t work
          confidently with fractions will never handle algebraic fractions. We go
          back to exactly where understanding broke &mdash; no shame, no
          judgement &mdash; and rebuild from there.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Phase 3 &mdash; Current Syllabus with Depth
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Once foundations are solid, we cover the Class 8 syllabus with genuine
          understanding. Every formula is derived, not memorised. Every concept
          is connected to what comes next. When we teach factorisation, we
          explain how it directly connects to quadratic equations in Class 9.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Phase 4 &mdash; Problem-Solving Practice
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Textbook exercises, additional practice problems, and
          application-based questions. We ensure your child can solve unfamiliar
          problems, not just familiar ones.
        </p>
      </div>
    </div>
  ),

  subjects: ["Mathematics (all curricula)", "Physics (all curricula)"],

  curriculaDescription:
    "CBSE Class 8, ICSE Class 8, IB MYP Year 3, IGCSE preparation \u2014 we cover it all. Each curriculum has different emphasis areas, and we tailor our teaching accordingly. A CBSE student needs strong computation skills. An IB MYP student needs to develop mathematical investigation skills. We understand these differences.",

  parentInsight: {
    heading: "What Parents Typically Tell Us",
    content: (
      <p className="text-gray-600 leading-relaxed">
        &ldquo;My child was doing fine until Class 7, but Class 8 maths suddenly
        became difficult.&rdquo; We hear this constantly. It&rsquo;s not that
        Class 8 is suddenly harder &mdash; it&rsquo;s that gaps from earlier
        years finally become visible when abstract thinking is required. The
        diagnostic tells us exactly which gaps exist.
      </p>
    ),
  },

  faqs: [
    {
      question:
        "My child is only in Class 8. Isn\u2019t it too early for tuition?",
      answer:
        "Class 8 is actually the ideal time. This is when algebra, geometry, and physics foundations are built. Gaps that form now compound into Class 10 board problems. Fixing them early is 10x easier than fixing them during board year.",
    },
    {
      question: "My child finds maths boring. Can you make it interesting?",
      answer:
        "Boredom usually means one of two things: the child already understands and is under-challenged, or they have gaps that make everything confusing. The diagnostic tells us which one. Once we address the real issue, engagement follows naturally.",
    },
    {
      question:
        "We already have a school tutor. Why would we need Ankuram?",
      answer:
        "Most school tutors re-teach the current chapter. We diagnose WHY your child doesn\u2019t understand the current chapter \u2014 and it\u2019s usually because something from 1\u20132 years ago was missed. Different approach, different results.",
    },
  ],
};

export default function Class8Tuition() {
  return <GradePageTemplate data={class8Data} />;
}
