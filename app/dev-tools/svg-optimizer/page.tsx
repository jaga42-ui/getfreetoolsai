import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "SVG Optimizer & Cleaner — Free Online | GetFreeToolsAI",
  description:
    "Clean and shrink SVG files online — strip editor metadata, comments and excess whitespace, with a live preview and size report. In your browser, free.",
  keywords:
    "svg optimizer, svg cleaner, optimize svg online, minify svg, compress svg, clean svg, reduce svg size",
  path: "/dev-tools/svg-optimizer",
});

const Tool = dynamic(() => import("@/components/dev/tools/SvgOptimizer"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Exported SVGs from design tools are full of cruft — XML prologs, editor metadata,
      Inkscape/Sodipodi attributes, comments and excess whitespace. This optimizer strips all of
      that, shows a live preview of the cleaned graphic, and reports the size saving.
    </p>
    <p>
      The result is a smaller, cleaner SVG ready to drop into your site or component. Everything
      runs in your browser.
    </p>
  </>
);

const faqs = [
  { q: "What does it remove?", a: "The XML prolog and doctype, comments, <metadata>/<title>/<desc>, editor-specific namespaces and attributes (Inkscape, Sodipodi, RDF), and redundant whitespace." },
  { q: "Will it change how my icon looks?", a: "No. It removes non-rendered cruft, not the actual shapes. The live preview lets you confirm the result is identical." },
  { q: "Is my SVG uploaded?", a: "No. Optimization runs entirely in your browser." },
  { q: "Is this the same as SVGO?", a: "It is a lightweight cleaner focused on the highest-impact, safe removals. For aggressive path-level optimization, a full SVGO pipeline goes further." },
];

export default function Page() {
  return (
    <DevFrame slug="svg-optimizer" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
