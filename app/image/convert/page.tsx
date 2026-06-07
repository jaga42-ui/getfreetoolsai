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
    "Convert Image Format Free Online — JPG PNG WebP Converter",
  description:
    "Convert images between JPG, PNG, WebP, BMP formats free online. Batch convert multiple images. No signup, no watermark. Browser-based and 100% private.",
  keywords:
    "jpg to png, png to jpg, webp to jpg, jpg to webp, image converter free, convert image format online, png to webp free, webp converter",
  path: "/image/convert",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Converter",
  description:
    "Convert images between JPG, PNG, WebP and BMP free online. Batch convert, no signup, no watermark.",
  path: "/image/convert",
  ratingCount: 1042,
});

const ConvertImage = dynamic(() => import("@/components/tools/ConvertImage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Which image formats are supported?",
    a: "You can upload JPG, PNG, WebP, BMP and GIF, and convert to JPG, PNG, WebP or BMP. That covers nearly every everyday image conversion.",
  },
  {
    q: "Can I convert multiple images at once?",
    a: "Yes. Add as many images as you like, choose one output format, and convert the whole batch in one click. Download them individually or as a single ZIP.",
  },
  {
    q: "Will converting change my image quality?",
    a: "PNG and BMP are lossless, so no quality is lost. For JPG and WebP you can set a quality slider; higher values preserve more detail at a larger file size.",
  },
  {
    q: "What is WebP and why should I use it?",
    a: "WebP is a modern format from Google that produces noticeably smaller files than JPG or PNG at similar quality, making web pages load faster. It’s supported by all current browsers.",
  },
  {
    q: "Is there a file size limit?",
    a: "Each image can be up to 50MB. Conversion runs in your browser, so the practical limit depends on your device’s memory rather than any server cap.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Convert Image"
      />
      <ToolHeader
        title="Convert Image Format"
        description="Switch between JPG, PNG, WebP and BMP in seconds. Batch convert and download — all in your browser."
      />
      <div className="mt-8">
        <ConvertImage />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your images",
          "Choose the output format",
          "Download converted images",
        ]}
      />
      <ToolDemo kind="convert-image" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image converter switches photos between JPG, PNG, WebP, and
          BMP in seconds. It covers nearly every everyday need: turning a PNG
          screenshot into a smaller JPG for email, converting images to modern
          WebP so a website loads faster, or changing a WebP download back into
          a JPG that older software accepts. Add as many images as you like,
          pick one output format, and convert the whole batch at once, then
          download them individually or as a single ZIP. For JPG and WebP you can
          set a quality slider to balance detail against file size. Unlike paid
          converters with daily caps, GetFreeToolsAI is unlimited and never adds
          a watermark. Conversion runs entirely in your browser, so your images
          are never uploaded to a server and stay private on your device. It
          works in Chrome, Firefox, Safari, and Edge with no installation and no
          signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/image/convert" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/convert" />
    </div>
  );
}
