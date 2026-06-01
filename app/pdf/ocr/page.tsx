import type { Metadata } from "next";
import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";

export const metadata: Metadata = {
  title: "PDF OCR — Extract Text from Scanned PDF Free",
  description:
    "Convert scanned PDF to searchable text free. OCR runs in your browser — your documents never leave your device. Supports English, Hindi, Arabic and more.",
  keywords:
    "pdf ocr free, extract text from scanned pdf, ocr pdf online, pdf to text converter, searchable pdf free",
  openGraph: {
    title: "PDF OCR — Extract Text from Scanned PDF Free | GetFreeToolsAI",
    description:
      "Convert scanned PDF to searchable text free. OCR runs in your browser — documents never leave your device.",
    url: "https://getfreetoolsai.com/pdf/ocr",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF OCR — Extract Text from Scanned PDF Free",
    description:
      "Convert scanned PDF to text free. Runs in your browser — fully private.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/ocr" },
};

const PdfOcr = dynamic(() => import("@/components/tools/PdfOcr"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What is OCR and how does it work?",
    a: "OCR (Optical Character Recognition) analyses the pixels of a scanned page and recognises the letters and words in the image, turning a picture of text into real, selectable, copyable text.",
  },
  {
    q: "Which languages does OCR support?",
    a: "This tool supports English, Hindi, Arabic, French and Spanish, plus an auto-detect option. Each language uses a trained model loaded on demand for accurate recognition.",
  },
  {
    q: "Why is my OCR result inaccurate?",
    a: "Accuracy depends on scan quality. Low-resolution, skewed, blurry or low-contrast pages reduce accuracy. For best results use a clean scan of at least 300 DPI and choose the correct language.",
  },
  {
    q: "Can I OCR a PDF with many pages?",
    a: "Yes. Each page is processed in turn with a live progress indicator showing “Processing page X of Y”. Larger documents simply take a little longer since recognition runs on your own device.",
  },
  {
    q: "Is my scanned document kept private?",
    a: "Completely. The OCR runs entirely in your browser using Tesseract.js. Your PDF is never uploaded to any server — not even ours. Only the language model is fetched, never your file.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="PDF OCR"
      />
      <ToolHeader
        title="PDF OCR — Extract Text from Scanned PDF"
        description="Turn scanned or image-based PDFs into editable, searchable text. Everything runs in your browser, so your documents stay completely private."
      />
      <div className="mt-8">
        <PdfOcr />
      </div>
      <HowItWorks
        steps={[
          "Upload your scanned PDF",
          "We OCR each page in your browser",
          "Copy or download the text",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/ocr" />
    </div>
  );
}
