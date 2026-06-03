import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "JavaScript Minifier — Free Online JS Minify | GetFreeToolsAI",
  description:
    "Minify JavaScript online with Terser — compress and mangle to shrink file size, with a before/after size report. Runs in your browser, nothing uploaded. Free.",
  keywords:
    "javascript minifier, js minifier, minify javascript online, terser online, compress javascript, js compressor, minify js free",
  path: "/dev-tools/js-minifier",
});

const Tool = dynamic(() => import("@/components/dev/tools/JsMinifier"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      This minifier runs <span className="text-zinc-200">Terser</span> — the industry-standard
      JavaScript compressor — directly in your browser. It removes whitespace and comments,
      shortens variable names (mangling) and applies safe compression, then reports how many bytes
      you saved.
    </p>
    <p>
      Use it for quick one-off minification of a snippet or a small script. Because it uses a real
      parser rather than regex, it won&apos;t silently break valid code.
    </p>
  </>
);

const faqs = [
  { q: "What does minifying do?", a: "It removes whitespace and comments and shortens local names so the file downloads faster, without changing what the code does." },
  { q: "Is Terser safe?", a: "Yes — Terser parses your code into an AST and transforms it correctly, which is far safer than regex-based minifiers that can corrupt valid JavaScript." },
  { q: "Is my code uploaded?", a: "No. Terser is loaded and run entirely in your browser; your code never leaves your device." },
  { q: "Does it support modern JavaScript?", a: "Yes, Terser handles modern ES syntax. For very large bundles, use a build tool — this is best for snippets and small scripts." },
];

export default function Page() {
  return (
    <DevFrame slug="js-minifier" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
