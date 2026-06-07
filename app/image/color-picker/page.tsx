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
    "Image Color Picker Free Online — Pick Colors from Any Image",
  description:
    "Pick colors from any image free online. Get HEX, RGB, HSL values instantly. Extract the dominant color palette from photos. No signup. Works in your browser.",
  keywords:
    "color picker from image free, image color picker online, pick color from photo, hex color picker from image, color extractor from image free",
  path: "/image/color-picker",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Color Picker",
  description:
    "Pick colors from any image and get HEX, RGB and HSL values. Extract dominant palette. No signup, no watermark.",
  path: "/image/color-picker",
  ratingCount: 401,
});

const ColorPicker = dynamic(() => import("@/components/tools/ColorPicker"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I pick a color from an image?",
    a: "Upload your image, then click anywhere on it. The exact colour under your cursor is shown as HEX, RGB and HSL, and added to your recent-colours history.",
  },
  {
    q: "Can I get the dominant colors of a photo?",
    a: "Yes. The tool automatically extracts the top five dominant colours from the whole image as a palette — click any swatch to copy its HEX value.",
  },
  {
    q: "What color formats do I get?",
    a: "HEX (e.g. #FF5733), RGB (rgb(255, 87, 51)) and HSL (hsl(11, 100%, 60%)). Click any value to copy it to your clipboard.",
  },
  {
    q: "Does it keep a history of picked colors?",
    a: "Yes, your last ten picked colours are kept for the session so you can re-select them. They’re cleared when you start over or close the tab.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. The image is read locally on a canvas in your browser, so it never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Color Picker"
      />
      <ToolHeader
        title="Image Color Picker"
        description="Click any pixel to grab its HEX, RGB and HSL value, and pull the dominant palette from any photo — all in your browser."
      />
      <div className="mt-8">
        <ColorPicker />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "Click to pick a colour",
          "Copy HEX, RGB or HSL",
        ]}
      />
      <ToolDemo kind="colorpick" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image color picker lets you click any pixel in a photo and
          instantly read its exact colour as HEX, RGB, and HSL. It is the tool
          designers and developers reach for when matching a brand colour from a
          logo, sampling a shade from a reference photo, or building a palette
          for a website or presentation. Beyond single-pixel picking, it
          automatically extracts the five dominant colours from the whole image
          as a ready-made palette, and keeps a history of your recently picked
          colours so you can re-select them. Click any value to copy it straight
          to your clipboard. Unlike paid design suites, GetFreeToolsAI is
          completely free with no limits and no watermark. The image is read
          locally on a canvas in your browser, so it never leaves your device. It
          works in Chrome, Firefox, Safari, and Edge with no installation and no
          signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/image/color-picker" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/color-picker" />
    </div>
  );
}
