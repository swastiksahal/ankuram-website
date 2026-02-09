import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 10 Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Class 10 Maths & Physics tuition in Jubilee Hills, Hyderabad. Board exam preparation for CBSE, ICSE, IGCSE. Small batches of 3\u20135. Book a diagnostic assessment.",
  alternates: {
    canonical: "/class-10-tuition",
  },
};

const class10Data: GradePageData = {
  gradeNumber: 10,
  heroTitle: "Class 10 Maths & Physics Tuition",
  heroSubtitle:
    "Board exam year. The marks your child scores now influence stream selection, school reputation, and confidence for years to come.",
  badge: "Board Year",
  topicsHeading: "What Class 10 Covers",
  topics: [
    {
      category: "Algebra",
      items: [
        "Quadratic equations",
        "Arithmetic progressions",
      ],
    },
    {
      category: "Geometry",
      items: [
        "Circles & constructions",
        "Coordinate geometry",
      ],
    },
    {
      category: "Trigonometry",
      items: [
        "Trigonometric ratios",
        "Heights & distances",
      ],
    },
    {
      category: "Physics",
      items: [
        "Electricity & magnetism",
        "Light & human eye",
      ],
    },
  ],
  struggles: [
    {
      title: "Trigonometry Appears Suddenly",
      description:
        "Sin, cos, tan \u2014 introduced quickly and expected to be applied immediately. Many students never build intuition.",
    },
    {
      title: "Board Paper Pattern is Different",
      description:
        "School exams and board exams test differently. Application-based questions trip up students who only practiced textbook problems.",
    },
    {
      title: "Time Pressure in Exams",
      description:
        "3 hours, multiple sections, no room for getting stuck. Speed comes from clarity, not just practice.",
    },
  ],
  faqs: [
    {
      question: "My child\u2019s boards are in 3 months. Is there time?",
      answer:
        "Yes \u2014 if we\u2019re strategic. The diagnostic identifies highest-impact areas. We focus on what moves your score most, not everything equally.",
    },
    {
      question: "Do you do board exam preparation specifically?",
      answer:
        "Yes. After foundations are solid, we practice board-pattern questions, previous years, and time management.",
    },
    {
      question: "What about practicals and projects?",
      answer:
        "We focus on theory and problem-solving. For practicals, school guidance is usually sufficient.",
    },
  ],
};

export default function Class10Tuition() {
  return <GradePageTemplate data={class10Data} />;
}
