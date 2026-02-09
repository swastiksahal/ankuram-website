import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "CBSE Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert CBSE tuition for Classes 8-12 in Jubilee Hills, Hyderabad. Diagnostic-first approach, small batches of 3-5 students. Book a diagnostic assessment.",
  alternates: {
    canonical: "/cbse-tuition",
  },
};

const cbseData: CurriculumPageData = {
  heroTitle: "CBSE Maths & Physics Tuition",
  heroSubtitle:
    "Board exams reward understanding, not memorization. We build the foundations that make Class 10 and 12 boards feel manageable.",
  trustBadges: [
    "13+ Years Teaching CBSE",
    "3\u20135 Students Per Batch",
    "Classes 8\u201312",
  ],
  challengeHeading: "Why CBSE Students Struggle",
  challenges: [
    {
      title: "NCERT Builds on Itself",
      description:
        "Chapter 7 assumes Chapter 3 is clear. If it isn\u2019t, you\u2019re memorizing formulas instead of understanding them. By board exams, the gaps compound.",
    },
    {
      title: "School Pace vs. Your Child\u2019s Pace",
      description:
        "Teachers must complete the syllabus. If your child needs an extra day on quadratic equations, they don\u2019t get it. The class moves on.",
    },
    {
      title: "Practice Papers Aren\u2019t Enough",
      description:
        "Solving 10-year papers helps \u2014 but only if the concepts are solid. Otherwise, you\u2019re just memorizing solution patterns.",
    },
  ],
  approachHeading: "The Ankuram Approach for CBSE",
  approachSteps: [
    {
      title: "Diagnostic First",
      description:
        "We test across NCERT chapters to find exactly where understanding broke down.",
    },
    {
      title: "Fix the Gaps",
      description:
        "Before touching current syllabus, we rebuild the missing foundations.",
    },
    {
      title: "NCERT Mastery",
      description:
        "Every concept from NCERT \u2014 understood deeply, not memorized.",
    },
    {
      title: "Board-Ready Confidence",
      description:
        "By the time boards arrive, your child isn\u2019t cramming. They know the material.",
    },
  ],
  subjectsHeading: "Maths & Physics for Classes 8\u201312",
  subjects: [
    {
      name: "Mathematics",
      topics: [
        "Real Numbers & Number Systems",
        "Algebra (Linear Equations to Quadratics)",
        "Coordinate Geometry",
        "Trigonometry",
        "Statistics & Probability",
        "Calculus (Class 11\u201312)",
      ],
    },
    {
      name: "Physics",
      topics: [
        "Motion & Laws of Motion",
        "Work, Energy & Power",
        "Electricity & Magnetism",
        "Optics",
        "Modern Physics (Class 12)",
      ],
    },
  ],
  gradesHeading: "CBSE Classes 8 to 12",
  grades: [
    { name: "Class 8", href: "/class-8-tuition" },
    { name: "Class 9", href: "/class-9-tuition" },
    { name: "Class 10", href: "/class-10-tuition", highlight: "Board Year" },
    { name: "Class 11", href: "/class-11-tuition" },
    { name: "Class 12", href: "/class-12-tuition", highlight: "Board Year" },
  ],
  faqHeading: "Common Questions from CBSE Parents",
  faqs: [
    {
      question:
        "My child is in Class 10. Is there time to fix gaps before boards?",
      answer:
        "Yes \u2014 if we start now. The diagnostic identifies exactly what needs fixing, and we prioritize ruthlessly. Many students see significant improvement in 2\u20133 months.",
    },
    {
      question: "Do you follow NCERT exactly?",
      answer:
        "Yes, we follow NCERT completely because CBSE boards are based on it. We supplement with additional problems for deeper understanding, but NCERT mastery is the foundation.",
    },
    {
      question: "How big are the batches?",
      answer:
        "Maximum 3\u20135 students per batch. This ensures every student gets individual attention, can ask questions freely, and receives real-time correction.",
    },
    {
      question: "Do you teach Physics as well?",
      answer:
        "Yes. We teach both Maths and Physics for Classes 11\u201312. Our teacher has an MSc in Physics, so the subject is taught with real depth and understanding.",
    },
  ],
};

export default function CBSETuition() {
  return <CurriculumPageTemplate data={cbseData} />;
}
