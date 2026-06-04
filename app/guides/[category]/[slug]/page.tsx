import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GuideContent } from "@/components/guides/GuideContent";
import { guides, getGuide } from "@/lib/guides";
import { toolMeta } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((g) => ({ category: g.category, slug: g.slug }));
}

export function generateMetadata({ params }: { params: { category: string; slug: string } }): Metadata {
  const g = getGuide(params.category, params.slug);
  if (!g) return {};
  return toolMeta({
    title: `${g.title} | GetFreeToolsAI`,
    description: g.description,
    keywords: g.keywords,
    path: `/guides/${g.category}/${g.slug}`,
  });
}

export default function GuideArticlePage({ params }: { params: { category: string; slug: string } }) {
  const g = getGuide(params.category, params.slug);
  if (!g) notFound();
  return <GuideContent guide={g} />;
}
