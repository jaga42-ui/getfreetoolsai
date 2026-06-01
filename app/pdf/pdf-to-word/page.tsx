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
  title: "PDF to Word Converter Free Online",
  description:
    "Convert PDF to an editable Word (.docx) document free. Extracts text in your browser — no signup, no upload, 100% private.",
  keywords:
    "pdf to word, pdf to docx, convert pdf to word free, pdf to editable text, pdf to doc",
  openGraph: {
    title: "PDF to Word Converter Free Online | GetFreeToolsAI",
    description:
      "Convert PDF to an editable Word document free. Extracts text in your browser, 100% private.",
    url: "https://getfreetoolsai.com/pdf/pdf-to-word",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Word Converter Free Online",
    description: "Convert PDF to editable Word free. Browser-based, private.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/pdf-to-word" },
};

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
