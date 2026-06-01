import Link from "next/link";
import {
  Lock,
  Gauge,
  Infinity as InfinityIcon,
  Smartphone,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { pdfTools, imageTools } from "@/lib/tools";

const trustItems = ["No signup", "Files stay on your device", "Free forever"];

const whyUs: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lock,
    title: "Private by design",
    body: "Every tool runs in your browser. Your files are never uploaded — not to us, not to anyone.",
  },
  {
    icon: Gauge,
    title: "Fast, no waiting",
    body: "No queues and no round-trips to a server. Processing happens instantly on your own device.",
  },
  {
    icon: InfinityIcon,
    title: "Free, with no catch",
    body: "No accounts, no credit card, no premium tier. Every tool is completely free, always.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    body: "Carefully built to feel right on a phone, a tablet, or a desktop browser.",
  },
];

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-3">
      <h2 className="font-display text-2xl font-medium text-text-primary">
        {title}
      </h2>
      <span className="label">{count} tools</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* HERO */}
      <section className="border-b border-border py-16 sm:py-24">
        <p className="label">17 free tools · no signup ever</p>
        <h1 className="mt-5 max-w-3xl font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-text-primary sm:text-6xl">
          Free PDF &amp; image tools,
          <br className="hidden sm:block" /> done with care.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
          No signup. No limits. No uploads to our servers. Every tool runs right
          in your browser — so your files never leave your device.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          {trustItems.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 text-sm text-text-muted"
            >
              <Check className="h-4 w-4 text-secondary" strokeWidth={2} />
              {t}
            </span>
          ))}
        </div>

        <div className="mt-9">
          <Link
            href="#all-tools"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[15px] font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
          >
            Browse all tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* TOOL GRID */}
      <section id="all-tools" className="scroll-mt-20 py-16">
        <SectionHeader title="PDF Tools" count={pdfTools.length} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pdfTools.map((t) => (
            <ToolCard key={t.href} tool={t} />
          ))}
        </div>

        <div className="mt-14">
          <SectionHeader title="Image Tools" count={imageTools.length} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imageTools.map((t) => (
              <ToolCard key={t.href} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="border-t border-border py-16">
        <h2 className="max-w-2xl font-display text-3xl font-medium leading-tight text-text-primary">
          Tools that respect your time and your privacy.
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {whyUs.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon
                className="mt-1 h-5 w-5 shrink-0 text-primary"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="font-display text-lg font-medium text-text-primary">
                  {title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
