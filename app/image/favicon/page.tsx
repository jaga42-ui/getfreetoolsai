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
  title: "Favicon Generator — Free ICO & PNG Favicons",
  description:
    "Generate a full favicon pack free online — favicon.ico plus PNGs at 16, 32, 48, 180, 192 and 512px and an Apple touch icon. Runs in your browser, no upload.",
  keywords:
    "favicon generator, favicon.ico generator, create favicon, png to ico, favicon maker free, apple touch icon generator",
  path: "/image/favicon",
});

const jsonLd = softwareAppSchema({
  name: "Free Favicon Generator",
  description:
    "Turn any image into a complete favicon pack — favicon.ico, PNGs from 16 to 512px and an Apple touch icon.",
  path: "/image/favicon",
});

const FaviconGenerator = dynamic(
  () => import("@/components/tools/FaviconGenerator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "What sizes does the favicon pack include?", a: "You get a multi-resolution favicon.ico (16, 32 and 48px), standalone PNGs at 16, 32, 48, 192 and 512px, and a 180px apple-touch-icon.png — everything modern browsers, Android and iOS need." },
  { q: "Can I convert a PNG or JPG to ICO?", a: "Yes. Upload any PNG, JPG, WebP or SVG and the tool renders a proper .ico file that embeds 16, 32 and 48px images, which is what browsers request for the address bar and bookmarks." },
  { q: "What image should I upload?", a: "A square image works best — ideally 512×512px or larger with a simple, high-contrast mark so it stays legible at 16px. You can add a white or coloured background if your logo is transparent." },
  { q: "How do I add the favicon to my site?", a: "Unzip the pack into your site's root folder and paste the provided <link> tags into the <head> of your HTML. The tool shows the exact snippet with a copy button." },
  { q: "Are my images uploaded to a server?", a: "No. All rendering and ICO packaging happen in your browser, so your image never leaves your device." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Image Tools" sectionHref="/image-tools" current="Favicon Generator" />
      <ToolHeader
        title="Favicon Generator"
        description="Turn any logo into a complete favicon pack — favicon.ico, every PNG size and an Apple touch icon — all in your browser."
      />
      <div className="mt-8">
        <FaviconGenerator />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your image never leaves your browser.</span>{" "}
        Every size and the .ico file are generated on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to generate a favicon"
        steps={[
          "Upload a square logo or image",
          "Pick a background and preview the sizes",
          "Download the favicon pack and paste the HTML",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          A favicon is the small icon that appears in browser tabs, bookmarks and
          history — and on phone home screens when someone saves your site. This
          free favicon generator turns a single image into everything you need:
          a multi-resolution favicon.ico for classic browser support, crisp PNGs
          from 16px right up to 512px for Android and PWAs, and a 180px Apple
          touch icon for iPhones and iPads. Upload a square logo, choose a
          transparent, white or custom background, and download a ready-to-ship
          ZIP together with the exact HTML link tags to drop into your page head.
          Everything is rendered and packaged locally with the Canvas API, so
          your artwork is never uploaded, there is no watermark, and there are no
          limits — ideal for shipping a polished favicon on any website.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/favicon" />
    </div>
  );
}
