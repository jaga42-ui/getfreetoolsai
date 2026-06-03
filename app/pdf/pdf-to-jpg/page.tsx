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
    "PDF to JPG Converter Free Online — Convert PDF Pages to Images | GetFreeToolsAI",
  description:
    "Convert PDF pages to JPG images free online. No signup, no watermark. Convert all pages or specific pages. Download individually or as ZIP. 100% browser-based.",
  keywords:
    "pdf to jpg, pdf to jpg converter free, convert pdf to image, pdf to jpeg online free, pdf pages to jpg",
  path: "/pdf/pdf-to-jpg",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF to JPG Converter",
  description:
    "Convert PDF pages to JPG images free online. No signup, no watermark, browser-based.",
  path: "/pdf/pdf-to-jpg",
  ratingCount: 1320,
});

const PdfToJpg = dynamic(() => import("@/components/tools/PdfToJpg"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I convert specific pages only?",
    a: "Yes. Switch to “Specific pages” and enter a range like 1,3,5-8. Only those pages are rendered to JPG, which is faster for large documents.",
  },
  {
    q: "What quality options are available?",
    a: "Choose Low, Medium, High or Max. Higher settings render the pages at a larger resolution for crisp images, at the cost of bigger files and slightly longer processing.",
  },
  {
    q: "Can I convert a PDF with many pages?",
    a: "Yes. There’s no page limit. A live progress bar shows which page is rendering. Very large PDFs at Max quality use more memory, so reduce quality if your device struggles.",
  },
  {
    q: "Will images have watermarks?",
    a: "No. The JPG images are clean with no watermark, logo or branding added.",
  },
  {
    q: "How long does conversion take?",
    a: "Usually a second or two per page, depending on page complexity, chosen quality and your device. Everything runs locally, so there’s no upload or queue wait.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="PDF to JPG"
      />
      <ToolHeader
        title="PDF to JPG Converter"
        description="Turn every PDF page into a high-quality JPG image. Preview, download individually, or grab them all as a ZIP."
      />
      <div className="mt-8">
        <PdfToJpg />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Pick pages and quality",
          "Download your JPG images",
        ]}
      />
      <ToolDemo kind="pdf-to-jpg" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF to JPG converter renders every page of a PDF into a
          crisp, high-quality image. It is the tool you need when a website only
          accepts image uploads, when you want to post a PDF page to social
          media, or when you need a thumbnail or preview of a document. Choose
          the exact pages and the resolution you want, then download images
          individually or all at once as a ZIP. Unlike Smallpdf and Adobe, which
          gate free conversions and add their branding, GetFreeToolsAI has no
          daily limits and never adds a watermark. Pages are rendered locally in
          your browser with pdf.js, so your document is never uploaded to a
          server — there is no queue and no waiting, and your private files stay
          on your device. It works in Chrome, Firefox, Safari, and Edge with no
          installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/pdf-to-jpg" />
    </div>
  );
}
