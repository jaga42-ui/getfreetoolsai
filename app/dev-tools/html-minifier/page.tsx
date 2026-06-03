import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "HTML Minifier — Free Online HTML Minify | GetFreeToolsAI",
  description:
    "Minify HTML online to reduce page weight — removes comments and collapses whitespace while preserving pre, textarea, script and style. In your browser, free.",
  keywords:
    "html minifier, minify html online, compress html, html compressor, minify html free, reduce html size",
  path: "/dev-tools/html-minifier",
});

const Tool = dynamic(() => import("@/components/dev/tools/HtmlMinifier"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      This minifier removes HTML comments and collapses redundant whitespace to shrink page
      weight, while carefully preserving the contents of
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">pre</code>,
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">textarea</code>,
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">script</code> and
      <code className="ml-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">style</code> blocks where whitespace is significant.
    </p>
    <p>
      The size report shows your saving. Everything runs locally in your browser.
    </p>
  </>
);

const faqs = [
  { q: "Will it break my page?", a: "It preserves the contents of pre, textarea, script and style, where whitespace matters, and removes only comments and collapsible whitespace elsewhere — safe for typical markup." },
  { q: "Does it keep conditional comments?", a: "Yes. Internet Explorer conditional comments (<!--[if ...]>) are preserved; ordinary comments are removed." },
  { q: "Is my HTML uploaded?", a: "No. Minification runs entirely in your browser." },
  { q: "Why minify HTML?", a: "Smaller HTML downloads faster and improves time-to-first-byte and overall page weight, especially on large pages." },
];

export default function Page() {
  return (
    <DevFrame slug="html-minifier" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
