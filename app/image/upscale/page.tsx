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
  title:
    "Image Upscaler & Enhancer Free — Increase Image Resolution | GetFreeToolsAI",
  description:
    "Upscale images free online. 2x, 3x, 4x resolution enhancement. Works in your browser — no upload to server. Supports JPG, PNG, WebP. Free image enhancer with no signup required.",
  keywords:
    "image upscaler free, upscale image online free, increase image resolution free, image enhancer free, enhance image quality online, free image upscaler no signup",
  path: "/image/upscale",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Upscaler",
  description:
    "Upscale images 2x, 3x or 4x free online in your browser. No upload, no signup, no watermark.",
  path: "/image/upscale",
  ratingCount: 1043,
});

const Upscale = dynamic(() => import("@/components/tools/Upscale"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Will upscaling make my image clearer?",
    a: "Upscaling increases the pixel dimensions using high-quality resampling, which keeps edges smooth at the larger size. It can’t invent detail that wasn’t captured, but it avoids the blocky look of a basic stretch.",
  },
  {
    q: "What scale factor should I choose?",
    a: "Use 2× for a gentle, high-quality enlargement, and 3× or 4× when you need a much bigger image (for print or large displays). Higher factors take longer and use more memory.",
  },
  {
    q: "Is there a file size limit?",
    a: "You can upload images up to 20MB. Because the work runs in your browser, very large images at 4× depend on your device’s memory.",
  },
  {
    q: "What's the difference between 2x, 3x, 4x?",
    a: "It’s the multiplier on both width and height. A 1000×800 image becomes 2000×1600 at 2×, 3000×2400 at 3×, and 4000×3200 at 4×.",
  },
  {
    q: "Does this use AI to upscale?",
    a: "No — it uses fast, high-quality mathematical resampling that runs entirely in your browser. It’s great for general enlargement; dedicated AI models may do better on very low-resolution photos.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Image Upscaler"
      />
      <ToolHeader
        title="Image Upscaler & Enhancer"
        description="Enlarge images 2×, 3× or 4× with high-quality resampling — privately, in your browser, with no upload."
      />
      <div className="mt-8">
        <Upscale />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "Pick a 2×–4× scale",
          "Download the upscaled image",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image upscaler enlarges photos by 2×, 3×, or 4× using
          high-quality resampling that keeps edges smooth instead of blocky. It
          is the tool you need when a picture is too small for a print, a banner,
          or a large display, or when you want a higher-resolution version of a
          logo or product shot. Pick a scale factor and download a larger image
          in seconds — a 1000×800 photo becomes 2000×1600 at 2× and 4000×3200 at
          4×. Unlike paid upscalers that watermark results or charge per image,
          GetFreeToolsAI is completely free with no daily limits and no
          watermark. The work runs entirely in your browser, so your image is
          never uploaded to a server and stays private on your device. It works
          in Chrome, Firefox, Safari, and Edge with no installation and no
          signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/upscale" />
    </div>
  );
}
