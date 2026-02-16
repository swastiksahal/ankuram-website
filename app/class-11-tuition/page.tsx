import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 11 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
  description:
    "Class 11 Maths & Physics tuition in Jubilee Hills, Hyderabad. CBSE, ISC, IB DP, A-Levels. Navigate the toughest academic year. Book a diagnostic assessment. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/class-11-tuition",
  },
  openGraph: {
    title: "Class 11 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
    description:
      "Class 11 Maths & Physics tuition in Jubilee Hills, Hyderabad. CBSE, ISC, IB DP, A-Levels. Navigate the toughest academic year. Book a diagnostic assessment. Call +91 7396669430",
    url: "https://ankuramtuition.in/class-11-tuition",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const class11Data: GradePageData = {
  gradeNumber: 11,
  heroTitle: "Class 11 Tuition Near Me in Jubilee Hills, Hyderabad",
  heroSubtitle:
    "Looking for class 11 tuition near me in Hyderabad? Our Jubilee Hills centre specialises in Maths & Physics for CBSE, ISC, IB DP, and Cambridge A-Level Class 11 students. The most difficult academic year \u2014 the jump from Class 10 is the steepest.",

  whyItMatters: (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">
        Class 11 is where most students hit a wall. The mathematics they knew
        &mdash; straightforward algebra, basic trigonometry, simple geometry
        &mdash; is replaced by something fundamentally different. Sets,
        relations, functions, limits, derivatives, permutations, combinations,
        complex numbers, conic sections, 3D geometry, mathematical reasoning.
        This is not harder Class 10. This is a different subject.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Physics makes the same leap. Vectors, kinematics in 2D, rotational
        motion, thermodynamics &mdash; these require mathematical maturity that
        Class 10 doesn&rsquo;t build. Students who scored 90+ in Class 10
        physics suddenly struggle because the mathematical demands are
        completely different.
      </p>
      <p className="text-gray-600 leading-relaxed">
        For IB DP students, the split into Analysis & Approaches (AA) and
        Applications & Interpretation (AI) means choosing a mathematical
        pathway. AA requires abstract thinking and proof skills. AI requires
        modelling and real-world application skills. Both are demanding in
        different ways.
      </p>
      <p className="text-gray-600 leading-relaxed">
        For A-Level students, the transition from IGCSE to AS-Level Mathematics
        is brutal. Pure Mathematics requires proof-based thinking. Mechanics
        requires physics intuition. Statistics requires probabilistic reasoning.
        Each module is essentially a different subject.
      </p>
      <p className="text-gray-600 leading-relaxed">
        At Ankuram, we prepare students for this jump. If they come to us in
        Class 11, we assess whether their Class 9-10 foundations can support
        Class 11 work. If not, we fill the gaps fast while keeping pace with the
        new syllabus.
      </p>
    </div>
  ),

  howWeTeach: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">Foundation Check</h3>
        <p className="text-gray-600 leading-relaxed">
          Even students who scored 95+ in Class 10 can have gaps that matter in
          Class 11. Can they manipulate algebraic expressions with speed and
          accuracy? Do they truly understand trigonometric identities or did they
          memorise them? Can they think in terms of functions and graphs? The
          diagnostic reveals all of this.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">CBSE Class 11 Maths</h3>
        <p className="text-gray-600 leading-relaxed">
          We follow a concept-first approach. Every chapter is taught by
          deriving results, not stating them. When we teach limits, students
          understand what a limit actually means &mdash; not just how to compute
          one. When we teach derivatives, we derive from first principles before
          teaching shortcuts. This approach is slower initially but creates
          genuine understanding that makes Class 12 significantly easier.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          CBSE Class 11 Physics
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Units and measurement, motion in a straight line, motion in a plane,
          laws of motion, work-energy-power, rotational motion, gravitation,
          mechanical properties, thermodynamics, oscillations, waves. We ensure
          the mathematical foundations (vectors, calculus basics, trigonometry)
          are solid before tackling physics concepts. Physics problems are
          essentially maths problems in disguise &mdash; and we teach them that
          way.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          IB DP Maths (AA & AI)
        </h3>
        <p className="text-gray-600 leading-relaxed">
          For AA students: we build abstract reasoning skills, introduce formal
          proof techniques, and develop the mathematical rigour that HL demands.
          For AI students: we focus on modelling, technology use (GDC), and
          real-world application of mathematical concepts. For both: we begin IA
          (Internal Assessment) planning early &mdash; topic selection,
          mathematical depth, and presentation standards.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">Cambridge A-Levels</h3>
        <p className="text-gray-600 leading-relaxed">
          Pure Mathematics: functions, coordinate geometry, sequences,
          trigonometry, differentiation, integration &mdash; taught with
          emphasis on proof and mathematical reasoning. Mechanics: kinematics,
          forces, Newton&rsquo;s laws, moments, energy &mdash; taught with
          strong mathematical foundations. Statistics: probability,
          distributions, hypothesis testing &mdash; taught with conceptual
          clarity over formula memorisation.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          IGCSE Students Transitioning to A-Levels
        </h3>
        <p className="text-gray-600 leading-relaxed">
          The gap between IGCSE and A-Level is enormous. We specifically bridge
          this gap by identifying which IGCSE concepts need strengthening before
          A-Level content can be absorbed.
        </p>
      </div>
    </div>
  ),

  subjects: ["Mathematics (all curricula)", "Physics (all curricula)"],

  faqs: [
    {
      question:
        "My child topped Class 10 but is failing in Class 11. How is that possible?",
      answer:
        "Very common. Class 10 rewards memorization and practice. Class 11 rewards understanding. Students who scored 95+ through pattern recognition hit a wall when calculus and physics demand actual comprehension. The diagnostic reveals which Class 9\u201310 concepts were memorized rather than understood.",
    },
    {
      question:
        "Should we focus on boards or competitive exams (JEE/NEET)?",
      answer:
        "Our focus is board-level mastery \u2014 deep understanding of NCERT concepts. This happens to be the foundation for JEE/NEET too. Students with genuine conceptual clarity handle competitive problems better than those who\u2019ve memorized 500 tricks.",
    },
  ],
};

export default function Class11Tuition() {
  return <GradePageTemplate data={class11Data} />;
}
