import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "CBSE Maths & Science Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert CBSE Maths & Science tuition for Grades 1–12 in Jubilee Hills, Hyderabad. Diagnostic-first approach, small batches of 3–5. Book a diagnostic assessment.",
  alternates: {
    canonical: "/cbse-tuition",
  },
};

const cbseData: CurriculumPageData = {
  curriculumName: "CBSE",
  heroTitle: "CBSE Maths & Science Tuition in Jubilee Hills",
  heroSubtitle:
    "Most CBSE students don\u2019t have a \u201csyllabus problem\u201d \u2014 they have gaps from two grades ago that nobody fixed. We find those gaps first.",
  heroBadge: "CBSE \u2022 Grades 1\u201312 \u2022 Maths & Science",

  painPoints: [
    "Solves textbook examples fine, but freezes on slightly different questions in the exam",
    "\u201cStudies hard\u201d but marks don\u2019t reflect the effort \u2014 especially in word problems and application questions",
    "Memorises formulas but can\u2019t decide which one to use when",
    "Gets the concept in class, forgets it two weeks later",
    "Loses marks for \u201csilly mistakes\u201d \u2014 but those mistakes keep repeating",
  ],

  howWeTeachHeading: "How We Teach CBSE",
  howWeTeachContent: (
    <>
      <p className="text-lg font-semibold text-navy mb-4">
        We don&rsquo;t start with where your child&rsquo;s class is. We start
        with where your child actually is.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        CBSE increasingly tests application and higher-order thinking &mdash;
        not just recall. The Class X Science paper is designed as 50% knowledge,
        30% application, 20% higher-order. The Maths Standard paper puts 24% on
        application and 22% on analysis/evaluation.
      </p>
      <p className="text-gray-600 leading-relaxed mb-8">
        That means your child can&rsquo;t survive on memorisation anymore. They
        need to <em>understand</em> &mdash; and understanding requires that
        every earlier concept is solid.
      </p>

      <p className="section-label mb-6">Our process</p>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 1: Diagnostic Assessment
          </h3>
          <p className="text-gray-600 leading-relaxed">
            A 45&ndash;60 minute written test &mdash; not on their current
            chapter, but on the foundations that current chapters depend on. Your
            child works independently. No hints.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">Step 2: Gap Map</h3>
          <p className="text-gray-600 leading-relaxed">
            We identify exactly which earlier concepts are weak. A Class 9
            student struggling with quadratic equations often has gaps in
            algebraic manipulation from Class 7. We find that.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 3: Foundation Repair + Current Syllabus
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We fix foundational gaps while keeping pace with the school syllabus.
            As the foundations strengthen, the current syllabus starts making
            sense &mdash; and moves faster.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Step 4: Exam-Ready Habits
          </h3>
          <p className="text-gray-600 leading-relaxed">
            CBSE rewards method marks. We teach students to write solutions the
            way the board wants to see them: Given &rarr; Formula &rarr;
            Substitution &rarr; Working &rarr; Answer with units. Every step
            earns marks.
          </p>
        </div>
      </div>
    </>
  ),

  whatMakesDifferentHeading: "What Makes Our CBSE Teaching Different",
  whatMakesDifferentContent: (
    <>
      <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          Most CBSE tutors open RD Sharma and solve problems. We open NCERT and
          ask &ldquo;do you understand why this works?&rdquo; There&rsquo;s a
          difference between getting the answer right and understanding the
          mathematics. We ensure every NCERT example is understood &mdash; the
          logic, the method, the reasoning &mdash; before moving to additional
          practice books. RD Sharma and RS Aggarwal are for practice after
          understanding, not as substitutes for it.
        </p>
      </div>

      <p className="text-lg font-semibold text-navy mb-4">
        CBSE has changed.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        The board now includes case-based questions, assertion-reason questions,
        and competency-focused items across Classes 6&ndash;10. This means:
      </p>
      <ul className="space-y-2 mb-6 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>Rote learning doesn&rsquo;t work anymore</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Students must transfer concepts to unfamiliar contexts
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            The exam tests whether you <em>understand</em> or just{" "}
            <em>memorised</em>
          </span>
        </li>
      </ul>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">
          The internal assessment counts too.
        </strong>{" "}
        Class X Maths IA is 20 marks (pen-paper test, portfolio, lab practical).
        Science IA is 20 marks (periodic assessment, practical work, portfolio).
        These aren&rsquo;t afterthoughts &mdash; they&rsquo;re real marks.
      </p>

      <p className="text-gray-600 leading-relaxed">
        <strong className="text-navy">Two Board Exams from 2026:</strong> CBSE
        now offers a second attempt in May for improvement in up to 3 subjects.
        But the first attempt is the main one &mdash; and it covers the full
        syllabus.
      </p>
    </>
  ),

  commonGaps: [
    {
      category: "Maths gaps (surface in Class 9\u201310, started earlier)",
      items: [
        "Fractions, decimals, percentages \u2014 basic operations still shaky",
        "Algebraic manipulation \u2014 factorisation, transposition, sign errors",
        "Ratio and proportion \u2014 unitary method confusion",
        "Geometry basics \u2014 angle rules, congruence reasoning, proof language",
        "Graph reading \u2014 scale, axes, plotting discipline",
      ],
    },
    {
      category: "Science gaps",
      items: [
        "Unit conversions and SI units",
        "Balancing chemical equations from scratch",
        "Reading and interpreting motion graphs",
        "Diagram accuracy \u2014 labelling, neatness, conventions",
        "\u201cDefine vs Explain\u201d \u2014 knowing a term but not being able to explain it",
      ],
    },
  ],

  diagnosticContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-4">
        The diagnostic isn&rsquo;t a test to judge your child. It&rsquo;s Day 1
        of tuition.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        Your child writes a 45&ndash;60 minute assessment aligned to their CBSE
        grade and subjects. They work independently &mdash; no hints, no help.
        This tells us how they actually think, not how they perform with support.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        After the assessment, our teacher solves every question with your child.
        This is where the teaching begins &mdash; your child sees how an expert
        approaches the same problems they just attempted.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        You receive a clear picture: here&rsquo;s what&rsquo;s solid,
        here&rsquo;s what needs work, here&rsquo;s the plan.
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
          <strong className="text-navy">Maths:</strong> Grades 1&ndash;12
          (Basic & Standard for Class 10, all streams for 11&ndash;12)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Science:</strong> Grades 6&ndash;10
          (Physics, Chemistry, Biology)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Physics:</strong> Grades 11&ndash;12
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        Small batches of 3&ndash;5 students. Online, offline, and hybrid
        options.
      </p>
    </div>
  ),

  faqs: [
    {
      question: "Do you follow NCERT?",
      answer:
        "NCERT is the foundation. We use it as the base, add supplementary problems for depth, and include CBSE sample paper practice from Grade 9 onwards. We also use CBSE\u2019s own competency-based test items for application practice.",
    },
    {
      question:
        "My child is in Class 10 \u2014 is it too late to fix gaps?",
      answer:
        "No, but honesty matters. If the gaps are from Class 7\u20138, we need to address them while keeping pace with the board syllabus. The diagnostic tells us exactly how deep the gaps go and what\u2019s realistic.",
    },
    {
      question: "Do you prepare for competitive exams like JEE/NEET?",
      answer:
        "Our focus is school-level mastery \u2014 CBSE board exams. We don\u2019t run competitive exam coaching. Strong CBSE foundations do help with future competitive prep, but we don\u2019t dilute board preparation by mixing in JEE/NEET material.",
    },
    {
      question:
        "Maths Standard or Maths Basic \u2014 which should my child take?",
      answer:
        "This depends on your child\u2019s comfort with the subject and future plans. Standard is required if they want Maths in Class 11. We can advise after the diagnostic \u2014 it gives us a clear picture of where they stand.",
    },
    {
      question: "How do you handle internal assessments and projects?",
      answer:
        "We guide students on IA work throughout the year \u2014 not as a last-minute rush. For Class 10, that includes pen-paper tests, portfolio work, and lab practicals in Science.",
    },
    {
      question: "What\u2019s your batch size?",
      answer:
        "3\u20135 students per batch. This isn\u2019t a coaching centre \u2014 every student gets individual attention in every session.",
    },
  ],
};

export default function CBSETuition() {
  return <CurriculumPageTemplate data={cbseData} />;
}
