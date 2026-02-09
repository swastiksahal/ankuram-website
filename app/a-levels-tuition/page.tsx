import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "A-Level Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Cambridge A-Level Maths & Physics tuition in Jubilee Hills, Hyderabad. Pure Mathematics, Mechanics, Statistics. Small batches of 3\u20135. Book a diagnostic assessment.",
  alternates: {
    canonical: "/a-levels-tuition",
  },
};

const aLevelsData: CurriculumPageData = {
  heroTitle: "A-Level Maths & Physics Tuition",
  heroSubtitle:
    "A-Levels demand mathematical maturity, not just effort. We build the rigour and depth that Cambridge papers actually test.",
  trustBadges: [
    "13+ Years Teaching A-Levels",
    "3\u20135 Students Per Batch",
    "AS & A2 (Classes 11\u201312)",
  ],
  challengeHeading: "Why A-Level Students Struggle",
  challenges: [
    {
      title: "The IGCSE\u2013to\u2013A-Level Jump Is Huge",
      description:
        "A-Level Maths is a fundamentally different subject from IGCSE. The abstract thinking, proof techniques, and calculus depth catch almost everyone off guard in the first term.",
    },
    {
      title: "Three Papers, Three Skill Sets",
      description:
        "Pure Maths, Mechanics, and Statistics require different kinds of thinking. Students who prepare for one style often underperform on the others.",
    },
    {
      title: "Mechanics Needs Physics Intuition",
      description:
        "Forces, motion, and energy aren\u2019t just maths problems \u2014 they need physical understanding. Students without a physics background struggle to set up mechanics questions correctly.",
    },
  ],
  approachHeading: "The Ankuram Approach for A-Levels",
  approachSteps: [
    {
      title: "Diagnostic First",
      description:
        "We assess IGCSE-level foundations alongside current A-Level content to find where understanding broke down.",
    },
    {
      title: "Fix the Gaps",
      description:
        "A-Level calculus requires flawless algebra. If IGCSE foundations have cracks, we fix them before the weight of A-Level content makes them worse.",
    },
    {
      title: "Component Mastery",
      description:
        "Pure, Mechanics, and Statistics each get dedicated attention \u2014 because each requires a different approach and mindset.",
    },
    {
      title: "Exam Strategy",
      description:
        "Cambridge past paper practice, mark scheme analysis, and time management for AS and A2 papers.",
    },
  ],
  subjectsHeading: "Maths & Physics for A-Levels",
  subjects: [
    {
      name: "Mathematics",
      topics: [
        "Pure Maths (Algebra, Calculus, Vectors)",
        "Mechanics (Forces, Kinematics, Energy)",
        "Statistics (Distributions, Hypothesis Testing)",
        "Further Maths support (select modules)",
      ],
    },
    {
      name: "Physics",
      topics: [
        "Mechanics & Materials",
        "Waves & Electricity",
        "Fields & Nuclear Physics",
        "Practical Skills & Paper 5",
      ],
    },
  ],
  gradesHeading: "A-Level Grades We Teach",
  grades: [
    { name: "Class 11", href: "/class-11-tuition", highlight: "AS Level" },
    { name: "Class 12", href: "/class-12-tuition", highlight: "A2 Level" },
  ],
  faqHeading: "Common Questions from A-Level Parents",
  faqs: [
    {
      question: "Is A-Level Maths necessary for engineering?",
      answer:
        "Essential. Top universities require it for all STEM courses. Further Maths strengthens applications significantly, especially for Oxbridge and top-tier universities.",
    },
    {
      question: "How difficult is the jump from IGCSE to A-Level?",
      answer:
        "Substantial. A-Level introduces abstract reasoning, formal proofs, and calculus depth that IGCSE doesn\u2019t touch. Students who scored A* at IGCSE can still struggle without the right preparation.",
    },
    {
      question: "Do you teach both AS and A2?",
      answer:
        "Yes. We teach AS (Year 12) and A2 (Year 13), building properly from foundations. Many students join us in A2 after struggling in AS \u2014 we go back and fix AS gaps first.",
    },
    {
      question: "Can your physics background help with Mechanics?",
      answer:
        "Absolutely. Our teacher has an MSc in Physics, which means Mechanics is taught with real physical intuition \u2014 not just memorised formulae. This makes a significant difference in how students approach problems.",
    },
  ],
};

export default function ALevelsTuition() {
  return <CurriculumPageTemplate data={aLevelsData} />;
}
