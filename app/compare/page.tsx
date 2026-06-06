import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ToolScaffold";
import { comparisons } from "@/lib/comparisons";
import { toolMeta } from "@/lib/seo";

export const metadata: Metadata = toolMeta({
  title:
    "Free Alternatives to Smallpdf, iLovePDF, TinyPNG & remove.bg | GetFreeToolsAI",
  description:
    "Free, private, in-browser alternatives to popular paid tools — no signup, no watermark, no daily limits. Compare GetFreeToolsAI with Smallpdf, iLovePDF, TinyPNG and remove.bg.",
  keywords:
    "free alternatives, smallpdf alternative, ilovepdf alternative, tinypng alternative, remove.bg alternative, free online tools comparison",
  path: "/compare",
});

export default function CompareHub() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb section="Compare" sectionHref="/compare" current="Alternatives" />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.1] text-text-primary sm:text-[2.6rem]">
          Free alternatives to the tools you pay for
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-muted">
          See how GetFreeToolsAI compares to popular paid tools. Every job runs
          free in your browser — no signup, no watermark, no daily limits, and
          your files are never uploaded.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {comparisons.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
          >
            <h2 className="font-display text-xl font-medium text-text-primary group-hover:text-primary">
              Free {c.competitor} alternative
            </h2>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-text-muted">
              {c.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Compare
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
