import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "ICSE Maths Tuition in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
  description:
    "ICSE Maths tuition for Class 6-10 in Jubilee Hills, Hyderabad. Method-focused teaching, step-marking expertise, small batches of 3-5. Book a diagnostic. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/icse-maths-tuition",
  },
  openGraph: {
    title: "ICSE Maths Tuition in Jubilee Hills, Hyderabad | Ankuram Tuition Centre",
    description:
      "ICSE Maths tuition for Class 6-10 in Jubilee Hills, Hyderabad. Method-focused teaching, step-marking expertise, small batches of 3-5. Book a diagnostic. Call +91 7396669430",
    url: "https://ankuramtuition.in/icse-maths-tuition",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const icseData: CurriculumPageData = {
  curriculumName: "ICSE",
  heroTitle: "ICSE Maths Tuition in Jubilee Hills, Hyderabad",
  heroSubtitle:
    "Searching for ICSE tuition near me in Hyderabad? At our Jubilee Hills centre, we don\u2019t just teach ICSE \u2014 we train method, presentation, and concept depth. Your child learns to show their work, explain their reasoning, and present it the way examiners reward.",
  heroBadge: "ICSE \u2022 Grades 6\u201310 \u2022 Maths & Science",

  painPoints: [
    "Understands the concept but loses marks because they skip steps or don\u2019t show enough working",
    "Gets confused when the question is worded slightly differently from the textbook",
    "Can solve direct problems but struggles with application-based and competency-style questions",
    "Diagrams are messy, graph scales are wrong, ray diagrams miss labels",
    "Knows the Chemistry reaction but forgets to write the conditions, observations, or balanced equation",
  ],

  howWeTeachHeading: "How We Teach ICSE",
  howWeTeachContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-8">
        ICSE rewards three things equally:{" "}
        <strong className="text-navy">concept understanding</strong>,{" "}
        <strong className="text-navy">correct method</strong>, and{" "}
        <strong className="text-navy">clean presentation</strong>. Most students
        are decent at the first, okay at the second, and weak at the third. We
        build all three from day one.
      </p>

      <p className="section-label mb-6">Our process</p>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">Step 1: Diagnostic</h3>
          <p className="text-gray-600 leading-relaxed">
            We test foundational skills &mdash; not just the current chapter. An
            ICSE Class 9 student struggling with quadratics often has gaps in
            factorisation and algebraic manipulation from Class 7. The diagnostic
            finds exactly where things went off track.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 2: Method + Presentation Training
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            ICSE explicitly states that &ldquo;omission of essential working will
            result in loss of marks.&rdquo; We take this seriously. From the
            first session, students learn to write solutions in a structured
            format:
          </p>
          <p className="text-navy font-medium italic">
            Given &rarr; To Find &rarr; Formula/Theorem &rarr; Substitution
            &rarr; Working &rarr; Answer (boxed) + Units
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            This isn&rsquo;t about neatness for its own sake &mdash; it&rsquo;s
            about earning every mark the student deserves.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 3: Application Practice
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            CISCE has shifted towards competency-based questions. We use a
            3-level practice system:
          </p>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Level 1:</strong> Direct (same as
                taught example)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Level 2:</strong> Twisted (one
                variable changed &mdash; wording, units, or diagram orientation)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                <strong className="text-navy">Level 3:</strong> Mixed (two
                concepts combined in an unfamiliar context)
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 4: Paper-Specific Training
          </h3>
          <p className="text-gray-600 leading-relaxed">
            From Grade 9, students practise with the actual exam structure
            &mdash; Section A (compulsory) and Section B (choice). We teach them
            to use the 15-minute reading time strategically: mark confident
            questions, choose Section B questions, plan time allocation.
          </p>
        </div>
      </div>
    </>
  ),

  whatMakesDifferentHeading: "What Makes Our ICSE Teaching Different",
  whatMakesDifferentContent: (
    <>
      <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          ICSE examiners reward method, not just answers. We train students to
          write solutions the way examiners want to see them &mdash; clear
          steps, proper working, no skipped lines. ICSE also has a wider
          syllabus than CBSE with more application-based questions. Commercial
          maths in Class 10, additional geometry constructions, greater emphasis
          on proof &mdash; we prepare students for all of these.
        </p>
      </div>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">Three separate Science papers.</strong>{" "}
        Unlike CBSE&rsquo;s single Science exam, ICSE students face separate
        board papers for Physics, Chemistry, and Biology &mdash; each 80 marks,
        2 hours. That means three different answer-writing styles to master:
      </p>
      <ul className="space-y-2 mb-6 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Physics:</strong> Numericals +
            diagrams + units + derivations
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Chemistry:</strong> Balanced equations
            + conditions + observations + structured reasoning
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            <strong className="text-navy">Biology:</strong> Precise terminology
            + diagrams + process explanations
          </span>
        </li>
      </ul>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">Working is marks.</strong> ICSE Maths
        examiners explicitly penalise missing steps. A correct final answer
        without working can still lose marks. This is different from many other
        boards.
      </p>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">Internal assessment is real.</strong>{" "}
        Maths has 20 marks of internal assessment (assignments evaluated by your
        teacher AND an external examiner). Science practicals carry marks too.
        These aren&rsquo;t optional &mdash; they&rsquo;re part of the final
        score.
      </p>

      <p className="text-gray-600 leading-relaxed">
        <strong className="text-navy">
          Competency-based questions from 2024.
        </strong>{" "}
        CISCE has formally introduced competency-focused questions testing
        understanding, analysis, application, evaluation, and creativity.
        Textbook practice alone won&rsquo;t prepare students for these.
      </p>
    </>
  ),

  commonGaps: [
    {
      category: "Maths",
      items: [
        "Algebraic manipulation \u2014 identities, factorisation, sign control (most common gap)",
        "Geometry proof writing \u2014 students skip reasons, and in ICSE, reasons ARE marks",
        "Graph and statistics presentation \u2014 wrong scales, missing kink marks, incorrect labelling",
        "Premature rounding \u2014 rounding mid-solution instead of at the end",
        "Formula confusion \u2014 knowing multiple formulas but not knowing WHEN to use which",
      ],
    },
    {
      category: "Science",
      items: [
        "Physics: SI units discipline, ray diagram accuracy, numerical structure",
        "Chemistry: \u201cConditions + Observations + Balanced Equation\u201d \u2014 students consistently forget one of the three",
        "Biology: Diagram labels and process sequencing",
        "All three: \u201cDefine vs Explain\u201d gap \u2014 knowing the term but writing a weak explanation",
      ],
    },
  ],

  diagnosticContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-4">
        45&ndash;60 minutes. Your child writes independently &mdash; no hints,
        no help. We&rsquo;re not testing their current chapter. We&rsquo;re
        testing the foundations their current chapter depends on.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        After the assessment, our teacher solves every question with your child.
        This is the first teaching session &mdash; your child sees how to
        approach problems systematically, how to write solutions that earn full
        marks, and where their specific gaps are.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        You get a clear gap map and a plan.
      </p>
      <p className="text-lg font-semibold text-accent">
        ₹750 &mdash; fully credited when you enroll.
      </p>
    </>
  ),

  subjectsContent: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Maths:</strong> Grades 6&ndash;10
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Science:</strong> Grades 6&ndash;10
          (Physics, Chemistry, Biology &mdash; all three)
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        Small batches of 3&ndash;5 students. Online, offline, and hybrid.
      </p>
    </div>
  ),

  faqs: [
    {
      question: "ICSE is vast \u2014 how do you cover everything?",
      answer:
        "We don\u2019t try to \u201ccover\u201d \u2014 we build understanding. When foundations are strong, the syllabus moves faster. We plan around the board\u2019s unit weightage and focus teaching time where it matters most.",
    },
    {
      question:
        "My child knows the concepts but keeps losing marks on presentation. Can you fix that?",
      answer:
        "This is one of the most common ICSE problems \u2014 and yes, it\u2019s very fixable. We enforce structured solution writing from day one. Given \u2192 Formula \u2192 Steps \u2192 Answer with units. In geometry, every statement must have a reason. Within weeks, the habit sticks.",
    },
    {
      question: "Is ICSE harder than CBSE?",
      answer:
        "Different, not necessarily harder. ICSE demands more detailed answers, more structured writing, and more application. CBSE has shifted towards competency too, but ICSE has traditionally expected it. The key difference: ICSE makes you show your thinking on paper.",
    },
    {
      question:
        "Do you help with practicals and internal assessments?",
      answer:
        "Yes. We plan IA work through the year \u2014 mini-projects from Grade 6\u20138, formal submissions in 9\u201310. For Science practicals, we teach observation tables, labelled diagrams, inference writing, and error analysis.",
    },
    {
      question:
        "Will ICSE preparation help for competitive exams later?",
      answer:
        "ICSE\u2019s depth and application focus builds a strong conceptual base that transfers well. We don\u2019t mix in competitive exam material during board prep, but the analytical skills our students develop serve them well in any future exam.",
    },
  ],
};

export default function ICSETuition() {
  return <CurriculumPageTemplate data={icseData} />;
}
