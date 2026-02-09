import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 12 Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Class 12 Maths & Physics tuition in Jubilee Hills, Hyderabad. Board exam preparation, integration, electrostatics, optics. Book a diagnostic assessment.",
  alternates: {
    canonical: "/class-12-tuition",
  },
};

const class12Data: GradePageData = {
  gradeNumber: 12,
  heroTitle: "Class 12 Maths & Physics Tuition",
  heroSubtitle:
    "Board exams, university applications, competitive exams \u2014 everything converges. Class 12 performance shapes the next decade.",
  badge: "Board Year",
  topicsHeading: "What Class 12 Covers",
  topics: [
    {
      category: "Maths",
      items: [
        "Relations & functions",
        "Calculus (integration & applications)",
        "Vectors & 3D geometry",
        "Probability",
      ],
    },
    {
      category: "Physics",
      items: [
        "Electrostatics & current electricity",
        "Magnetism",
        "Optics",
        "Modern physics",
      ],
    },
  ],
  struggles: [
    {
      title: "Integration is Vast",
      description:
        "Multiple techniques, knowing which to apply when \u2014 integration alone can make or break maths scores.",
    },
    {
      title: "Modern Physics is Conceptually Dense",
      description:
        "Photoelectric effect, atoms, nuclei \u2014 these need careful conceptual building, not just formula memorization.",
    },
    {
      title: "Time is the Enemy",
      description:
        "Boards, practicals, applications, possibly competitive exams \u2014 everything happens at once.",
    },
  ],
  faqs: [
    {
      question: "Can you help with JEE/NEET preparation?",
      answer:
        "We focus on board-level mastery. For competitive exam coaching, specialized institutes are better. However, strong boards foundation helps competitive prep significantly.",
    },
    {
      question: "My child is struggling with calculus. Is it too late?",
      answer:
        "Not if we act now. Calculus can be rebuilt faster than you\u2019d think with focused, gap-targeted work.",
    },
    {
      question: "Boards are in a few months. Can you still help?",
      answer:
        "The diagnostic will tell us. If gaps are manageable, yes. If they\u2019re too deep, we\u2019ll tell you honestly rather than waste your money.",
    },
  ],
};

export default function Class12Tuition() {
  return <GradePageTemplate data={class12Data} />;
}
