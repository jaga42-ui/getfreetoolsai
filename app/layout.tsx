import type { Metadata } from "next";
// Self-hosted variable fonts via next/font/local (no external/build-time fetch),
// with automatic preload + swap + size-adjusted fallback.
import { inter, fraunces } from "./fonts";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ConsentManager } from "@/components/ConsentManager";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { RouteProgress } from "@/components/RouteProgress";
// Cookieless, GDPR-friendly product + performance analytics. No consent gate
// needed (sets no cookies, collects no PII), so it stays privacy-safe.
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { allSiteTools, TOOL_COUNT_LABEL } from "@/lib/siteTools";

// Every live tool (including developer tools) drives the ItemList schema and
// the headline count, so neither can go stale or under-report the catalog.
const liveTools = allSiteTools;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getfreetoolsai.com"),

  title: {
    default: `GetFreeToolsAI — ${TOOL_COUNT_LABEL} Free Online Tools, No Signup Needed`,
    template: "%s",
  },

  description:
    `${TOOL_COUNT_LABEL} free online tools for PDF, images, audio, calculators and developers. No signup, no watermark, no limits. 100% browser-based and private.`,

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
      `GetFreeToolsAI — ${TOOL_COUNT_LABEL} Free Online Tools | No Signup, No Watermark, No Limits`,
    description:
      `${TOOL_COUNT_LABEL} free online tools for PDF, images, audio, calculators and developers. No signup. No watermark. No limits. 100% browser-based and private.`,
    // og:image is provided automatically by app/opengraph-image.tsx
  },

  twitter: {
    card: "summary_large_image",
    title: `GetFreeToolsAI — ${TOOL_COUNT_LABEL} Free Online Tools | No Signup`,
    description:
      `${TOOL_COUNT_LABEL} free online tools: PDF, image, audio, calculator & developer. No signup, no watermark, 100% free.`,
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
    // AdSense site-ownership verification for the approval/review step. This is
    // a plain meta tag — it loads no script and sets no cookies, so it stays
    // privacy-safe (the actual ad loader remains consent-gated in ConsentManager).
    "google-adsense-account": "ca-pub-8900650860007222",
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
        "Free online tools for PDF, images, audio, calculators and developers. No signup, no watermark, no limits.",
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <JsonLd data={siteSchema} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text-primary focus:shadow-lg focus:outline focus:outline-2 focus:outline-primary"
        >
          Skip to content
        </a>
        <RouteProgress />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <ConsentManager />
        <ServiceWorkerRegistrar />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
