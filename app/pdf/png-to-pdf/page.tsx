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
  title:
    "PNG to PDF Converter Free Online — Convert PNG Images to PDF | GetFreeToolsAI",
  description:
    "Convert PNG images to PDF free online. Batch convert multiple PNG files. No signup, no watermark. Merge multiple PNGs into one PDF or individual files.",
  keywords:
    "png to pdf, png to pdf converter free, convert png to pdf online, png to pdf no signup, image to pdf free, webp to pdf",
  path: "/pdf/png-to-pdf",
});

const jsonLd = softwareAppSchema({
  name: "Free PNG to PDF Converter",
  description:
    "Convert PNG images to PDF free online. Batch convert, merge or individual PDFs. No signup, no watermark.",
  path: "/pdf/png-to-pdf",
  ratingCount: 1124,
});

const PngToPdf = dynamic(() => import("@/components/tools/PngToPdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I convert multiple PNG files at once?",
    a: "Yes. Add as many PNGs as you like, reorder them, then convert them into a single PDF or one PDF per image — bundled as a ZIP when there are several.",
  },
  {
    q: "How is this different from JPG to PDF?",
    a: "It’s the same engine tuned for PNG. PNG is lossless and supports transparency, so it’s ideal for screenshots, logos and diagrams. WebP, BMP and GIF are accepted too.",
  },
  {
    q: "What page size will my PDF be?",
    a: "Choose “Fit” to make each page match its image exactly, or A4/Letter with portrait/landscape and a margin to standardise pages for printing.",
  },
  {
    q: "Will my PNG transparency be preserved?",
    a: "Transparent PNGs are placed directly. On standardised pages the surrounding area is white, which is what you want for printing.",
  },
  {
    q: "Is there a limit on the number of files?",
    a: "No fixed limit — it depends on your device’s memory, since everything is processed locally in your browser.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="PNG to PDF"
      />
      <ToolHeader
        title="PNG to PDF Converter"
        description="Turn PNG images into a clean PDF — merge them into one document or export one PDF per image. No signup, no watermark."
      />
      <div className="mt-8">
        <PngToPdf />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PNG images",
          "Pick page size and output",
          "Download your PDF",
        ]}
      />
      <ToolDemo kind="png-to-pdf" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PNG to PDF converter turns lossless PNG images — and WebP,
          BMP, or GIF files — into a clean PDF. It is the ideal choice for
          screenshots, logos, diagrams, and graphics where you want crisp edges
          and preserved transparency rather than the compression of a JPG. Merge
          several PNGs into one document or export one PDF per image, reorder
          pages before converting, and pick a page size such as Fit, A4, or
          Letter with your chosen orientation and margins. Unlike subscription
          PDF suites, GetFreeToolsAI has no daily limits and never adds a
          watermark. The PDF is assembled locally in your browser using pdf-lib,
          so your images are never uploaded to a server and stay private on your
          device. It works in every modern browser including Chrome, Firefox,
          Safari, and Edge, with no installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/png-to-pdf" />
    </div>
  );
}
