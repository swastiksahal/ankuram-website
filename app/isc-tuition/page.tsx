import { Metadata } from "next";
import CurriculumPageTemplate from "@/components/CurriculumPageTemplate";
import type { CurriculumPageData } from "@/components/CurriculumPageTemplate";

export const metadata: Metadata = {
  title: "ISC Maths & Physics Tuition in Jubilee Hills | Ankuram",
  description:
    "Expert ISC Maths & Physics tuition for Grades 11\u201312 in Jubilee Hills, Hyderabad. Derivations, proofs, project work guidance, small batches of 3\u20135. Book a diagnostic assessment.",
  alternates: {
    canonical: "/isc-tuition",
  },
};

const iscData: CurriculumPageData = {
  curriculumName: "ISC",
  heroTitle: "ISC Maths & Physics Tuition in Jubilee Hills",
  heroSubtitle:
    "ISC isn\u2019t ICSE with harder questions. It\u2019s a different kind of thinking \u2014 derivations, proofs, structured reasoning, and real application. The jump catches most students off guard.",
  heroBadge: "ISC \u2022 Grades 11\u201312 \u2022 Maths & Physics",

  painPoints: [
    "Scored well in ICSE Class 10 but is suddenly struggling in Class 11",
    "Can follow the teacher\u2019s explanation in class but can\u2019t reproduce the solution independently",
    "Gets lost in multi-step problems \u2014 doesn\u2019t know where to start",
    "Algebra keeps breaking under pressure \u2014 sign errors, wrong factorisation, incomplete manipulation",
    "Treats projects and practicals as \u201cextra work\u201d rather than marks that count",
  ],

  howWeTeachHeading: "How We Teach ISC",
  howWeTeachContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-8">
        The jump from ICSE to ISC is the biggest academic transition most
        students face. The depth increases sharply, the abstraction level rises,
        and suddenly &ldquo;understanding the concept&rdquo; isn&rsquo;t enough
        &mdash; you need to derive it, prove it, apply it, and communicate it
        clearly.
      </p>

      <p className="section-label mb-6">What we do differently</p>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Bridge Module (First 2&ndash;3 Weeks of Class 11)
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Before the syllabus begins, we run a diagnostic and patch the gaps
            that will cause problems later:
          </p>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Algebraic fluency: identities, factorisation, inequalities,
                logarithms
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Function language: domain, range, composition, inverse
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>Trigonometry: standard values, transformations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Graph sense: slope and area interpretation (critical for Physics)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1.5">&bull;</span>
              <span>
                Vectors and components (must be automatic before mechanics
                begins)
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Teach From the Paper Backwards
          </h3>
          <p className="text-gray-600 leading-relaxed">
            ISC Maths Theory is 80 marks: Calculus alone carries 32 marks.
            That&rsquo;s 40% of the paper. We put Calculus on a long runway
            &mdash; frequent practice, spaced revision, constant mixed sets. We
            plan teaching time by unit weightage, not by chapter order.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Dual-Skill Building: Concept + Board Communication
          </h3>
          <p className="text-gray-600 leading-relaxed mb-3">
            Every chapter produces two outputs:
          </p>
          <ol className="space-y-1 text-gray-600 ml-4 list-decimal list-inside">
            <li>
              A concept map with 10&ndash;15 problems of increasing difficulty
            </li>
            <li>
              3&ndash;5 exam-format answers where students practise structured
              writing &mdash; clean steps, correct notation, proper diagrams,
              final statements
            </li>
          </ol>
          <p className="text-gray-600 leading-relaxed mt-3">
            ISC papers distribute marks across method and communication. We
            train both.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-navy mb-2">
            Projects & Practicals Are Non-Negotiable
          </h3>
          <p className="text-gray-600 leading-relaxed">
            ISC Maths has 20 marks of project work (2 projects, evaluated by
            your teacher AND a visiting examiner, including a viva). ISC Physics
            has 30 marks of practical + project + file. These are real marks
            &mdash; often the difference between one grade and the next. We plan
            these from Month 1.
          </p>
        </div>
      </div>
    </>
  ),

  whatMakesDifferentHeading: "What Makes Our ISC Teaching Different",
  whatMakesDifferentContent: (
    <>
      <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl mb-8">
        <p className="text-gray-700 leading-relaxed">
          ICSE examiners reward method, not just answers. We train students to
          write solutions the way examiners want to see them &mdash; clear
          steps, proper working, no skipped lines. ISC takes this further with
          derivations, proofs, and project work that carry real marks. We
          prepare students for the full scope &mdash; theory, practicals, and
          projects.
        </p>
      </div>

      <p className="text-gray-600 leading-relaxed mb-3">
        <strong className="text-navy">
          ISC vs CBSE (what parents should know):
        </strong>
      </p>
      <ul className="space-y-2 mb-6 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            ISC Maths has Section A (compulsory) + choice of Section B or C.
            CBSE has 5 sections with no overall choice.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            ISC Physics allows a scientific calculator. CBSE does not.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            ISC tends to reward well-written, structured reasoning &mdash;
            derivations with clear steps. CBSE increasingly uses case-study and
            assertion-reason formats.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent mt-1.5">&bull;</span>
          <span>
            Both are valid for Indian university admissions and are widely
            recognised internationally (CISCE has published UCAS recognition
            guidance).
          </span>
        </li>
      </ul>

      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">
          The hidden transition problem:
        </strong>{" "}
        Students enter Class 11 with strong ICSE scores but weak &ldquo;algebraic
        maturity&rdquo; &mdash; they can&rsquo;t manipulate expressions quickly,
        don&rsquo;t think in function language, and their graph skills are basic.
        These aren&rsquo;t ISC problems &mdash; they&rsquo;re prerequisite
        problems. Our bridge module fixes this before the syllabus starts.
      </p>
    </>
  ),

  commonGaps: [
    {
      category: "Maths",
      items: [
        "Functions mindset \u2014 domain/range, invertibility, composition (students treat these as definitions to memorise instead of tools to use)",
        "Calculus fluency \u2014 differentiation and integration techniques without understanding what they represent",
        "Probability depth \u2014 conditional probability, Bayes\u2019 theorem, expectation/variance",
        "Vectors and 3D geometry \u2014 direction cosines, line/plane equations",
      ],
    },
    {
      category: "Physics",
      items: [
        "Derivations \u2014 knowing facts but unable to derive them under exam conditions",
        "Graph interpretation \u2014 slope/area meaning, proportional reasoning, linearisation",
        "Units and dimensions \u2014 treated casually, loses marks consistently",
        "Practical skills \u2014 observation tables, correct graphs, significant figures, uncertainty",
      ],
    },
  ],

  diagnosticContent: (
    <>
      <p className="text-gray-600 leading-relaxed mb-4">
        We start with a diagnostic that tests prerequisite fluency &mdash; not
        ISC topics. This tells us whether your child&rsquo;s Class 10 foundation
        is actually ready for Class 11.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        <strong className="text-navy">For Class 11 students:</strong> the
        diagnostic focuses on algebraic skills, trig, coordinate geometry, and
        graph sense.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        <strong className="text-navy">For Class 12 students:</strong> the
        diagnostic also checks Class 11 concept retention.
      </p>
      <p className="text-gray-600 leading-relaxed mb-6">
        45&ndash;60 minutes. Independent work. Then we solve every question
        together.
      </p>
      <p className="text-lg font-semibold text-accent">
        ₹750 &mdash; fully credited on enrollment.
      </p>
    </>
  ),

  subjectsContent: (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Mathematics:</strong> Grade 11&ndash;12
          (including project work guidance)
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          <strong className="text-navy">Physics:</strong> Grade 11&ndash;12
          (theory + practical + project)
        </p>
      </div>
      <p className="text-gray-500 text-sm mt-6">
        Small batches of 3&ndash;5 students. Online, offline, and hybrid.
      </p>
    </div>
  ),

  faqs: [
    {
      question:
        "My child scored 90+ in ICSE but is struggling in ISC. Why?",
      answer:
        "This is extremely common. ICSE rewards thorough preparation within a defined scope. ISC demands deeper abstraction, multi-step reasoning, and derivation skills. A strong ICSE score doesn\u2019t automatically mean ISC readiness. The diagnostic tells us exactly where the disconnect is.",
    },
    {
      question: "Do you help with ISC project work?",
      answer:
        "Yes \u2014 from planning to viva preparation. ISC Maths projects carry 20 marks and are evaluated by both your teacher and a visiting examiner. We set milestones: topic selection \u2192 data/working \u2192 draft \u2192 viva rehearsal. We guide \u2014 we don\u2019t write it for them.",
    },
    {
      question:
        "ISC or CBSE \u2014 which is better for college admissions?",
      answer:
        "Both are equally valid. Indian universities accept ISC as a recognised 10+2 board. For entrance-driven admissions (engineering, medicine), the entrance test matters more than the board. Choose the board that helps your child learn best.",
    },
    {
      question:
        "Do you prepare for competitive exams alongside ISC?",
      answer:
        "Our focus is ISC mastery \u2014 board exams, practicals, and projects. Strong ISC foundations do help with competitive prep. We don\u2019t mix JEE/NEET material into board preparation, but our students develop the conceptual depth that competitive exams require. For SAT/ACT, there\u2019s natural overlap with ISC Maths content.",
    },
    {
      question:
        "Can you help if my child is already in Class 12 and behind?",
      answer:
        "Yes, but the earlier we start, the better. The diagnostic tells us exactly how much ground needs to be covered. In Class 12, we prioritise high-weightage topics (Calculus is 32/80 in Maths) and ensure projects/practicals are on track.",
    },
  ],
};

export default function ISCTuition() {
  return <CurriculumPageTemplate data={iscData} />;
}
