import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 11 Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Class 11 Maths & Physics tuition in Jubilee Hills, Hyderabad. Calculus, trigonometry, mechanics. CBSE, ISC, IB, A-Levels. Book a diagnostic assessment.",
  alternates: {
    canonical: "/class-11-tuition",
  },
};

const class11Data: GradePageData = {
  gradeNumber: 11,
  heroTitle: "Class 11 Maths & Physics Tuition",
  heroSubtitle:
    "The biggest academic jump your child will face. Class 11 content is the foundation for Class 12 boards, competitive exams, and university.",
  topicsHeading: "What Class 11 Covers",
  topics: [
    {
      category: "Maths",
      items: [
        "Sets, relations & functions",
        "Trigonometry",
        "Calculus introduction",
        "Coordinate geometry",
        "Statistics",
      ],
    },
    {
      category: "Physics",
      items: [
        "Units & motion",
        "Laws of motion",
        "Work, energy & power",
        "Rotational motion",
        "Gravitation & thermodynamics",
      ],
    },
  ],
  struggles: [
    {
      title: "The Jump is Brutal",
      description:
        "Class 11 is harder than Class 10 by a massive margin. Students who coasted before suddenly struggle.",
    },
    {
      title: "Calculus is Completely New",
      description:
        "Limits, derivatives, continuity \u2014 these concepts need time and proper introduction. Schools often rush.",
    },
    {
      title: "Physics Becomes Calculus-Based",
      description:
        "Integration and differentiation appear in physics. If maths is shaky, physics becomes impossible.",
    },
  ],
  faqs: [
    {
      question: "Why do so many students struggle in Class 11?",
      answer:
        "The difficulty jump is 3\u20134x, but study habits don\u2019t change. Add new concepts like calculus, and it\u2019s overwhelming without support.",
    },
    {
      question:
        "Should I worry if my child\u2019s Class 11 marks drop?",
      answer:
        "A drop is common and not permanent \u2014 if addressed. Ignoring it leads to Class 12 disaster. Early intervention is key.",
    },
    {
      question: "Do you cover JEE/NEET preparation?",
      answer:
        "Our focus is board curriculum mastery. Strong boards create the foundation for competitive exams, but we don\u2019t do dedicated JEE/NEET coaching.",
    },
  ],
};

export default function Class11Tuition() {
  return <GradePageTemplate data={class11Data} />;
}
