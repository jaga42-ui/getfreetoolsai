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
  title: "Image to Base64 — Free Encoder (Data URI, CSS, HTML)",
  description:
    "Convert an image to a Base64 data URI free online. Copy it as a raw data URI, CSS background, or HTML img tag. Runs in your browser, nothing uploaded.",
  keywords:
    "image to base64, base64 image encoder, image to data uri, png to base64, base64 css background, convert image to base64",
  path: "/image/to-base64",
});

const jsonLd = softwareAppSchema({
  name: "Free Image to Base64 Encoder",
  description:
    "Encode any image to a Base64 data URI and copy it as a data URI, CSS background or HTML img tag.",
  path: "/image/to-base64",
});

const ImageToBase64 = dynamic(() => import("@/components/tools/ImageToBase64"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is a Base64 image?", a: "It's an image encoded as text using the Base64 scheme, wrapped in a data URI like data:image/png;base64,…. Because it's plain text, you can embed it directly in HTML or CSS without a separate image file." },
  { q: "When should I use a Base64 image?", a: "For small assets — icons, logos, tiny background patterns — where inlining avoids an extra HTTP request. Avoid it for large images, since Base64 is about 33% bigger than the original file and can't be cached separately." },
  { q: "What output formats does it give me?", a: "Three: a raw data URI, a CSS background-image rule, and a ready-to-paste HTML <img> tag. Switch between them and copy with one click." },
  { q: "Which image types are supported?", a: "PNG, JPG, WebP, GIF and SVG. SVGs stay compact when encoded, which makes them a good fit for inline icons." },
  { q: "Is my image uploaded?", a: "No. Encoding happens entirely in your browser with the FileReader API, so your image never leaves your device." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Image Tools" sectionHref="/image-tools" current="Image to Base64" />
      <ToolHeader
        title="Image to Base64"
        description="Encode any image into a Base64 data URI and copy it as a data URI, CSS background, or HTML tag — all in your browser."
      />
      <div className="mt-8">
        <ImageToBase64 />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your image never leaves your browser.</span>{" "}
        Encoding runs on your device with the FileReader API — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to convert an image to Base64"
        steps={[
          "Upload your image",
          "Choose data URI, CSS or HTML output",
          "Copy the encoded string",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Base64 encoding lets you embed an image directly inside your HTML, CSS
          or JavaScript as a text string, removing the need for a separate file
          and an extra network request. This free image-to-Base64 encoder takes
          any PNG, JPG, WebP, GIF or SVG and produces a clean data URI, then lets
          you copy it as a raw data URI, a CSS <code>background-image</code> rule,
          or a complete HTML <code>&lt;img&gt;</code> tag. It&apos;s ideal for
          small icons, email signatures, inline SVGs and quick prototypes where
          bundling the asset is simpler than hosting it. Keep in mind that Base64
          data is roughly a third larger than the original file and can&apos;t be
          cached on its own, so it suits small images best. Everything is encoded
          locally in your browser, so your image is never uploaded and stays
          completely private.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/to-base64" />
    </div>
  );
}
