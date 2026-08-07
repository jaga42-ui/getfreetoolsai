import type { Metadata } from "next";
import Script from "next/script";
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
import { TOOL_COUNT_LABEL } from "@/lib/siteTools";

// Every live tool (including developer tools) drives the headline count, so it
// can't go stale or under-report the catalog. The matching catalog ItemList
// schema lives in lib/seo.ts and is rendered by the homepage alone.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-KCV7M4GJ";

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
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@getfreetoolsai.com",
        url: "https://www.getfreetoolsai.com/contact",
      },
      // NOTE: `sameAs` is deliberately absent. It previously listed five social
      // profiles (x, youtube, instagram, linkedin, facebook) that do not exist —
      // every one returned 404 / "profile isn't available". `sameAs` exists so
      // search engines can corroborate this entity against profiles they already
      // trust; pointing it at dead URLs provides zero corroboration while
      // asserting a presence we don't have, which is what Google's structured-data
      // guidelines prohibit. An Organization without `sameAs` is perfectly valid.
      // Re-add entries here ONE AT A TIME, only after the profile is live and has
      // real content on it.
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
      <head>
        {/*
          GTM is the only cross-origin host the page talks to on first load, and
          it is injected by an afterInteractive <Script> — so the connection is
          opened late, on the critical path. Warming DNS + TLS here removes that
          round-trip. googletagmanager.com serves the container; google-analytics
          is where the container's GA4 tag then sends hits.
        */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <Script id="gtm-consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
        </Script>
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
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
