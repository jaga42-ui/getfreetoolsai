import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { toolMeta, softwareAppSchema } from "@/lib/seo";
import { ToolExtraContent } from "@/components/ToolExtraContent";

export const metadata = toolMeta({
  title: "Free Audio & Video Transcription — Private, In Your Browser",
  description:
    "Transcribe audio or video to text and download subtitles (SRT) free. Powered by on-device AI (Whisper) — your file never leaves your browser. No signup, no upload, no limits.",
  keywords:
    "free transcription, audio to text, video to text, transcribe audio online free, generate subtitles, srt generator, whisper in browser, private transcription",
  path: "/audio/transcribe",
});

const jsonLd = softwareAppSchema({
  name: "Free AI Transcription",
  description:
    "Transcribe audio/video to text and subtitles with on-device AI. 100% private — your file never leaves your browser.",
  path: "/audio/transcribe",
  ratingCount: 118,
});

const Transcriber = dynamic(() => import("@/components/tools/Transcriber"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Is my audio or video uploaded to a server?",
    a: "No. The AI speech model runs entirely in your browser, so your file is never uploaded. The model is served from this site itself (not a third-party) and cached after the first use — nothing goes to an external provider.",
  },
  {
    q: "What files can I transcribe?",
    a: "Common audio (MP3, WAV, M4A, OGG) and video (MP4, WebM, MOV) files with an audio track. The audio is decoded locally and fed to the model.",
  },
  {
    q: "Can I get subtitles (SRT)?",
    a: "Yes. Alongside the plain-text transcript, you can download a timestamped .srt subtitle file ready to load into a video player or editor.",
  },
  {
    q: "Why is the first run slow?",
    a: "The first time you transcribe, the AI model downloads to your browser (one time only). After that it's cached and starts instantly. A device with WebGPU (most modern desktops) is significantly faster.",
  },
  {
    q: "How accurate is it?",
    a: "It uses OpenAI's Whisper model, which is strong on clear speech in many languages. Accuracy drops with heavy background noise, overlapping speakers or very low-quality audio.",
  },
  {
    q: "Is it really free with no limits?",
    a: "Yes. No signup, no per-minute caps and no watermark. Because it runs on your own device, there are no server costs to pass on.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Audio & Video Tools" sectionHref="/audio-tools" current="Transcribe Audio & Video" />
      <ToolHeader
        title="Transcribe Audio & Video — Free & Private"
        description="Turn speech into text and subtitles with on-device AI. Your file is transcribed entirely in your browser — nothing is ever uploaded."
      />
      <div className="mt-8">
        <Transcriber />
      </div>
      <HowItWorks
        steps={[
          "Drop in an audio or video file",
          "On-device AI transcribes it locally",
          "Copy the text or download .txt / .srt",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free transcription tool turns spoken audio into text — and into
          ready-to-use subtitles — using OpenAI&apos;s Whisper speech model
          running entirely inside your browser. It&apos;s built for podcasters,
          students transcribing lectures, journalists working through interviews,
          and creators who need captions for a video. Unlike the typical
          &ldquo;free&rdquo; transcription site, your recording is never uploaded
          to a server: the AI model downloads to your device once and then does
          all the work locally, which is why it&apos;s safe for confidential
          interviews and private recordings, and why there are no per-minute
          limits or watermarks. Download the plain-text transcript or a
          timestamped <strong>.srt</strong> subtitle file. A modern device with
          WebGPU runs it fastest, but it works on any current browser. This is an
          early version — accuracy is best on clear speech, and very long files
          take longer on slower machines.
        </p>
      </section>
      <ToolExtraContent href="/audio/transcribe" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/audio/transcribe" />
    </div>
  );
}
