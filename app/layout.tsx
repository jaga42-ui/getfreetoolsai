import type { Metadata } from "next";
// Self-hosted variable fonts (no external/build-time font fetch).
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://getfreetoolsai.com"),

  title: {
    default:
      "GetFreeToolsAI — Free Online Tools: PDF, Image, AI, Generator & More | No Signup",
    template: "%s | GetFreeToolsAI — Free Online Tools",
  },

  description:
    "GetFreeToolsAI offers 42+ free online tools for PDF, images, AI writing, generators, video, calculators, and more. No signup. No watermark. No limits. 100% browser-based and private. Compress PDF, merge PDF, remove background, compress image, HEIC to JPG, AI humanizer, QR code generator, meme maker, invoice generator and more — all completely free.",

  keywords: [
    // PDF TOOLS
    "compress pdf online free",
    "merge pdf free",
    "split pdf online",
    "pdf to word converter free",
    "pdf to jpg converter",
    "jpg to pdf converter",
    "unlock pdf online free",
    "rotate pdf online",
    "pdf ocr free",
    "pdf compressor no watermark",
    "compress pdf without losing quality",
    "combine pdf files free",
    "pdf editor free online no signup",
    "smallpdf alternative free",
    "ilovepdf alternative",
    "pdf tools free no limit",
    "merge pdf files online free no signup",
    "compress pdf file size free",
    "pdf to word no watermark",
    "online pdf tools free",
    // IMAGE TOOLS
    "compress image to 200kb",
    "compress image to 100kb",
    "compress image online free",
    "reduce image size in kb",
    "reduce photo size for online form",
    "heic to jpg converter free",
    "convert iphone photo to jpg",
    "remove background from image free",
    "background remover no signup",
    "remove bg free alternative",
    "image compressor no watermark",
    "resize image online free",
    "crop image online free",
    "compress jpg online free",
    "compress png online free",
    "webp to jpg converter free",
    "jpg to png converter online free",
    "image to text converter free",
    "remove exif data from photo",
    "strip gps from photo online",
    "compress image without losing quality",
    "reduce image file size free",
    "image converter free online no signup",
    "batch image compressor free",
    // AI WRITING TOOLS
    "ai text humanizer free",
    "humanize ai text free",
    "ai content humanizer no limit",
    "bypass ai detection free",
    "make ai text sound human",
    "ai humanizer no word limit",
    "free ai humanizer for essays",
    "quillbot alternative free",
    "undetectable ai free alternative",
    "ai grammar checker free",
    "grammarly alternative free",
    "free grammar checker no signup",
    "plagiarism checker free",
    "free plagiarism checker no signup",
    "ai text detector free",
    "chatgpt detector free",
    "gptzero alternative free",
    "ai summarizer free",
    "summarize pdf free",
    "paraphrase text free online",
    "ai paraphraser free no limit",
    "resume ats checker free",
    "ats resume scanner free",
    "jobscan alternative free",
    "cover letter generator free",
    "ai cover letter writer free",
    "contract explainer plain english free",
    "readability checker free",
    "tone analyzer free online",
    // GENERATOR TOOLS
    "qr code generator free",
    "free qr code maker no signup",
    "qr code generator no expiry",
    "meme generator free no watermark",
    "meme maker free online",
    "imgflip alternative no watermark",
    "youtube thumbnail generator free",
    "thumbnail maker free online",
    "email signature generator free",
    "free email signature maker",
    "invoice generator free",
    "free invoice maker online",
    "free invoice pdf generator",
    "certificate generator free",
    "quote card generator free",
    "business card generator free",
    "color palette generator free",
    "og image generator free",
    "lorem ipsum generator",
    "password generator free",
    "barcode generator free online",
    // VIDEO TOOLS
    "extract audio from video free",
    "video to mp3 converter free",
    "compress video online free",
    "compress video without watermark",
    "trim video online free",
    "cut video online free",
    "mov to mp4 converter free",
    "video to gif converter free",
    "add subtitles to video free",
    "video compressor no watermark",
    // CALCULATOR TOOLS
    "emi calculator free",
    "loan emi calculator",
    "home loan calculator",
    "personal loan emi calculator",
    "calorie calculator free",
    "tdee calculator free",
    "bmi calculator online free",
    "tip calculator free",
    "split bill calculator free",
    "age calculator online free",
    "percentage calculator free",
    // SOCIAL MEDIA TOOLS
    "youtube thumbnail downloader",
    "download youtube thumbnail free",
    "linkedin banner maker free",
    "linkedin banner resizer free",
    "instagram post resizer free",
    "social media image resizer free",
    "twitter header maker free",
    "image resizer for social media",
    // DEV TOOLS
    "json formatter free online",
    "regex tester free online",
    "css gradient generator free",
    "password generator strong free",
    "htaccess generator free",
    "base64 encoder decoder free",
    "url encoder decoder free",
    // WRITING / DOCUMENT TOOLS
    "word counter free online",
    "character counter free",
    "citation generator free",
    "apa citation generator free",
    "mla citation generator free",
    "word to pdf converter free",
    "excel to pdf free",
    "markdown to html converter free",
    // BRAND KEYWORDS
    "getfreetoolsai",
    "free online tools no signup",
    "free online tools no watermark",
    "free tools browser based",
    "online tools without registration",
    "free tools private browser based",
    "100 percent free online tools",
    "tools that work in browser no upload",
    "free online tools india",
    "best free online tools 2026",
  ],

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
    url: "https://getfreetoolsai.com",
    siteName: "GetFreeToolsAI",
    title:
      "GetFreeToolsAI — 42+ Free Online Tools | No Signup, No Watermark, No Limits",
    description:
      "42+ free online tools for PDF, images, AI writing, generators, video, calculators and more. No signup. No watermark. No limits. 100% browser-based and private.",
    // og:image is provided automatically by app/opengraph-image.tsx
  },

  twitter: {
    card: "summary_large_image",
    title: "GetFreeToolsAI — 42+ Free Online Tools | No Signup",
    description:
      "42+ free online tools: PDF, images, AI writing, generators & more. No signup, no watermark, 100% free.",
    creator: "@getfreetoolsai",
  },

  alternates: {
    canonical: "https://getfreetoolsai.com",
  },

  category: "technology",

  verification: {
    google: "ADD_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },

  other: {
    "theme-color": "#6366f1",
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
      "@id": "https://getfreetoolsai.com/#website",
      url: "https://getfreetoolsai.com",
      name: "GetFreeToolsAI",
      description:
        "42+ free online tools for PDF, images, AI writing, generators, video and more. No signup, no watermark, no limits.",
      publisher: { "@id": "https://getfreetoolsai.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://getfreetoolsai.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://getfreetoolsai.com/#organization",
      name: "GetFreeToolsAI",
      url: "https://getfreetoolsai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://getfreetoolsai.com/logo.png",
        width: 512,
        height: 512,
      },
      description:
        "Free online tools for everyone. No signup, no watermark, no limits.",
      foundingDate: "2026",
      sameAs: [],
    },
    {
      "@type": "ItemList",
      name: "Free Online Tools",
      description:
        "Complete list of free online tools available on GetFreeToolsAI",
      numberOfItems: 42,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Compress PDF", url: "https://getfreetoolsai.com/pdf/compress" },
        { "@type": "ListItem", position: 2, name: "Merge PDF", url: "https://getfreetoolsai.com/pdf/merge" },
        { "@type": "ListItem", position: 3, name: "Split PDF", url: "https://getfreetoolsai.com/pdf/split" },
        { "@type": "ListItem", position: 4, name: "PDF to JPG", url: "https://getfreetoolsai.com/pdf/pdf-to-jpg" },
        { "@type": "ListItem", position: 5, name: "JPG to PDF", url: "https://getfreetoolsai.com/pdf/jpg-to-pdf" },
        { "@type": "ListItem", position: 6, name: "Unlock PDF", url: "https://getfreetoolsai.com/pdf/unlock" },
        { "@type": "ListItem", position: 7, name: "Rotate PDF", url: "https://getfreetoolsai.com/pdf/rotate" },
        { "@type": "ListItem", position: 8, name: "PDF to Word", url: "https://getfreetoolsai.com/pdf/pdf-to-word" },
        { "@type": "ListItem", position: 9, name: "PDF OCR", url: "https://getfreetoolsai.com/pdf/ocr" },
        { "@type": "ListItem", position: 10, name: "Compress Image", url: "https://getfreetoolsai.com/image/compress" },
        { "@type": "ListItem", position: 11, name: "HEIC to JPG", url: "https://getfreetoolsai.com/image/heic-to-jpg" },
        { "@type": "ListItem", position: 12, name: "Background Remover", url: "https://getfreetoolsai.com/image/background-remover" },
        { "@type": "ListItem", position: 13, name: "Convert Image", url: "https://getfreetoolsai.com/image/convert" },
        { "@type": "ListItem", position: 14, name: "Resize Image", url: "https://getfreetoolsai.com/image/resize" },
        { "@type": "ListItem", position: 15, name: "Crop Image", url: "https://getfreetoolsai.com/image/crop" },
        { "@type": "ListItem", position: 16, name: "Remove EXIF", url: "https://getfreetoolsai.com/image/remove-exif" },
        { "@type": "ListItem", position: 17, name: "Image to Text", url: "https://getfreetoolsai.com/image/image-to-text" },
      ],
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
