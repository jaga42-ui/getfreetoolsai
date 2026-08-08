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
  title: "Fake Discord Chat Generator — Free Message Screenshot Maker",
  description:
    "Free fake Discord chat generator. Build a realistic channel screenshot with multiple users, role colours, BOT tags, message grouping and light or dark theme. Nothing is uploaded.",
  keywords:
    "fake discord chat, fake discord message generator, discord screenshot generator, fake discord chat maker, discord message mockup, fake discord conversation",
  path: "/fun/fake-discord",
});

const jsonLd = softwareAppSchema({
  name: "Fake Discord Chat Generator",
  description:
    "Create a realistic fake Discord channel screenshot entirely in your browser.",
  path: "/fun/fake-discord",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeDiscord"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I make a fake Discord chat?",
    a: "Set the channel name, then write each message as 'name: message' on its own line. Every distinct name gets its own avatar and role colour automatically. A line with no name before the colon continues the previous person's message, which is how multi-line Discord posts look.",
  },
  {
    q: "Can I add a BOT tag?",
    a: "Yes. Put [BOT] after the name — for example 'MEE6 [BOT]: welcome!' — and that author renders with Discord's blue BOT badge next to their name.",
  },
  {
    q: "How are the username colours chosen?",
    a: "Each name is hashed to one of Discord's default role colours, so a given username always gets the same colour every time you render. You do not have to configure anything for a multi-person conversation to look right.",
  },
  {
    q: "Does it group consecutive messages?",
    a: "Yes. When the same person posts twice in a row, the second message omits the avatar and name header and sits directly under the first — matching how Discord actually collapses repeated authors.",
  },
  {
    q: "Is anything uploaded?",
    a: "No. The screenshot is drawn on your own device with the Canvas API and never leaves your browser.",
  },
  {
    q: "Is this allowed?",
    a: "It is intended for memes, mockups, bot documentation and jokes. Creating images to impersonate a real person, fabricate evidence, or defraud someone can be illegal regardless of the tool used. This tool is not affiliated with or endorsed by Discord.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Fun Tools"
        sectionHref="/fun-tools"
        current="Fake Discord Chat"
      />
      <ToolHeader
        title="Fake Discord Chat Generator"
        description="Build a realistic Discord channel screenshot with multiple users, automatic role colours, BOT tags and message grouping — then download it as a PNG."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span> The screenshot
        is drawn on your device with the Canvas API.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake Discord chat"
        steps={[
          "Set the channel name and timestamp",
          "Write each line as name: message",
          "Download the channel as a PNG",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            Discord does not look like a phone messenger — there are no chat
            bubbles. Messages are rows: a circular avatar, a coloured username,
            a timestamp, and the text beneath. This generator reproduces that
            layout, including the two things most mockups get wrong — role
            colours that stay consistent per user, and the way Discord collapses
            the avatar and name when the same person posts again.
          </p>
          <p>
            That makes it genuinely useful for bot developers documenting a
            command&apos;s output, moderators illustrating server rules, and
            anyone writing a tutorial who needs an example conversation without
            screenshotting a real server.
          </p>
          <p>
            Everything renders locally with the Canvas API, so nothing you type
            leaves your device. For other platforms, try the{" "}
            <Link
              href="/fun/fake-whatsapp"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake WhatsApp chat generator
            </Link>
            , the{" "}
            <Link
              href="/fun/fake-instagram-dm"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake Instagram DM generator
            </Link>{" "}
            or the{" "}
            <Link
              href="/fun/fake-tweet"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake tweet generator
            </Link>
            .
          </p>
        </div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-discord" />
    </div>
  );
}
