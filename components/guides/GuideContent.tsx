import Link from "next/link";
import { ChevronRight, Clock, CalendarCheck, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { SITE_URL, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { allTools } from "@/lib/tools";
import { getAuthor } from "@/lib/guides/authors";
import { getCategory, relatedGuides } from "@/lib/guides";
import type { Guide } from "@/lib/guides/types";

function fmtDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function GuideContent({ guide }: { guide: Guide }) {
  const cat = getCategory(guide.category)!;
  const author = getAuthor(guide.authorId);
  const related = relatedGuides(guide.slug);
  const tools = guide.relatedTools
    .map((href) => allTools.find((t) => t.href === href && t.ready))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const path = `/guides/${guide.category}/${guide.slug}`;

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
      <JsonLd
        data={articleSchema({
          title: guide.title,
          description: guide.description,
          path,
          datePublished: guide.datePublished,
          dateModified: guide.dateModified,
          authorName: author.name,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Guides", url: `${SITE_URL}/guides` },
          { name: cat.label, url: `${SITE_URL}/guides/${cat.id}` },
          { name: guide.title },
        ])}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="transition-colors hover:text-text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/guides" className="transition-colors hover:text-text-primary">Guides</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/guides/${cat.id}`} className="transition-colors hover:text-text-primary">{cat.label}</Link>
      </nav>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-text-primary sm:text-[2.5rem]">
          {guide.title}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-text-muted">{guide.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-3 text-sm text-text-muted">
          <span>By {author.name}</span>
          <span className="inline-flex items-center gap-1.5"><CalendarCheck className="h-4 w-4" /> Updated {fmtDate(guide.dateModified)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {guide.readingTime} min read</span>
        </div>
      </header>

      {guide.toc.length > 0 && (
        <nav aria-label="On this page" className="mt-6 rounded-lg border border-border bg-surface p-4">
          <p className="label">On this page</p>
          <ul className="mt-2 space-y-1.5">
            {guide.toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-sm text-text-muted transition-colors hover:text-primary">{t.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <article className="guide-prose mt-8">{guide.body}</article>

      {tools.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-medium text-text-primary">Tools used in this guide</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {tools.map((t) => <ToolCard key={t.href} tool={t} />)}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-medium text-text-primary">Related guides</h2>
          <div className="mt-4 space-y-2.5">
            {related.map((g) => (
              <Link key={g.slug} href={`/guides/${g.category}/${g.slug}`} className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
                <span className="text-sm font-medium text-text-primary">{g.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 rounded-xl border border-border bg-surface p-5">
        <p className="label">Written &amp; reviewed by</p>
        <p className="mt-2 font-display text-lg font-medium text-text-primary">{author.name}</p>
        <p className="text-sm text-text-muted">{author.role}</p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{author.bio}</p>
        <p className="mt-3 text-xs text-text-muted">
          Published {fmtDate(guide.datePublished)} · Last reviewed {fmtDate(guide.dateModified)}
        </p>
      </section>
    </div>
  );
}
