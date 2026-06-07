import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Schema Markup Generator — JSON-LD Structured Data",
  description:
    "Generate JSON-LD structured data for Organization, Article, Product, FAQ and Local Business. Copy-ready schema.org markup, live in your browser. Free, no signup.",
  keywords:
    "schema markup generator, json-ld generator, structured data generator, schema.org generator, faq schema generator, product schema, rich results markup",
  path: "/dev-tools/schema-generator",
});

const Tool = dynamic(() => import("@/components/dev/tools/SchemaGenerator"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Structured data helps Google understand your page and can unlock rich results — star
      ratings, FAQ accordions, article cards and more. This generator outputs clean
      <span className="mx-1 text-zinc-200">JSON-LD</span> (Google&apos;s recommended format) for the most
      common schema.org types from a simple form.
    </p>
    <p>
      Pick a type, fill in the fields you have, and paste the generated
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">&lt;script&gt;</code>
      block into your page&apos;s <code className="rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">&lt;head&gt;</code>.
      Empty fields are omitted so the markup stays valid.
    </p>
  </>
);

const faqs = [
  { q: "Where do I put the generated code?", a: "Paste the entire <script type=\"application/ld+json\"> block anywhere in your page's <head> or <body>. JSON-LD does not need to wrap any visible content." },
  { q: "Which schema types are supported?", a: "Organization, Article, Product, FAQ Page and Local Business — the types that most often earn rich results for small sites and blogs." },
  { q: "Will this guarantee rich results?", a: "No tool can. Valid markup makes your page eligible, but Google decides when to show rich results. Always validate with the Rich Results Test." },
  { q: "Should the markup match the page?", a: "Yes. Structured data must describe content actually visible on the page — fabricated data (e.g. fake reviews) can trigger a manual penalty." },
];

export default function Page() {
  return (
    <DevFrame slug="schema-generator" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
