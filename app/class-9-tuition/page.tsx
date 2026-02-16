import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 9 Tuition in Jubilee Hills, Hyderabad | Ankuram",
  description:
    "Expert Class 9 Maths & Physics tuition in Jubilee Hills, Hyderabad. Polynomials, coordinate geometry, motion. CBSE, ICSE, IB, IGCSE. Book a diagnostic assessment.",
  alternates: {
    canonical: "/class-9-tuition",
  },
};

const class9Data: GradePageData = {
  gradeNumber: 9,
  heroTitle: "Class 9 Tuition in Jubilee Hills, Hyderabad",
  heroSubtitle:
    "The real foundation year for board exams. What happens in Class 9 determines Class 10 results.",

  whyItMatters: (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">
        Class 9 is where secondary mathematics truly begins. Number systems,
        polynomials, coordinate geometry, linear equations in two variables,
        triangles, quadrilaterals, circles, surface areas and volumes,
        statistics, probability &mdash; this is not a revision of Class 8. This
        is a significant leap in complexity and abstraction.
      </p>
      <p className="text-gray-600 leading-relaxed">
        For CBSE and ICSE students, Class 9 directly feeds into board exams.
        Nearly 60% of what appears in Class 10 board papers requires Class 9
        concepts. A student who memorised their way through Class 9 will hit a
        wall in Class 10 when application-based questions appear.
      </p>
      <p className="text-gray-600 leading-relaxed">
        For IB MYP students, Year 4 (Class 9 equivalent) is where
        criterion-based assessments become more demanding. Mathematical
        investigation and communication skills need to be developed now.
      </p>
      <p className="text-gray-600 leading-relaxed">
        For IGCSE students, Class 9 is when Cambridge Extended vs Core decisions
        are typically made. Strong foundations here determine whether your child
        qualifies for Extended papers.
      </p>
    </div>
  ),

  howWeTeach: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">Diagnostic First</h3>
        <p className="text-gray-600 leading-relaxed">
          Before we teach a single Class 9 topic, we assess Class 7-8
          foundations. Can your child manipulate algebraic expressions
          confidently? Do they understand fractions, ratios, and percentages at
          an operational level? Do they know their geometry basics &mdash;
          angles, parallel lines, triangle properties? If not, we fix these
          first. This step is what separates us from every other tuition centre.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Concept Mastery Over Speed
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We don&rsquo;t rush through the syllabus. When we teach polynomials,
          we ensure your child understands what a polynomial actually is, why the
          remainder theorem works, and how factorisation connects to finding
          zeroes. When we teach coordinate geometry, we derive the distance and
          section formulas &mdash; not just hand them over.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Board-Specific Preparation
        </h3>
        <p className="text-gray-600 leading-relaxed">
          CBSE students focus on NCERT mastery &mdash; every example, every
          exercise. We add RD Sharma and RS Aggarwal only after NCERT is solid.
          ICSE students practise application-based and higher-order questions
          that Selina and ML Aggarwal introduce. IB MYP students develop their
          investigation and communication skills alongside content knowledge.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">Physics Integration</h3>
        <p className="text-gray-600 leading-relaxed">
          Class 9 Physics (motion, force, gravitation, work & energy, sound)
          requires mathematical fluency. Equations of motion need algebra.
          Numerical problems need unit conversion skills. We ensure maths and
          physics reinforce each other.
        </p>
      </div>
    </div>
  ),

  subjects: ["Mathematics (all curricula)", "Physics (all curricula)"],

  parentInsight: {
    heading: "Common Problems We Fix in Class 9",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Students who can&rsquo;t solve linear equations confidently &mdash;
        traced back to weak Class 7 algebra. Students who memorise geometry
        theorems but can&rsquo;t apply them in proofs. Students who panic at
        word problems because they can&rsquo;t translate English into equations.
        Students who score well in unit tests but poorly in finals because their
        understanding is superficial. We fix all of these.
      </p>
    ),
  },

  faqs: [
    {
      question:
        "Is Class 9 really that important? Boards are only in Class 10.",
      answer:
        "Class 9 IS Class 10 preparation. Every major Class 10 topic builds directly on Class 9. Coordinate geometry, trigonometry, quadratics \u2014 they all start here. Gaps from Class 9 become board exam problems in Class 10.",
    },
    {
      question:
        "My child got 80% in Class 8 but is dropping in Class 9. What\u2019s happening?",
      answer:
        "Class 9 marks a difficulty jump. 80% in Class 8 might mean some concepts were partially understood \u2014 enough to score, not enough to build on. The diagnostic identifies these partial understandings and turns them into solid foundations.",
    },
  ],
};

export default function Class9Tuition() {
  return <GradePageTemplate data={class9Data} />;
}
