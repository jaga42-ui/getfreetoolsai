import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { audioTools, videoTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Free Video & Audio Tools — Compress, Convert & Transcribe",
  description:
    "Free video and audio tools that run 100% in your browser — compress video, convert video to MP3 or GIF, transcribe speech to text and generate subtitles. No signup, no watermark, nothing uploaded.",
  keywords:
    "free video tools, compress video online, video to mp3, video to gif, transcribe audio free, generate subtitles, srt generator, in-browser video converter",
  path: "/audio-tools",
});

const faqs = [
  {
    q: "Are these video & audio tools free?",
    a: "Yes — completely free with no daily limits, no signup, and no watermark on your output.",
  },
  {
    q: "Is my video or audio uploaded anywhere?",
    a: "No. Everything runs locally in your browser on your own device. Your media is never uploaded — the ffmpeg video engine and the AI transcription model are each downloaded once and cached, which is ideal for private or confidential files.",
  },
  {
    q: "What can I do here today?",
    a: "Compress a video, convert a video to MP3 or an animated GIF, and transcribe audio or video to text with downloadable subtitles (SRT). More tools are on the way.",
  },
  {
    q: "Do these tools work on mobile?",
    a: "They run in modern mobile browsers, but heavy video encoding and AI transcription are fastest on a desktop; long or large files can be slow on phones.",
  },
];

export default function AudioToolsHub() {
  const ready = [...videoTools, ...audioTools].filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Video & Audio Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free Video & Audio Tools",
          ready.map((t) => ({ name: t.name, href: t.href }))
        )}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">Video &amp; Audio Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free Video &amp; Audio Tools
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        Work with video and audio privately, free, and with no upload. Compress a
        video, pull the audio out as MP3, turn a clip into a GIF, or transcribe
        speech to text with subtitles — all powered by ffmpeg and AI that run
        entirely on your own device, so your files never leave your browser.
        There are no per-minute limits and no watermark, and more tools are on
        the way.
      </p>

      <TrustBadges className="mt-6" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ready.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/audio-tools" />
    </div>
  );
}
