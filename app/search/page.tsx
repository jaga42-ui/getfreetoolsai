import type { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { allTools } from "@/lib/tools";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Search Free Tools | GetFreeToolsAI" },
  description:
    "Search 50+ free online tools — PDF, image and calculators. No signup, no watermark, processed privately in your browser.",
  alternates: { canonical: `${SITE_URL}/search` },
  // Search results pages should be crawlable for discovery but not indexed.
  robots: { index: false, follow: true },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const query = q.toLowerCase();
  const results = query
    ? allTools.filter(
        (t) =>
          t.ready &&
          (t.name.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query))
      )
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Search Free Tools
      </h1>

      <form action="/search" method="get" className="mt-6 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="Search tools — compress, resize, EMI, convert…"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
          />
        </div>
      </form>

      {q ? (
        <p className="mt-6 text-sm text-text-muted">
          {results.length > 0
            ? `${results.length} ${results.length === 1 ? "tool" : "tools"} for “${q}”`
            : `No tools matched “${q}”.`}
        </p>
      ) : (
        <p className="mt-6 text-sm text-text-muted">
          Type above, or{" "}
          <Link href="/#all-tools" className="text-primary underline underline-offset-2">
            browse all tools
          </Link>
          .
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <ToolCard key={t.href} tool={t} />
          ))}
        </div>
      )}

      {q && results.length === 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pdf-tools"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-muted hover:text-text-primary"
          >
            PDF tools
          </Link>
          <Link
            href="/image-tools"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-muted hover:text-text-primary"
          >
            Image tools
          </Link>
          <Link
            href="/calculators"
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-muted hover:text-text-primary"
          >
            Calculators
          </Link>
        </div>
      )}
    </div>
  );
}
