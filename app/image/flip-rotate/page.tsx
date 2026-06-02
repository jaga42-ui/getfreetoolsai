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
  title: "Flip & Rotate Image Free Online | GetFreeToolsAI",
  description:
    "Rotate and flip images free online. Rotate 90°, 180°, 270° or a custom angle. Flip horizontally or vertically. No signup. Works in your browser instantly.",
  keywords:
    "rotate image online free, flip image online, rotate photo free, flip photo online, rotate jpg free, rotate png online",
  path: "/image/flip-rotate",
});

const jsonLd = softwareAppSchema({
  name: "Free Flip & Rotate Image Tool",
  description:
    "Rotate and flip images free online — 90°, 180°, custom angle, horizontal/vertical flip. No signup, no watermark.",
  path: "/image/flip-rotate",
  ratingCount: 612,
});

const FlipRotate = dynamic(() => import("@/components/tools/FlipRotate"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I rotate by a custom angle?",
    a: "Yes. Use the quick 90°/180° buttons, or drag the custom-angle slider for any rotation between −180° and 180°. The canvas resizes automatically to fit the rotated image.",
  },
  {
    q: "Will rotating add a background to the corners?",
    a: "For JPG images the exposed corners are filled white (JPG has no transparency); for PNG and WebP they stay transparent, so your rotated image keeps a clean edge.",
  },
  {
    q: "Can I flip and rotate at the same time?",
    a: "Yes. Flip horizontal/vertical and rotation combine, and the live preview shows the exact result before you download.",
  },
  {
    q: "Which formats are supported?",
    a: "JPG, PNG, WebP and GIF. The output is saved in the same format family as your original.",
  },
  {
    q: "Is my image uploaded to a server?",
    a: "No. Everything runs in your browser using the HTML canvas, so your image never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Flip & Rotate"
      />
      <ToolHeader
        title="Flip & Rotate Image"
        description="Rotate by 90°, 180° or any custom angle and flip horizontally or vertically — instantly, in your browser."
      />
      <div className="mt-8">
        <FlipRotate />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "Rotate or flip it",
          "Download the result",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/flip-rotate" />
    </div>
  );
}
