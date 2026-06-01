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
  title: "Merge PDF Files Free Online",
  description:
    "Combine multiple PDF files into one. Free, no signup, no file size limit. Drag to reorder pages before merging.",
  keywords:
    "merge pdf, combine pdf files, join pdf online free, merge pdf without watermark",
  openGraph: {
    title: "Merge PDF Files Free Online | GetFreeToolsAI",
    description:
      "Combine multiple PDF files into one. Free, no signup, drag to reorder before merging.",
    url: "https://getfreetoolsai.com/pdf/merge",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files Free Online",
    description: "Combine multiple PDF files into one. Free, browser-based.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/merge" },
};

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
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
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
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/merge" />
    </div>
  );
}
