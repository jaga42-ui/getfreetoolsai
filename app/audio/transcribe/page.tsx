import dynamic from "next/dynamic";
import Link from "next/link";
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
  title: "Transcribe Audio Without Uploading — Free & Private",
  description:
    "Transcribe audio and video to text free. On-device Whisper AI runs in your browser so files never upload. Export SRT subtitles — no signup, no limits.",
  keywords:
    "transcribe audio without uploading, audio to text without upload, transcribe audio in browser free, private transcription, free transcription, video to text, generate subtitles, srt generator, whisper in browser",
  path: "/audio/transcribe",
});

const jsonLd = softwareAppSchema({
  name: "Transcribe Audio Without Uploading",
  description:
    "Transcribe audio and video to text and subtitles with on-device AI. 100% private — your file is never uploaded, it stays in your browser.",
  path: "/audio/transcribe",
  ratingCount: 118,
});

const Transcriber = dynamic(() => import("@/components/tools/Transcriber"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How can I transcribe audio without uploading it?",
    a: "Use this tool — it runs an on-device AI speech model (Whisper) right in your browser. You add your file, it is decoded and transcribed locally, and the audio is never sent to any server. That is what lets you transcribe audio without uploading it anywhere.",
  },
  {
    q: "Can I transcribe a video without uploading it?",
    a: "Yes. The video's audio track is decoded in your browser and transcribed locally, so the video file never leaves your device either. You get the transcript and optional .srt subtitles.",
  },
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
        title="Transcribe Audio Without Uploading"
        description="Turn speech into text and subtitles with on-device AI — for audio and video files. Everything is transcribed entirely in your browser, so your file is never uploaded to a server."
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
          This is a free way to <strong>transcribe audio without uploading</strong>{" "}
          it anywhere. It turns spoken audio — and video — into text and
          ready-to-use subtitles using OpenAI&apos;s Whisper speech model running
          entirely inside your browser. It&apos;s built for podcasters, students
          transcribing lectures, journalists working through interviews, and
          creators who need captions for a video. Unlike the typical
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
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          New to this?{" "}
          <Link
            href="/guides/audio/transcribe-audio-without-uploading"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            Read the guide: how to transcribe audio without uploading it
          </Link>
          .
        </p>
      </section>
      <ToolExtraContent href="/audio/transcribe" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/audio/transcribe" />
    </div>
  );
}
