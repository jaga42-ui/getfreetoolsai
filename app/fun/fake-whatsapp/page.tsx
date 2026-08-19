import dynamic from "next/dynamic";
import Link from "next/link";
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
  title: "Fake WhatsApp Chat Generator — Free Screenshot Maker",
  description:
    "Free fake WhatsApp chat generator. Build a chat screenshot with your own contact name, timestamps, blue ticks and dark mode. Nothing is uploaded.",
  keywords:
    "fake whatsapp chat generator, fake whatsapp screenshot, whatsapp chat maker, fake whatsapp message, whatsapp conversation generator, fake chat generator",
  path: "/fun/fake-whatsapp",
});

const jsonLd = softwareAppSchema({
  name: "Fake WhatsApp Chat Generator",
  description:
    "Create a realistic fake WhatsApp chat screenshot image entirely in your browser.",
  path: "/fun/fake-whatsapp",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeWhatsApp"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I make a fake WhatsApp chat?",
    a: "Set the contact name and status line, then type the conversation one message per line. Start a line with '>' for messages you sent (green, on the right); everything else is shown as received (white, on the left). Then download the result as a PNG.",
  },
  {
    q: "Can I set a different time on each message?",
    a: "Yes. Add '@' followed by a time at the end of any line — for example 'On my way @10:22'. Lines without one use the default time, so you only need to set the times that matter.",
  },
  {
    q: "Can I show blue ticks or dark mode?",
    a: "Both. The blue-ticks toggle switches read receipts between blue (read) and grey (delivered), and dark mode renders the chat with WhatsApp's dark palette.",
  },
  {
    q: "Is anything uploaded?",
    a: "No. The screenshot is drawn on your own device with the Canvas API and never leaves your browser. There is no account and no watermark.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes. The generator runs in mobile browsers on Android and iPhone, and the downloaded PNG is rendered at 2× so it stays sharp on high-density screens.",
  },
  {
    q: "Is this legal to use?",
    a: "It is intended for memes, mockups, UI design examples and jokes. Creating images to impersonate a real person, fabricate evidence, or defraud someone can be illegal regardless of the tool used to make them — please don't. This tool is not affiliated with or endorsed by WhatsApp.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Fun Tools"
        sectionHref="/fun-tools"
        current="Fake WhatsApp Chat"
      />
      <ToolHeader
        title="Fake WhatsApp Chat Generator"
        description="Build a realistic WhatsApp chat screenshot with your own contact, per-message timestamps, blue ticks and dark mode — then download it as a PNG."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span> The chat
        screenshot is drawn on your device with the Canvas API.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake WhatsApp chat"
        steps={[
          "Set the contact name and status line",
          "Type messages — prefix sent lines with >, add @10:30 for a time",
          "Download the chat as a PNG",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            This generator draws a WhatsApp-style conversation from text you
            type. Beyond the bubbles themselves it reproduces the details that
            make a mockup read as real: per-message timestamps tucked into the
            bottom-right of each bubble, double-tick read receipts that switch
            between grey and blue, the tail on the first bubble of each side, the
            patterned chat wallpaper, and a full dark-mode palette.
          </p>
          <p>
            It is genuinely useful for more than jokes — designers use it to mock
            up messaging UI, teachers to build conversation examples for language
            classes, and support teams to illustrate a flow in documentation
            without exposing a real chat.
          </p>
          <p>
            Everything is rendered locally with the Canvas API, so no message you
            type is transmitted anywhere. Prefer a different platform? Try the{" "}
            <Link
              href="/fun/fake-text-message"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake iMessage generator
            </Link>{" "}
            or the{" "}
            <Link
              href="/fun/fake-tweet"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake tweet generator
            </Link>
            . For image macros, use the{" "}
            <Link
              href="/image/meme-maker"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              meme maker
            </Link>
            .
          </p>
        </div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-whatsapp" />
    </div>
  );
}
