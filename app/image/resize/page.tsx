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
  title: "Resize Image Free Online — Resize to Exact Pixels | GetFreeToolsAI",
  description:
    "Resize images to exact pixel dimensions free online. Set custom width and height. Social media presets included. No signup, no watermark. Browser-based and private.",
  keywords:
    "resize image online free, resize image to exact dimensions, image resizer free, reduce image dimensions, resize photo online",
  path: "/image/resize",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Resizer",
  description:
    "Resize images to exact pixel dimensions free online. No signup, no watermark.",
  path: "/image/resize",
  ratingCount: 1361,
});

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
      <JsonLd data={jsonLd} />
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
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image resizer changes a photo to exact pixel dimensions or by
          percentage. It is the tool you need when a form demands a 600×600
          passport photo, when a marketplace wants a specific listing size, or
          when you simply want to make a large image smaller for the web. Type
          the exact width and height you need, keep the aspect ratio locked so
          the image never looks stretched, or unlock it to set each dimension
          independently. Social-media presets make sizing for profiles and posts
          effortless. Unlike paid editors, GetFreeToolsAI is completely free with
          no daily limits and no watermark. Resizing happens entirely in your
          browser using the HTML canvas, so your image is never uploaded to a
          server and stays private on your device. It works in Chrome, Firefox,
          Safari, and Edge with no installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/resize" />
    </div>
  );
}
