import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Open Graph Preview & Meta Tag Generator",
  description:
    "Preview how your page looks when shared on social platforms and generate Open Graph & Twitter Card meta tags. Live, in your browser, free, no signup.",
  keywords:
    "open graph preview, og tags generator, twitter card generator, social share preview, meta tag generator, og image preview, opengraph debugger",
  path: "/dev-tools/open-graph-preview",
});

const Tool = dynamic(() => import("@/components/dev/tools/OpenGraphPreview"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Open Graph and Twitter Card meta tags control the title, description and image shown when
      your page is shared on social platforms and chat apps. Fill in your details and this tool
      renders a live preview of the share card and generates the exact meta tags to paste into
      your <code className="rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">&lt;head&gt;</code>.
    </p>
    <p>
      For the sharpest cards, use an image around 1200×630px. Everything is previewed locally in
      your browser.
    </p>
  </>
);

const faqs = [
  { q: "What image size should I use?", a: "1200×630px (a 1.91:1 ratio) is the recommended Open Graph image size and renders well across platforms with the large summary card." },
  { q: "Why isn't my image showing when I share?", a: "Common causes are a non-absolute image URL, an image that's too small, or the platform caching an old version. Use each platform's debugger to re-scrape after updating." },
  { q: "Do I need both Open Graph and Twitter tags?", a: "Open Graph covers most platforms (Facebook, LinkedIn, WhatsApp, Slack). Adding twitter:card tags gives you precise control on X. This tool generates both." },
  { q: "Is my data uploaded?", a: "No. The preview and tag generation happen entirely in your browser." },
];

export default function Page() {
  return (
    <DevFrame slug="open-graph-preview" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
