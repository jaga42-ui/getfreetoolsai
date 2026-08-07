import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { videoTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Free Video Tools Online — Compress, Video to MP3 & GIF, No Upload",
  description:
    "Compress video, extract MP3 audio and turn clips into GIFs — free, in your browser. Nothing is uploaded, so your videos never leave your device.",
  keywords:
    "free video tools, compress video online free, video to mp3, video to gif, video compressor no upload, online video tools no watermark",
  path: "/video-tools",
});

const faqs = [
  {
    q: "Are my videos uploaded to a server?",
    a: "No. Every video tool runs entirely inside your browser using ffmpeg compiled to WebAssembly. Your video is processed on your own device and is never uploaded — which is why there is no size cap imposed by an upload limit and nothing to delete afterwards.",
  },
  {
    q: "Why is browser-based video processing better?",
    a: "Most online video tools upload your file to a server, add a queue, and often watermark the result or cap the free tier. Because everything here happens locally, there is no waiting in line, no watermark, and your footage stays private — useful for personal clips, client work and anything confidential.",
  },
  {
    q: "Is there a file size or length limit?",
    a: "There is no server-side limit because nothing is uploaded. The practical ceiling is your own device's memory and speed, so very large or very long videos work best on a recent laptop or desktop in Chrome or Edge.",
  },
  {
    q: "Do the tools add a watermark?",
    a: "Never. The compressed video, extracted MP3 and generated GIF are clean, with no watermark, logo or branding added.",
  },
  {
    q: "Which video tool should I use?",
    a: "Use Compress Video to shrink a clip for email or upload, Video to MP3 to pull the audio out of a video, and Video to GIF to turn a short clip into a shareable animated GIF. Browse the full list above.",
  },
];

export default function VideoToolsHub() {
  const ready = videoTools.filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Video Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free Video Tools",
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
        <span className="text-text-primary">Video Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free Video Tools Online
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        A small, focused set of free video tools that do the everyday jobs —
        compress a video so it fits an email or upload limit, extract the audio
        from a clip as an MP3, or turn a short clip into an animated GIF. What
        makes these different is where the work happens: everything runs on your
        own device using ffmpeg compiled to WebAssembly, so your footage is{" "}
        <span className="text-text-primary">never uploaded</span> to any server.
        No queue, no watermark, no signup, and no artificial size cap. Need to
        pull a transcript instead? Try the{" "}
        <Link
          href="/audio/transcribe"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          audio &amp; video transcriber
        </Link>
        .
      </p>

      <TrustBadges className="mt-6" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ready.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <p className="mt-8 text-[15px] text-text-muted">
        Working with audio too?{" "}
        <Link
          href="/audio-tools"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          See the audio tools
        </Link>{" "}
        or compress the images in your project with the{" "}
        <Link
          href="/image-tools"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          image tools
        </Link>
        .
      </p>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/video-tools" />
    </div>
  );
}
