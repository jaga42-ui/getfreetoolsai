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
  title: "Resize Image to Exact Dimensions Free Online",
  description:
    "Resize JPG, PNG, WebP images to exact pixel dimensions or by percentage. Free, no signup, keeps aspect ratio. Works in your browser.",
  keywords:
    "resize image, image resizer free, resize photo online, change image dimensions, scale image",
  openGraph: {
    title: "Resize Image to Exact Dimensions Free Online | GetFreeToolsAI",
    description:
      "Resize images to exact pixel dimensions or by percentage. Free, keeps aspect ratio, browser-based.",
    url: "https://getfreetoolsai.com/image/resize",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize Image to Exact Dimensions Free Online",
    description: "Resize images by pixels or percentage. Free, browser-based.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/resize" },
};

const ResizeImage = dynamic(() => import("@/components/tools/ResizeImage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Can I resize an image to exact pixel dimensions?",
    a: "Yes. Switch to “Pixels” mode and type the exact width and height you need. The tool produces an image at precisely those dimensions.",
  },
  {
    q: "Will resizing keep the aspect ratio?",
    a: "By default the aspect ratio is locked, so changing the width updates the height automatically. Click the link icon to unlock it and set width and height independently.",
  },
  {
    q: "Can I make an image larger?",
    a: "Yes, you can upscale beyond 100% in percentage mode or enter larger pixel values. Note that enlarging can’t add detail, so very large upscales may look soft.",
  },
  {
    q: "Which formats are supported?",
    a: "JPG, PNG, WebP and BMP. The resized image is saved in the same family of format as the original where possible.",
  },
  {
    q: "Are my images uploaded anywhere?",
    a: "No. Resizing happens entirely in your browser using the HTML canvas. Your image never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Resize Image"
      />
      <ToolHeader
        title="Resize Image"
        description="Resize photos to exact pixel dimensions or by percentage, with optional aspect-ratio lock — all in your browser."
      />
      <div className="mt-8">
        <ResizeImage />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "Set dimensions or scale",
          "Download the resized image",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/resize" />
    </div>
  );
}
