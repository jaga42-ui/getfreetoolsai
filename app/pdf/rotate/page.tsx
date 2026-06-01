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
  title: "Rotate PDF Pages Free Online",
  description:
    "Rotate PDF pages 90, 180 or 270 degrees. Rotate all pages or specific pages. Free, no signup, no watermark, browser-based.",
  keywords:
    "rotate pdf, rotate pdf pages, turn pdf page, fix pdf orientation free, rotate pdf online",
  openGraph: {
    title: "Rotate PDF Pages Free Online | GetFreeToolsAI",
    description:
      "Rotate PDF pages 90/180/270 degrees, all or specific pages. Free, no watermark.",
    url: "https://getfreetoolsai.com/pdf/rotate",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF Pages Free Online",
    description: "Rotate PDF pages, all or specific. Free, browser-based.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/pdf/rotate" },
};

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
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/#all-tools"
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
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/rotate" />
    </div>
  );
}
