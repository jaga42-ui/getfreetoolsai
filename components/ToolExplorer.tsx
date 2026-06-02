"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  SpellCheck,
  ScanSearch,
  ScrollText,
  FileCheck2,
  Repeat,
  PenLine,
  Gauge,
  QrCode,
  Smile,
  Youtube,
  Mail,
  ReceiptText,
  Award,
  Quote,
  Palette,
  Music,
  Minimize2,
  Scissors,
  Film,
  Clapperboard,
  Braces,
  Regex,
  Blend,
  Binary,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import {
  pdfTools,
  imageTools,
  calculatorTools,
  type Tool,
} from "@/lib/tools";

type ComingSoon = { name: string; description: string; icon: LucideIcon };

const aiTools: ComingSoon[] = [
  { name: "AI Humanizer", description: "Make AI text sound human. No word limit.", icon: Sparkles },
  { name: "Grammar Checker", description: "Better than Grammarly free tier.", icon: SpellCheck },
  { name: "Plagiarism Checker", description: "Check for copied content free.", icon: ScanSearch },
  { name: "AI Summarizer", description: "Summarize any PDF or long article.", icon: ScrollText },
  { name: "Resume ATS Checker", description: "Beat applicant tracking systems free.", icon: FileCheck2 },
  { name: "AI Paraphraser", description: "Rewrite text in your own words.", icon: Repeat },
  { name: "Cover Letter Generator", description: "AI-written cover letters free.", icon: PenLine },
  { name: "Tone Analyzer", description: "Check if your message sounds right.", icon: Gauge },
];

const generatorTools: ComingSoon[] = [
  { name: "QR Code Generator", description: "Custom QR codes, unlimited, free.", icon: QrCode },
  { name: "YouTube Thumbnail Maker", description: "Stand out in search results.", icon: Youtube },
  { name: "Email Signature Generator", description: "Professional signatures free.", icon: Mail },
  { name: "Invoice Generator", description: "Create PDF invoices instantly free.", icon: ReceiptText },
  { name: "Certificate Generator", description: "Printable certificates free.", icon: Award },
  { name: "Quote Card Maker", description: "Beautiful quote images for social.", icon: Quote },
  { name: "Color Palette Generator", description: "Perfect color palettes instantly.", icon: Palette },
];

const videoTools: ComingSoon[] = [
  { name: "Extract Audio from Video", description: "Pull MP3 from any video free.", icon: Music },
  { name: "Video Compressor", description: "No watermark, no account needed.", icon: Minimize2 },
  { name: "Trim / Cut Video", description: "Cut video clips in your browser.", icon: Scissors },
  { name: "MOV to MP4", description: "Convert iPhone videos free.", icon: Film },
  { name: "Video to GIF", description: "Better than Ezgif. No limits.", icon: Clapperboard },
];

const devTools: ComingSoon[] = [
  { name: "JSON Formatter", description: "Format and validate JSON instantly.", icon: Braces },
  { name: "Regex Tester", description: "Test and explain regex in plain English.", icon: Regex },
  { name: "CSS Gradient Generator", description: "Visual CSS gradient builder.", icon: Blend },
  { name: "Base64 Encoder / Decoder", description: "Encode and decode Base64 free.", icon: Binary },
  { name: "Password Generator", description: "Strong passwords with custom rules.", icon: KeyRound },
];

function SectionHeader({ title, label }: { title: string; label: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-3">
      <h2 className="font-display text-2xl font-medium text-text-primary">
        {title}
      </h2>
      <span className="label">{label}</span>
    </div>
  );
}

export function ToolExplorer() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const matches = (name: string, description: string) =>
    !query ||
    name.toLowerCase().includes(query) ||
    description.toLowerCase().includes(query);

  const fLive = (arr: Tool[]) => arr.filter((t) => matches(t.name, t.description));
  const fCS = (arr: ComingSoon[]) =>
    arr.filter((t) => matches(t.name, t.description));

  const pdf = fLive(pdfTools);
  const img = fLive(imageTools);
  const calcs = fLive(calculatorTools);
  const ai = fCS(aiTools);
  const gen = fCS(generatorTools);
  const vid = fCS(videoTools);
  const dev = fCS(devTools);

  const total =
    pdf.length +
    img.length +
    calcs.length +
    ai.length +
    gen.length +
    vid.length +
    dev.length;

  const comingSoonGroups = [
    { title: "AI Writing", items: ai },
    { title: "Generators", items: gen },
    { title: "Video", items: vid },
    { title: "Developer", items: dev },
  ].filter((g) => g.items.length > 0);

  return (
    <section id="all-tools" className="scroll-mt-20 py-16">
      {/* Search */}
      <div className="relative max-w-xl">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Search tools... (compress, qr code, meme)"
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
              label={`${pdfTools.length} tools`}
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
              label={`${imageTools.length} tools`}
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
              label={`${calculatorTools.length} calculators`}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {calcs.map((t) => (
                <ToolCard key={t.href} tool={t} />
              ))}
            </div>
          </div>
        )}

        {comingSoonGroups.length > 0 && (
          <div id="coming-soon" className="scroll-mt-20 border-t border-border pt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-medium text-text-primary">
                More tools coming soon
              </h2>
              <span className="label">in development</span>
            </div>
            <div className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {comingSoonGroups.map((g) => (
                <div key={g.title}>
                  <p className="text-sm font-medium text-text-primary">
                    {g.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {g.items.map((i) => i.name).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {total === 0 && (
          <p className="text-[15px] text-text-muted">
            No tools found for “{q}”.
          </p>
        )}
      </div>
    </section>
  );
}
