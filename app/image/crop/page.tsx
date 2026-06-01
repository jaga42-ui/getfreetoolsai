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
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/crop" />
    </div>
  );
}
