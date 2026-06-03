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
    "Word to PDF Converter Free Online — Convert DOCX to PDF | GetFreeToolsAI",
  description:
    "Convert Word documents to PDF free online. No signup, no watermark, no file size limit. Formatting preserved. Works in your browser — your files never uploaded. Convert DOCX to PDF instantly.",
  keywords:
    "word to pdf, word to pdf converter free, docx to pdf, convert word to pdf online, doc to pdf free, word to pdf no signup, microsoft word to pdf free",
  path: "/pdf/word-to-pdf",
});

const jsonLd = softwareAppSchema({
  name: "Free Word to PDF Converter",
  description:
    "Convert Word (DOCX) documents to PDF free online with formatting preserved. No signup, no watermark.",
  path: "/pdf/word-to-pdf",
  ratingCount: 1890,
});

const WordToPdf = dynamic(() => import("@/components/tools/WordToPdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I convert .doc and .docx files?",
    a: "Modern .docx files (Word 2007 and newer) are fully supported. Legacy .doc files aren’t — open them in Word or Google Docs and re-save as .docx first.",
  },
  {
    q: "Will my formatting be preserved?",
    a: "Yes. Headings, bold and italic text, lists and paragraphs are rendered into the PDF so it looks like your document. Very complex layouts may differ slightly.",
  },
  {
    q: "Is there a file size limit?",
    a: "You can convert files up to 50MB each, and several at once. Because it runs in your browser, the practical limit is your device’s memory.",
  },
  {
    q: "Are my Word documents uploaded to a server?",
    a: "No. The conversion happens entirely in your browser — your documents never leave your device.",
  },
  {
    q: "Can I convert multiple Word files at once?",
    a: "Yes. Add several .docx files, convert them in one batch, and download them individually or together as a ZIP.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="Word to PDF"
      />
      <ToolHeader
        title="Word to PDF Converter"
        description="Convert Word (.docx) documents to clean PDFs with your formatting preserved — privately, in your browser."
      />
      <div className="mt-8">
        <WordToPdf />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your Word files",
          "We convert them to PDF",
          "Download your PDFs",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free Word to PDF converter turns your .docx documents into clean,
          shareable PDFs with the formatting preserved. It is the tool you need
          before sending a résumé, a cover letter, an assignment, or a contract,
          when you want the layout to look identical on every device and prevent
          accidental edits. Headings, bold and italic text, lists, and
          paragraphs are rendered faithfully into the PDF, and you can convert
          several files in one batch and download them together as a ZIP. Unlike
          Smallpdf and similar services that cap free conversions and add a
          watermark, GetFreeToolsAI is unlimited and watermark-free. The
          conversion happens entirely in your browser, so your documents are
          never uploaded to a server and stay private on your device. It works
          in every modern browser including Chrome, Firefox, Safari, and Edge,
          with no installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/word-to-pdf" />
    </div>
  );
}
