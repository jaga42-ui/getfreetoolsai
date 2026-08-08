import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
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
    "PDF OCR — Extract Text from Scanned PDFs Free, No Upload",
  description:
    "Extract editable text from scanned PDFs free. OCR runs in your browser so files never upload — English, Hindi, Arabic and more, export to Word.",
  keywords:
    "pdf ocr free, pdf ocr online, extract text from scanned pdf, scanned pdf to text, ocr pdf online free, searchable pdf free, pdf text extractor",
  path: "/pdf/ocr",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF OCR",
  description:
    "Extract text from scanned PDFs free. OCR runs entirely in your browser — documents never leave your device.",
  path: "/pdf/ocr",
  ratingCount: 803,
});

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
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
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
      <ToolDemo kind="ocr-pdf" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF OCR tool reads scanned, image-based PDFs and turns the
          pictures of text into real, selectable, copyable words. It is exactly
          what you need when you receive a scanned contract, an old book page, or
          a photographed document that you cannot search or copy from. Using
          optical character recognition, it recognises text in 13 languages —
          English, Hindi, Bengali, Odia, Tamil, Telugu, Marathi, Gujarati,
          Punjabi, Arabic, French, Spanish and German — processing each page with
          a live progress indicator. Unlike paid OCR services that upload your files and cap free
          pages, this runs entirely in your browser with Tesseract.js — your PDF
          is never sent to any server, so even confidential scans stay completely
          private on your device. Only the language model is fetched, never your
          file. There are no daily limits and no watermark. It works in Chrome,
          Firefox, Safari, and Edge with no installation and no signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/pdf/ocr" />
      <p className="mt-8 text-[15px] leading-relaxed text-text-muted">
        Working from a screenshot or photo instead of a PDF? Use{" "}
        <Link
          href="/image/image-to-text"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          Image to Text
        </Link>
        . For a language list, an accuracy checklist and help choosing between
        the two, see all{" "}
        <Link
          href="/ocr-tools"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          OCR tools
        </Link>
        .
      </p>
      <ProseSection title="What is OCR, and how does this tool work?">
        <p>
          <strong>OCR (Optical Character Recognition)</strong> is the technology that
          turns a picture of text — a scan, a photo, or an image-based PDF — into real,
          selectable, editable text. A scanned page is just pixels to a computer; OCR
          analyses those pixels, recognises the shapes of letters and words, and
          reconstructs the underlying characters.
        </p>
        <h3>From pixels to an editable document</h3>
        <p>
          Most free OCR tools stop at a flat wall of text. This one goes further: it
          reads the <strong>layout geometry</strong> the OCR engine produces — the
          position and size of every word, line and block — and uses it to rebuild the
          document&apos;s structure. Larger, isolated lines become <strong>headings</strong>;
          flowing lines become <strong>paragraphs</strong> (with end-of-line hyphenation
          repaired); bulleted or numbered lines become <strong>lists</strong>; and rows of
          text separated by aligned column gaps are recovered as real, editable
          <strong> tables</strong>. The result is a document you can export to{" "}
          <Link href="/pdf/pdf-to-word">Word</Link>, HTML or Markdown with far less cleanup —
          or as a <strong>searchable PDF</strong> that keeps the original page exactly as it
          looks while adding a selectable, copyable text layer on top.
        </p>
        <h3>Tips for the most accurate results</h3>
        <ul>
          <li>Use a clean scan of at least <strong>300 DPI</strong>; low-resolution or blurry pages reduce accuracy.</li>
          <li>Make sure the page is straight — skewed scans confuse line detection.</li>
          <li>Pick the correct <strong>language</strong> (English, Hindi, Bengali, Odia, Tamil, Telugu, Marathi, Gujarati, Punjabi and more) so the engine uses the right character model.</li>
          <li>High contrast helps — dark text on a light background recognises best.</li>
          <li>Use the <strong>editable result</strong> to fix the highlighted low-confidence words before exporting.</li>
        </ul>
        <h3>Privacy by design</h3>
        <p>
          The entire process — rendering, recognition and reconstruction — runs inside
          your browser with WebAssembly. Your document is <strong>never uploaded</strong>
          to any server, and it is discarded the moment you close the tab, which makes it
          safe for contracts, statements and other sensitive scans. Working with a photo
          instead of a PDF? Use <Link href="/image/image-to-text">Image to Text</Link>. Need
          to shrink the file first? Try <Link href="/pdf/compress">Compress PDF</Link>.
        </p>
      </ProseSection>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/ocr" />
    </div>
  );
}
