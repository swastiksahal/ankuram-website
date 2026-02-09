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
    { name: "Class 8", href: "/class-8-tuition" },
    { name: "Class 9", href: "/class-9-tuition" },
    { name: "Class 10", href: "/class-10-tuition", highlight: "MYP 5" },
  ],
  faqHeading: "Common Questions from IB MYP Parents",
  faqs: [
    {
      question: "Do you understand how IB MYP is assessed?",
      answer:
        "Yes. MYP uses four criteria \u2014 Knowing & Understanding, Investigating Patterns, Communicating, and Applying Mathematics in Real-Life Contexts. We teach and assess using all four, not just the first.",
    },
    {
      question: "Can you help with MYP investigations and tasks?",
      answer:
        "Absolutely. We guide students through the open-ended investigation process \u2014 from choosing an approach to presenting findings in a way that meets criterion expectations.",
    },
    {
      question: "How do you prepare for the MYP 5 eAssessment?",
      answer:
        "We familiarise students with the on-screen format, practise with past papers and specimen papers, and build the quick conceptual thinking the exam rewards.",
    },
    {
      question: "My child\u2019s school uses IB but they\u2019re still struggling. Why?",
      answer:
        "IB\u2019s spiral curriculum revisits topics at increasing depth each year. If the foundation from an earlier year is weak, the current year feels impossible. Our diagnostic finds exactly where the chain broke.",
    },
  ],
};

export default function IBMYPTuition() {
  return <CurriculumPageTemplate data={ibMypData} />;
}
