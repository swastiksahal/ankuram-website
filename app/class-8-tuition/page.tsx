import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 8 Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Class 8 Maths & Physics tuition in Jubilee Hills, Hyderabad. Build strong algebra and science foundations. CBSE, ICSE, IB, IGCSE. Book a diagnostic assessment.",
  alternates: {
    canonical: "/class-8-tuition",
  },
};

const class8Data: GradePageData = {
  gradeNumber: 8,
  heroTitle: "Class 8 Maths & Physics Tuition",
  heroSubtitle:
    "Class 8 is where algebra, geometry, and physics foundations are built. Gaps here echo through Class 10 boards and beyond.",
  topicsHeading: "What Class 8 Covers",
  topics: [
    {
      category: "Algebra",
      items: [
        "Linear equations",
        "Factorization",
        "Algebraic identities",
      ],
    },
    {
      category: "Geometry",
      items: [
        "Quadrilaterals",
        "Practical geometry",
        "Mensuration",
      ],
    },
    {
      category: "Physics",
      items: [
        "Force, pressure, friction",
        "Sound",
        "Light basics",
      ],
    },
  ],
  struggles: [
    {
      title: "Algebra Feels Abstract",
      description:
        "Variables replacing numbers is a big mental shift. Without proper bridging, students memorize steps without understanding.",
    },
    {
      title: "Geometry Proofs Begin",
      description:
        "Class 8 introduces logical reasoning in geometry. Many students aren\u2019t taught HOW to think through proofs.",
    },
    {
      title: "Physics Concepts vs. Formulas",
      description:
        "Memorizing F=ma is easy. Understanding what force actually means? That\u2019s where most teaching fails.",
    },
  ],
  faqs: [
    {
      question: "Is Class 8 too early for tuition?",
      answer:
        "Class 8 is actually the ideal time. Foundations built now prevent struggles in Class 9\u201310. Fixing gaps later takes 3x longer.",
    },
    {
      question: "Which curricula do you cover for Class 8?",
      answer:
        "CBSE, ICSE, IB MYP, and IGCSE. The diagnostic identifies gaps regardless of which board your child follows.",
    },
  ],
};

export default function Class8Tuition() {
  return <GradePageTemplate data={class8Data} />;
}
