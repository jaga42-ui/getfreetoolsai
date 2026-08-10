import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  PrivacyNote,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Video to MP3 — Free Online, No Upload",
  description:
    "Extract audio from video to MP3 free and private. Convert MP4, MOV and WebM in your browser — no signup, no watermark, nothing uploaded.",
  keywords:
    "video to mp3, mp4 to mp3, convert video to mp3 free, extract audio from video, video to audio converter, mov to mp3",
  path: "/video/to-mp3",
});

const jsonLd = softwareAppSchema({
  name: "Free Video to MP3 Converter",
  description:
    "Extract the audio track from a video and save it as an MP3, entirely in your browser.",
  path: "/video/to-mp3",
});

const Tool = dynamic(() => import("@/components/tools/VideoToMp3"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I convert a video to MP3?",
    a: "Choose your video file, pick an MP3 quality (128, 192 or 320 kbps), and click Extract MP3. The audio track is decoded and encoded to MP3 right in your browser.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. The conversion runs on your device with ffmpeg compiled to WebAssembly, so your video and its audio never leave your browser.",
  },
  {
    q: "Which formats are supported?",
    a: "Video files like MP4, MOV, WebM, MKV and AVI, plus audio files like M4A and WAV. Any of them can be converted to a standard MP3.",
  },
  {
    q: "What bitrate should I choose?",
    a: "192 kbps is a good balance of quality and size for most music and speech. Choose 320 kbps for the best quality or 128 kbps for the smallest file.",
  },
  {
    q: "Why is there a short wait the first time?",
    a: "The first use downloads the ~31 MB video engine (ffmpeg.wasm) once. It is cached afterwards, so later conversions start instantly.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Video & Audio Tools"
        sectionHref="/audio-tools"
        current="Video to MP3"
      />
      <ToolHeader
        title="Video to MP3"
        description="Pull the audio out of any video and save it as an MP3 — converted entirely in your browser, with nothing uploaded."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your file never leaves your browser.</span>{" "}
        The audio is extracted on your device via WebAssembly — nothing is
        uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to convert a video to MP3"
        steps={[
          "Choose your video file",
          "Pick an MP3 bitrate",
          "Extract and download the MP3",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          This free tool extracts the audio track from a video and saves it as an
          MP3 — perfect for saving a song, a lecture, a podcast or an interview
          from an MP4 or MOV without keeping the video. Everything happens inside
          your browser using ffmpeg compiled to WebAssembly, so your file is
          never uploaded and there is no signup, no watermark and no size limit.
          Choose 128, 192 or 320 kbps depending on whether you want a smaller
          file or the best possible quality. Want to keep the video but make it
          smaller? Use the{" "}
          <a
            href="/video/compress"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            video compressor
          </a>
          , or turn a clip into a{" "}
          <a
            href="/video/to-gif"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            GIF
          </a>
          .
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/video/to-mp3" />
    </div>
  );
}
