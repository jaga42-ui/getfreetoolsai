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
  title: "Meme Generator Free — Add Top & Bottom Text, No Watermark",
  description:
    "Create memes free online with classic top and bottom text. No watermark, no signup, no upload — your image is processed in your browser. Download instantly.",
  keywords:
    "meme generator, meme maker free, make a meme, meme creator no watermark, add text to image meme, top bottom text meme, free meme generator online",
  path: "/image/meme-maker",
});

const jsonLd = softwareAppSchema({
  name: "Free Meme Generator",
  description:
    "Create memes with classic top and bottom text free online. No watermark, no signup, processed in your browser.",
  path: "/image/meme-maker",
});

const MemeMaker = dynamic(() => import("@/components/tools/MemeMaker"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "Does it add a watermark to my meme?", a: "No. Your meme downloads completely clean — no branding and no signup, unlike many meme sites." },
  { q: "What font does it use?", a: "The classic bold Impact style with a black outline and white fill, the look people expect from a meme." },
  { q: "Can I use my own image?", a: "Yes. Upload any JPG, PNG or WebP and add your top and bottom captions." },
  { q: "Is my image uploaded anywhere?", a: "No. The meme is rendered on a canvas in your browser, so your image never leaves your device." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Image Tools" sectionHref="/image-tools" current="Meme Maker" />
      <ToolHeader
        title="Meme Generator"
        description="Turn any image into a meme with classic top and bottom text — bold, outlined and watermark-free, rendered privately in your browser."
      />
      <div className="mt-8">
        <MemeMaker />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={["Upload your image", "Add top and bottom text", "Download your meme"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free meme generator puts the classic top-and-bottom caption style on any
          image — bold uppercase text with a black outline and white fill, exactly the
          look people expect. Just upload a picture, type your captions, adjust the text
          size and download. Unlike Imgflip and many meme sites, GetFreeToolsAI never
          stamps a watermark on your meme, requires no signup, and never uploads your
          image: everything renders on a canvas in your browser. It works in every
          modern browser including Chrome, Firefox, Safari and Edge, with no installation
          and no limits, ever.
        </p>
      </section>
      <ToolExtraContent href="/image/meme-maker" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/meme-maker" />
    </div>
  );
}
