import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "IGCSE Maths & Science Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Cambridge IGCSE Maths & Science tuition in Jubilee Hills, Hyderabad. Core & Extended, past paper mastery, small batches of 3\u20135. Book a diagnostic assessment.",
  alternates: {
    canonical: "/igcse-tuition",
  },
};

const igcseData: CurriculumPageData = {
  curriculumName: "IGCSE",
  heroTitle: "IGCSE Maths & Science Tuition in Jubilee Hills",
  heroSubtitle:
    "IGCSE isn\u2019t about memorising content. It\u2019s about precise methods, clean working, and the discipline to show every step \u2014 because every step earns marks.",
  heroBadge: "Cambridge IGCSE \u2022 Grades 9\u201310 \u2022 Maths & Sciences",

  painPoints: [
    "Gets the right answer but loses marks because working is incomplete or unclear",
    "Can solve standard questions but freezes when the question looks different from practice",
    "Doesn\u2019t know whether to use sine rule or cosine rule, factorising or the quadratic formula \u2014 can\u2019t identify the right method",
    "In Science, knows definitions but struggles with \u201cexplain\u201d and \u201ccompare\u201d questions",
    "Makes the same \u201ccareless\u201d mistakes repeatedly \u2014 but they\u2019re not actually careless, they\u2019re skill gaps",
  ],

  howWeTeachHeading: "How We Teach IGCSE",
  howWeTeachContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-8">
        IGCSE is method-mark heavy. The mark scheme rewards visible thinking
        &mdash; correct method steps, proper units, precise scientific
        vocabulary, and structured answers. We train all of this systematically.
      </p>

      <p className="section-label mb-6">Our process</p>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">Step 1: Diagnostic</h3>
          <p className="text-gray-600 leading-relaxed">
            We test the foundations that IGCSE depends on &mdash; not just the
            current topic. Many Grade 9 IGCSE struggles trace back to weak
            algebra, ratio reasoning, or graph skills from earlier years.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 2: Teach for Understanding, Then Train for Marks
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We don&rsquo;t start with past papers. We start with concept models
            &mdash; why something works, not just how to do it. Once
            understanding is solid, we layer exam technique on top: mark scheme
            awareness, command word discipline, and structured answer writing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 3: Deliberate Practice
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            We don&rsquo;t assign &ldquo;20 questions on one topic.&rdquo; We
            use a deliberate practice system:
          </p>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>6 questions on the new skill (build accuracy)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Then 6 mixed questions from earlier topics (build selection skill
                &mdash; &ldquo;which method do I use?&rdquo;)
              </span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            This mirrors the actual exam, where questions mix topics.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 4: Error Classification
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            After every practice set, students classify their errors:
          </p>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Knowledge gap</strong>{" "}
                (didn&rsquo;t know the concept)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Misconception</strong> (thought
                they knew, but wrong)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Process error</strong> (right
                concept, wrong execution)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Careless</strong> (knew
                everything, slipped up)
              </span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            Each type has a different fix. We don&rsquo;t treat all errors the
            same.
          </p>
        </div>
      </div>
    </>
  ),

  whatMakesDifferentHeading: "What Makes Our IGCSE Teaching Different",
  whatMakesDifferentContent: (
    <>
      <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          Cambridge marks every step. A correct answer with wrong working gets
          zero. We don&rsquo;t just teach concepts &mdash; we teach how to
          present solutions in the exact format Cambridge rewards. We also help
          students and parents make the Core vs Extended decision &mdash;
          Extended opens more doors but requires stronger foundations. We prepare
          students for both calculator (Paper 2/4) and non-calculator (Paper
          1/3) components.
        </p>
      </div>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">Command words matter.</strong> IGCSE
        Science examiners expect specific response styles:
      </p>
      <ul className="space-y-2 mb-6 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">State:</strong> one correct line, no
            explanation
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Describe:</strong> what happens
            (trend/pattern)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Explain:</strong> cause-effect
            reasoning (because... therefore...)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Compare:</strong> both sides +
            comparative language (&ldquo;greater than,&rdquo;
            &ldquo;more/less&rdquo;)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Calculate:</strong> formula &rarr;
            substitution &rarr; answer with units
          </span>
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed mb-6">
        Students who don&rsquo;t match their answer style to the command word
        lose marks even when they know the content.
      </p>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">Core vs Extended:</strong> IGCSE Maths has
        two tiers. Extended covers more topics and reaches grades A*&ndash;E.
        Core covers fewer topics for grades C&ndash;G. We help students and
        parents make the right choice &mdash; the diagnostic informs this
        decision.
      </p>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">Cambridge vs Edexcel:</strong> Both are
        IGCSE, but the exam style differs slightly. We adapt our practice
        materials to match whichever board your child&rsquo;s school follows.
      </p>

      <p className="text-gray-600 leading-relaxed">
        <strong className="text-navy">Practical skills in Science:</strong> Even
        if your child doesn&rsquo;t do practical exams, they must master:
        identifying variables, planning fair tests, interpreting graphs,
        evaluating experiments, and suggesting improvements. These are tested on
        theory papers.
      </p>
    </>
  ),

  commonGaps: [
    {
      category: "Maths",
      items: [
        "Problem type recognition \u2014 can\u2019t classify \u201cis this factorise, complete the square, or quadratic formula?\u201d",
        "Trigonometry \u2014 right triangle vs sine/cosine rule confusion",
        "Graph interpretation \u2014 gradient, intercept, area under curve",
        "Geometry \u2014 angle chase + giving reasons (reasons are marks in IGCSE too)",
        "Mathematical communication \u2014 equals signs used incorrectly, messy notation, no units",
      ],
    },
    {
      category: "Science",
      items: [
        "\u201cExplain\u201d answers that are actually \u201cdescribe\u201d answers \u2014 no causal reasoning",
        "Variable identification in experiments \u2014 can state them but can\u2019t justify controls",
        "Graph skills \u2014 choosing scale, labelling axes, drawing best-fit line, interpreting gradient",
        "Misconceptions treated as facts \u2014 \u201cforce causes motion,\u201d \u201ccurrent is used up,\u201d \u201catoms vs molecules vs ions\u201d",
        "Calculation structure \u2014 missing formula statement, missing units, missing substitution step",
      ],
    },
  ],

  diagnosticContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-3">
        IGCSE-specific diagnostic covering:
      </p>
      <ul className="space-y-2 mb-4 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Foundational maths skills (algebra, ratio, graphs, geometry)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Science concept baselines (aligned to your child&rsquo;s specific
            IGCSE subjects)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Method and presentation habits (do they show working naturally, or
            skip steps?)
          </span>
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed mb-6">
        45&ndash;60 minutes. Independent. Then we solve every question together
        &mdash; teaching starts on Day 1.
      </p>
      <p className="text-lg font-semibold text-accent">
        ₹750 &mdash; fully credited on enrollment.
      </p>
    </>
  ),

  subjectsContent: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">IGCSE Mathematics:</strong> Grades
          9&ndash;10 (Core and Extended)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">IGCSE Additional Mathematics:</strong>{" "}
          Grade 10 (for students taking Add Maths)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">IGCSE Physics:</strong> Grades
          9&ndash;10
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">IGCSE Chemistry:</strong> Grades
          9&ndash;10
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">IGCSE Biology:</strong> Grades
          9&ndash;10
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        Small batches of 3&ndash;5 students. Online, offline, and hybrid. We
        work with students internationally.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">Papers covered:</strong> Core (Papers 1 &
        3), Extended (Papers 2 & 4).
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">Exam boards:</strong> Cambridge (0580),
        Edexcel.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">SAT/Pre-SAT readiness:</strong> IGCSE
        Maths builds strong algebraic and data interpretation skills that
        directly support SAT preparation. We align practice for students
        planning these tests.
      </p>
    </div>
  ),

  faqs: [
    {
      question: "Core or Extended \u2014 how do I decide?",
      answer:
        "The diagnostic gives us a clear answer. If your child is comfortable with Extended-level foundations, Extended is the better choice (wider grade range, more university flexibility). If foundations are shaky, Core with strong performance may be smarter than Extended with a low grade. We\u2019ll advise honestly.",
    },
    {
      question:
        "My child\u2019s school uses Cambridge. Do you cover Edexcel too?",
      answer:
        "Yes. We work with both Cambridge and Edexcel IGCSE. The core content overlaps significantly \u2014 the main differences are in exam structure and question style. We adapt practice accordingly.",
    },
    {
      question: "Do you cover Additional Mathematics?",
      answer:
        "Yes. IGCSE Additional Maths is important for students planning A-Levels or IB DP Maths AA. We teach it as preparation for the next level, not just another exam to pass.",
    },
    {
      question: "How do you prepare for IGCSE Science without practicals?",
      answer:
        "IGCSE Science theory papers test practical skills \u2014 variables, experimental design, graph interpretation, evaluation. We build these skills through structured exercises even without lab access. Students learn to think like experimenters, which is what the exam actually tests.",
    },
    {
      question: "Is IGCSE enough preparation for A-Levels?",
      answer:
        "It depends on how well the IGCSE foundation is built. A strong IGCSE with deep understanding prepares students well. A strong IGCSE built on past-paper drilling without understanding creates problems at A-Level. That\u2019s exactly the gap we focus on closing.",
    },
  ],
};

export default function IGCSETuition() {
  return <CurriculumPageTemplate data={igcseData} />;
}
