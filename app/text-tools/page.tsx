import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { textTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Free Text Tools — Case Converter, Slug Maker & More",
  description:
    "Free online text tools that run 100% in your browser — case converter, lorem ipsum generator, remove line breaks, remove duplicate lines and slug generator.",
  keywords:
    "free text tools, case converter, lorem ipsum generator, remove line breaks, remove duplicate lines, slug generator, online text utilities",
  path: "/text-tools",
});

const faqs = [
  {
    q: "Are these text tools free?",
    a: "Yes — every text tool is completely free with no daily limits, no signup and no watermark.",
  },
  {
    q: "Is my text uploaded anywhere?",
    a: "No. All text processing happens locally in your browser on your own device, so whatever you paste never leaves your computer or phone.",
  },
  {
    q: "Do the text tools work on mobile?",
    a: "Yes. Every text tool works in mobile browsers on Android and iPhone, with nothing to install.",
  },
  {
    q: "Can I process large amounts of text?",
    a: "Yes. Because the work happens on your device rather than a server, there is no upload limit — the only ceiling is your device's available memory.",
  },
];

export default function TextToolsHub() {
  const ready = textTools.filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Text Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free Text Tools",
          ready.map((t) => ({ name: t.name, href: t.href }))
        )}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">Text Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free Text Tools Online
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        Simple, fast utilities for everyday text work — change the case of a
        headline, generate lorem ipsum placeholder copy, remove stray line
        breaks or extra spaces, reverse or repeat text, find and replace in bulk,
        sort and alphabetize a list, strip duplicate lines, or turn a title into
        a clean URL slug. Every tool updates as you type and runs entirely in
        your browser, so there are no daily limits, no watermark and nothing is
        ever uploaded.
      </p>

      <TrustBadges className="mt-6" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ready.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <p className="mt-8 text-[15px] text-text-muted">
        Working with words? You may also want the{" "}
        <Link
          href="/calculators/word-counter"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          word &amp; character counter
        </Link>{" "}
        or our{" "}
        <Link
          href="/dev-tools"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          developer tools
        </Link>
        .
      </p>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/text-tools" />
    </div>
  );
}
