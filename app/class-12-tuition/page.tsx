import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 12 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
  description:
    "Class 12 Maths & Physics board exam tuition in Jubilee Hills, Hyderabad. CBSE, ISC, IB DP, A-Levels. Board prep, IA support, university readiness. Book a diagnostic assessment. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/class-12-tuition",
  },
  openGraph: {
    title: "Class 12 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
    description:
      "Class 12 Maths & Physics board exam tuition in Jubilee Hills, Hyderabad. CBSE, ISC, IB DP, A-Levels. Board prep, IA support, university readiness. Book a diagnostic assessment. Call +91 7396669430",
    url: "https://ankuramtuition.in/class-12-tuition",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const class12Data: GradePageData = {
  gradeNumber: 12,
  heroTitle: "Class 12 Tuition Near Me in Jubilee Hills, Hyderabad",
  heroSubtitle:
    "Searching for class 12 tuition near me for board exam preparation? Ankuram in Jubilee Hills, Hyderabad offers expert Maths & Physics tuition for CBSE, ISC, IB DP, and Cambridge A-Level Class 12 students. Board exams, university applications \u2014 we make sure your child is ready.",
  badge: "Board Year",

  whyItMatters: (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">
        Class 12 is the culmination of everything. Board exam scores affect
        university admissions. IB predicted grades determine international
        university offers. A-Level results are the sole criterion for UK
        university entry. The stakes have never been higher.
      </p>
      <p className="text-gray-600 leading-relaxed">
        But here&rsquo;s the truth: Class 12 is not inherently harder than Class
        11. If your child genuinely understood Class 11 concepts, Class 12 is a
        natural extension. Integrals build on derivatives. 3D geometry builds on
        coordinate geometry. Probability builds on combinatorics.
        Electromagnetic induction builds on electrostatics.
      </p>
      <p className="text-gray-600 leading-relaxed">
        The students who struggle in Class 12 are almost always those who
        survived Class 11 by memorising rather than understanding. If
        that&rsquo;s your child&rsquo;s situation, we assess how deep the gaps
        are and create a focused plan to address them while preparing for
        boards.
      </p>
    </div>
  ),

  howWeTeach: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Board Exam Preparation (CBSE/ISC)
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          By Class 12, our approach is highly exam-focused &mdash; but grounded
          in understanding. We analyse previous year papers, identify
          high-frequency topics, and ensure concept clarity on every one of
          them. We train exam technique: time allocation per section, answer
          presentation, marks optimisation. But we never sacrifice understanding
          for shortcuts. A student who understands integration conceptually can
          handle any question &mdash; memorised formulas fail when the question
          is unfamiliar.
        </p>
        <p className="text-gray-600 leading-relaxed mb-3">
          <strong className="text-navy">Key focus areas for CBSE Maths:</strong>{" "}
          Relations & Functions, Matrices & Determinants, Calculus (continuity,
          differentiation, integration, application of integrals, differential
          equations), Vectors & 3D Geometry, Probability. We pay special
          attention to the 6-mark questions where students lose the most marks.
        </p>
        <p className="text-gray-600 leading-relaxed">
          <strong className="text-navy">
            Key focus areas for Physics:
          </strong>{" "}
          Electrostatics, Current Electricity, Magnetic Effects, EMI & AC,
          Optics, Modern Physics, Semiconductor Electronics. Numericals are
          practised extensively because CBSE Physics numericals directly test
          mathematical problem-solving.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">IB DP Year 2</h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          IA completion and refinement. Exam preparation across all papers. For
          HL students: the additional topics (sets/number theory for AA HL, or
          additional statistics for AI HL) need dedicated attention. Predicted
          grades are critical for university applications &mdash; we ensure your
          child&rsquo;s performance matches their potential.
        </p>
        <p className="text-gray-600 leading-relaxed">
          We provide ethical IA support: topic suggestions, feedback on
          mathematical depth, guidance on presentation &mdash; but we never
          write or solve problems for students. The IA must be genuinely their
          work.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">Cambridge A2 Levels</h3>
        <p className="text-gray-600 leading-relaxed">
          Building on AS foundations. Further Pure Mathematics, Further
          Mechanics, Further Statistics for those taking Further Maths. For
          regular A-Level: completing the P3/P4, M2, S2 components. Past paper
          practice is essential &mdash; Cambridge repeats question patterns, and
          familiarity with these patterns is a legitimate exam strategy.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          IGCSE Students Completing Their Qualification
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Final exam preparation, past paper practice, exam technique for Papers
          2 and 4. Emphasis on the exact method presentation Cambridge rewards.
        </p>
      </div>
    </div>
  ),

  subjects: ["Mathematics (all curricula)", "Physics (all curricula)"],

  faqs: [
    {
      question:
        "My child has boards and JEE/NEET both. Can you help with both?",
      answer:
        "We focus on board-level conceptual mastery. Strong board preparation builds the foundation for competitive exams. For JEE/NEET-specific preparation (advanced problem types, time pressure training), specialized coaching is better. But without the conceptual foundation we build, that coaching won\u2019t stick.",
    },
    {
      question:
        "Is Rs. 750 for the diagnostic worth it this late in Class 12?",
      answer:
        "If your child is struggling, Rs. 750 for an honest, precise assessment of where they stand is one of the cheapest investments you can make. Even in the final months, knowing exactly what to focus on \u2014 instead of panicking about everything \u2014 changes the outcome.",
    },
  ],
};

export default function Class12Tuition() {
  return <GradePageTemplate data={class12Data} />;
}
