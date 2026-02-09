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
      question: "Can you help with both boards and competitive exams?",
      answer:
        "We focus on board mastery. Strong board preparation helps competitive exams, but dedicated JEE/NEET coaching is a different track.",
    },
    {
      question:
        "My child is struggling with calculus. Is it too late?",
      answer:
        "Not if we act now. Calculus can be rebuilt faster than you\u2019d think with focused, gap-targeted work.",
    },
    {
      question: "What about practical exams?",
      answer:
        "We focus on theory and numericals. School practical preparation is usually sufficient.",
    },
  ],
};

export default function Class12Tuition() {
  return <GradePageTemplate data={class12Data} />;
}
