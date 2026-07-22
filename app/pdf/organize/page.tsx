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
  title: "Organize PDF — Reorder, Rotate & Delete Pages Free",
  description:
    "Organize a PDF online free — drag to reorder pages, rotate them, and delete the ones you don't need, then save. Runs in your browser, no upload, no watermark.",
  keywords:
    "organize pdf, reorder pdf pages, rearrange pdf pages, sort pdf pages, rotate pdf pages, delete pdf pages, pdf page organizer free",
  path: "/pdf/organize",
});

const jsonLd = softwareAppSchema({
  name: "Free Organize PDF Tool",
  description:
    "Reorder, rotate and delete PDF pages visually, then save — entirely in your browser.",
  path: "/pdf/organize",
});

const OrganizePdf = dynamic(() => import("@/components/tools/OrganizePdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I reorder pages in a PDF?", a: "Upload your PDF, then drag any page thumbnail to a new position — or use the left/right arrows on each page. When the order looks right, click Save PDF." },
  { q: "Can I rotate individual pages?", a: "Yes. Each page has a rotate button that turns just that page 90° at a time, which is handy for fixing sideways scans." },
  { q: "Can I delete pages here too?", a: "Yes. Click the trash icon on any page to remove it. The remaining pages keep your chosen order when you save." },
  { q: "Is my PDF uploaded to a server?", a: "No. The whole tool runs in your browser using pdf.js and pdf-lib, so your document never leaves your device — safe for contracts and private files." },
  { q: "Does it add a watermark or change quality?", a: "Never. Pages are copied as-is into the new order with no watermark and no re-compression, so quality is unchanged." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="PDF Tools" sectionHref="/pdf-tools" current="Organize PDF" />
      <ToolHeader
        title="Organize PDF"
        description="Drag to reorder pages, rotate them, and delete the ones you don't need — then save, all in your browser."
      />
      <div className="mt-8">
        <OrganizePdf />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your PDF never leaves your browser.</span>{" "}
        Pages are rendered and rebuilt on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to organize a PDF"
        steps={[
          "Upload your PDF",
          "Drag, rotate or delete pages",
          "Save and download the result",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Organize PDF gives you a visual grid of every page so you can put a
          document in the right shape without any software. Drag thumbnails to
          reorder them, rotate a sideways scan, and drop pages you don&apos;t
          need — then save a clean new PDF. It&apos;s ideal for assembling a
          report in the correct sequence, fixing a scan that came out rotated, or
          trimming a long document down to the pages that matter. Everything runs
          locally with pdf.js and pdf-lib, so your file is never uploaded, there
          is no watermark, and page quality is untouched because pages are copied
          rather than re-rendered.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/organize" />
    </div>
  );
}
