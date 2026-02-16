import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import GoogleAnalytics from "@/components/tracking/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "Ankuram Tuition Centre | Maths & Physics | Jubilee Hills, Hyderabad",
    template: "%s | Ankuram Tuition Centre",
  },
  description:
    "Expert Maths & Physics tuition for Classes 8-12 in Jubilee Hills, Hyderabad. Diagnostic-first approach with small batches of 3-5 students. CBSE, ICSE, IB, IGCSE, A-Levels.",
  metadataBase: new URL("https://ankuramtuition.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ankuramtuition.in",
    siteName: "Ankuram Tuition Centre",
    title: "Ankuram Tuition Centre | Maths & Physics Tuition in Jubilee Hills",
    description:
      "Diagnostic-first maths & physics tuition for Classes 8-12. Small batches of 3-5 students. CBSE, ICSE, IB, IGCSE, A-Levels. 13+ years experience. 4.8★ on Google.",
    images: [
      {
        url: "/images/logo.avif",
        width: 120,
        height: 48,
        alt: "Ankuram Tuition Centre",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Ankuram Tuition Centre | Maths & Physics | Jubilee Hills",
    description:
      "Diagnostic-first maths & physics tuition for Classes 8-12. Small batches of 3-5 students. 13+ years experience.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <GoogleAnalytics />
        <Header />
        <main className="pb-28 sm:pb-0">{children}</main>
        <Footer />
        <MobileCTA />
        <LocalBusinessSchema />
      </body>
    </html>
  );
}
