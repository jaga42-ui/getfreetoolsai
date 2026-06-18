import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { audioTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Free Audio & Video Tools — Transcribe, Subtitle & More",
  description:
    "Free audio and video tools that run 100% in your browser — transcribe speech to text, generate subtitles (SRT) and more, powered by on-device AI. No signup, no watermark, no upload.",
  keywords:
    "free audio tools, video tools online, transcribe audio free, generate subtitles, audio to text, srt generator, in-browser ai transcription",
  path: "/audio-tools",
});

const faqs = [
  {
    q: "Are these audio & video tools free?",
    a: "Yes — completely free with no daily limits, no signup, and no watermark on your output.",
  },
  {
    q: "Is my audio or video uploaded anywhere?",
    a: "No. Everything runs locally in your browser on your own device. Your media is never uploaded — only the AI model is downloaded once and cached, which is ideal for private or confidential recordings.",
  },
  {
    q: "What can I do here today?",
    a: "Transcribe an audio or video file to text and download timestamped subtitles (SRT). More audio and video tools are on the way.",
  },
  {
    q: "Do these tools work on mobile?",
    a: "They run in modern mobile browsers, but AI transcription is fastest on a desktop with WebGPU; long files can be slow on phones.",
  },
];

export default function AudioToolsHub() {
  const ready = audioTools.filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Audio & Video Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free Audio & Video Tools",
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
        <span className="text-text-primary">Audio &amp; Video Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free Audio &amp; Video Tools
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        Work with audio and video privately, free, and with no upload. Transcribe
        speech to text and generate subtitles using AI that runs entirely on your
        own device — your recordings never leave your browser. There are no
        per-minute limits and no watermark, and more audio and video tools are on
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
    </div>
  );
}
