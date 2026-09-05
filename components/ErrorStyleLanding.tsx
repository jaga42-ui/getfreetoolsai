import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumb, FaqSection, PrivacyNote, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { softwareAppSchema, faqPageSchema, howToSchema } from "@/lib/seo";
import type { ErrorStyle } from "@/lib/errorStyles";

/**
 * Shared renderer for the per-OS fake error dialog pages. Mirrors
 * `SizeLanding`, which does the same job for /pdf/compress/*.
 */
export function ErrorStyleLanding({
  style,
  others,
  tool,
}: {
  style: ErrorStyle;
  others: ErrorStyle[];
  tool: React.ReactNode;
}) {
  const path = `/fun/fake-error/${style.slug}`;
  const steps = [
    "Type your title bar text and message",
    "Pick an icon and the buttons you want",
    "Download the PNG or copy a link to it",
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd
        data={softwareAppSchema({ name: style.h1, description: style.description, path })}
      />
      <JsonLd data={faqPageSchema(style.faqs)} />
      <JsonLd data={howToSchema(`How to make a ${style.label} error message`, steps)} />

      <Breadcrumb
        section="Fake Error Message"
        sectionHref="/fun/fake-error"
        current={style.label}
      />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.1] text-text-primary sm:text-[2.6rem]">
          {style.h1}
        </h1>
      </header>

      <div className="guide-prose mt-5 max-w-none">{style.intro}</div>

      <div className="mt-8">{tool}</div>

      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The popup is drawn on your device — it is cosmetic only.
      </PrivacyNote>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          What people use it for
        </h2>
        <ul className="mt-4 space-y-2">
          {style.uses.map((u) => (
            <li key={u} className="flex items-start gap-2 text-[15px] text-text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2.25} />
              {u}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Other Windows and Mac versions
        </h2>
        <p className="mt-3 text-[15px] text-text-muted">
          Each version draws its own era&rsquo;s chrome — the title bar, buttons
          and icons genuinely differ, so pick the one you actually want to
          screenshot.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/fun/fake-error/${o.slug}`}
              className="inline-flex flex-col rounded-lg border border-border bg-surface px-4 py-2.5 transition-colors hover:border-primary/50"
            >
              <span className="text-sm font-medium text-text-primary">{o.label}</span>
              <span className="text-xs text-text-muted">{o.era}</span>
            </Link>
          ))}
        </div>
      </section>

      <FaqSection items={style.faqs} />

      <div className="mt-10">
        <Link
          href="/fun/fake-error"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          All error message generators <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <CategoryStrip currentHref="/fun/fake-error" />
    </div>
  );
}
