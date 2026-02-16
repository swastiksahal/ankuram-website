import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "Cambridge A-Level Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Cambridge A-Level Maths & Physics tuition in Jubilee Hills, Hyderabad. Pure, Mechanics, Statistics, Practicals. Small batches of 3\u20135. Book a diagnostic assessment.",
  alternates: {
    canonical: "/a-levels-tuition",
  },
};

const aLevelsData: CurriculumPageData = {
  curriculumName: "A-Levels",
  heroTitle: "Cambridge A-Level Maths & Physics Tuition in Jubilee Hills",
  heroSubtitle:
    "A-Levels demand more than IGCSE with harder numbers. They demand multi-step reasoning, mathematical modelling, and the ability to link ideas across topics. That\u2019s a different skill \u2014 and we teach it.",
  heroBadge: "Cambridge AS & A Level \u2022 Maths (9709) \u2022 Physics (9702)",

  painPoints: [
    "Understood IGCSE fine but is now lost in A-Level \u2014 \u201cI understand in class but can\u2019t do the questions alone\u201d",
    "Algebra keeps falling apart under pressure \u2014 sign errors, wrong manipulation, incomplete factorisation",
    "Can differentiate and integrate mechanically but has no idea what the result actually means",
    "Physics problems feel like \u201cequation hunting\u201d \u2014 searching for a formula instead of thinking through the problem",
    "Treats practical work as a chore, but Paper 3/Paper 5 carry real marks",
  ],

  howWeTeachHeading: "How We Teach A-Levels",
  howWeTeachContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-8">
        The game shifts from IGCSE to A-Level. It&rsquo;s no longer about
        coverage &mdash; it&rsquo;s about{" "}
        <strong className="text-navy">depth, modelling, and multi-step reasoning</strong>.
        Students need stronger prerequisite fluency than they realise, and they
        need to communicate their reasoning precisely (Cambridge expects working
        &mdash; unsupported calculator answers don&rsquo;t earn marks).
      </p>

      <p className="section-label mb-6">Our approach</p>

      <div className="space-y-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Prerequisite Diagnostic
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Before anything else, we test the hidden prerequisites that A-Level
            depends on:
          </p>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Algebraic manipulation (surds, logs, indices, factor theorem)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Function thinking (domain/range, composition, inverse)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>Trigonometric identities and transformations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Graph sense (gradient, area, proportional reasoning)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>Vectors and components (for Mechanics)</span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            These aren&rsquo;t A-Level topics &mdash; they&rsquo;re tools. If
            they&rsquo;re not automatic, every A-Level topic becomes harder than
            it needs to be.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Concept &rarr; Procedure &rarr; Problem Solving &rarr; Exam
            Performance
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We build in this order. Coaching often starts at step 4 (past
            papers). We don&rsquo;t. Students who understand deeply perform
            better under pressure than students who memorised solution patterns.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Problem Routine (Taught Explicitly)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-navy font-medium text-sm mb-2">
                Maths routine:
              </p>
              <ol className="space-y-1 text-gray-600 text-sm list-decimal list-inside">
                <li>Represent (sketch/graph/define variables)</li>
                <li>Plan (choose method)</li>
                <li>Execute (clean working &mdash; method marks)</li>
                <li>Check (units, shape, sign, domain)</li>
                <li>Communicate (final statement in context)</li>
              </ol>
            </div>
            <div>
              <p className="text-navy font-medium text-sm mb-2">
                Physics routine:
              </p>
              <ol className="space-y-1 text-gray-600 text-sm list-decimal list-inside">
                <li>Define the system</li>
                <li>Diagram (forces/fields/circuit)</li>
                <li>State principle (Newton/energy/conservation)</li>
                <li>Assumptions (air resistance, uniform field, etc.)</li>
                <li>Solve + check (units, limiting cases)</li>
                <li>Explain (reasoning for &ldquo;why&rdquo; prompts)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <p className="section-label mb-6">Paper-Specific Training</p>

      <div className="space-y-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">Maths (9709)</h3>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Paper 1 + 3 (Pure):</strong>{" "}
                algebra, functions, trig, calculus &mdash; weekly mini-papers
                mixing topics
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Paper 4 (Mechanics):</strong>{" "}
                diagram first, sign convention stated, components resolved, then
                algebra
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Paper 5/6 (Statistics):</strong>{" "}
                distribution selection, hypothesis testing structure, conclusion
                in context
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">Physics (9702)</h3>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Paper 1 (MCQ):</strong> daily
                concept diagnosis with 1-line justification per answer
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Paper 2 + 4 (Structured):</strong>{" "}
                command-word awareness, formula sheet fluency, structured writing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Paper 3 (Practical):</strong>{" "}
                table design, graph scaling, best-fit line, gradient/intercept
                meaning, uncertainty, improvements
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">
                  Paper 5 (Planning & Analysis):
                </strong>{" "}
                variable identification, method outline, data processing plan,
                limitations
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          Practical Skills Are Year-Long
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Physics AO3 (experimental skills) carries 20% at both AS and A Level.
          Paper 3 has two experiments, each 1 hour. Paper 5 tests planning,
          analysis, and evaluation. These can&rsquo;t be &ldquo;revised&rdquo;
          &mdash; they must be built through regular practice all year.
        </p>
      </div>
    </>
  ),

  whatMakesDifferentHeading: "What Makes Our A-Levels Teaching Different",
  whatMakesDifferentContent: (
    <>
      <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          A-Level Maths isn&rsquo;t harder IGCSE. It&rsquo;s a fundamentally
          different subject. The thinking is more abstract, the problems are
          multi-step, and memorisation is useless. We build mathematical
          maturity &mdash; the ability to see a problem, identify which concepts
          apply, and construct a solution. Pure Maths needs proof skills.
          Mechanics needs physics intuition. Statistics needs probabilistic
          thinking. We develop all three.
        </p>
      </div>

      <p className="text-gray-600 leading-relaxed mb-3">
        <strong className="text-navy">
          From IGCSE to A-Level &mdash; what changes:
        </strong>
      </p>
      <ul className="space-y-2 mb-6 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Multi-step reasoning replaces single-concept questions
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Mathematical modelling becomes central &mdash; turn words into
            equations, solve, interpret
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Precision in notation, assumptions, units, and logical structure is
            now non-negotiable
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Transfer is expected &mdash; using the same principle in unfamiliar
            contexts
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Calculator is standard scientific only &mdash; no CAS, no graphical;
            working must be shown
          </span>
        </li>
      </ul>

      <p className="text-gray-600 leading-relaxed mb-3">
        <strong className="text-navy">Paper structure (Maths 9709):</strong>
      </p>
      <ul className="space-y-1 mb-6 text-gray-600 text-sm ml-4">
        <li>Paper 1 (Pure 1): 1h 50m, 75 marks &mdash; the backbone</li>
        <li>Paper 3 (Pure 3): 1h 50m, 75 marks &mdash; deeper pure topics</li>
        <li>Paper 4 (Mechanics): 1h 15m, 50 marks</li>
        <li>Paper 5 (Prob & Stats 1): 1h 15m, 50 marks</li>
      </ul>
      <p className="text-gray-500 text-sm mb-6">
        Important: AS &ldquo;Pure only&rdquo; (Paper 1+2) CANNOT be carried
        forward to complete A-Level later. Full A-Level requires Paper 1+3 plus
        either Paper 4+5 or Paper 5+6.
      </p>

      <p className="text-gray-600 leading-relaxed mb-3">
        <strong className="text-navy">Paper structure (Physics 9702):</strong>
      </p>
      <ul className="space-y-1 text-gray-600 text-sm ml-4">
        <li>Paper 1 (MCQ): 1h 15m &mdash; 15.5% of A-Level</li>
        <li>Paper 2 (AS Structured): 1h 15m &mdash; 23%</li>
        <li>Paper 3 (Practical): 2h &mdash; 11.5%</li>
        <li>
          Paper 4 (A2 Structured): 2h &mdash; 38.5% (the big one)
        </li>
        <li>Paper 5 (Planning & Analysis): 1h 15m &mdash; 11.5%</li>
      </ul>
    </>
  ),

  commonGaps: [
    {
      category: "Maths",
      items: [
        "Algebra collapses: expanding, factoring, surds, logs, indices \u2014 these must be automatic",
        "Calculus is mechanical: can differentiate but can\u2019t interpret or set up optimisation/modelling problems",
        "Mixed questions panic: A-Level blends topics (trig + calculus + algebra) and students haven\u2019t practised this",
        "Exam language blindness: \u201chence\u201d means use the previous result; \u201cshow that\u201d means derive it; \u201cexact value\u201d means no decimals",
      ],
    },
    {
      category: "Physics",
      items: [
        "Equation hunting: searching for a formula instead of identifying the principle first",
        "Vector and sign convention errors: especially mechanics, fields, circuits",
        "Graph literacy: can plot but can\u2019t interpret gradient/area or linearise relationships",
        "Practical skills: weak table design, poor graph skills, no uncertainty awareness",
      ],
    },
  ],

  diagnosticContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">For AS students (Year 12):</strong> Tests
        IGCSE-level prerequisites &mdash; algebra, functions, trig, graph
        skills, vectors. Also checks whether they can handle multi-step
        reasoning (not just single-concept questions).
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        <strong className="text-navy">For A2 students (Year 13):</strong> Also
        tests AS topic retention &mdash; especially Pure Maths 1 concepts that
        Paper 3 builds on.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        45&ndash;60 minutes. Independent. Then we solve everything together.
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
          <strong className="text-navy">Mathematics (9709):</strong> AS and A
          Level &mdash; Pure, Mechanics, Statistics
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Physics (9702):</strong> AS and A Level
          &mdash; Theory + Practical skills
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        Small batches of 3&ndash;5 students. Online, offline, and hybrid. We
        work with students internationally.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">Modules covered:</strong> Pure Mathematics
        (P1-P4), Mechanics (M1-M2), Statistics (S1-S2), Further Pure
        Mathematics.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">Exam boards:</strong> Cambridge (9709),
        Edexcel.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">SAT/ACT readiness:</strong> A-Level Maths
        students have strong foundations for SAT/ACT math sections. We align
        practice for students planning these tests.
      </p>
    </div>
  ),

  faqs: [
    {
      question:
        "My child did well in IGCSE but is struggling at A-Level. Why?",
      answer:
        "This is the most common pattern we see. IGCSE success can come from practising past papers and learning patterns. A-Level requires deeper algebraic fluency, multi-step reasoning, and the ability to link topics. The diagnostic tells us exactly which prerequisites are weak.",
    },
    {
      question: "Do you cover both AS and A2?",
      answer:
        "Yes. For AS students, we build the foundation that A2 depends on. For A2 students, we focus on high-weightage papers (Paper 4 is 38.5% of Physics) and ensure practical skills are exam-ready.",
    },
    {
      question:
        "Mechanics or Statistics \u2014 which should my child choose?",
      answer:
        "Depends on their strengths and university plans. Mechanics suits students heading towards engineering/physics and requires confident algebra + vector skills. Statistics suits students heading towards business/economics/biological sciences. We can advise after the diagnostic.",
    },
    {
      question: "Do you help with Physics practicals?",
      answer:
        "Yes. Paper 3 and Paper 5 carry combined 23% of the A-Level. We build practical skills throughout the year \u2014 table design, graph scaling, gradient calculation, uncertainty estimation, evaluation writing. These are concrete, teachable skills.",
    },
    {
      question:
        "Is A-Level preparation compatible with SAT/ACT prep?",
      answer:
        "Very much so. A-Level Pure Mathematics covers algebra, functions, calculus, and statistics at a depth that exceeds SAT requirements. Students who are solid in A-Level Maths find SAT/ACT math sections comfortable. We can integrate SAT-style practice where relevant.",
    },
  ],
};

export default function ALevelsTuition() {
  return <CurriculumPageTemplate data={aLevelsData} />;
}
