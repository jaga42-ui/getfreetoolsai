import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, X, ArrowRight } from "lucide-react";
import { Breadcrumb, FaqSection } from "@/components/ToolScaffold";
import { ToolCard } from "@/components/ToolCard";
import { JsonLd } from "@/components/JsonLd";
import { allTools } from "@/lib/tools";
import { comparisons, getComparison } from "@/lib/comparisons";
import { toolMeta, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const c = getComparison(params.slug);
  if (!c) return {};
  return toolMeta({
    title: c.title,
    description: c.description,
    keywords: c.keywords,
    path: `/compare/${c.slug}`,
  });
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const c = getComparison(params.slug);
  if (!c) notFound();

  const tools = c.tools
    .map((href) => allTools.find((t) => t.href === href && t.ready))
    .filter(Boolean) as (typeof allTools)[number][];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: c.title,
          description: c.description,
          url: `${SITE_URL}/compare/${c.slug}`,
        }}
      />
      <Breadcrumb
        section="Compare"
        sectionHref="/compare"
        current={`${c.competitor} alternative`}
      />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.1] text-text-primary sm:text-[2.6rem]">
          {c.h1}
        </h1>
      </header>

      <div className="guide-prose mt-5 max-w-none">{c.intro}</div>

      {/* Comparison table */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          GetFreeToolsAI vs {c.competitor}
        </h2>
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="border-b border-border p-3 text-left font-medium text-text-muted">
                  Feature
                </th>
                <th className="border-b border-l border-border p-3 text-left font-semibold text-primary">
                  GetFreeToolsAI
                </th>
                <th className="border-b border-l border-border p-3 text-left font-medium text-text-primary">
                  {c.competitor}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.feature} className="even:bg-background/40">
                  <td className="border-b border-border p-3 font-medium text-text-primary">
                    {r.feature}
                  </td>
                  <td className="border-b border-l border-border p-3 text-text-primary">
                    <span className="inline-flex items-start gap-1.5">
                      {r.usWins && (
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                          strokeWidth={2.25}
                        />
                      )}
                      {r.us}
                    </span>
                  </td>
                  <td className="border-b border-l border-border p-3 text-text-muted">
                    <span className="inline-flex items-start gap-1.5">
                      {r.usWins && (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-text-muted/50" />
                      )}
                      {r.them}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-muted/80">
          Comparison reflects {c.competitor}&apos;s publicly documented free tier
          as of mid-2026 and may change. GetFreeToolsAI is not affiliated with{" "}
          {c.competitor}.
        </p>
      </section>

      {/* Why choose */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Why switch to GetFreeToolsAI
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {c.reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="font-display text-lg font-medium text-text-primary">
                {r.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-muted">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured replacement tools */}
      {tools.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-text-primary">
            The free tools that replace {c.competitor}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
          </div>
        </section>
      )}

      <FaqSection items={c.faqs} />

      {/* Related comparisons */}
      {c.related.length > 0 && (
        <section className="mt-14" data-nosnippet>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            More comparisons
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {c.related
              .map((s) => getComparison(s))
              .filter(Boolean)
              .map((rc) => (
                <Link
                  key={rc!.slug}
                  href={`/compare/${rc!.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary/50 hover:text-primary"
                >
                  Free {rc!.competitor} alternative
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
