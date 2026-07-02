import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ToolScaffold";
import { HOWTO_NICHES, howtosByNiche } from "@/lib/howto";
import { toolMeta } from "@/lib/seo";

export const metadata: Metadata = toolMeta({
  title: "How-To Guides — Exam, Visa, Social & PDF Size Requirements",
  description:
    "Step-by-step guides for exact size requirements — exam and form photos & signatures, social media image sizes, visa & passport photos, and PDF upload limits. Free, in your browser, nothing uploaded.",
  keywords:
    "photo size for exam, signature size, visa photo size, social media image sizes, compress pdf for upload, resize photo for form",
  path: "/how-to",
});

export default function HowToHub() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb section="How-to" sectionHref="/how-to" current="Guides" />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-medium leading-[1.1] text-text-primary sm:text-[2.6rem]">
          Hit the exact size, every time
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-muted">
          Specific requirements for exam forms, social platforms, visas and
          document uploads — with the exact dimensions and size, and the free
          in-browser tools to match them. Nothing is ever uploaded.
        </p>
      </header>

      {HOWTO_NICHES.map((niche) => {
        const items = howtosByNiche(niche.id);
        if (!items.length) return null;
        return (
          <section key={niche.id} id={niche.id} className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl font-medium text-text-primary">
              {niche.label}
            </h2>
            <p className="mt-1.5 text-[14px] text-text-muted">{niche.blurb}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {items.map((h) => (
                <Link
                  key={h.slug}
                  href={`/how-to/${h.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
                >
                  <h3 className="font-display text-lg font-medium text-text-primary group-hover:text-primary">
                    {h.h1}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-text-muted">
                    {h.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Open guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
