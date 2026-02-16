import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "IB DP Maths Tuition in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
  description:
    "IB DP Maths AA & AI tuition (SL/HL) in Jubilee Hills. IA guidance, exam prep, predicted grade support. Small batches. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/ib-dp-maths-tuition",
  },
  openGraph: {
    title: "IB DP Maths Tuition in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
    description:
      "IB DP Maths AA & AI tuition (SL/HL) in Jubilee Hills. IA guidance, exam prep, predicted grade support. Small batches. Call +91 7396669430",
    url: "https://ankuramtuition.in/ib-dp-maths-tuition",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const ibDpData: CurriculumPageData = {
  curriculumName: "IB DP",
  heroTitle: "IB DP Maths & Science Tuition in Jubilee Hills",
  heroSubtitle:
    "DP isn\u2019t about covering the syllabus. It\u2019s about building conceptual models, solving multi-step problems under pressure, and communicating your reasoning precisely. That\u2019s what we train.",
  heroBadge: "IB DP \u2022 Maths AA/AI \u2022 Physics \u2022 Chemistry",

  painPoints: [
    "Understands the concept during class but can\u2019t reproduce it independently on the exam",
    "Knows techniques but panics on multi-step questions because they can\u2019t identify which method to use",
    "AA Paper 1 (no calculator) feels impossible \u2014 algebra and exact values are shaky",
    "The IA (Internal Assessment / Exploration) feels overwhelming \u2014 doesn\u2019t know how to start, what topic to choose, or what \u201cgood\u201d looks like",
    "Scored well in MYP but is now struggling because DP requires deeper, more rigorous reasoning",
  ],

  howWeTeachHeading: "How We Teach IB DP",
  howWeTeachContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-8">
        DP success depends on three capabilities:{" "}
        <strong className="text-navy">conceptual models</strong> (you can
        explain WHY),{" "}
        <strong className="text-navy">multi-step problem solving</strong> (you
        can CHOOSE and LINK methods), and{" "}
        <strong className="text-navy">assessment literacy</strong> (you know
        what each paper demands and how to earn marks).
      </p>

      <p className="section-label mb-6">Our approach</p>

      <div className="space-y-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Diagnostic &rarr; Bridge &rarr; Build
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Many DP students struggle not because DP is too hard, but because
            MYP/IGCSE prerequisites aren&rsquo;t automatic. We start with a
            diagnostic that tests prerequisite fluency &mdash; algebra,
            functions, trig, graph sense &mdash; and fix gaps before they
            compound.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Two-Mode Training (AA Students)
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            AA has two very different exam modes:
          </p>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Paper 1 (no calculator):</strong>{" "}
                Pure algebraic fluency &mdash; exact values, proofs, clean
                manipulation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">
                  Paper 2/3 (technology required):
                </strong>{" "}
                Numerical methods, graph interpretation, modelling, efficient GDC
                use
              </span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            We split practice accordingly. Paper 1 skills are drilled without
            technology. Paper 2/3 skills integrate GDC work.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            AI-Specific Training
          </h3>
          <p className="text-gray-600 leading-relaxed">
            AI students always have technology available, but the trap is using
            the calculator as a replacement for explanation instead of as
            evidence. We train students to show reasoning and interpretation even
            when the GDC does the computation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">Weekly Routine</h3>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                1 skills + fluency session (thin-sliced practice, one skill
                deep)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                1 mixed practice session (interleaved problems from prior topics)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                1 paper training session (timed exam-style questions + mark
                scheme habits)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                1 investigation/modelling slot (fortnightly) &mdash; builds IA
                readiness AND Paper 2/3 thinking
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            The IA: Taught as a Skill, Not a Project
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            We run 2&ndash;3 mini-explorations before students choose their
            final topic. Each is 2&ndash;3 pages: aim, maths, reflection,
            communication. By the time they start their real IA, they know the
            structure, the criteria, and what Level 7 evidence looks like.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            <strong className="text-navy">Checkpoint system for IA:</strong>
          </p>
          <ol className="space-y-1 text-gray-600 ml-4 list-decimal list-inside">
            <li>Topic + personal motivation</li>
            <li>Clear aim / research question</li>
            <li>Mathematical plan</li>
            <li>First data/model attempt</li>
            <li>Draft for criteria-based feedback</li>
            <li>Final version</li>
          </ol>
          <p className="text-gray-600 leading-relaxed mt-3">
            We give feedback using criteria language &mdash; not line-by-line
            rewriting. The work must be theirs.
          </p>
        </div>
      </div>

      {/* DP Sciences sub-section */}
      <p className="section-label mb-6">DP Sciences</p>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Physics (First Assessment 2025)
          </h3>
          <ul className="space-y-1 text-gray-600 ml-4 text-sm mb-3">
            <li>Paper 1 (MCQ + data-based): 36%</li>
            <li>Paper 2 (short + extended response): 44%</li>
            <li>IA (scientific investigation): 20%</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            We train the &ldquo;physics triangle&rdquo; &mdash; students must
            move fluently between qualitative explanation (what&rsquo;s
            happening), mathematical model (equations/relationships), and
            data/graphs (evidence + uncertainty).
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Chemistry (First Assessment 2025)
          </h3>
          <ul className="space-y-1 text-gray-600 ml-4 text-sm mb-3">
            <li>Paper 1A MCQ + 1B data-based: 36%</li>
            <li>Paper 2 short + extended response: 44%</li>
            <li>IA: 20%</li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            Chemistry success requires translating between three
            representations: macroscopic (what you observe), submicroscopic
            (particles), and symbolic (equations/structures/calculations).
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">For Both Sciences</h3>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Weekly data-based drills (one graph/table + 3 questions)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Fortnightly extended-response practice (structured argument
                writing)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                IA micro-skills taught throughout the course &mdash; not bolted
                on at the end
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  ),

  whatMakesDifferentHeading: "What Makes Our IB DP Teaching Different",
  whatMakesDifferentContent: (
    <>
      <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          Whether your child takes AA or AI, SL or HL &mdash; we build the
          specific thinking each pathway requires. AA students need abstract
          proof skills and mathematical rigour. AI students need real-world
          modelling skills and technology fluency. Same subject name, different
          mathematical brains required. We also provide ethical IA guidance
          &mdash; topic selection, feedback on mathematical depth and
          presentation &mdash; while ensuring the work remains genuinely your
          child&rsquo;s.
        </p>
      </div>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">
          AA or AI &mdash; which should my child take?
        </strong>{" "}
        AA is for students who enjoy pure mathematical thinking &mdash; algebra,
        proof, calculus. AI is for students who prefer maths applied to real
        contexts &mdash; statistics, modelling, technology. AA HL is typically
        expected for engineering/physical sciences at university. AI SL is often
        sufficient for business/social sciences.
      </p>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">The IA is 20%.</strong> The Internal
        Assessment requires original mathematical exploration. Most students
        don&rsquo;t know what &ldquo;personal engagement&rdquo; means in
        criterion terms &mdash; and lose marks they could easily earn. We teach
        IA as a structured skill from early in the course.
      </p>

      <p className="text-gray-600 leading-relaxed">
        <strong className="text-navy">The MYP-to-DP jump is real.</strong>{" "}
        Students who coasted through MYP hit a wall in DP Year 1 &mdash;
        especially in calculus and proof-based topics. Our bridge module catches
        this before it becomes a crisis.
      </p>
    </>
  ),

  commonGaps: [
    {
      category: "Maths",
      items: [
        "Algebra collapses under pressure \u2014 wrong signs, illegal cancellations, weak surd/log manipulation",
        "Calculus is mechanical \u2014 can differentiate but can\u2019t interpret rate of change or set up models",
        "Mixed questions feel unfair \u2014 students haven\u2019t practised linking topics",
        "Notation and exam language confusion \u2014 \u201chence\u201d vs \u201cshow that,\u201d domain restrictions, exact values",
      ],
    },
    {
      category: "Physics",
      items: [
        "Equation hunting instead of principle-based problem solving",
        "Weak graph literacy \u2014 gradient/area interpretation, linearisation",
        "Units, significant figures, uncertainty \u2014 marks lost even when the physics is right",
        "Practical skills are an afterthought (but IA is 20%)",
      ],
    },
    {
      category: "Chemistry",
      items: [
        "Can\u2019t translate between observation \u2192 particle model \u2192 symbolic equation",
        "Stoichiometry workflows lack clear logic",
        "Data booklet usage is passive \u2014 students don\u2019t practise locating and applying data efficiently",
      ],
    },
  ],

  diagnosticContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">For DP1 students:</strong> Diagnostic
        tests prerequisite skills &mdash; algebra, functions, trig, graph sense,
        basic calculus concepts. This tells us if the MYP/IGCSE foundation is
        ready for DP.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">For DP2 students:</strong> Diagnostic also
        checks DP1 topic retention and identifies which areas need urgent
        revision before exams.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        <strong className="text-navy">For Physics/Chemistry:</strong> Separate
        diagnostic covering mathematical skills for science + conceptual
        baselines.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        45&ndash;60 minutes. Independent. Then we solve together.
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
          <strong className="text-navy">Maths AA:</strong> SL and HL (including
          IA/Exploration guidance)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Maths AI:</strong> SL and HL (including
          IA/Exploration guidance)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Physics:</strong> SL and HL (including
          IA guidance)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Chemistry:</strong> SL and HL (including
          IA guidance)
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        Small batches of 3&ndash;5 students. Online, offline, and hybrid. We
        work with students internationally.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">IA Support:</strong> Topic ideation,
        structure guidance, mathematical rigour feedback &mdash; while ensuring
        the work remains genuinely the student&rsquo;s own.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">SAT/ACT readiness:</strong> DP Maths
        skills (especially AA) overlap significantly with SAT/ACT math sections.
        We can align practice for students planning these tests.
      </p>
    </div>
  ),

  faqs: [
    {
      question: "AA or AI \u2014 which should my child take?",
      answer:
        "AA is for students who enjoy pure mathematical thinking \u2014 algebra, proof, calculus. AI is for students who prefer maths applied to real contexts \u2014 statistics, modelling, technology. AA HL is typically expected for engineering/physical sciences at university. AI SL is often sufficient for business/social sciences. We can advise after the diagnostic.",
    },
    {
      question: "Do you write the IA for students?",
      answer:
        "Absolutely not. The IA must be the student\u2019s own work \u2014 IB checks for authenticity. We teach IA skills (structure, criteria, mathematical depth), run mini-explorations for practice, provide criteria-based feedback on drafts, and prepare students for the viva. The thinking and writing must be theirs.",
    },
    {
      question:
        "My child is in DP2 and behind on the syllabus. Can you help?",
      answer:
        "Yes. We prioritise by paper weightage \u2014 what carries the most marks and where your child can gain the most. For Maths, that often means intensive Calculus practice. For Physics/Chemistry, it means targeted data-based and extended-response training. The diagnostic tells us exactly where to focus.",
    },
    {
      question:
        "How is your approach different from a DP coaching class?",
      answer:
        "Coaching typically starts with past papers. We start with understanding. We build conceptual models first, then train exam performance on top. Students who understand deeply perform better under pressure than students who only memorised solutions to past papers.",
    },
    {
      question: "Do you help with predicted grades?",
      answer:
        "Predicted grades are set by your school. What we do is ensure your actual performance matches (or exceeds) what your teacher expects. Strong internal assessment results and consistent mock performance give your school confidence in predicting higher.",
    },
  ],
};

export default function IBDPTuition() {
  return <CurriculumPageTemplate data={ibDpData} />;
}
