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
  title: "Add Page Numbers to PDF Free Online | GetFreeToolsAI",
  description:
    "Add page numbers to PDF free online. Choose position, format, and starting number. No signup, no watermark. Processed entirely in your browser.",
  keywords:
    "add page numbers to pdf free, pdf page numbering free, number pdf pages online, pdf page numbers tool free",
  path: "/pdf/number-pages",
});

const jsonLd = softwareAppSchema({
  name: "Free Add Page Numbers to PDF",
  description:
    "Add page numbers to PDF free online — choose position, format and start number. No signup, no watermark.",
  path: "/pdf/number-pages",
  ratingCount: 287,
});

const NumberPages = dynamic(() => import("@/components/tools/NumberPages"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Where can I place the page numbers?",
    a: "Any of six positions — bottom or top, left, centre or right. Pick the one that suits your document.",
  },
  {
    q: "What number formats are available?",
    a: "Plain (1), “Page 1”, “1 of N”, and dashed “- 1 -”. You can also choose the starting number and font size.",
  },
  {
    q: "Can I skip the cover page?",
    a: "Yes. Enable “Skip first page” so numbering begins on page 2 — handy when page 1 is a title or cover.",
  },
  {
    q: "Will it change my PDF’s content?",
    a: "No. It only stamps the page number text; the rest of your document is untouched, with no watermark added.",
  },
  {
    q: "Is my PDF uploaded anywhere?",
    a: "No. Numbering runs entirely in your browser with pdf-lib, so your file never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="Add Page Numbers"
      />
      <ToolHeader
        title="Add Page Numbers to PDF"
        description="Stamp page numbers onto your PDF with full control over position, format and starting number — privately, in your browser."
      />
      <div className="mt-8">
        <NumberPages />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Choose position and format",
          "Download the numbered PDF",
        ]}
      />
      <ToolDemo kind="number" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free add-page-numbers tool stamps clean, professional page numbers
          onto any PDF. It is the finishing touch you need for a thesis, a legal
          bundle, a contract, or a multi-chapter report where readers must be
          able to reference pages precisely. Choose from six positions, several
          formats such as plain numbers, “Page 1”, “1 of N”, or dashed “- 1 -”,
          and set the starting number and font size to suit your document. You
          can even skip the first page when it is a cover or title sheet. Unlike
          paid PDF editors, GetFreeToolsAI adds no watermark of its own and has
          no daily limits — only the page numbers you ask for are added.
          Everything runs locally in your browser using pdf-lib, so your file is
          never uploaded to a server and stays private on your device. It works
          in every modern browser with no installation and no signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/pdf/number-pages" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/number-pages" />
    </div>
  );
}
