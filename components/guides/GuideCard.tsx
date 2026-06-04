import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategory } from "@/lib/guides";
import type { Guide } from "@/lib/guides/types";

export function GuideCard({ guide }: { guide: Guide }) {
  const cat = getCategory(guide.category);
  return (
    <Link
      href={`/guides/${guide.category}/${guide.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-text-muted/40"
    >
      <p className="label">{cat?.label} · {guide.readingTime} min read</p>
      <h3 className="mt-2 font-display text-lg font-medium leading-snug text-text-primary">
        {guide.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{guide.excerpt}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Read guide
        <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
      </span>
    </Link>
  );
}
