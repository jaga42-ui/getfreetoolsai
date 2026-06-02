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
  title: "Add Watermark to PDF Free Online | GetFreeToolsAI",
  description:
    "Add a text or image watermark to PDF free online. Customise opacity, position and rotation. No signup, no third-party watermark added. 100% browser-based.",
  keywords:
    "add watermark to pdf free, pdf watermark online free, watermark pdf free, pdf watermark tool, text watermark pdf free",
  path: "/pdf/watermark",
});

const jsonLd = softwareAppSchema({
  name: "Free Add Watermark to PDF",
  description:
    "Add a text or image watermark to PDF free online with custom opacity, position and rotation. No signup, no watermark from us.",
  path: "/pdf/watermark",
  ratingCount: 356,
});

const PdfWatermark = dynamic(() => import("@/components/tools/PdfWatermark"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I add a text or an image watermark?",
    a: "Both. Type any text watermark, or upload a PNG/JPG logo as an image watermark. You control opacity, position and (for text) rotation.",
  },
  {
    q: "Can I tile the watermark across the whole page?",
    a: "Yes. For text watermarks choose the Tile position to repeat it diagonally across every page — great for “CONFIDENTIAL” or “DRAFT” stamps.",
  },
  {
    q: "Does it add its own watermark or branding?",
    a: "Never. Only the watermark you create is added — there’s no GetFreeToolsAI logo or third-party mark.",
  },
  {
    q: "Will it apply to every page?",
    a: "Yes, the watermark is applied to all pages of the PDF in one pass.",
  },
  {
    q: "Is my PDF uploaded to a server?",
    a: "No. Watermarking runs entirely in your browser with pdf-lib, so your document never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
        current="Add Watermark"
      />
      <ToolHeader
        title="Add Watermark to PDF"
        description="Stamp a custom text or logo watermark across your PDF with full control over opacity, position and rotation — privately, in your browser."
      />
      <div className="mt-8">
        <PdfWatermark />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Set up your watermark",
          "Download the watermarked PDF",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free add-watermark tool stamps a custom text or logo watermark
          across every page of a PDF. It is what you need to mark a document
          “CONFIDENTIAL” or “DRAFT”, brand a proposal with your company logo, or
          protect work you are sharing for review. Type any text or upload a
          PNG/JPG logo, then control its opacity, position, and rotation — or
          tile a text watermark diagonally across the whole page. The key
          difference from free online watermarkers is that GetFreeToolsAI never
          adds its own branding: only the watermark you create appears, with no
          daily limits. Everything runs locally in your browser using pdf-lib,
          so your document is never uploaded to a server and your confidential
          files stay on your device. It works in Chrome, Firefox, Safari, and
          Edge with no installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/watermark" />
    </div>
  );
}
