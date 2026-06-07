import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { GuideCard } from "@/components/guides/GuideCard";
import { GUIDE_CATEGORIES, guidesByCategory, getCategory } from "@/lib/guides";
import type { GuideCategory } from "@/lib/guides/types";
import { toolMeta, SITE_URL, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return GUIDE_CATEGORIES.filter((c) => guidesByCategory(c.id).length).map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = getCategory(params.category);
  if (!cat) return {};
  return toolMeta({
    title: `${cat.title}`,
    description: cat.description,
    keywords: `${cat.label.toLowerCase()}, ${cat.id} how to, free ${cat.id} tutorials`,
    path: `/guides/${cat.id}`,
  });
}

export default function GuideCategoryPage({ params }: { params: { category: string } }) {
  const cat = getCategory(params.category);
  if (!cat) notFound();
  const gs = guidesByCategory(cat.id as GuideCategory);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Guides", url: `${SITE_URL}/guides` },
          { name: cat.label },
        ])}
      />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-text-muted">
        <Link href="/" className="transition-colors hover:text-text-primary">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/guides" className="transition-colors hover:text-text-primary">Guides</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">{cat.label}</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        {cat.label}
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">{cat.description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gs.map((g) => <GuideCard key={g.slug} guide={g} />)}
      </div>
    </div>
  );
}
