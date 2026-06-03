import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "CSS Minifier — Free Online CSS Minify | GetFreeToolsAI",
  description:
    "Minify CSS online to shrink stylesheet size — strips comments and whitespace with a before/after size report. Runs in your browser, nothing uploaded. Free.",
  keywords:
    "css minifier, minify css online, compress css, css compressor, minify stylesheet, css minify free",
  path: "/dev-tools/css-minifier",
});

const Tool = dynamic(() => import("@/components/dev/tools/CssMinifier"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Paste your CSS and get a compact, single-line version with comments and unnecessary
      whitespace removed and redundant semicolons trimmed. The size report shows exactly how many
      bytes you saved, which translates into faster page loads.
    </p>
    <p>
      It is a fast, lightweight minifier for stylesheets and snippets, running entirely in your
      browser.
    </p>
  </>
);

const faqs = [
  { q: "How much smaller will my CSS get?", a: "It depends on how much whitespace and how many comments your file has — heavily formatted stylesheets often shrink 20–50%. The tool shows the exact saving." },
  { q: "Will it break my styles?", a: "It removes comments and whitespace and trims redundant semicolons, which is safe for standard CSS. Keep your original source and use the minified version for production." },
  { q: "Is my CSS uploaded?", a: "No. Minification happens entirely in your browser." },
  { q: "Should I minify CSS in production?", a: "Yes — smaller CSS downloads and parses faster. Most build tools do this automatically; this tool is handy for quick one-off minification." },
];

export default function Page() {
  return (
    <DevFrame slug="css-minifier" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
