import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "XML Sitemap Generator — Free Online | GetFreeToolsAI",
  description:
    "Generate a valid XML sitemap from a list of URLs, with lastmod, changefreq and priority. Live preview, copy in one click. Free, in your browser, no signup.",
  keywords:
    "xml sitemap generator, sitemap generator online, create sitemap xml, generate sitemap from urls, free sitemap tool, seo sitemap",
  path: "/dev-tools/sitemap-generator",
});

const Tool = dynamic(() => import("@/components/dev/tools/SitemapGenerator"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      Paste your URLs — one per line — and this tool builds a standards-compliant XML sitemap
      using the sitemaps.org schema, with optional <code className="rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">lastmod</code>,
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">changefreq</code> and
      <code className="ml-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">priority</code> values.
      Invalid URLs are detected and skipped.
    </p>
    <p>
      Save the output as <code className="rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">sitemap.xml</code>,
      upload it to your site root, and submit it in Google Search Console. Generation runs entirely
      in your browser.
    </p>
  </>
);

const faqs = [
  { q: "What is changefreq and priority?", a: "They are hints: changefreq suggests how often a page updates, priority (0.0–1.0) signals relative importance within your site. Search engines treat them as soft signals, not commands." },
  { q: "How many URLs can a sitemap hold?", a: "A single sitemap supports up to 50,000 URLs and 50MB uncompressed. Beyond that, split into multiple sitemaps and reference them from a sitemap index." },
  { q: "Are invalid URLs included?", a: "No. Each line is validated as a real URL; anything malformed is skipped and the count of skipped entries is shown." },
  { q: "Where do I submit my sitemap?", a: "Add a Sitemap: line to your robots.txt and submit the sitemap URL in Google Search Console and Bing Webmaster Tools." },
];

export default function Page() {
  return (
    <DevFrame slug="sitemap-generator" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
