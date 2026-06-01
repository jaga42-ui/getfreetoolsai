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
  title: "PDF to JPG Converter Free Online",
  description:
    "Convert PDF pages to JPG images free. No signup, no watermark, browser-based. Download individual pages or all as ZIP.",
  keywords:
    "pdf to jpg, convert pdf to image, pdf to jpeg free, extract images from pdf",
  openGraph: {
    title: "PDF to JPG Converter Free Online | GetFreeToolsAI",
    description:
      "Convert PDF pages to JPG images free. No signup, no watermark, browser-based.",
    url: "https://getfreetoolsai.com/pdf/pdf-to-jpg",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to JPG Converter Free Online",
    description: "Convert PDF pages to JPG images free. Browser-based, no watermark.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/pdf-to-jpg" },
};

const PdfToJpg = dynamic(() => import("@/components/tools/PdfToJpg"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I convert specific pages only?",
    a: "Yes. Switch to “Specific pages” and enter a range like 1,3,5-8. Only those pages are rendered to JPG, which is faster for large documents.",
  },
  {
    q: "What quality options are available?",
    a: "Choose Low, Medium, High or Max. Higher settings render the pages at a larger resolution for crisp images, at the cost of bigger files and slightly longer processing.",
  },
  {
    q: "Can I convert a PDF with many pages?",
    a: "Yes. There’s no page limit. A live progress bar shows which page is rendering. Very large PDFs at Max quality use more memory, so reduce quality if your device struggles.",
  },
  {
    q: "Will images have watermarks?",
    a: "No. The JPG images are clean with no watermark, logo or branding added.",
  },
  {
    q: "How long does conversion take?",
    a: "Usually a second or two per page, depending on page complexity, chosen quality and your device. Everything runs locally, so there’s no upload or queue wait.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="PDF to JPG"
      />
      <ToolHeader
        title="PDF to JPG Converter"
        description="Turn every PDF page into a high-quality JPG image. Preview, download individually, or grab them all as a ZIP."
      />
      <div className="mt-8">
        <PdfToJpg />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Pick pages and quality",
          "Download your JPG images",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/pdf-to-jpg" />
    </div>
  );
}
