import Link from "next/link";
import {
  ChevronRight,
  Lock,
  Upload,
  Cog,
  Download,
  FileText,
  Image as ImageIcon,
  Calculator,
  Type,
  Code2,
  Sparkles,
  Music,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { GuideCard } from "@/components/guides/GuideCard";
import { Faq, type FaqItem } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { relatedTools } from "@/lib/tools";
import { guidesForTool } from "@/lib/guides";
import { howtosForTool } from "@/lib/howto";
import { cn } from "@/lib/utils";
import {
  SITE_URL,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
} from "@/lib/seo";

/**
 * The eight top-level tool categories. `key` matches the leading path segment
 * so the current category can be excluded from the cross-hub strip.
 */
const CATEGORY_HUBS: {
  key: string;
  name: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { key: "pdf", name: "PDF Tools", href: "/pdf-tools", icon: FileText },
  { key: "image", name: "Image Tools", href: "/image-tools", icon: ImageIcon },
  { key: "calculators", name: "Calculators", href: "/calculators", icon: Calculator },
  { key: "text", name: "Text Tools", href: "/text-tools", icon: Type },
  { key: "dev", name: "Developer Tools", href: "/dev-tools", icon: Code2 },
  { key: "fun", name: "Fun Tools", href: "/fun-tools", icon: Sparkles },
  { key: "audio", name: "Audio Tools", href: "/audio-tools", icon: Music },
  { key: "video", name: "Video Tools", href: "/video-tools", icon: Clapperboard },
];

/** Map a tool/hub href to its category key (e.g. "/pdf/compress" → "pdf"). */
function categoryKeyFromHref(href?: string): string | null {
  if (!href) return null;
  const seg = href.split("/")[1];
  if (!seg) return null;
  if (seg === "pdf" || seg === "pdf-tools") return "pdf";
  if (seg === "image" || seg === "image-tools") return "image";
  if (seg === "calculators") return "calculators";
  if (seg === "text" || seg === "text-tools") return "text";
  if (seg === "dev-tools") return "dev";
  if (seg === "fun" || seg === "fun-tools") return "fun";
  if (seg === "audio" || seg === "audio-tools") return "audio";
  if (seg === "video" || seg === "video-tools") return "video";
  return null;
}

/**
 * Cross-hub link strip. Surfaces every *other* tool category so authority flows
 * sideways across the whole graph, not just down from a hub to its tools. Ships
 * on every tool page (via RelatedTools), calculator, dev tool and hub.
 * `variant="dark"` matches the developer-tools palette.
 */
export function CategoryStrip({
  currentHref,
  variant = "light",
  className,
}: {
  currentHref?: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const current = categoryKeyFromHref(currentHref);
  const hubs = CATEGORY_HUBS.filter((h) => h.key !== current);
  const dark = variant === "dark";
  return (
    <section className={cn("mt-16", className)} data-nosnippet>
      <h2
        className={cn(
          "font-display font-medium",
          dark
            ? "text-lg font-semibold text-zinc-100"
            : "text-2xl text-text-primary"
        )}
      >
        Explore more free tools
      </h2>
      <p
        className={cn(
          "mt-2 text-[15px]",
          dark ? "text-sm text-zinc-400" : "text-text-muted"
        )}
      >
        Every category runs free in your browser — nothing is uploaded.
      </p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {hubs.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors",
              dark
                ? "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-400"
                : "border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary"
            )}
          >
            <Icon
              className={cn("h-4 w-4", dark ? "text-emerald-400" : "text-primary")}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {name}
          </Link>
        ))}
      </div>
    </section>
  );
}

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
      {/*
        HowTo schema is emitted ONLY when the caller names a real procedure
        ("How to compress a PDF"). It used to fall back to the generic
        "How to use this free online tool", which put an identical, meaningless
        HowTo on 66 pages — it describes no specific procedure, and Google
        retired HowTo rich results entirely in 2023, so it produced nothing on
        any surface. The visible "How it works" section below is unaffected.
      */}
      {name ? <JsonLd data={howToSchema(name, resolved)} /> : null}
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

export function FaqSection({
  items,
  heading,
}: {
  items: FaqItem[];
  /**
   * Localized heading. Defaults to English; the /[locale] routes pass the
   * translated string so a Spanish page doesn't render an English <h2> over
   * Spanish questions.
   */
  heading?: string;
}) {
  return (
    <section className="mt-16">
      <JsonLd data={faqPageSchema(items)} />
      <h2 className="font-display text-2xl font-medium text-text-primary">
        {heading ?? "Frequently asked questions"}
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

      <CategoryStrip currentHref={currentHref} />
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
