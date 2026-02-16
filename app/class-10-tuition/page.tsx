import { Metadata } from "next";
import GradePageTemplate from "@/components/GradePageTemplate";
import type { GradePageData } from "@/components/GradePageTemplate";

export const metadata: Metadata = {
  title: "Class 10 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
  description:
    "Class 10 board exam preparation in Jubilee Hills. CBSE, ICSE, IGCSE, IB MYP. Foundation-first approach for 90+ scores. Call +91 7396669430",
  alternates: {
    canonical: "https://ankuramtuition.in/class-10-tuition",
  },
  openGraph: {
    title: "Class 10 Tuition Near Me in Jubilee Hills, Hyderabad | Ankuram",
    description:
      "Class 10 board exam preparation in Jubilee Hills. CBSE, ICSE, IGCSE, IB MYP. Foundation-first approach for 90+ scores. Call +91 7396669430",
    url: "https://ankuramtuition.in/class-10-tuition",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const class10Data: GradePageData = {
  gradeNumber: 10,
  heroTitle: "Class 10 Tuition in Jubilee Hills, Hyderabad",
  heroSubtitle:
    "Board exam year. The difference between scoring 70% and 95% is almost always foundation \u2014 not effort.",
  badge: "Board Year",

  whyItMatters: (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">
        Class 10 is the first high-stakes exam of your child&rsquo;s life. CBSE
        boards, ICSE boards, IGCSE finals, IB MYP eAssessment &mdash; the
        pressure is real. But here&rsquo;s what most parents don&rsquo;t
        realise: a student&rsquo;s Class 10 performance was largely decided in
        Classes 8 and 9.
      </p>
      <p className="text-gray-600 leading-relaxed">
        If your child understood algebra, geometry, and trigonometry foundations
        properly in Class 9, Class 10 board prep is straightforward. If they
        didn&rsquo;t &mdash; if they memorised formulas without understanding,
        if they copied solutions without thinking &mdash; then Class 10 becomes
        a scramble.
      </p>
      <p className="text-gray-600 leading-relaxed">
        At Ankuram, we&rsquo;ve seen both scenarios hundreds of times. The
        students who come to us early (Class 8-9) consistently outperform those
        who come in panic mode in Class 10. But even if your child is already in
        Class 10, the diagnostic assessment tells us exactly what&rsquo;s
        fixable in the time available.
      </p>
    </div>
  ),

  howWeTeach: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          For Students Who&rsquo;ve Been With Us Since Class 8-9
        </h3>
        <p className="text-gray-600 leading-relaxed">
          The heavy lifting is done. Foundations are solid. Class 10 is about
          applying what they already know to board-level problems. We focus on
          exam technique &mdash; time management, paper presentation, marking
          scheme awareness, and practice with previous year papers. These
          students typically score 90+ because they actually understand what
          they&rsquo;re writing.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          For Students Joining in Class 10
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          We start with an honest diagnostic. We assess Class 8-9 foundations
          because that&rsquo;s where most Class 10 struggles originate. Based on
          the diagnostic, we create a plan:
        </p>
        <ul className="space-y-1 text-gray-600 ml-4">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5">&bull;</span>
            <span>
              If gaps are manageable (2-3 months of foundation work needed), we
              build a parallel track &mdash; fixing gaps while keeping pace with
              the school syllabus.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5">&bull;</span>
            <span>
              If gaps are deep, we have an honest conversation about realistic
              targets and focus on maximising improvement within the available
              time.
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          CBSE Board Preparation
        </h3>
        <p className="text-gray-600 leading-relaxed">
          NCERT is the bible. We ensure every NCERT example and exercise is
          understood, not just solved. Then we move to sample papers, previous
          years, and additional practice. We pay special attention to HOTS
          questions and case study-based questions that have become common in
          recent CBSE papers.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">
          ICSE Board Preparation
        </h3>
        <p className="text-gray-600 leading-relaxed">
          ICSE rewards method and presentation. We train students to write
          step-by-step solutions the way examiners want to see them. Special
          focus on commercial maths (a unique ICSE challenge), and
          application-level geometry problems.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">IGCSE Preparation</h3>
        <p className="text-gray-600 leading-relaxed">
          Cambridge marks every step. A correct answer with wrong working gets
          zero. We train students in the exact format Cambridge rewards. Core vs
          Extended preparation based on your child&rsquo;s target grade.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-navy mb-2">IB MYP eAssessment</h3>
        <p className="text-gray-600 leading-relaxed">
          Criterion-based preparation across Knowing (A), Investigating (B),
          Communicating (C), and Applying (D). We ensure students can handle the
          on-screen examination format.
        </p>
      </div>
    </div>
  ),

  subjects: ["Mathematics (all curricula)", "Physics (all curricula)"],

  faqs: [
    {
      question: "Boards are in 4 months. Can you still help?",
      answer:
        "Honestly \u2014 it depends on how deep the gaps are. The diagnostic takes 60 minutes and tells us exactly. If gaps are targeted (specific topics), 4 months of focused work can improve scores significantly. If gaps are foundational (from Class 7\u20138), we\u2019ll tell you what\u2019s realistically achievable.",
    },
    {
      question:
        "My child needs 95+ for their desired stream. Is that possible?",
      answer:
        "95+ requires near-perfect conceptual understanding across all topics. The diagnostic shows us exactly how far your child is from that level and what needs to happen to get there. We won\u2019t promise numbers \u2014 we\u2019ll show you the gap and the plan.",
    },
    {
      question:
        "Should I also enroll for coaching classes alongside your tuition?",
      answer:
        "Large coaching classes and our approach serve different purposes. Coaching gives you practice volume. We give you conceptual clarity. Many of our students attend coaching AND come to us \u2014 because coaching assumes understanding, while we build it.",
    },
  ],
};

export default function Class10Tuition() {
  return <GradePageTemplate data={class10Data} />;
}
