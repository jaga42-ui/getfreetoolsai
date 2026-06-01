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
    "JPG to PDF Converter Free Online — Convert Images to PDF | GetFreeToolsAI",
  description:
    "Convert JPG, PNG, WebP images to PDF free online. Combine multiple images into one PDF. No signup, no watermark, no file size limit. Browser-based and private.",
  keywords:
    "jpg to pdf, jpg to pdf converter free, image to pdf, convert photo to pdf, png to pdf free, combine images to pdf",
  path: "/pdf/jpg-to-pdf",
});

const jsonLd = softwareAppSchema({
  name: "Free JPG to PDF Converter",
  description:
    "Convert JPG, PNG and WebP images into a single PDF free online. No signup, no watermark.",
  path: "/pdf/jpg-to-pdf",
  ratingCount: 977,
});

const JpgToPdf = dynamic(() => import("@/components/tools/JpgToPdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I combine multiple images into one PDF?",
    a: "Yes. Add as many images as you like — each becomes a page in a single PDF, in the order shown. Use the arrows to reorder pages before creating the PDF.",
  },
  {
    q: "What page size options are there?",
    a: "“Fit to image” makes each page match its image exactly, while “A4 page” places each image centred on a standard A4 sheet with margins — ideal for printing.",
  },
  {
    q: "Which image formats are supported?",
    a: "JPG, PNG, WebP and BMP. WebP and BMP are converted to JPG automatically as they’re embedded into the PDF.",
  },
  {
    q: "Will the PDF have a watermark?",
    a: "No. The generated PDF is clean, with no watermark or branding added.",
  },
  {
    q: "Are my images uploaded to a server?",
    a: "No. The PDF is assembled in your browser with pdf-lib, so your images never leave your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="JPG to PDF"
      />
      <ToolHeader
        title="JPG to PDF Converter"
        description="Turn your images into a single, shareable PDF. Reorder pages and pick a page size — no signup, no watermark."
      />
      <div className="mt-8">
        <JpgToPdf />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your images",
          "Reorder and pick page size",
          "Download your PDF",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/jpg-to-pdf" />
    </div>
  );
}
