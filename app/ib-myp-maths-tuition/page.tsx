import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "IB MYP Maths Tuition in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
  description:
    "IB MYP Maths tuition for Years 1-5 in Jubilee Hills, Hyderabad. Criterion-based preparation (A,B,C,D). eAssessment ready. Small batches of 3-5. Book a diagnostic. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/ib-myp-maths-tuition",
  },
  openGraph: {
    title: "IB MYP Maths Tuition in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
    description:
      "IB MYP Maths tuition for Years 1-5 in Jubilee Hills, Hyderabad. Criterion-based preparation (A,B,C,D). eAssessment ready. Small batches of 3-5. Book a diagnostic. Call +91 7396669430",
    url: "https://ankuramtuition.in/ib-myp-maths-tuition",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const ibMypData: CurriculumPageData = {
  curriculumName: "IB MYP",
  heroTitle: "IB MYP Maths Tuition in Jubilee Hills, Hyderabad",
  heroSubtitle:
    "Looking for IB MYP tuition near me? Ankuram in Jubilee Hills, Hyderabad offers expert IB tuition that trains all four MYP criteria. MYP doesn\u2019t test what your child memorised \u2014 it tests investigation, application, and communication. That\u2019s what we prepare.",
  heroBadge: "IB MYP \u2022 Years 1\u20135 \u2022 Maths & Sciences",

  painPoints: [
    "Gets decent marks on Criterion A (knowledge) but struggles with Criterion B (investigations) and D (real-life application)",
    "Can solve problems but can\u2019t explain their reasoning in writing \u2014 Criterion C (communication) scores are low",
    "Doesn\u2019t understand what the teacher wants in an investigation task \u2014 keeps getting \u201cdeveloping\u201d or \u201capproaching\u201d on rubrics",
    "Studies hard before summatives but the criterion-based marking feels unpredictable",
    "Finds it hard to connect maths or science to the \u201cglobal context\u201d or \u201cstatement of inquiry\u201d \u2014 it feels like a forced exercise",
  ],

  howWeTeachHeading: "How We Teach IB MYP",
  howWeTeachContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-6">
        MYP is criterion-based. That means your child isn&rsquo;t just graded on
        &ldquo;right or wrong&rdquo; &mdash; they&rsquo;re assessed on four
        separate criteria, each measuring a different skill. We train all four.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-3">MYP Maths Criteria</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <strong className="text-navy">A:</strong> Knowing &
              Understanding
            </li>
            <li>
              <strong className="text-navy">B:</strong> Investigating Patterns
            </li>
            <li>
              <strong className="text-navy">C:</strong> Communicating
            </li>
            <li>
              <strong className="text-navy">D:</strong> Applying in Real-Life
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-3">
            MYP Sciences Criteria
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <strong className="text-navy">A:</strong> Knowing &
              Understanding
            </li>
            <li>
              <strong className="text-navy">B:</strong> Inquiring & Designing
            </li>
            <li>
              <strong className="text-navy">C:</strong> Processing & Evaluating
            </li>
            <li>
              <strong className="text-navy">D:</strong> Reflecting on Impacts
            </li>
          </ul>
        </div>
      </div>

      <p className="section-label mb-6">Our approach</p>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Foundation First, Then Criteria Training
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Most MYP students who score low on investigations (B) or
            communication (C) actually have concept gaps in A. You can&rsquo;t
            investigate a pattern you don&rsquo;t understand. We fix the concept
            base, then build criterion-specific skills on top.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            We Teach Criteria as Skills, Not Mysteries
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Criterion B:</strong> We teach the
                investigation cycle &mdash; notice &rarr; conjecture &rarr; test
                &rarr; generalise &rarr; justify &rarr; reflect
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Criterion C:</strong> We teach
                explanation frames &mdash; &ldquo;because / therefore /
                if...then&rdquo; + proper notation + representation switching
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Criterion D:</strong> We teach
                modelling &mdash; define variables &rarr; choose model &rarr;
                solve &rarr; interpret &rarr; validate assumptions
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Year-by-Year Progression
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Years 1&ndash;2:</strong> Build
                routines, representations, MYP vocabulary, and the &ldquo;how to
                write for each criterion&rdquo; habit
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Year 3:</strong> Consolidate
                conceptual understanding + investigation independence
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Years 4&ndash;5:</strong> Increase
                rigour, extended responses, modelling, evaluation &mdash;
                eAssessment preparation where relevant
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  ),

  whatMakesDifferentHeading: "What Makes Our IB MYP Teaching Different",
  whatMakesDifferentContent: (
    <>
      <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          MYP isn&rsquo;t about right answers. It&rsquo;s about mathematical
          thinking. We teach your child to investigate, communicate
          mathematically, and apply concepts to unfamiliar situations &mdash;
          because that&rsquo;s what criteria B, C, and D actually test. We
          understand what 7-8 level work looks like across all four criteria:
          Knowing & Understanding (A), Investigating Patterns (B),
          Communicating (C), and Applying in Real-Life (D). We train students to
          meet each criterion&rsquo;s demands.
        </p>
      </div>

      <p className="text-lg font-semibold text-navy mb-4">
        It&rsquo;s not harder &mdash; it&rsquo;s different.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        MYP doesn&rsquo;t ask &ldquo;can you solve this equation?&rdquo; It
        asks &ldquo;can you investigate a pattern, generalise a rule, prove it
        works, and explain why it matters in a real context?&rdquo; That requires
        a different kind of preparation than traditional boards.
      </p>

      <p className="text-gray-600 leading-relaxed mb-3">
        <strong className="text-navy">Key things parents should know:</strong>
      </p>
      <ul className="space-y-2 mb-6 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Each criterion is assessed on a 1&ndash;8 scale. Your child can
            score 7 on A but 4 on C &mdash; the criteria are independent.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            All four criteria must be assessed at least twice per year with
            evidence across all strands.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Summative tasks usually target 1&ndash;2 criteria deeply (not all
            four at once).
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            MYP Sciences can be integrated or separate
            (Biology/Chemistry/Physics) depending on the school.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            If your school does eAssessment (Years 4&ndash;5), the on-screen
            exam format samples across all criteria and branches.
          </span>
        </li>
      </ul>

      <p className="text-gray-600 leading-relaxed">
        <strong className="text-navy">The ACT/SAT connection:</strong> MYP Maths
        builds strong algebraic reasoning, pattern recognition, and data
        interpretation &mdash; all of which directly support SAT and Pre-SAT
        preparation. We can align practice accordingly for students planning
        these tests.
      </p>
    </>
  ),

  commonGaps: [
    {
      category: "Maths",
      items: [
        "Weak algebraic foundations that make Year 4\u20135 MYP feel impossible",
        "Can\u2019t structure an investigation \u2014 doesn\u2019t know what \u201cgeneralise and justify\u201d actually means",
        "Communication is vague \u2014 missing logical connectors, unclear steps, no interpretation of results",
        "Real-life application tasks feel \u201cfake\u201d \u2014 student doesn\u2019t know how to model or evaluate assumptions",
      ],
    },
    {
      category: "Sciences",
      items: [
        "Investigation design is mechanical \u2014 lists variables but can\u2019t justify controls or method choices",
        "Data processing stops at \u201cdraw the graph\u201d \u2014 no interpretation, no evaluation of limitations",
        "Scientific vocabulary is memorised but not used correctly in context",
        "Criterion D (impacts/reflection) answers are shallow \u2014 \u201cscience is useful to society\u201d level responses",
      ],
    },
  ],

  diagnosticContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-3">
        MYP students need a different kind of diagnostic. We assess:
      </p>
      <ul className="space-y-2 mb-4 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">
              Foundational maths/science concepts
            </strong>{" "}
            (is the base solid?)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Criterion-specific skills</strong>{" "}
            (can they write an investigation? Can they communicate reasoning?)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">
              Where in the Year 1&ndash;5 progression they actually sit
            </strong>{" "}
            (which may be different from what year they&rsquo;re enrolled in)
          </span>
        </li>
      </ul>
      <p className="text-gray-600 leading-relaxed mb-6">
        45&ndash;60 minutes. Independent work. Then we solve together and show
        them what criterion-level performance looks like.
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
          <strong className="text-navy">MYP Mathematics:</strong> Years
          1&ndash;5 (Standard and Extended where applicable)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">MYP Sciences:</strong> Years 1&ndash;5
          (Integrated and Separate sciences)
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        Small batches of 3&ndash;5 students. Online, offline, and hybrid. We
        work with students from schools following the full MYP framework in
        Hyderabad and internationally.
      </p>
      <p className="text-gray-500 text-sm">
        <strong className="text-navy">Schools we support students from:</strong>{" "}
        Oakridge, Indus International, Sri Ram Universal, Pathways, and other IB
        schools in Hyderabad.
      </p>
    </div>
  ),

  faqs: [
    {
      question:
        "My child\u2019s school teaches MYP but I don\u2019t understand the grading. Can you explain?",
      answer:
        "MYP uses criterion-based assessment (A, B, C, D) \u2014 each scored 1\u20138. Your child\u2019s final grade comes from these criteria, not from a single exam score. We help parents understand what each criterion measures and what \u201cmoving from a 5 to a 7\u201d actually requires.",
    },
    {
      question: "Do you help with MYP eAssessment?",
      answer:
        "Yes. For students in Year 4\u20135 whose schools participate in eAssessment, we prepare for the on-screen exam format \u2014 which samples across criteria and mathematical branches. We also build the investigation and modelling skills that eAssessment specifically tests.",
    },
    {
      question: "Can you help with the Personal Project (Year 5)?",
      answer:
        "Our focus is Maths and Sciences. If the Personal Project involves a mathematical or scientific component, we can guide that aspect.",
    },
    {
      question:
        "My child is doing well on tests but poorly on investigations and applications. Why?",
      answer:
        "Tests usually measure Criterion A (knowledge). Investigations (B), communication (C), and real-life application (D) are separate skills that must be taught separately. Most students who score well on A but poorly on B\u2013D have never been explicitly trained on investigation structure, explanation writing, or modelling. We teach these as concrete, learnable skills.",
    },
    {
      question: "How does MYP preparation help with IB DP later?",
      answer:
        "MYP builds the habits DP demands \u2014 structured reasoning, investigation skills, mathematical communication, and reflective evaluation. Students who are strong across all four MYP criteria transition to DP much more smoothly. We also align Year 4\u20135 preparation with DP readiness.",
    },
  ],
};

export default function IBMYPTuition() {
  return <CurriculumPageTemplate data={ibMypData} />;
}
