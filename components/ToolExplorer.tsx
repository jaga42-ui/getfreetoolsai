"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { pdfTools, imageTools, calculatorTools, audioTools, textTools, type Tool } from "@/lib/tools";

function SectionHeader({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
      <h2 className="font-display text-2xl font-medium text-text-primary">
        <Link href={href} className="transition-colors hover:text-primary">
          {title}
        </Link>
      </h2>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary"
      >
        {label} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

const pdfCount = pdfTools.filter((t) => t.ready).length;
const imgCount = imageTools.filter((t) => t.ready).length;
const calcCount = calculatorTools.filter((t) => t.ready).length;
const audioCount = audioTools.filter((t) => t.ready).length;
const textCount = textTools.filter((t) => t.ready).length;

export function ToolExplorer() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const f = (arr: Tool[]) =>
    arr.filter(
      (t) =>
        t.ready &&
        (!query ||
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query))
    );

  const pdf = f(pdfTools);
  const img = f(imageTools);
  const calcs = f(calculatorTools);
  const audio = f(audioTools);
  const text = f(textTools);
  const total =
    pdf.length + img.length + calcs.length + audio.length + text.length;

  return (
    <section id="all-tools" className="scroll-mt-20 py-16">
      <div className="relative max-w-xl">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Search tools... (compress, resize, emi, convert)"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-9 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-10 space-y-14">
        {pdf.length > 0 && (
          <div>
            <SectionHeader
              title="Free PDF Tools Online"
              href="/pdf-tools"
              label={`All ${pdfCount} PDF tools`}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pdf.map((t) => (
                <ToolCard key={t.href} tool={t} />
              ))}
            </div>
          </div>
        )}

        {img.length > 0 && (
          <div>
            <SectionHeader
              title="Free Image Tools Online"
              href="/image-tools"
              label={`All ${imgCount} image tools`}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {img.map((t) => (
                <ToolCard key={t.href} tool={t} />
              ))}
            </div>
          </div>
        )}

        {calcs.length > 0 && (
          <div>
            <SectionHeader
              title="Free Calculator Tools"
              href="/calculators"
              label={`All ${calcCount} calculators`}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {calcs.map((t) => (
                <ToolCard key={t.href} tool={t} />
              ))}
            </div>
          </div>
        )}

        {audio.length > 0 && (
          <div>
            <SectionHeader
              title="Free Audio & Video Tools"
              href="/audio-tools"
              label={`All ${audioCount} audio & video ${audioCount === 1 ? "tool" : "tools"}`}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {audio.map((t) => (
                <ToolCard key={t.href} tool={t} />
              ))}
            </div>
          </div>
        )}

        {text.length > 0 && (
          <div>
            <SectionHeader
              title="Free Text Tools"
              href="/text-tools"
              label={`All ${textCount} text tools`}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {text.map((t) => (
                <ToolCard key={t.href} tool={t} />
              ))}
            </div>
          </div>
        )}

        {!query && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/dev-tools",
                title: "Developer Tools",
                body: "JSON formatter, JWT decoder, regex tester, UUID, hashing, minifiers and more.",
              },
              {
                href: "/guides",
                title: "Guides & How-Tos",
                body: "Step-by-step tutorials for compressing, converting and editing PDFs and images.",
              },
              {
                href: "/compare",
                title: "Free Alternatives",
                body: "How we compare to Smallpdf, iLovePDF, TinyPNG and remove.bg — free, no upload.",
              },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-text-muted/40"
              >
                <p className="flex items-center justify-between font-display text-lg font-medium text-text-primary">
                  {c.title}
                  <ArrowRight className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-primary" />
                </p>
                <p className="mt-1 text-sm text-text-muted">{c.body}</p>
              </Link>
            ))}
          </div>
        )}

        {total === 0 && (
          <p className="text-[15px] text-text-muted">No tools found for “{q}”.</p>
        )}
      </div>
    </section>
  );
}
