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
  title: "Fake AI Chat Screenshot Generator — ChatGPT Style",
  description:
    "Free fake AI chat generator. Write a prompt and reply, then download a realistic ChatGPT-style conversation screenshot. Nothing is uploaded.",
  keywords:
    "fake chatgpt screenshot, fake ai chat generator, chatgpt screenshot generator, fake chatgpt conversation, ai chat mockup, fake chatgpt reply",
  path: "/fun/fake-chatgpt",
});

const jsonLd = softwareAppSchema({
  name: "Fake AI Chat Screenshot Generator",
  description:
    "Create a realistic ChatGPT-style conversation screenshot image, in your browser.",
  path: "/fun/fake-chatgpt",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeChatGpt"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I write the conversation?", a: "Type one message per line. Start a line with '>' for your prompt — it appears as a bubble on the right. Lines without it are the assistant's reply, shown full-width next to an avatar." },
  { q: "Can I switch to light mode?", a: "Yes. Untick Dark mode to get the light theme instead. Both export at 2× resolution, so the PNG stays sharp when posted." },
  { q: "Does it upload my text anywhere?", a: "No. The screenshot is drawn on your device with the Canvas API, and nothing you type leaves the browser." },
  { q: "Is that a real logo in the screenshot?", a: "No — the avatar is a plain geometric mark, not any company's logo. The layout carries the resemblance without copying a trademark into your image." },
  { q: "Is this okay to use?", a: "For memes, mockups and jokes, yes. Don't pass a made-up answer off as something a real assistant actually said — that is how misinformation spreads, and screenshots travel further than corrections." },
];

const about = (
  <>
    <p>
      The AI-conversation screenshot has become its own meme format, and it is
      the layout that makes it recognisable rather than any logo: your prompt
      sits in a small rounded bubble on the right, while the reply runs
      full-width beside a round avatar with no bubble at all. Most imitations
      render both sides as matched bubbles, which is exactly why they read as a
      messaging app instead.
    </p>
    <p>
      Write the conversation one message per line, prefix your own lines with{" "}
      <code>&gt;</code>, pick light or dark, and download it as a PNG at 2×
      resolution. Everything is drawn in your browser and nothing is uploaded.
    </p>
    <p>
      One ask: keep invented answers obviously jokes. A fabricated screenshot
      presented as a real reply spreads much faster than the correction does.
      For other formats, try the{" "}
      <a href="/fun/fake-tweet" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake tweet generator</a>{" "}
      or the{" "}
      <a href="/fun/fake-reddit" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake Reddit post generator</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fake AI Chat" />
      <ToolHeader
        title="Fake AI Chat Screenshot Generator"
        description="Write a prompt and a reply, then download a realistic ChatGPT-style conversation screenshot."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The screenshot is drawn on your device with the Canvas API.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake AI chat screenshot"
        steps={["Set the conversation title", "Type the chat — prefix your prompts with >", "Download the screenshot as a PNG"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-chatgpt" />
    </div>
  );
}
