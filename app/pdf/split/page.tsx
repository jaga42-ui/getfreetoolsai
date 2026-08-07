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

export const metadata = toolMeta({
  title: "Split PDF Online Free — Extract PDF Pages Instantly",
  description:
    "Split PDF into multiple files or extract specific pages free online. No signup required. Enter page ranges like 1-3,5,8. Download as ZIP.",
  keywords:
    "split pdf, split pdf online free, extract pages from pdf, pdf splitter free, separate pdf pages, pdf page extractor free",
  path: "/pdf/split",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF Splitter",
  description:
    "Split PDF into multiple files or extract specific pages free online. No signup, no watermark.",
  path: "/pdf/split",
  ratingCount: 884,
});

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
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
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
      <ToolDemo kind="split" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF splitter lets you extract specific pages from a PDF or
          break a large document into separate files. It is ideal when you only
          need a single page from a long statement, want to pull a signed form
          out of a scanned packet, or need to separate a merged file back into
          individual chapters. Type a printer-style range like 1,3,5-8 to pull
          exactly the pages you want, or split every page into its own PDF
          bundled as a ZIP. Unlike paid tools that lock splitting behind a
          subscription, GetFreeToolsAI is completely free with no daily limits
          and no watermark. Pages are copied byte-for-byte, so text, fonts, and
          layout are preserved exactly. Everything runs locally in your browser
          using pdf-lib — your file is never uploaded to any server. It works in
          every modern browser with no installation and no signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/pdf/split" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/split" />
    </div>
  );
}
