import Link from "next/link";
import { ChevronRight, ShieldCheck, ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  softwareAppSchema,
  faqPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { getDevTool, relatedDevTools } from "@/lib/devtools";
import { devToolContent } from "@/lib/devContent";
import type { FaqItem } from "@/components/Faq";

export function DevFrame({
  slug,
  children,
  about,
  faqs,
}: {
  slug: string;
  children: ReactNode;
  about: ReactNode;
  faqs: FaqItem[];
}) {
  const tool = getDevTool(slug);
  if (!tool) return null;
  const related = relatedDevTools(slug);
  const extra = devToolContent[slug];

  return (
    <div>
      <JsonLd data={softwareAppSchema({ name: tool.name, description: tool.description, path: tool.href })} />
      <JsonLd data={faqPageSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Developer Tools", url: `${SITE_URL}/dev-tools` },
          { name: tool.name },
        ])}
      />

      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-zinc-500">
        <Link href="/" className="transition-colors hover:text-zinc-300">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/dev-tools" className="transition-colors hover:text-zinc-300">Developer Tools</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-zinc-300">{tool.name}</span>
      </nav>

      <header className="mt-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          {tool.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">{tool.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Runs entirely in your browser — your input never leaves your device
        </span>
      </header>

      <div className="mt-6">{children}</div>

      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-zinc-100">About this tool</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-400 [&_a]:text-emerald-400 [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12px] [&_code]:text-zinc-200 [&_h3]:mb-1 [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_strong]:font-medium [&_strong]:text-zinc-200">{about}</div>
      </section>

      {extra && (
        <>
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-zinc-100">Why use it</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {extra.benefits.map((b, i) => (
                <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                  <p className="text-sm font-medium text-zinc-100">{b.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{b.body}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-8 max-w-2xl">
            <h2 className="font-display text-lg font-semibold text-zinc-100">Common use cases</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {extra.useCases.map((u, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-zinc-400">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" strokeWidth={2} />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section className="mt-10 max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-zinc-100">Frequently asked questions</h2>
        <div className="mt-3 divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800">
          {faqs.map((f, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-zinc-200 [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10" data-nosnippet>
          <h2 className="font-display text-lg font-semibold text-zinc-100">Related developer tools</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.slug}
                  href={t.href}
                  className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-emerald-500/40 hover:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4 text-emerald-400" />
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-emerald-400" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-zinc-200">{t.name}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
