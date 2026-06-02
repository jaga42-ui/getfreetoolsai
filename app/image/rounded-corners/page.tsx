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
  title: "Round Image Corners Free Online | GetFreeToolsAI",
  description:
    "Add rounded corners to images free online. Set a custom corner radius and export as a PNG with transparent background. No signup. Works in your browser instantly.",
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
        sectionHref="/#all-tools"
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
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/rounded-corners" />
    </div>
  );
}
