import type { Metadata } from "next";
// Self-hosted variable fonts (no external/build-time font fetch).
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://getfreetoolsai.com"),
  title: {
    default:
      "Free PDF & Image Tools Online | GetFreeToolsAI — No Signup Required",
    template: "%s | GetFreeToolsAI",
  },
  description:
    "17 free online tools for PDF and images. Compress, merge, split, convert, OCR and more. No signup, no watermark, no limits. 100% browser-based and private.",
  keywords:
    "free pdf tools, free image tools, compress pdf, merge pdf, pdf to jpg, compress image to kb, heic to jpg, pdf ocr",
  openGraph: {
    title: "Free PDF & Image Tools Online | GetFreeToolsAI",
    description:
      "17 free online tools for PDF and images. No signup, no watermark, no limits. 100% browser-based and private.",
    url: "https://getfreetoolsai.com",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF & Image Tools Online | GetFreeToolsAI",
    description:
      "17 free online tools for PDF and images. No signup, no watermark, no limits. 100% browser-based.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
