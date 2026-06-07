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
  title:
    "Rotate PDF Pages Free Online — Rotate PDF 90° 180° 270°",
  description:
    "Rotate PDF pages free online. Rotate all pages or specific pages by 90, 180, or 270 degrees. No signup, no watermark. Download instantly. Browser-based.",
  keywords:
    "rotate pdf, rotate pdf online free, rotate pdf pages, flip pdf pages, pdf rotation tool free",
  path: "/pdf/rotate",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF Rotator",
  description:
    "Rotate PDF pages 90, 180 or 270 degrees free online. No signup, no watermark.",
  path: "/pdf/rotate",
  ratingCount: 531,
});

const RotatePDF = dynamic(() => import("@/components/tools/RotatePDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I rotate only some pages?",
    a: "Yes. Choose “Specific pages” and enter a range like 1,3,5-8. Only those pages are rotated; the rest stay as they are.",
  },
  {
    q: "Which rotation angles are available?",
    a: "You can rotate 90° clockwise, 180°, or 90° counter-clockwise (270°). The rotation is added to each page’s existing orientation.",
  },
  {
    q: "Does rotating reduce quality?",
    a: "No. Rotation only changes the page’s orientation flag — the original content is untouched, so there’s zero quality loss.",
  },
  {
    q: "Will the rotated PDF have a watermark?",
    a: "No. The output is a clean PDF with no watermark or branding.",
  },
  {
    q: "Are my files uploaded to your server?",
    a: "No. Rotation runs entirely in your browser with pdf-lib, so your PDF never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="Rotate PDF"
      />
      <ToolHeader
        title="Rotate PDF"
        description="Fix the orientation of your PDF — rotate every page or just the ones you choose, instantly and for free."
      />
      <div className="mt-8">
        <RotatePDF />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Choose angle and pages",
          "Download the rotated PDF",
        ]}
      />
      <ToolDemo kind="rotate-pdf" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF rotator fixes the orientation of pages that scanned in
          sideways or upside down. It is the tool you reach for when a scanner or
          phone-camera document opens at the wrong angle, when only a few pages
          of a report need turning, or when you want a landscape page to display
          upright. Rotate every page or just a chosen range by 90°, 180°, or
          270°, and download the corrected file instantly. Because rotation only
          changes each page’s orientation flag, there is zero quality loss — the
          original content is untouched. Unlike paid editors, GetFreeToolsAI
          adds no watermark and imposes no daily limits. Everything runs locally
          in your browser using pdf-lib, so your document is never uploaded to a
          server and stays private on your device. It works in Chrome, Firefox,
          Safari, and Edge with no installation and no signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/pdf/rotate" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/rotate" />
    </div>
  );
}
