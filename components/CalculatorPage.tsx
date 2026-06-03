import {
  Breadcrumb,
  ToolHeader,
  FaqSection,
} from "@/components/ToolScaffold";
import { ToolCard } from "@/components/ToolCard";
import { ToolExtraContent } from "@/components/ToolExtraContent";
import { CalcDisclaimer } from "@/components/CalcDisclaimer";
import { relatedCalculators } from "@/lib/tools";
import type { FaqItem } from "@/components/Faq";

/**
 * Shared scaffold for calculator pages — mirrors the existing tool-page layout
 * (breadcrumb, header, tool area, About section, FAQ, related tools) so every
 * calculator looks identical to the rest of the site.
 */
export function CalculatorPage({
  title,
  description,
  currentHref,
  current,
  disclaimer,
  about,
  faqs,
  children,
}: {
  title: string;
  description: string;
  currentHref: string;
  current: string;
  disclaimer: "financial" | "health" | "none";
  about: React.ReactNode;
  faqs: FaqItem[];
  children: React.ReactNode;
}) {
  const related = relatedCalculators(currentHref);
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="Calculators"
        sectionHref="/calculators"
        current={current}
      />
      <ToolHeader title={title} description={description} />

      <div className="mt-8">{children}</div>

      {disclaimer !== "none" && <CalcDisclaimer kind={disclaimer} />}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this calculator
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-relaxed text-text-muted [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mb-1 [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:text-text-primary [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_strong]:font-medium [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {about}
        </div>
      </section>

      <ToolExtraContent href={currentHref} />

      <FaqSection items={faqs} />

      {related.length > 0 && (
        <section className="mt-14" data-nosnippet>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Related calculators
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
