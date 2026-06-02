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
  title: "Image Filters & Effects Free Online | GetFreeToolsAI",
  description:
    "Add filters and effects to photos free online. 14 preset filters plus manual brightness, contrast, saturation controls. No signup, no watermark. Instant browser-based editing.",
  keywords:
    "image filters online free, photo effects free, add filter to photo free, photo editor filters free, image editing free online, photo filter maker free",
  path: "/image/filters",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Filters & Effects",
  description:
    "Apply preset filters and adjust brightness, contrast, saturation, hue and blur free online. No signup, no watermark.",
  path: "/image/filters",
  ratingCount: 742,
});

const ImageFilters = dynamic(() => import("@/components/tools/ImageFilters"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What filters are available?",
    a: "14 one-click presets including Grayscale, Sepia, Vintage, Cool, Warm, Vivid, Matte, Dramatic and more — plus manual sliders for brightness, contrast, saturation, hue and blur.",
  },
  {
    q: "Can I combine a preset with manual adjustments?",
    a: "Yes. Pick a preset, then fine-tune with the sliders on top of it. The live preview updates instantly so you see the exact result.",
  },
  {
    q: "Will editing reduce my image quality?",
    a: "The image is re-encoded once at high quality on download. The pixel dimensions stay the same, so there’s no resizing loss.",
  },
  {
    q: "Which formats are supported?",
    a: "JPG, PNG and WebP. The edited image is saved in the same format as your original.",
  },
  {
    q: "Are my photos uploaded anywhere?",
    a: "No. All editing happens in your browser on the canvas, so your photos never leave your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Image Filters"
      />
      <ToolHeader
        title="Image Filters & Effects"
        description="Apply Instagram-style presets and fine-tune brightness, contrast, saturation and more — live, in your browser."
      />
      <div className="mt-8">
        <ImageFilters />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image",
          "Pick a filter or adjust sliders",
          "Download the edited image",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/filters" />
    </div>
  );
}
