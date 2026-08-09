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
  title: "Video to GIF — Free Online Converter, No Upload",
  description:
    "Convert video to GIF free online. Turn MP4, MOV or WebM clips into high-quality GIFs in your browser — no signup, no watermark, nothing uploaded.",
  keywords:
    "video to gif, mp4 to gif, convert video to gif free, make a gif from video, gif maker no watermark, mov to gif",
  path: "/video/to-gif",
});

const jsonLd = softwareAppSchema({
  name: "Free Video to GIF Converter",
  description:
    "Convert a video clip into a high-quality animated GIF entirely in your browser.",
  path: "/video/to-gif",
});

const Tool = dynamic(() => import("@/components/tools/VideoToGif"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I turn a video into a GIF?",
    a: "Choose your video, pick a frame rate and width, then click Make GIF. The tool builds an optimised colour palette and renders a high-quality animated GIF in your browser.",
  },
  {
    q: "Is my video uploaded to a server?",
    a: "No. The conversion runs on your device with ffmpeg compiled to WebAssembly, so your clip never leaves your browser.",
  },
  {
    q: "Why is my GIF larger than the video?",
    a: "GIF is an old, inefficient format, so a GIF is often bigger than the source video. Lower the frame rate and width, and keep the clip to a few seconds, to keep the file small.",
  },
  {
    q: "What frame rate and width should I use?",
    a: "15 fps at 480px is a good default for sharing. Use 24 fps for smoother motion, or 320px and 10 fps for a small, lightweight GIF.",
  },
  {
    q: "Does it add a watermark?",
    a: "Never. Your GIF is clean, with no watermark or branding.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Video & Audio Tools"
        sectionHref="/audio-tools"
        current="Video to GIF"
      />
      <ToolHeader
        title="Video to GIF"
        description="Turn a short video clip into a high-quality animated GIF — rendered entirely in your browser, with nothing uploaded."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your video never leaves your browser.</span>{" "}
        The GIF is rendered on your device via WebAssembly — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to convert a video to a GIF"
        steps={[
          "Choose your video clip",
          "Pick a frame rate and width",
          "Make GIF and download",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          This free video-to-GIF converter turns a short clip into an animated
          GIF you can drop into a chat, a README, a slide or a social post. To
          keep the result sharp, it generates a custom colour palette from your
          clip and applies it in a single pass, which looks far better than a
          default-palette GIF. Everything runs in your browser through ffmpeg
          compiled to WebAssembly, so your video is never uploaded and there is
          no signup, no watermark and no size cap. Because GIFs grow quickly with
          length and frame rate, trim your clip to a few seconds and pick a
          modest width for the smallest file. Prefer to keep it as a video? Try
          the{" "}
          <a
            href="/video/compress"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            video compressor
          </a>
          .
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/video/to-gif" />
    </div>
  );
}
