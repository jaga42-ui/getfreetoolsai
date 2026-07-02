import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Breadcrumb, FaqSection } from "@/components/ToolScaffold";
import { ToolCard } from "@/components/ToolCard";
import { JsonLd } from "@/components/JsonLd";
import { allTools } from "@/lib/tools";
import { howtos, getHowTo, getHowToNiche } from "@/lib/howto";
import { toolMeta, SITE_URL, breadcrumbSchema, howToSchema } from "@/lib/seo";

export function generateStaticParams() {
  return howtos.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const h = getHowTo(params.slug);
  if (!h) return {};
  return toolMeta({
    title: h.title,
    description: h.description,
    keywords: h.keywords,
    path: `/how-to/${h.slug}`,
  });
}

export default function HowToPage({ params }: { params: { slug: string } }) {
  const h = getHowTo(params.slug);
  if (!h) notFound();
  const niche = getHowToNiche(h.niche)!;

  // Derive a resize deep-link from the first "W × H px" value in the spec box,
  // so a plain /image/resize link becomes pre-armed to the exact dimensions.
  const pxMatch = h.spec
    .map((s) => s.value.match(/(\d{2,4})\s*[×x]\s*(\d{2,4})\s*px/i))
    .find(Boolean);
  const resizeHref = pxMatch
    ? `/image/resize?w=${pxMatch[1]}&h=${pxMatch[2]}`
    : null;

  const tools = h.tools
    .map((raw) => {
      const href = raw === "/image/resize" && resizeHref ? resizeHref : raw;
      const t = allTools.find((x) => x.href === href && x.ready);
      if (t) return t;
      // pre-armed compress-to-size pages aren't in the tool registry; synthesize a card target
      const m = href.match(/^\/(pdf|image)\/compress\/(\d+(?:kb|mb))$/i);
      if (m) {
        const base = allTools.find((x) => x.href === `/${m[1]}/compress`);
        if (base) return { ...base, href, name: `${base.name} to ${m[2].toUpperCase()}` };
      }
      // query-param deep-links (e.g. /image/resize?w=1280&h=720) — match the base tool
      if (href.includes("?")) {
        const [base, query] = href.split("?");
        const t2 = allTools.find((x) => x.href === base && x.ready);
        if (t2) {
          const q = new URLSearchParams(query);
          const w = q.get("w");
          const hh = q.get("h");
          const dims = w && hh ? ` to ${w}×${hh}` : w ? ` to ${w}px wide` : hh ? ` to ${hh}px tall` : "";
          return { ...t2, href, name: `${t2.name}${dims}` };
        }
      }
      return null;
    })
    .filter(Boolean) as (typeof allTools)[number][];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "How-to", url: `${SITE_URL}/how-to` },
          { name: niche.label, url: `${SITE_URL}/how-to#${niche.id}` },
          { name: h.h1 },
        ])}
      />
      <JsonLd data={howToSchema(h.h1, h.steps)} />

      <Breadcrumb section="How-to" sectionHref="/how-to" current={h.h1} />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.12] text-text-primary sm:text-[2.4rem]">
          {h.h1}
        </h1>
      </header>

      <div className="guide-prose mt-5 max-w-none">{h.intro}</div>

      {/* Spec box */}
      <section className="mt-8 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium text-text-primary">
          The requirement
        </h2>
        <dl className="mt-3 divide-y divide-border">
          {h.spec.map((s) => (
            <div key={s.label} className="flex flex-wrap justify-between gap-x-4 py-2 text-sm">
              <dt className="text-text-muted">{s.label}</dt>
              <dd className="font-medium text-text-primary">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-text-muted/80">
          Requirements can change — always confirm against the official
          notification or portal before you submit.
        </p>
      </section>

      {/* Steps */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Step by step
        </h2>
        <ol className="mt-4 space-y-3">
          {h.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-[15px] leading-relaxed text-text-primary">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Tools */}
      {tools.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-text-primary">
            The free tools you need
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {tools.map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
          </div>
        </section>
      )}

      <FaqSection items={h.faqs} />

      {/* Related */}
      {h.related.length > 0 && (
        <section className="mt-14" data-nosnippet>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Related guides
          </h2>
          <div className="mt-5 space-y-2.5">
            {h.related
              .map((s) => getHowTo(s))
              .filter(Boolean)
              .map((r) => (
                <Link
                  key={r!.slug}
                  href={`/how-to/${r!.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <span className="text-sm font-medium text-text-primary">{r!.h1}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-primary" />
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
