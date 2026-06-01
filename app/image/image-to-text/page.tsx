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
  title: "Image to Text — Free Online OCR",
  description:
    "Extract text from any image (JPG, PNG, WebP) free with browser-based OCR. No signup, 100% private. Supports English, Hindi, Arabic and more.",
  keywords:
    "image to text, extract text from image, ocr online free, photo to text, picture to text converter",
  openGraph: {
    title: "Image to Text — Free Online OCR | GetFreeToolsAI",
    description:
      "Extract text from any image free with browser-based OCR. No signup, 100% private.",
    url: "https://getfreetoolsai.com/image/image-to-text",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Text — Free Online OCR",
    description: "Extract text from any image free. Browser-based, private.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/image-to-text" },
};

const ImageToText = dynamic(() => import("@/components/tools/ImageToText"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What kind of images work best?",
    a: "Clear, high-contrast images of printed text work best — screenshots, scanned documents, photos of signs or pages. Handwriting and very stylised fonts are less reliable.",
  },
  {
    q: "Which languages are supported?",
    a: "English, Hindi, Arabic, French and Spanish. Pick the language that matches your image for the most accurate results.",
  },
  {
    q: "Can I edit the text before downloading?",
    a: "Yes. The extracted text appears in an editable box, so you can fix any recognition mistakes before copying it or downloading as .txt or .docx.",
  },
  {
    q: "Why is some text wrong?",
    a: "OCR accuracy depends on image quality. Blurry, low-resolution, skewed or low-contrast images reduce accuracy. A sharper image and the correct language usually fix it.",
  },
  {
    q: "Is my image private?",
    a: "Completely. Recognition runs in your browser with Tesseract.js — the image is never uploaded to any server.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Image to Text"
      />
      <ToolHeader
        title="Image to Text (OCR)"
        description="Pull editable text out of any image — screenshots, scans or photos — right in your browser, completely private."
      />
      <div className="mt-8">
        <ImageToText />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "We OCR it in your browser",
          "Copy or download the text",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/image-to-text" />
    </div>
  );
}
