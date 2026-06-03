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

export const metadata = toolMeta({
  title: "Merge PDF Files Free Online — Combine PDFs Into One | GetFreeToolsAI",
  description:
    "Merge multiple PDF files into one free online. No signup, no file size limit, no watermark. Drag to reorder before merging. 100% browser-based. Better free alternative to Smallpdf and iLovePDF.",
  keywords:
    "merge pdf, merge pdf files free, combine pdf, join pdf online free, merge pdf without watermark, pdf merger free, combine pdf files online",
  path: "/pdf/merge",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF Merger",
  description:
    "Merge multiple PDF files into one free online. No signup, no watermark, no file size limit.",
  path: "/pdf/merge",
  ratingCount: 2103,
});

const MergePDF = dynamic(() => import("@/components/tools/MergePDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How many PDFs can I merge at once?",
    a: "There’s no fixed limit. You can add as many PDFs as you like in a single batch — the only constraint is your device’s available memory, since everything runs locally in your browser.",
  },
  {
    q: "Can I reorder pages before merging?",
    a: "Yes. Each file appears in a list where you can drag it to a new position or use the up/down arrows. The final PDF follows the order shown, top to bottom.",
  },
  {
    q: "Is there a file size limit?",
    a: "We accept files up to 200MB each. Because merging happens on your own device, there’s no server-side upload cap to worry about.",
  },
  {
    q: "Will the merged PDF have a watermark?",
    a: "Never. We don’t add watermarks, logos or any branding to your merged document. The output is a clean PDF.",
  },
  {
    q: "Are my files uploaded to your servers?",
    a: "No. All merging is performed in your browser using pdf-lib. Your files are never transmitted to us or stored anywhere.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="Merge PDF"
      />
      <ToolHeader
        title="Merge PDF Files"
        description="Combine multiple PDFs into a single document. Drag to reorder before merging — no signup, no watermark."
      />
      <div className="mt-8">
        <MergePDF />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF files",
          "Drag to set the merge order",
          "Download the merged PDF",
        ]}
      />
      <ToolDemo kind="merge" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF merger combines two or more PDF files into one tidy
          document in seconds. It is the tool you reach for when you need to
          join scanned contract pages, bundle invoices for an expense claim, or
          assemble chapters, reports, and forms into a single file before
          emailing or printing. Unlike iLovePDF and Smallpdf, which cap free
          users at a couple of tasks per hour, GetFreeToolsAI has no daily
          limits and never stamps a watermark on your output. You can add as
          many files as you like and drag them into the exact order you want
          before merging. Everything runs locally in your browser using
          pdf-lib, so your documents are never uploaded to a server — your
          confidential files stay entirely on your device. It works in Chrome,
          Firefox, Safari, and Edge with no installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/merge" />
    </div>
  );
}
