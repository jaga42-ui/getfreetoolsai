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
  title: "Crop Image Free Online — Crop Photos in Browser | GetFreeToolsAI",
  description:
    "Crop images free online with exact dimensions or free-form cropping. No signup, no watermark. Works entirely in your browser — image never uploaded.",
  keywords:
    "crop image online free, crop photo online, image cropper free, crop jpg online, crop png free",
  path: "/image/crop",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Cropper",
  description:
    "Crop images free online with exact dimensions or free-form cropping. No signup, no watermark.",
  path: "/image/crop",
  ratingCount: 720,
});

const CropImage = dynamic(() => import("@/components/tools/CropImage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I crop an image?",
    a: "Upload an image, then drag the highlighted box to position it and drag the corner handles to resize. Click “Crop image” to get just the selected area.",
  },
  {
    q: "Can I crop to a fixed aspect ratio?",
    a: "Yes. Choose a preset like 1:1 (square), 4:3 or 16:9 and the crop box will keep that ratio while you resize. Use “Free” for any shape.",
  },
  {
    q: "Does cropping reduce quality?",
    a: "No. Cropping simply keeps a region of the original pixels at full resolution — there’s no re-scaling or quality loss to the kept area.",
  },
  {
    q: "Which formats can I crop?",
    a: "JPG, PNG, WebP and BMP. The cropped image is saved in the same format family as the original.",
  },
  {
    q: "Is my image uploaded?",
    a: "No. Cropping is done entirely in your browser, so your image stays on your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Crop Image"
      />
      <ToolHeader
        title="Crop Image"
        description="Drag to select exactly the area you want and crop it instantly — with optional aspect-ratio presets, all in your browser."
      />
      <div className="mt-8">
        <CropImage />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "Drag to select the crop area",
          "Download the cropped image",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image cropper lets you keep exactly the part of a photo you
          want and discard the rest. It is perfect for straightening a crooked
          scan, cutting a profile picture down to a square, framing a product, or
          removing distracting edges before you share an image. Drag the
          highlighted box to position it and pull the corner handles to resize,
          or lock a preset aspect ratio like 1:1, 4:3, or 16:9 so the crop stays
          perfectly proportioned. Because cropping simply keeps a region of the
          original pixels at full resolution, there is no quality loss. Unlike
          paid photo editors, GetFreeToolsAI is completely free with no daily
          limits and no watermark. Everything runs in your browser, so your
          image is never uploaded to a server and stays private on your device.
          It works in Chrome, Firefox, Safari, and Edge with no installation and
          no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/crop" />
    </div>
  );
}
