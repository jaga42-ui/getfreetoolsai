import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  PrivacyNote,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";

export const metadata: Metadata = {
  title: "Split PDF Online Free",
  description:
    "Split PDF into multiple files or extract specific pages. Free, browser-based, no signup required.",
  keywords:
    "split pdf, extract pages from pdf, pdf splitter free, separate pdf pages online",
  openGraph: {
    title: "Split PDF Online Free | GetFreeToolsAI",
    description:
      "Split PDF into multiple files or extract specific pages. Free, browser-based, no signup.",
    url: "https://getfreetoolsai.com/pdf/split",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Online Free",
    description: "Split PDF or extract specific pages. Free, browser-based.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/split" },
};

const SplitPDF = dynamic(() => import("@/components/tools/SplitPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I extract specific pages from a PDF?",
    a: "Yes. Choose “Extract pages” and type a printer-style range like 1,3,5-8,12. We build a single new PDF containing exactly those pages in order.",
  },
  {
    q: "How do I split a PDF into individual pages?",
    a: "Pick the “Each page separately” mode. Every page becomes its own one-page PDF, and they’re bundled into a ZIP file for a single convenient download.",
  },
  {
    q: "What is the maximum PDF size supported?",
    a: "You can split PDFs up to 200MB. Since the work happens locally in your browser, very large files depend mostly on your device’s memory.",
  },
  {
    q: "Will split files keep original formatting?",
    a: "Yes. We copy the original pages byte-for-byte into the new PDFs, so text, fonts, images and layout are preserved exactly.",
  },
  {
    q: "Are my PDF files stored on your server?",
    a: "No. Splitting runs entirely in your browser with pdf-lib. Your document never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="Split PDF"
      />
      <ToolHeader
        title="Split PDF"
        description="Extract specific pages, split every N pages, or break a PDF into individual pages — all in your browser."
      />
      <div className="mt-8">
        <SplitPDF />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Choose how to split it",
          "Download the result",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/split" />
    </div>
  );
}
