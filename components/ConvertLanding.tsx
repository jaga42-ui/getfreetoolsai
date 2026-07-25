import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumb, FaqSection, PrivacyNote, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { softwareAppSchema } from "@/lib/seo";
import type { ConvertPreset } from "@/lib/convertPresets";

/**
 * Shared renderer for "convert X to Y" long-tail landing pages. Parallels
 * SizeLanding: embeds the (pre-armed) converter as `tool` and surrounds it with
 * unique, content-rich copy plus cross-links to the other conversion pairs.
 */
export function ConvertLanding({
  preset,
  others,
  tool,
}: {
  preset: ConvertPreset;
  others: ConvertPreset[];
  tool: React.ReactNode;
}) {
  const toolHref = "/image/convert";
  const path = `${toolHref}/${preset.slug}`;
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={softwareAppSchema({
          name: preset.h1,
          description: preset.description,
          path,
        })}
      />
      <Breadcrumb
        section="Convert Image"
        sectionHref={toolHref}
        current={preset.h1}
      />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.1] text-text-primary sm:text-[2.6rem]">
          {preset.h1} Online Free
        </h1>
      </header>

      <div className="guide-prose mt-5 max-w-none">{preset.intro}</div>

      <div className="mt-8">{tool}</div>

      <PrivacyNote />

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          What you can use it for
        </h2>
        <ul className="mt-4 space-y-2">
          {preset.uses.map((u) => (
            <li key={u} className="flex items-start gap-2 text-[15px] text-text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2.25} />
              {u}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Other conversions
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`${toolHref}/${o.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary/50 hover:text-primary"
            >
              {o.from} to {o.toLabel}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-[15px] text-text-muted">
          Need a different format, a quality slider or batch conversion? Use the{" "}
          <Link href={toolHref} className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
            image converter
          </Link>
          .
        </p>
      </section>

      <FaqSection items={preset.faqs} />

      <div className="mt-10">
        <Link
          href={toolHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          Back to Convert Image <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <CategoryStrip currentHref={toolHref} />
    </div>
  );
}
