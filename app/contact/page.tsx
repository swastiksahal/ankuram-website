import { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { PHONE_DISPLAY, PHONE_URL, WHATSAPP_URL, ADDRESS, GOOGLE_MAPS_EMBED } from "@/lib/constants";
import FAQSection from "@/components/FAQSection";
import TrackedCTALink from "@/components/tracking/TrackedCTALink";

export const metadata: Metadata = {
  title: "Contact Ankuram Tuition Centre | Jubilee Hills, Hyderabad",
  description:
    "Visit us at Plot 229, Road No. 72, Prashasan Nagar, Jubilee Hills, Hyderabad. Call +91 7396669430 or WhatsApp us.",
  alternates: {
    canonical: "https://ankuramtuition.in/contact",
  },
  openGraph: {
    title: "Contact Ankuram Tuition Centre | Jubilee Hills, Hyderabad",
    description:
      "Visit us at Plot 229, Road No. 72, Prashasan Nagar, Jubilee Hills, Hyderabad. Call +91 7396669430 or WhatsApp us.",
    url: "https://ankuramtuition.in/contact",
    siteName: "Ankuram Tuition Centre",
    type: "website",
  },
};

const areas = [
  "Jubilee Hills",
  "Banjara Hills",
  "Film Nagar",
  "Road No. 36",
  "Road No. 45",
  "Prashasan Nagar",
  "Panjagutta",
  "Somajiguda",
  "Ameerpet",
  "Madhapur",
  "Kondapur",
  "Gachibowli",
  "HITEC City",
  "Begumpet",
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-navy relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,168,83,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <p className="section-label mb-6">Contact</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-white/60 mb-10 leading-relaxed">
                Have questions about tuition? Want to book a diagnostic assessment?
                Reach out via WhatsApp or call—we respond within 24 hours.
              </p>

              <p className="text-sm text-accent/80 bg-accent/10 border border-accent/20 px-4 py-3 rounded-xl mb-10 leading-relaxed">
                Not sure if your child needs this? WhatsApp us your child&apos;s grade and curriculum &mdash; we&apos;ll tell you honestly whether the diagnostic makes sense.
              </p>

              <div className="space-y-4 mb-10">
                <TrackedCTALink trackingType="whatsapp"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">WhatsApp</p>
                    <p className="text-white/50">{PHONE_DISPLAY}</p>
                  </div>
                </TrackedCTALink>

                <TrackedCTALink trackingType="phone"
                  href={PHONE_URL}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-white/50">{PHONE_DISPLAY}</p>
                  </div>
                </TrackedCTALink>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p className="text-white/50">{ADDRESS}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Hours</p>
                    <p className="text-white/50">Monday - Saturday</p>
                    <p className="text-white/40 text-sm">Timings vary by batch</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <TrackedCTALink trackingType="whatsapp"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-navy px-8 py-4 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </TrackedCTALink>
                <TrackedCTALink trackingType="phone"
                  href={PHONE_URL}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/5 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </TrackedCTALink>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden min-h-[400px]">
              <iframe
                src={GOOGLE_MAPS_EMBED}
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ankuram Tuition Centre on Google Maps"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4">Service Area</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4">
            Areas We Serve
          </h2>
          <p className="text-lg text-gray-500 mb-10">
            Located in Jubilee Hills, we serve students from across Hyderabad, primarily within a 5km radius.
          </p>

          <div className="flex flex-wrap gap-3">
            {areas.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Questions */}
      <FAQSection
        title="Quick Questions"
        subtitle="Everything you need to know before getting in touch."
        items={[
          { q: "What\u2019s the best way to reach you?", a: "WhatsApp is fastest. We typically respond within a few hours. For urgent enquiries, please call directly." },
          { q: "Do you offer home tuition?", a: "No, all sessions are conducted at our centre in Jubilee Hills. This allows us to maintain a focused learning environment." },
          { q: "Can I visit the centre before enrolling?", a: "Yes, we encourage it. WhatsApp or call to schedule a visit. We\u2019ll explain our approach and answer your questions." },
          { q: "What are the next steps to enroll?", a: "Contact us \u2192 Schedule a diagnostic assessment \u2192 Receive gap report \u2192 Discuss if Ankuram is the right fit \u2192 Enroll if suitable." },
        ]}
      />
    </>
  );
}
