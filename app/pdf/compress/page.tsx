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
  title: "Compress PDF Free Online",
  description:
    "Reduce PDF file size in your browser. Free, no signup, no watermark. Great for shrinking scanned and image-heavy PDFs for email and uploads.",
  keywords:
    "compress pdf, reduce pdf size, shrink pdf free, pdf compressor online, make pdf smaller",
  openGraph: {
    title: "Compress PDF Free Online | GetFreeToolsAI",
    description:
      "Reduce PDF file size in your browser. Free, no watermark, great for scanned PDFs.",
    url: "https://getfreetoolsai.com/pdf/compress",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Free Online",
    description: "Reduce PDF file size in your browser. Free, no watermark.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/compress" },
};

const CompressPDF = dynamic(() => import("@/components/tools/CompressPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How much can I shrink a PDF?",
    a: "It depends on the content. Scanned or image-heavy PDFs can shrink dramatically (often 50–90%), while PDFs that are mostly plain text may compress little since they’re already small.",
  },
  {
    q: "Why does my text become non-selectable?",
    a: "To guarantee a smaller file, each page is re-rendered as a compressed image. This flattens the page, so text can no longer be selected. If you need selectable text, keep the original.",
  },
  {
    q: "What do the compression levels mean?",
    a: "Low produces the smallest file at lower visual quality, High keeps the best quality with more modest savings, and Medium balances the two.",
  },
  {
    q: "Will there be a watermark?",
    a: "No. The compressed PDF has no watermark or branding.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "No. Compression runs entirely in your browser, so your PDF never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="Compress PDF"
      />
      <ToolHeader
        title="Compress PDF"
        description="Shrink large PDFs so they’re easy to email and upload — ideal for scanned documents, processed privately in your browser."
      />
      <div className="mt-8">
        <CompressPDF />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Pick a compression level",
          "Download the smaller PDF",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/compress" />
    </div>
  );
}
