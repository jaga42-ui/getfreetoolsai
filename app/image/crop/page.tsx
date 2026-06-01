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
  title: "Crop Image Online Free",
  description:
    "Crop JPG, PNG, WebP images in your browser. Drag to select, lock aspect ratios like 1:1 or 16:9. Free, no signup, 100% private.",
  keywords:
    "crop image, crop photo online, image cropper free, crop picture, aspect ratio crop",
  openGraph: {
    title: "Crop Image Online Free | GetFreeToolsAI",
    description:
      "Crop images in your browser with drag-to-select and aspect ratio presets. Free, private.",
    url: "https://getfreetoolsai.com/image/crop",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Image Online Free",
    description: "Crop images in your browser. Free, private, aspect presets.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/crop" },
};

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
