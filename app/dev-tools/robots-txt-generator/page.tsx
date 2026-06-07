import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Robots.txt Generator — Free Online",
  description:
    "Generate a valid robots.txt file with allow/disallow rules, crawl-delay and a sitemap line. Live preview, copy in one click. Free, in your browser, no signup.",
  keywords:
    "robots.txt generator, create robots.txt, robots txt file generator, disallow generator, robots.txt online, seo robots file",
  path: "/dev-tools/robots-txt-generator",
});

const Tool = dynamic(() => import("@/components/dev/tools/RobotsGenerator"), { ssr: false, loading: () => <DevSkeleton /> });

const about = (
  <>
    <p>
      A <code className="rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">robots.txt</code>
      file tells search-engine crawlers which paths they may or may not request. This generator
      builds a syntactically valid file from simple inputs — user-agent, allow/disallow paths, an
      optional crawl-delay, and your sitemap URL — and previews it live.
    </p>
    <p>
      Use the presets to allow or block all crawlers instantly, then refine. Place the result at
      the root of your site, e.g. <code className="rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">https://yoursite.com/robots.txt</code>.
    </p>
  </>
);

const faqs = [
  { q: "Where do I put robots.txt?", a: "At the root of your domain — it must be reachable at https://yoursite.com/robots.txt. Crawlers only look there." },
  { q: "Does Disallow hide a page from Google?", a: "No. Disallow stops crawling, but a blocked URL can still be indexed if linked elsewhere. To keep a page out of the index, use a noindex meta tag instead." },
  { q: "Should I add my sitemap here?", a: "Yes — adding a Sitemap: line helps search engines discover all your URLs. You can include the absolute sitemap URL in this generator." },
  { q: "Is an empty Disallow valid?", a: "Yes. 'Disallow:' with nothing after it means 'allow everything' for that user-agent, which is the standard way to permit full crawling." },
];

export default function Page() {
  return (
    <DevFrame slug="robots-txt-generator" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
