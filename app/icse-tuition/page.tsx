import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "ICSE Maths Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert ICSE Maths tuition for Classes 8\u201310 in Jubilee Hills, Hyderabad. Application-focused teaching, small batches of 3\u20135 students. Book a diagnostic assessment.",
  alternates: {
    canonical: "/icse-tuition",
  },
};

const icseData: CurriculumPageData = {
  heroTitle: "ICSE Maths Tuition",
  heroSubtitle:
    "ICSE doesn\u2019t reward memorization \u2014 it tests whether your child can actually apply what they\u2019ve learned. We teach for that depth.",
  trustBadges: [
    "13+ Years Teaching ICSE",
    "3\u20135 Students Per Batch",
    "Classes 8\u201310",
  ],
  challengeHeading: "Why ICSE Students Struggle",
  challenges: [
    {
      title: "ICSE Goes Deeper Than You Expect",
      description:
        "The syllabus demands application, not just computation. A student can know the formula and still lose marks because they can\u2019t set up the problem correctly.",
    },
    {
      title: "Step Marking Is Unforgiving",
      description:
        "ICSE examiners are strict about working. A correct answer with missing steps loses marks. Students need to show method clearly \u2014 and most aren\u2019t trained to.",
    },
    {
      title: "Commercial Maths Catches Everyone Off Guard",
      description:
        "GST, banking, shares \u2014 these topics have no parallel in earlier classes. Students struggle because there\u2019s no foundation to fall back on.",
    },
  ],
  approachHeading: "The Ankuram Approach for ICSE",
  approachSteps: [
    {
      title: "Diagnostic First",
      description:
        "We assess across ICSE topics to find where conceptual understanding broke down \u2014 often in earlier classes.",
    },
    {
      title: "Fix the Gaps",
      description:
        "Before moving to the current syllabus, we rebuild the missing foundations so new concepts actually stick.",
    },
    {
      title: "Application Mastery",
      description:
        "We train students to set up problems, not just solve them. ICSE rewards this skill above all else.",
    },
    {
      title: "Exam-Ready Precision",
      description:
        "Step-by-step presentation, time management, and paper-solving strategy \u2014 so nothing is lost to carelessness.",
    },
  ],
  subjectsHeading: "Mathematics for Classes 8\u201310",
  subjects: [
    {
      name: "Algebra & Number Systems",
      topics: [
        "Rational Numbers & Indices",
        "Algebraic Identities & Expansions",
        "Factorisation",
        "Linear & Simultaneous Equations",
        "Quadratic Equations",
        "Ratio & Proportion",
      ],
    },
    {
      name: "Commercial Maths & Applications",
      topics: [
        "Compound Interest",
        "GST & Sales Tax",
        "Banking (Recurring Deposits)",
        "Shares & Dividends",
        "Trigonometry",
        "Statistics & Probability",
      ],
    },
  ],
  gradesHeading: "ICSE Classes 8 to 10",
  grades: [
    { name: "Class 8", href: "/class-8-tuition" },
    { name: "Class 9", href: "/class-9-tuition" },
    { name: "Class 10", href: "/class-10-tuition", highlight: "Board Year" },
  ],
  faqHeading: "Common Questions from ICSE Parents",
  faqs: [
    {
      question: "ICSE syllabus is vast. How do you manage?",
      answer:
        "We prioritize understanding over coverage. When foundations are strong, students learn faster. We identify what\u2019s actually causing confusion and fix that first.",
    },
    {
      question: "My child is switching from CBSE to ICSE. Can you help?",
      answer:
        "Yes. We assess their current level and create a bridge plan. ICSE has topics and depth that CBSE doesn\u2019t cover, so we fill those gaps before moving to current content.",
    },
    {
      question: "Do you cover Physics too?",
      answer:
        "Yes. Maths and Physics for classes 8\u201310. Same foundation-first approach.",
    },
  ],
};

export default function ICSETuition() {
  return <CurriculumPageTemplate data={icseData} />;
}
