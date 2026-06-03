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
  title: "Rotate & Flip Image Free Online — Rotate Photo 90° 180° | GetFreeToolsAI",
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
        sectionHref="/image-tools"
        current="Flip & Rotate"
      />
      <ToolHeader
        title="Rotate & Flip Image"
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
      <ToolDemo kind="rotate-image" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free flip and rotate tool fixes a photo’s orientation in seconds.
          It is what you reach for when a picture imported sideways, when you want
          to mirror a selfie so text reads correctly, or when a scanned image
          needs a small custom angle to sit perfectly straight. Use the quick
          90° and 180° buttons, drag the custom-angle slider for anything in
          between, and flip horizontally or vertically — the live preview shows
          the exact result before you download. For JPGs the exposed corners are
          filled white, while PNG and WebP keep clean transparent edges. Unlike
          paid editors, GetFreeToolsAI is completely free with no limits and no
          watermark. Everything runs in your browser using the HTML canvas, so
          your image is never uploaded to a server and stays private on your
          device. It works in Chrome, Firefox, Safari, and Edge with no
          installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/flip-rotate" />
    </div>
  );
}
