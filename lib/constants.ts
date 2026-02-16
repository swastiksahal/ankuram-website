// Brand
export const BRAND_NAME = "Ankuram Tuition Centre";
export const TAGLINE = "Foundations First. Results Follow.";

export const BRAND = {
  name: "Ankuram",
  phoneDisplay: "+91 73966 69430",
  phoneHref: "tel:+917396669430",
  whatsappHref: "https://wa.me/917396669430?text=Hi%20I%20want%20to%20book%20a%20diagnostic%20assessment",
  email: "hello@ankuramtuition.in",
  city: "Jubilee Hills, Hyderabad",
} as const;

// Contact
export const PHONE = "+917396669430";
export const PHONE_DISPLAY = "+91 73966 69430";
export const WHATSAPP_NUMBER = "917396669430";
export const PHONE_URL = `tel:${PHONE}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20I%20want%20to%20book%20a%20diagnostic%20assessment`;
export const WHATSAPP_ENQUIRY_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20I%20want%20to%20enquire%20about%20tuition`;

// Location
export const ADDRESS = "Plot 229, Road No. 72, Prashasan Nagar, Jubilee Hills, Hyderabad 500096";
export const CITY = "Jubilee Hills, Hyderabad";
export const GOOGLE_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.8421489094358!2d78.39763627445339!3d17.419381383473262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb95a38d079133%3A0xd70d61a4ba6957b!2sAnkuram%20Tuition%20Centre%20%7C%20Math%20Tuition%20%7C%20Science%20Tuition!5e0!3m2!1sen!2sin!4v1770439951554!5m2!1sen!2sin";

// Business Info
export const EXPERIENCE_YEARS = "13+";
export const BATCH_SIZE = "3-5";
export const DIAGNOSTIC_FEE = "₹750";

// Navigation
export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/curricula", label: "Curricula" },
  { href: "/contact", label: "Contact" },
] as const;

export const CURRICULA = [
  {
    name: "CBSE",
    slug: "cbse-maths-tuition",
    fullName: "Central Board of Secondary Education",
    shortDesc: "Grades 8-12. Board exam focus with conceptual depth.",
    grades: "8-12",
  },
  {
    name: "ICSE",
    slug: "icse-maths-tuition",
    fullName: "Indian Certificate of Secondary Education",
    shortDesc: "Grades 6-10. Application-heavy syllabus, concept-first approach.",
    grades: "6-10",
  },
  {
    name: "ISC",
    slug: "isc-tuition",
    fullName: "Indian School Certificate",
    shortDesc: "Grades 11-12. Derivations, proofs, project work guidance.",
    grades: "11-12",
  },
  {
    name: "IB MYP",
    slug: "ib-myp-maths-tuition",
    fullName: "International Baccalaureate Middle Years Programme",
    shortDesc: "Grades 6-10. Criterion-based assessment and investigation support.",
    grades: "6-10",
  },
  {
    name: "IB DP",
    slug: "ib-dp-maths-tuition",
    fullName: "International Baccalaureate Diploma Programme",
    shortDesc: "Grades 11-12. AA & AI pathways, IA guidance included.",
    grades: "11-12",
  },
  {
    name: "IGCSE",
    slug: "igcse-maths-tuition",
    fullName: "Cambridge IGCSE",
    shortDesc: "Grades 9-10. Core & Extended papers, mark-scheme strategy.",
    grades: "9-10",
  },
  {
    name: "A-Levels",
    slug: "a-levels-maths-tuition",
    fullName: "Cambridge A-Levels",
    shortDesc: "Grades 11-12. Pure Maths, Mechanics, and Statistics.",
    grades: "11-12",
  },
];

export const GRADES = [
  { grade: 8, slug: "class-8-tuition", subjects: ["Maths"] },
  { grade: 9, slug: "class-9-tuition", subjects: ["Maths"] },
  { grade: 10, slug: "class-10-tuition", subjects: ["Maths"] },
  { grade: 11, slug: "class-11-tuition", subjects: ["Maths", "Physics"] },
  { grade: 12, slug: "class-12-tuition", subjects: ["Maths", "Physics"] },
];

// Testimonials (real Google reviews)
export const TESTIMONIALS = [
  {
    name: "Vikas",
    review: "One of the best tuition centre in Jubilee Hills for IB MYP maths.",
    rating: 5,
    context: "IB MYP Student",
  },
  {
    name: "Dayanand Mettu",
    review: "My daughter from Gaudium MYP 5 studied maths and physics. Team Ankuram finished entire year 4 and 5 portion in 80 sessions. She was quite confident and performed well in her exams.",
    rating: 5,
    context: "Parent of IB MYP Student",
  },
  {
    name: "Srinu Sri",
    review: "My daughter was facing issues when we moved from UK. She was finding difficulty with IB curriculum. After joining Ankuram and with Swastik, she improved gradually. Thank you!!",
    rating: 5,
    context: "Parent of IB Student",
  },
  {
    name: "Gokul Jk",
    review: "The teachers at the tuition center are excellent. As an intermediate first-year student, the teacher shows a great deal of interest in each student and helped me in improving my maths 1A and maths 1B.",
    rating: 5,
    context: "Class 11 Student",
  },
  {
    name: "Chandana Jha",
    review: "I couldn't be happier with our experience at Ankuram Tuition Centre, where my son has been receiving educational support for the past years. As a concerned parent, I was initially skeptical, but the results speak for themselves.",
    rating: 5,
    context: "Parent",
  },
  {
    name: "Sireesha Kancharla",
    review: "Since joining this tuition center, my ability to understand concepts has improved significantly and so did my grades. The teachers have played a huge role in shaping my academics especially mathematics since grade 8.",
    rating: 5,
    context: "Student since Grade 8",
  },
];

// Homepage FAQs
export const HOMEPAGE_FAQS = [
  {
    question: "Which grades and curricula do you teach?",
    answer: "Mathematics and Physics for grades 6\u201312 across CBSE, ICSE, IB MYP, IB DP, IGCSE, and Cambridge A-Levels. One expert teacher handles all curricula \u2014 no rotating junior tutors.",
  },
  {
    question: "How is Ankuram different from other tuition centres?",
    answer: "We don\u2019t start with the current chapter. Every student begins with a diagnostic assessment that traces gaps back to their root \u2014 often 2\u20133 grades earlier. We fix those foundations first, then the current syllabus falls into place naturally.",
  },
  {
    question: "What happens in the diagnostic assessment?",
    answer: "A 60-minute one-on-one session with a qualified teacher. We assess conceptual understanding across foundational topics, identify specific gaps, and create a personalised recovery plan. Fee: \u20B9750, fully credited when you enroll.",
  },
  {
    question: "My child practices a lot but still struggles. Can you help?",
    answer: "This is exactly what we specialise in. Practice without understanding reinforces wrong methods. We rebuild the foundation so practice actually works.",
  },
  {
    question: "What\u2019s the batch size?",
    answer: "3\u20135 students maximum. Your child gets heard, asks questions freely, and receives corrections in real time \u2014 not a face in a crowd.",
  },
  {
    question: "Where are you located?",
    answer: "Plot 229, Road No. 72, Prashasan Nagar, Jubilee Hills, Hyderabad 500096. We also offer online sessions for students outside Hyderabad.",
  },
];
