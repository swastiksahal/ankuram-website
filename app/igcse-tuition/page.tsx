import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "IGCSE Maths Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert Cambridge IGCSE Maths tuition in Jubilee Hills, Hyderabad. Core & Extended curriculum, past paper mastery, small batches of 3\u20135 students. Book a diagnostic assessment.",
  alternates: {
    canonical: "/igcse-tuition",
  },
};

const igcseData: CurriculumPageData = {
  heroTitle: "IGCSE Maths Tuition",
  heroSubtitle:
    "Cambridge IGCSE rewards precision and problem-solving. We build the skills that turn tricky exam questions into straightforward ones.",
  trustBadges: [
    "13+ Years Teaching IGCSE",
    "3\u20135 Students Per Batch",
    "Classes 9\u201310",
  ],
  challengeHeading: "Why IGCSE Students Struggle",
  challenges: [
    {
      title: "Core vs. Extended Is a Big Decision",
      description:
        "Core caps at grade C. Extended is required for an A or A*. Choosing wrong \u2014 or being unprepared for Extended \u2014 limits outcomes before the exam even starts.",
    },
    {
      title: "Cambridge Marking Is Specific",
      description:
        "The mark scheme rewards exact methods. A correct answer with the wrong working can score zero. Students need to know what Cambridge expects, not just how to solve the problem.",
    },
    {
      title: "Problem-Solving, Not Just Computation",
      description:
        "IGCSE Extended papers test multi-step reasoning and unfamiliar problem formats. Students who only practise routine questions hit a wall on the actual exam.",
    },
  ],
  approachHeading: "The Ankuram Approach for IGCSE",
  approachSteps: [
    {
      title: "Diagnostic First",
      description:
        "We assess across IGCSE topics to find exactly where understanding breaks \u2014 and whether Core or Extended is the right path.",
    },
    {
      title: "Fix the Gaps",
      description:
        "Weak algebra or number skills from earlier years make IGCSE feel harder than it is. We fix the root before tackling the syllabus.",
    },
    {
      title: "Mark Scheme Mastery",
      description:
        "We teach students to present answers the way Cambridge wants to see them \u2014 maximising marks on every question.",
    },
    {
      title: "Past Paper Confidence",
      description:
        "Timed past paper practice with detailed feedback, grade boundary tracking, and targeted work on weak topics.",
    },
  ],
  subjectsHeading: "Mathematics for IGCSE",
  subjects: [
    {
      name: "Core Syllabus",
      topics: [
        "Number & Arithmetic",
        "Algebra & Graphs",
        "Geometry & Mensuration",
        "Statistics & Probability",
        "Coordinate Geometry",
      ],
    },
    {
      name: "Extended Syllabus (Additional)",
      topics: [
        "Sets & Functions",
        "Advanced Algebra",
        "Vectors & Transformations",
        "Trigonometry & Bearings",
        "Introductory Calculus",
      ],
    },
  ],
  gradesHeading: "IGCSE Grades We Teach",
  grades: [
    { name: "Class 9", href: "/class-9-tuition" },
    { name: "Class 10", href: "/class-10-tuition", highlight: "Exam Year" },
  ],
  faqHeading: "Common Questions from IGCSE Parents",
  faqs: [
    {
      question: "Should my child take Core or Extended?",
      answer:
        "Extended is required for grades A*\u2013A and is necessary if your child plans to take A-Level Maths. Core has a ceiling of grade C. We assess and advise based on current ability and goals.",
    },
    {
      question: "How do you prepare for Cambridge exams?",
      answer:
        "Extensive past paper practice, mark scheme analysis, and timed conditions. We teach students exactly how Cambridge allocates marks so nothing is left to chance.",
    },
    {
      question: "Is IGCSE harder than CBSE?",
      answer:
        "IGCSE Extended is more challenging, particularly in problem-solving and multi-step reasoning. Core is roughly comparable. The real difference is in how answers must be presented.",
    },
    {
      question: "Can you help improve predicted grades?",
      answer:
        "Yes. We diagnose exactly where marks are being lost, target those areas specifically, and track progress against grade boundaries. Many students improve by one or two grades.",
    },
  ],
};

export default function IGCSETuition() {
  return <CurriculumPageTemplate data={igcseData} />;
}
