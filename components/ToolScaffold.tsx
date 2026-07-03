import Link from "next/link";
import { ChevronRight, Lock, Upload, Cog, Download } from "lucide-react";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { GuideCard } from "@/components/guides/GuideCard";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { relatedTools } from "@/lib/tools";
import { guidesForTool } from "@/lib/guides";
import { howtosForTool } from "@/lib/howto";
import {
  SITE_URL,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
} from "@/lib/seo";

export function Breadcrumb({
  section,
  sectionHref,
  current,
}: {
  section: string;
  sectionHref: string;
  current: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 text-sm text-text-muted"
    >
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: section, url: `${SITE_URL}${sectionHref}` },
          { name: current },
        ])}
      />
      <Link href="/" className="transition-colors hover:text-text-primary">
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link href={sectionHref} className="transition-colors hover:text-text-primary">
        {section}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-text-primary">{current}</span>
    </nav>
  );
}

export function ToolHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mt-6">
      <h1 className="font-display text-3xl font-medium leading-[1.1] text-text-primary sm:text-[2.6rem]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        {description}
      </p>
      <TrustBadges className="mt-5" />
    </header>
  );
}

export function HowItWorks({
  steps,
  name,
}: {
  steps?: [string, string, string];
  /** Used as the HowTo schema name, e.g. "How to compress a PDF". */
  name?: string;
}) {
  const resolved = steps ?? [
    "Upload your file",
    "We process it instantly",
    "Download your result",
  ];
  const [s1, s2, s3] = resolved;
  const items = [
    { icon: Upload, title: s1 },
    { icon: Cog, title: s2 },
    { icon: Download, title: s3 },
  ];
  return (
    <section className="mt-16">
      <JsonLd data={howToSchema(name ?? "How to use this free online tool", resolved)} />
      <h2 className="font-display text-2xl font-medium text-text-primary">
        How it works
      </h2>
      <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-surface p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="font-display text-2xl font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-[15px] text-text-primary">{item.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function PrivacyNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-secondary/25 bg-secondary/[0.06] p-4">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={1.75} />
      <p className="text-sm leading-relaxed text-text-primary">
        {children ?? (
          <>
            <span className="font-medium">
              Your file never leaves your browser.
            </span>{" "}
            All processing happens on your device. Nothing is uploaded to any
            server.
          </>
        )}
      </p>
    </div>
  );
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-16">
      <JsonLd data={faqPageSchema(items)} />
      <h2 className="font-display text-2xl font-medium text-text-primary">
        Frequently asked questions
      </h2>
      <div className="mt-6">
        <Faq items={items} />
      </div>
    </section>
  );
}

export function RelatedTools({ currentHref }: { currentHref: string }) {
  const tools = relatedTools(currentHref);
  const guides = guidesForTool(currentHref, 2);
  const howtos = howtosForTool(currentHref, 4);
  if (tools.length === 0 && guides.length === 0 && howtos.length === 0)
    return null;
  return (
    <>
      {/* In-content display ad. Renders only after consent; reserves space to
          keep CLS at 0. Sits between the tool result and related links — a
          natural break that isn't disruptive. */}
      <AdSlot className="mt-16" />

      {tools.length > 0 && (
        <section className="mt-16" data-nosnippet>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Related tools
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Guides &amp; how-tos
          </h2>
          <p className="mt-2 text-[15px] text-text-muted">
            Step-by-step tutorials that use this tool.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>
      )}

      {howtos.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-medium text-text-primary">
            Popular sizes &amp; requirements
          </h2>
          <p className="mt-2 text-[15px] text-text-muted">
            Hit an exact size for a specific form, platform or application.
          </p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {howtos.map((h) => (
              <Link
                key={h.slug}
                href={`/how-to/${h.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40"
              >
                <span className="text-sm font-medium text-text-primary group-hover:text-primary">
                  {h.h1}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-primary" />
              </Link>
            ))}
          </div>
          <Link
            href="/how-to"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Browse all size guides
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}
    </>
  );
}

export function ToolSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-64 w-full rounded-xl" />
      <div className="skeleton h-12 w-full rounded-xl" />
    </div>
  );
}
