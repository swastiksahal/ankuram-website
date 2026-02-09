import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 9 Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Class 9 Maths & Physics tuition in Jubilee Hills, Hyderabad. Polynomials, coordinate geometry, motion. CBSE, ICSE, IB, IGCSE. Book a diagnostic assessment.",
  alternates: {
    canonical: "/class-9-tuition",
  },
};

const class9Data: GradePageData = {
  gradeNumber: 9,
  heroTitle: "Class 9 Maths & Physics Tuition",
  heroSubtitle:
    "Class 9 introduces concepts that directly appear in board exams. What\u2019s learned this year becomes the foundation for Class 10.",
  topicsHeading: "What Class 9 Covers",
  topics: [
    {
      category: "Algebra",
      items: [
        "Polynomials",
        "Linear equations in two variables",
      ],
    },
    {
      category: "Geometry",
      items: [
        "Triangles",
        "Circles",
        "Coordinate geometry basics",
      ],
    },
    {
      category: "Physics",
      items: [
        "Motion",
        "Force & laws of motion",
        "Work, energy & gravitation",
      ],
    },
  ],
  struggles: [
    {
      title: "Coordinate Geometry is New",
      description:
        "Plotting points, finding distances, understanding slopes \u2014 this is completely new territory that needs careful introduction.",
    },
    {
      title: "Physics Gets Mathematical",
      description:
        "Equations of motion, numerical problems \u2014 physics stops being \u2018conceptual\u2019 and starts requiring calculation skills.",
    },
    {
      title: "The Pace Increases",
      description:
        "Schools move faster. One week of confusion can snowball into a month of catching up.",
    },
  ],
  faqs: [
    {
      question: "How important is Class 9 for boards?",
      answer:
        "Extremely. About 40% of Class 10 board content builds directly on Class 9 concepts. Weak Class 9 = struggling Class 10.",
    },
    {
      question:
        "My child did well in Class 8 but is struggling now. Why?",
      answer:
        "Class 9 is a significant jump in abstraction and pace. It\u2019s common \u2014 and fixable with the right support.",
    },
  ],
};

export default function Class9Tuition() {
  return <GradePageTemplate data={class9Data} />;
}
