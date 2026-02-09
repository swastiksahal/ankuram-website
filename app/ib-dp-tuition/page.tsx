import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "IB DP Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert IB DP Maths tuition in Jubilee Hills, Hyderabad. Analysis & Approaches, Applications & Interpretation. SL & HL, IA guidance. Book a diagnostic assessment.",
  alternates: {
    canonical: "/ib-dp-tuition",
  },
};

const ibDpData: CurriculumPageData = {
  heroTitle: "IB DP Maths & Physics Tuition",
  heroSubtitle:
    "AA or AI, SL or HL \u2014 each pathway demands a different kind of mathematical thinking. We teach the nuance that IB exams actually test.",
  trustBadges: [
    "13+ Years Teaching IB",
    "3\u20135 Students Per Batch",
    "Classes 11\u201312",
  ],
  challengeHeading: "Why IB DP Students Struggle",
  challenges: [
    {
      title: "The Jump from MYP Is Brutal",
      description:
        "IB DP Maths is a different league from MYP. Students who coasted through MYP 5 hit a wall in DP Year 1 \u2014 especially in calculus and proof-based topics.",
    },
    {
      title: "AA and AI Need Different Brains",
      description:
        "Analysis & Approaches is abstract and proof-heavy. Applications & Interpretation is modelling-heavy. Studying one like the other guarantees frustration.",
    },
    {
      title: "The IA Is 20% and Poorly Understood",
      description:
        "The Internal Assessment requires original mathematical exploration. Most students don\u2019t know what \u2018personal engagement\u2019 means in criterion terms \u2014 and lose marks they could easily earn.",
    },
  ],
  approachHeading: "The Ankuram Approach for IB DP",
  approachSteps: [
    {
      title: "Diagnostic First",
      description:
        "We assess MYP-level foundations alongside current DP content to find where understanding broke down.",
    },
    {
      title: "Fix the Gaps",
      description:
        "DP calculus requires solid algebra and functions. If those aren\u2019t airtight, we fix them before moving forward.",
    },
    {
      title: "Pathway-Specific Teaching",
      description:
        "AA and AI are taught differently \u2014 because they test differently. We match our approach to your child\u2019s pathway.",
    },
    {
      title: "IA & Exam Mastery",
      description:
        "Criterion-aligned IA guidance from topic selection to final draft, plus Paper 1, 2, and 3 (HL) exam strategy.",
    },
  ],
  subjectsHeading: "Maths & Physics for IB DP",
  subjects: [
    {
      name: "Analysis & Approaches (AA)",
      topics: [
        "Algebra & Functions",
        "Sequences & Series",
        "Trigonometry",
        "Calculus (Differential & Integral)",
        "Vectors (HL)",
        "Internal Assessment Guidance",
      ],
    },
    {
      name: "Applications & Interpretation (AI)",
      topics: [
        "Statistics & Probability",
        "Functions & Modelling",
        "Geometry & Trigonometry",
        "Voronoi Diagrams",
        "Calculus Applications",
        "Internal Assessment Guidance",
      ],
    },
  ],
  gradesHeading: "IB DP Grades We Teach",
  grades: [
    { name: "Class 11", href: "/class-11-tuition", highlight: "DP Year 1" },
    { name: "Class 12", href: "/class-12-tuition", highlight: "DP Year 2" },
  ],
  faqHeading: "Common Questions from IB DP Parents",
  faqs: [
    {
      question: "AA or AI \u2014 which is right for my child?",
      answer:
        "AA (Analysis & Approaches) is for students strong in algebra heading toward STEM. AI (Applications & Interpretation) suits those going into business/social sciences. We teach both and can advise based on your child\u2019s goals.",
    },
    {
      question: "Can you help with IA (Internal Assessment)?",
      answer:
        "Yes. We guide topic selection, methodology, and ensure mathematical rigor \u2014 without doing the work for them.",
    },
    {
      question: "Do you teach IB Physics as well?",
      answer:
        "Yes. Our teacher has an MSc in Physics, so IB Physics is taught with real understanding \u2014 not just exam technique. This is especially helpful for students taking both Maths AA and Physics.",
    },
  ],
};

export default function IBDPTuition() {
  return <CurriculumPageTemplate data={ibDpData} />;
}
