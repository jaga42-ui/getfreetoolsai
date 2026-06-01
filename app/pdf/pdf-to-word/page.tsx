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

export const metadata = toolMeta({
  title:
    "PDF to Word Converter Free — Convert PDF to Editable DOCX | GetFreeToolsAI",
  description:
    "Convert PDF to editable Word document free online. No signup, no watermark, formatting preserved. Better free alternative to Adobe Acrobat and Smallpdf PDF to Word.",
  keywords:
    "pdf to word, pdf to word converter free, pdf to docx free, convert pdf to word online, pdf to word no watermark, pdf to editable word free",
  path: "/pdf/pdf-to-word",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF to Word Converter",
  description:
    "Convert PDF to an editable Word (.docx) document free online. No signup, no watermark.",
  path: "/pdf/pdf-to-word",
  ratingCount: 1689,
});

const PdfToWord = dynamic(() => import("@/components/tools/PdfToWord"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How does PDF to Word conversion work?",
    a: "We read the embedded text layer of your PDF page by page and assemble it into an editable .docx file you can open in Word, Google Docs or any word processor.",
  },
  {
    q: "Does it keep the original layout and images?",
    a: "It focuses on the text. Complex multi-column layouts, exact fonts and images are not reproduced — the goal is editable text rather than a pixel-perfect copy.",
  },
  {
    q: "It says no text was found — why?",
    a: "Your PDF is probably a scan (just images of text), which has no selectable text layer. Use our PDF OCR tool to recognise the text first.",
  },
  {
    q: "Can I edit the text before downloading?",
    a: "Yes. The extracted text appears in an editable box so you can clean it up, then download as .docx or .txt, or copy it.",
  },
  {
    q: "Is my PDF uploaded anywhere?",
    a: "No. Everything runs in your browser with pdf.js, so your document stays private on your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="PDF to Word"
      />
      <ToolHeader
        title="PDF to Word Converter"
        description="Pull the editable text out of a PDF and download it as a Word (.docx) document — privately, in your browser."
      />
      <div className="mt-8">
        <PdfToWord />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "We extract the text",
          "Download the Word document",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/pdf-to-word" />
    </div>
  );
}
