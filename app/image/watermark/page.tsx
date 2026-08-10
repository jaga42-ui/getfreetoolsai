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
import { ToolExtraContent } from "@/components/ToolExtraContent";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Add Watermark to Image Free Online — Text Watermark",
  description:
    "Add a text watermark to images free. Control size, opacity, colour and position, or tile it across the photo. No signup, no upload — in-browser.",
  keywords:
    "add watermark to image, image watermark free, watermark photo online, add text watermark, watermark maker, watermark images free, protect photos watermark",
  path: "/image/watermark",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Watermark Tool",
  description:
    "Add a custom text watermark to images free online with control over size, opacity, colour and position. No signup, no watermark from us.",
  path: "/image/watermark",
});

const ImageWatermark = dynamic(() => import("@/components/tools/ImageWatermark"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "Can I choose where the watermark goes?", a: "Yes. Place it in any corner or the centre, or choose Tile to repeat it diagonally across the whole image — useful for protecting proofs." },
  { q: "Will the watermark reduce image quality?", a: "No. The watermark is drawn over your image at full resolution and exported as a PNG, so the underlying photo is unchanged." },
  { q: "Does it add any branding of its own?", a: "Never. Only the text you type is added — there is no GetFreeToolsAI mark on your image." },
  { q: "Is my image uploaded?", a: "No. The watermark is applied on a canvas in your browser, so your image never leaves your device." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Image Tools" sectionHref="/image-tools" current="Add Watermark" />
      <ToolHeader
        title="Add Watermark to Image"
        description="Stamp a custom text watermark onto any image — set the size, opacity, colour and position, or tile it across the photo. Private and watermark-free."
      />
      <div className="mt-8">
        <ImageWatermark />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={["Upload your image", "Type and position your watermark", "Download the watermarked PNG"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image watermark tool overlays your own text on a photo so you can
          protect and brand your work before sharing it. You control the text, font
          size, colour, opacity and position — drop it in a corner, centre it, or tile
          it diagonally across the whole image to make removal difficult. Unlike many
          online watermarkers, GetFreeToolsAI never adds its own branding, has no daily
          limits and never uploads your image: everything is drawn on a canvas in your
          browser and exported as a clean PNG. It works in Chrome, Firefox, Safari and
          Edge with no installation and no signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/image/watermark" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/watermark" />
    </div>
  );
}
