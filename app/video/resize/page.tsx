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
  title: "Resize Video for Reels, TikTok & Shorts — Free",
  description:
    "Free video resizer for Reels, TikTok, Shorts and square posts. Crop to fill or add a blurred background, in your browser — nothing uploaded.",
  keywords:
    "video resizer, resize video for tiktok, resize video for instagram reels, youtube shorts resizer, 9:16 video converter, square video converter, blurred background video",
  path: "/video/resize",
});

const jsonLd = softwareAppSchema({
  name: "Free Social Video Resizer",
  description:
    "Resize and reframe a video for Reels, TikTok, Shorts or square posts entirely in your browser.",
  path: "/video/resize",
});

const Tool = dynamic(() => import("@/components/tools/VideoSocialFormat"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I resize a video for Instagram Reels or TikTok?",
    a: "Choose your video, pick the Reels / TikTok / Shorts preset (9:16 at 1080×1920), then choose whether to crop to fill or add a blurred background. The resized MP4 downloads straight from your browser.",
  },
  {
    q: "What's the difference between crop and blurred background?",
    a: "Crop fills the frame and trims whatever falls outside it — best when your subject is centred. Blurred background keeps the entire picture and fills the empty space with a zoomed, blurred copy of the footage, which is how landscape video gets into a vertical feed without black bars.",
  },
  {
    q: "What size should a Reel, TikTok or Short be?",
    a: "All three use 9:16 at 1080×1920. A square post is 1:1 at 1080×1080, feed portrait is 4:5 at 1080×1350, and landscape YouTube is 16:9 at 1920×1080. This tool exports at those exact resolutions, not just the right shape.",
  },
  {
    q: "Does it upload my video?",
    a: "No. The video is processed by FFmpeg compiled to WebAssembly, running inside your browser tab. The file never leaves your device, which also means there is no upload wait and no size limit imposed by a server.",
  },
  {
    q: "Why is the first run slower?",
    a: "The FFmpeg engine (a few MB) downloads once on first use and is then cached by your browser. Later conversions skip that step. Processing time after that depends on the clip's length and your device.",
  },
  {
    q: "Will it lose quality?",
    a: "There is one re-encode, at a visually-transparent quality setting. Scaling up a low-resolution clip to 1080×1920 cannot add detail that was never captured, so start from the highest-quality source you have.",
  },
  {
    q: "Can it download a video from Instagram or YouTube?",
    a: "No. This tool works on video files you already have on your device. It has no way to fetch anything from another site, and it does not try to.",
  },
];

const about = (
  <>
    <p>
      Every short-form feed wants the same frame — <strong>9:16 at 1080×1920</strong> —
      and most footage is not shot that way. This resizer reframes a clip you
      already have into that shape, or into a square, 4:5 portrait or 16:9
      landscape, and exports at the exact resolution the platform expects.
      Getting the right <em>shape</em> at the wrong <em>resolution</em> is the
      usual reason an upload comes back looking soft.
    </p>
    <p>
      Two ways to fit the picture. <strong>Crop to fill</strong> takes the
      centre of the frame and throws away the overflow — clean, but check that
      nothing important sits near the edges.{" "}
      <strong>Blurred background</strong> keeps the whole picture and fills the
      space around it with a zoomed, blurred copy of the footage, which is the
      standard way to put landscape video into a vertical feed without black
      bars down the sides.
    </p>
    <p>
      Everything runs in your browser through FFmpeg compiled to WebAssembly, so
      the video never leaves your device — no upload wait, and no server-side
      size cap. Also try the{" "}
      <a href="/video/compress" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">video compressor</a>,{" "}
      <a href="/video/to-mp3" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">video to MP3</a>{" "}
      or the{" "}
      <a href="/how-to/resize-image-for-youtube-thumbnail" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">YouTube thumbnail size guide</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Video Tools" sectionHref="/video-tools" current="Resize Video" />
      <ToolHeader
        title="Resize Video for Reels, TikTok & Shorts"
        description="Reframe any clip to 9:16, 1:1, 4:5 or 16:9 — crop to fill or add a blurred background. Nothing is uploaded."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        Your video is processed by FFmpeg running inside this browser tab.
      </PrivacyNote>
      <HowItWorks
        name="How to resize a video for social media"
        steps={[
          "Choose your video file",
          "Pick a format — Reels/TikTok, square, portrait or landscape",
          "Choose crop to fill or blurred background, then download the MP4",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/video/resize" />
    </div>
  );
}
