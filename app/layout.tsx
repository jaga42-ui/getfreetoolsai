import type { Metadata } from "next";
// Self-hosted variable fonts (no external/build-time font fetch).
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ConsentManager } from "@/components/ConsentManager";
import { RouteProgress } from "@/components/RouteProgress";
import { allTools } from "@/lib/tools";

// Live tools drive the ItemList schema so the count never goes stale.
const liveTools = allTools.filter((t) => t.ready);

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getfreetoolsai.com"),

  title: {
    default: "GetFreeToolsAI — 50+ Free Online Tools, No Signup Needed",
    template: "%s",
  },

  description:
    "50+ free online tools for PDF, images, AI writing and more. No signup, no watermark, no limits. 100% browser-based and private.",

  authors: [{ name: "GetFreeToolsAI" }],
  creator: "GetFreeToolsAI",
  publisher: "GetFreeToolsAI",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.getfreetoolsai.com",
    siteName: "GetFreeToolsAI",
    title:
      "GetFreeToolsAI — 50+ Free Online Tools | No Signup, No Watermark, No Limits",
    description:
      "50+ free online tools for PDF, images, AI writing, generators, video, calculators and more. No signup. No watermark. No limits. 100% browser-based and private.",
    // og:image is provided automatically by app/opengraph-image.tsx
  },

  twitter: {
    card: "summary_large_image",
    title: "GetFreeToolsAI — 50+ Free Online Tools | No Signup",
    description:
      "50+ free online tools: PDF, images, AI writing, generators & more. No signup, no watermark, 100% free.",
    creator: "@getfreetoolsai",
  },

  alternates: {
    canonical: "https://www.getfreetoolsai.com",
    languages: {
      "en-US": "https://www.getfreetoolsai.com",
      "x-default": "https://www.getfreetoolsai.com",
    },
  },

  category: "technology",

  // Only emit the verification tag when a real code is provided via env,
  // so we never ship an invalid placeholder meta tag.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),

  other: {
    "theme-color": "#211f1a",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.getfreetoolsai.com/#website",
      url: "https://www.getfreetoolsai.com",
      name: "GetFreeToolsAI",
      description:
        "50+ free online tools for PDF, images, AI writing, generators, video and more. No signup, no watermark, no limits.",
      publisher: { "@id": "https://www.getfreetoolsai.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://www.getfreetoolsai.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://www.getfreetoolsai.com/#organization",
      name: "GetFreeToolsAI",
      url: "https://www.getfreetoolsai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.getfreetoolsai.com/logo.png",
        width: 512,
        height: 512,
      },
      description:
        "Free online tools for everyone. No signup, no watermark, no limits.",
      foundingDate: "2026",
      availableLanguage: ["en"],
      sameAs: [
        "https://x.com/getfreetoolsai",
        "https://www.youtube.com/@getfreetoolsai",
        "https://www.instagram.com/getfreetoolsai",
        "https://www.linkedin.com/company/getfreetoolsai",
        "https://www.facebook.com/getfreetoolsai",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.getfreetoolsai.com/#localbusiness",
      name: "GetFreeToolsAI",
      url: "https://www.getfreetoolsai.com",
      description:
        "Free online PDF, image and AI tools that run entirely in your browser. No signup, no watermark, no limits.",
      image: "https://www.getfreetoolsai.com/logo.png",
      priceRange: "Free",
      areaServed: "Worldwide",
      availableLanguage: ["en"],
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
      sameAs: [
        "https://x.com/getfreetoolsai",
        "https://www.youtube.com/@getfreetoolsai",
        "https://www.instagram.com/getfreetoolsai",
        "https://www.linkedin.com/company/getfreetoolsai",
        "https://www.facebook.com/getfreetoolsai",
      ],
    },
    {
      "@type": "ItemList",
      name: "Free Online Tools",
      description:
        "Complete list of free online tools available on GetFreeToolsAI",
      numberOfItems: liveTools.length,
      itemListElement: liveTools.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.name,
        url: `https://www.getfreetoolsai.com${tool.href}`,
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <JsonLd data={siteSchema} />
        <RouteProgress />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ConsentManager />
      </body>
    </html>
  );
}
