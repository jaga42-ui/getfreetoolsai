import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "SVG to React Component Converter — Free Online | GetFreeToolsAI",
  description:
    "Convert SVG markup into a typed React component online. Renames attributes to JSX, spreads props onto the root and preserves viewBox. In your browser, free.",
  keywords:
    "svg to react, svg to jsx, convert svg to react component, svg to react converter, svgr online, react svg component",
  path: "/dev-tools/svg-to-react",
});

const Tool = dynamic(() => import("@/components/dev/tools/SvgToReact"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Paste raw SVG markup and get a clean, typed React component. The converter renames attributes
      to their JSX equivalents (<code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">class → className</code>,
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">stroke-width → strokeWidth</code>),
      converts inline styles to a style object, spreads
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">props</code> onto the root
      <code className="ml-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">&lt;svg&gt;</code>, and preserves the viewBox.
    </p>
    <p>
      Name your component, copy the output, and drop it straight into your project. Conversion runs
      entirely in your browser.
    </p>
  </>
);

const faqs = [
  { q: "What does it convert?", a: "Attribute names to camelCase JSX (class→className, for→htmlFor, kebab-case→camelCase), inline style strings to style objects, and it spreads props onto the root svg so you can pass className, width, onClick, etc." },
  { q: "Is the component typed?", a: "Yes — the root accepts React.SVGProps<SVGSVGElement>, so you get full TypeScript prop typing out of the box." },
  { q: "Does it preserve viewBox and gradients?", a: "Yes. The SVG is parsed as XML so case-sensitive attributes like viewBox and elements like linearGradient are preserved." },
  { q: "Is my SVG uploaded?", a: "No. Parsing and conversion happen entirely in your browser." },
];

export default function Page() {
  return (
    <DevFrame slug="svg-to-react" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
