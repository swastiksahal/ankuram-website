import { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { PHONE_DISPLAY, PHONE_URL, WHATSAPP_URL, ADDRESS, GOOGLE_MAPS_EMBED } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Ankuram Tuition | Jubilee Hills, Hyderabad",
  description:
    "Contact Ankuram Tuition in Jubilee Hills, Hyderabad. WhatsApp or call to book a diagnostic assessment.",
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-navy mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Have questions about tuition? Want to book a diagnostic assessment? 
                Reach out via WhatsApp or call—we respond within 24 hours.
              </p>

              <div className="space-y-6 mb-10">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-navy">WhatsApp</p>
                    <p className="text-gray-500">{PHONE_DISPLAY}</p>
                  </div>
                </a>

                <a
                  href={PHONE_URL}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-navy">Phone</p>
                    <p className="text-gray-500">{PHONE_DISPLAY}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-navy">Location</p>
                    <p className="text-gray-500">{ADDRESS}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-navy">Hours</p>
                    <p className="text-gray-500">Monday - Saturday</p>
                    <p className="text-gray-500 text-sm">Timings vary by batch</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
                <a
                  href={PHONE_URL}
                  className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy px-6 py-3 rounded-lg font-medium hover:bg-navy hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
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
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-4">
            Areas We Serve
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Located in Jubilee Hills, we serve students from across Hyderabad, primarily within a 5km radius.
          </p>

          <div className="flex flex-wrap gap-3">
            {areas.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Questions */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy mb-8 text-center">
            Quick Questions
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-medium text-navy mb-2">
                What&apos;s the best way to reach you?
              </h3>
              <p className="text-gray-600">
                WhatsApp is fastest. We typically respond within a few hours. 
                For urgent enquiries, please call directly.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-medium text-navy mb-2">
                Do you offer home tuition?
              </h3>
              <p className="text-gray-600">
                No, all sessions are conducted at our centre in Jubilee Hills. 
                This allows us to maintain a focused learning environment.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-medium text-navy mb-2">
                Can I visit the centre before enrolling?
              </h3>
              <p className="text-gray-600">
                Yes, we encourage it. WhatsApp or call to schedule a visit. 
                We&apos;ll explain our approach and answer your questions.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-navy mb-2">
                What are the next steps to enroll?
              </h3>
              <p className="text-gray-600">
                Contact us → Schedule a diagnostic assessment → Receive gap report → 
                Discuss if Ankuram is the right fit → Enroll if suitable.
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
