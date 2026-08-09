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
  title: "Compress Video Free — No Upload, No Watermark",
  description:
    "Compress video free online and keep it private — files never leave your browser. Shrink MP4, MOV and WebM with no signup, watermark or size cap.",
  keywords:
    "compress video, compress video online free, reduce video size, video compressor no watermark, shrink mp4, compress video for email, compress video for whatsapp",
  path: "/video/compress",
});

const jsonLd = softwareAppSchema({
  name: "Free Video Compressor",
  description:
    "Compress video files in your browser to reduce size, with no upload, no watermark and no size cap.",
  path: "/video/compress",
});

const Tool = dynamic(() => import("@/components/tools/VideoCompressor"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Is my video uploaded to a server?",
    a: "No. Compression runs entirely in your browser using ffmpeg compiled to WebAssembly. Your video never leaves your device, which makes it safe for private and sensitive footage.",
  },
  {
    q: "Why is there a one-time download the first time?",
    a: "The first time you use any video tool, the browser downloads the ~31 MB video engine (ffmpeg.wasm). It is cached afterwards, so subsequent runs start immediately.",
  },
  {
    q: "How much smaller will my video get?",
    a: "It depends on the source, but the Balanced preset typically cuts size by 40–70%. Choose a lower resolution or the Smallest-file preset to shrink it further.",
  },
  {
    q: "Which video formats can I compress?",
    a: "MP4, MOV, WebM, MKV, AVI and M4V. The output is a widely-compatible MP4 (H.264 + AAC) with fast-start enabled for smooth web playback.",
  },
  {
    q: "Is there a file-size limit?",
    a: "There is no upload limit because nothing is uploaded. Very large files are limited only by your device's memory — for multi-GB videos, a desktop browser works best.",
  },
  {
    q: "Does it add a watermark?",
    a: "Never. The compressed video is clean, with no watermark, logo or branding of any kind.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Video & Audio Tools"
        sectionHref="/audio-tools"
        current="Compress Video"
      />
      <ToolHeader
        title="Compress Video"
        description="Shrink an MP4, MOV or WebM to a smaller file — entirely in your browser. No upload, no watermark, no size cap."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your video never leaves your browser.</span>{" "}
        ffmpeg runs on your device via WebAssembly — nothing is uploaded to any
        server.
      </PrivacyNote>
      <HowItWorks
        name="How to compress a video"
        steps={[
          "Choose your video file",
          "Pick a quality and resolution",
          "Compress and download",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          This free video compressor reduces the size of a video so it fits an
          email attachment limit, uploads faster to WhatsApp or Discord, or takes
          up less space on your phone. Unlike most online compressors, it does
          not upload your file to a server — ffmpeg is compiled to WebAssembly
          and runs directly in your browser, so your footage stays completely
          private and there is no artificial size cap or watermark. Pick a
          quality preset (High, Balanced or Smallest file) and optionally scale
          the resolution down to 1080p, 720p or 480p; the tool re-encodes to a
          widely-compatible MP4 (H.264 + AAC). The first run downloads the video
          engine once (~31 MB) and caches it. Need only the sound? Use{" "}
          <a
            href="/video/to-mp3"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            Video to MP3
          </a>{" "}
          instead.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/video/compress" />
    </div>
  );
}
