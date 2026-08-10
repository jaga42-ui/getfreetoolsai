import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { GuideCard } from "@/components/guides/GuideCard";
import { GUIDE_CATEGORIES, guidesByCategory } from "@/lib/guides";
import { toolMeta, SITE_URL, breadcrumbSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Free How-To Guides — PDF, Image, OCR & Calculators",
  description:
    "Free how-to guides for compressing images and PDFs, OCR, document conversion and money calculators — each paired with a private in-browser tool.",
  keywords:
    "how to guides, image tutorials, pdf tutorials, ocr guide, sip calculator guide, free tools tutorials",
  path: "/guides",
});

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Guides" }])} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-text-muted">
        <Link href="/" className="transition-colors hover:text-text-primary">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">Guides</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Guides &amp; Tutorials
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        Clear, practical walkthroughs for the things people actually do with files — compressing
        images to an exact size, removing backgrounds, converting and OCR-ing PDFs, and working out
        money calculations. Every guide is written by the team that builds the tools and links
        straight to a free, private, in-browser tool.
      </p>

      <div className="mt-10 space-y-12">
        {GUIDE_CATEGORIES.map((cat) => {
          const gs = guidesByCategory(cat.id);
          if (!gs.length) return null;
          return (
            <section key={cat.id}>
              <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
                <h2 className="font-display text-2xl font-medium text-text-primary">
                  <Link href={`/guides/${cat.id}`} className="hover:text-primary">{cat.label}</Link>
                </h2>
                <Link href={`/guides/${cat.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gs.map((g) => <GuideCard key={g.slug} guide={g} />)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
