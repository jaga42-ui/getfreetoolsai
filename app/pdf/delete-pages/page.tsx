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
  title: "Delete PDF Pages — Remove Pages from a PDF Free",
  description:
    "Delete pages from a PDF online free. Remove single pages or ranges and keep the rest in order — in your browser, no upload, no signup, no watermark.",
  keywords:
    "delete pdf pages, remove pages from pdf, delete pages from pdf free, remove pdf page online, delete page from pdf",
  path: "/pdf/delete-pages",
});

const jsonLd = softwareAppSchema({
  name: "Free Delete PDF Pages Tool",
  description:
    "Remove specific pages or ranges from a PDF and keep the rest, entirely in your browser.",
  path: "/pdf/delete-pages",
});

const DeletePdfPages = dynamic(() => import("@/components/tools/DeletePdfPages"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I delete pages from a PDF?", a: "Upload the PDF, type the pages to remove (for example 2,5-7,10), and click Remove pages. The kept pages stay in their original order in a new PDF." },
  { q: "Can I remove a range of pages?", a: "Yes. Use commas and ranges together, like 1,4-6,9, to remove several pages and ranges at once." },
  { q: "Want to reorder or rotate instead?", a: "Use the Organize PDF tool for a visual grid where you can drag to reorder, rotate and delete pages together." },
  { q: "Is my PDF uploaded anywhere?", a: "No. The file is processed in your browser with pdf-lib, so it never leaves your device — safe for private documents." },
  { q: "Does it add a watermark?", a: "No. The output has no watermark, and the kept pages are copied without any quality loss." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="PDF Tools" sectionHref="/pdf-tools" current="Delete PDF Pages" />
      <ToolHeader
        title="Delete PDF Pages"
        description="Remove specific pages or ranges from a PDF and keep the rest in order — entirely in your browser."
      />
      <div className="mt-8">
        <DeletePdfPages />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your PDF never leaves your browser.</span>{" "}
        Pages are removed on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to delete pages from a PDF"
        steps={[
          "Upload your PDF",
          "Type the pages to remove",
          "Download the trimmed PDF",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          This free tool removes the pages you don&apos;t want from a PDF and
          keeps everything else in its original order. Enter individual pages and
          ranges together — such as a blank cover sheet, a duplicate scan, or a
          confidential appendix — and download a clean, trimmed PDF. It is the
          quickest way to drop a few pages when you don&apos;t need to rearrange
          anything; if you also want to reorder or rotate, use{" "}
          <a
            href="/pdf/organize"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            Organize PDF
          </a>
          . Everything runs locally with pdf-lib, so your document is never
          uploaded and there is no watermark or quality loss.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/delete-pages" />
    </div>
  );
}
