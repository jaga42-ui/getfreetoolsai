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
import { JsonLd } from "@/components/JsonLd";
import { toolMeta, softwareAppSchema } from "@/lib/seo";
import { ToolDemo } from "@/components/ToolDemo";
import { ToolExtraContent } from "@/components/ToolExtraContent";
import { ProseSection } from "@/components/ProseSection";
import Link from "next/link";

export const metadata = toolMeta({
  title:
    "Image to Text Free Online — OCR Extract Text from Images",
  description:
    "Extract text from images free with OCR. Convert screenshots, photos and scans to editable text in 20+ languages — no signup, in your browser.",
  keywords:
    "image to text, image to text converter free, ocr free online, extract text from image, photo to text converter, screenshot to text free",
  path: "/image/image-to-text",
});

const jsonLd = softwareAppSchema({
  name: "Free Image to Text OCR",
  description:
    "Extract text from images free online using OCR. No signup, works in your browser.",
  path: "/image/image-to-text",
  ratingCount: 933,
});

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
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
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
      <ToolDemo kind="ocr-image" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image to text tool uses optical character recognition to pull
          editable text out of any picture — a screenshot, a photographed page, a
          receipt, or a scanned document. It saves you from retyping by hand
          whenever you need to quote a passage, copy a code or address from a
          photo, or digitise printed notes. Recognition supports English, Hindi,
          Arabic, French, and Spanish, and the extracted text appears in an
          editable box so you can fix any mistakes before copying it or
          downloading as .txt or .docx. Unlike paid OCR services that upload your
          files and limit free pages, GetFreeToolsAI is unlimited and adds no
          watermark. Everything runs in your browser with Tesseract.js, so your
          image is never sent to any server and stays private on your device. It
          works in Chrome, Firefox, Safari, and Edge with no installation and no
          signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/image/image-to-text" />
      <ProseSection title="From a photo of text to an editable document">
        <p>
          This tool does more than dump the words out of a picture. It runs the same
          <strong> layout-aware OCR engine</strong> as our PDF OCR studio: it reads the
          position of every word and line and rebuilds the structure — <strong>headings</strong>,
          <strong> paragraphs</strong>, <strong>lists</strong> and aligned <strong>tables</strong> —
          then lets you fix the highlighted low-confidence words and export.
        </p>
        <h3>What you can export</h3>
        <ul>
          <li><strong>Editable text</strong> — copy it, or download as .txt, Markdown or HTML.</li>
          <li><strong>Word (.doc)</strong> — keeps headings and tables, ready to edit.</li>
          <li><strong>Searchable PDF</strong> — your image with an invisible, selectable text layer on top, so the picture looks identical but you can search and copy from it.</li>
        </ul>
        <h3>Best results</h3>
        <ul>
          <li>Use a sharp, well-lit photo — high contrast between text and background helps most.</li>
          <li>Keep the page flat and straight; skew confuses line detection.</li>
          <li>Pick the right language (English, Hindi, Bengali, Odia, Tamil, Telugu, Marathi, Gujarati, Punjabi and more).</li>
        </ul>
        <h3>Private by design</h3>
        <p>
          Recognition and reconstruction happen entirely in your browser — your image is
          never uploaded. Working with a multi-page PDF instead? Use{" "}
          <Link href="/pdf/ocr">PDF OCR</Link>. Need an editable Word document from a PDF?
          See <Link href="/pdf/pdf-to-word">PDF to Word</Link>.
        </p>
      </ProseSection>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/image-to-text" />
    </div>
  );
}
