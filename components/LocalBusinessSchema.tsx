import Script from "next/script";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Ankuram Tuition Centre",
    telephone: "+91 73966 69430",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 229, Road No. 72, Prashasan Nagar, Jubilee Hills",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500096",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 17.419361,
      longitude: 78.397636,
    },
    url: "https://ankuramtuition.in",
    areaServed: ["Jubilee Hills", "Banjara Hills", "Gachibowli", "Kondapur", "Madhapur", "Hyderabad"],
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
