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
  title: "Round Image Corners Free Online",
  description:
    "Add rounded corners to images free online. Set a custom corner radius and export as a PNG with transparent background. No signup.",
  keywords:
    "round image corners free, rounded corners photo online, circle image maker free, round corners photo editor free",
  path: "/image/rounded-corners",
});

const jsonLd = softwareAppSchema({
  name: "Free Round Image Corners Tool",
  description:
    "Add rounded corners to images free online with a custom radius. Export transparent PNG. No signup, no watermark.",
  path: "/image/rounded-corners",
  ratingCount: 318,
});

const RoundedCorners = dynamic(
  () => import("@/components/tools/RoundedCorners"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "How do I round the corners of an image?",
    a: "Upload your image and drag the corner-radius slider (or pick a preset like Slight, Medium, Heavy or Circle). The live preview updates instantly, then download the result.",
  },
  {
    q: "Can I make a circular image?",
    a: "Yes. Set the radius to 50% (the Circle preset) on a square image to get a perfect circle, exported as a transparent PNG.",
  },
  {
    q: "Will the corners be transparent?",
    a: "If you choose the Transparent background and export as PNG, the rounded corners are fully transparent. Choose White or a custom colour to fill them instead.",
  },
  {
    q: "Which formats are supported?",
    a: "Upload JPG, PNG or WebP. The output is PNG when using a transparent background (to preserve transparency), otherwise JPG.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. Rounding happens entirely in your browser, so your image never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Round Corners"
      />
      <ToolHeader
        title="Round Image Corners"
        description="Give any image smooth rounded corners — or a perfect circle — and export a transparent PNG, all in your browser."
      />
      <div className="mt-8">
        <RoundedCorners />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "Set the corner radius",
          "Download the rounded image",
        ]}
      />
      <ToolDemo kind="rounded" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free round-corners tool gives any image smooth rounded edges — or
          turns a square photo into a perfect circle. It is ideal for profile
          pictures, app icons, avatars, thumbnails, and UI mockups where sharp
          rectangular corners look out of place. Drag the radius slider or pick a
          preset like Slight, Medium, Heavy, or Circle, and watch the live
          preview update instantly. Export as a PNG with the corners fully
          transparent so the image drops cleanly onto any background, or fill them
          with white or a custom colour. Unlike paid design apps, GetFreeToolsAI
          is completely free with no daily limits and no watermark. Rounding
          happens entirely in your browser, so your image is never uploaded to a
          server and stays private on your device. It works in Chrome, Firefox,
          Safari, and Edge with no installation and no signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/image/rounded-corners" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/rounded-corners" />
    </div>
  );
}
