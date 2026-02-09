import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "IB MYP Maths Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert IB MYP Maths tuition in Jubilee Hills, Hyderabad. Inquiry-based learning, criterion-aligned teaching, small batches of 3\u20135 students. Book a diagnostic assessment.",
  alternates: {
    canonical: "/ib-myp-tuition",
  },
};

const ibMypData: CurriculumPageData = {
  heroTitle: "IB MYP Maths Tuition",
  heroSubtitle:
    "IB MYP doesn\u2019t just test answers \u2014 it tests thinking. We teach the mathematical reasoning that MYP actually assesses.",
  trustBadges: [
    "13+ Years Teaching IB",
    "3\u20135 Students Per Batch",
    "MYP Years 1\u20135",
  ],
  challengeHeading: "Why IB MYP Students Struggle",
  challenges: [
    {
      title: "Four Criteria, Not Just Answers",
      description:
        "MYP assesses Knowing, Investigating, Communicating, and Applying. Most students only practise the first. The other three require a completely different skill set.",
    },
    {
      title: "Investigations Are Open-Ended",
      description:
        "There\u2019s no single right answer in an MYP investigation. Students trained on textbook problems freeze when they have to design their own approach.",
    },
    {
      title: "Gaps Hide Behind the Inquiry Model",
      description:
        "IB\u2019s spiral curriculum revisits topics at increasing depth. If a student missed the foundation in Year 1, the Year 4 version becomes impossible \u2014 and it\u2019s not obvious why.",
    },
  ],
  approachHeading: "The Ankuram Approach for IB MYP",
  approachSteps: [
    {
      title: "Diagnostic First",
      description:
        "We assess across MYP strands to find where conceptual understanding broke down \u2014 not just what the student can\u2019t do, but why.",
    },
    {
      title: "Fix the Gaps",
      description:
        "Before touching current units, we rebuild the missing foundations so the spiral curriculum starts making sense again.",
    },
    {
      title: "Criterion Mastery",
      description:
        "We train students in all four criteria \u2014 especially Investigating and Communicating, where most marks are lost.",
    },
    {
      title: "eAssessment Ready",
      description:
        "For MYP 5, we prepare for the on-screen exam format with its unique question types and time pressure.",
    },
  ],
  subjectsHeading: "Mathematics Across MYP Years",
  subjects: [
    {
      name: "MYP 1\u20133 (Grades 6\u20138)",
      topics: [
        "Number Systems & Operations",
        "Algebraic Thinking & Patterns",
        "Geometry Fundamentals",
        "Data Handling & Statistics",
        "Ratio, Proportion & Percentages",
      ],
    },
    {
      name: "MYP 4\u20135 (Grades 9\u201310)",
      topics: [
        "Linear & Quadratic Functions",
        "Systems of Equations",
        "Trigonometry",
        "Probability",
        "eAssessment Preparation",
      ],
    },
  ],
  gradesHeading: "IB MYP Grades We Teach",
  grades: [
    { name: "Grade 6", href: "/ib-myp-tuition", highlight: "MYP 1" },
    { name: "Grade 7", href: "/ib-myp-tuition", highlight: "MYP 2" },
    { name: "Grade 8", href: "/class-8-tuition", highlight: "MYP 3" },
    { name: "Grade 9", href: "/class-9-tuition", highlight: "MYP 4" },
    { name: "Grade 10", href: "/class-10-tuition", highlight: "MYP 5" },
  ],
  faqHeading: "Common Questions from IB MYP Parents",
  faqs: [
    {
      question: "Do you understand criterion-based assessment?",
      answer:
        "We\u2019ve been teaching IB MYP since 2017. We train students across all four criteria \u2014 especially Investigating and Communicating, where most marks are lost.",
    },
    {
      question: "Can you help with the eAssessment?",
      answer:
        "Yes. For MYP 5, we specifically prepare for the on-screen exam format with its unique question types and time pressure.",
    },
    {
      question: "My child\u2019s school doesn\u2019t teach properly. Can you cover the full syllabus?",
      answer:
        "Absolutely. Many IB students come to us because school teaching is inconsistent. We ensure conceptual clarity across all MYP strands.",
    },
  ],
};

export default function IBMYPTuition() {
  return <CurriculumPageTemplate data={ibMypData} />;
}
