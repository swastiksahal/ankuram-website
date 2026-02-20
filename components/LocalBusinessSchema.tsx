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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
