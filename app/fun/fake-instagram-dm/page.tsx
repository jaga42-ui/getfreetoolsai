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
  title: "Fake Instagram DM Generator — Free Chat Screenshot Maker",
  description:
    "Free fake Instagram DM generator. Build a realistic Instagram direct message screenshot with a username, story ring, gradient bubbles, dark mode and a Seen marker. Nothing is uploaded.",
  keywords:
    "fake instagram dm, fake instagram dm generator, instagram dm screenshot, fake instagram message, instagram chat generator, fake dm maker",
  path: "/fun/fake-instagram-dm",
});

const jsonLd = softwareAppSchema({
  name: "Fake Instagram DM Generator",
  description:
    "Create a realistic fake Instagram direct message screenshot entirely in your browser.",
  path: "/fun/fake-instagram-dm",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeInstagramDm"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I make a fake Instagram DM?",
    a: "Enter the username and status line, then type the conversation one message per line. Start a line with '>' for messages you sent — those render as the purple-to-blue gradient bubbles on the right. Everything else appears as a received message on the left.",
  },
  {
    q: "Does it look like the real Instagram DM screen?",
    a: "It reproduces the details people notice: the gradient story ring around the avatar, the gradient sent bubbles, tight grouping of consecutive messages from the same person, the pill-shaped bubble corners, and the small 'Seen' marker under the last message.",
  },
  {
    q: "Can I switch to light mode?",
    a: "Yes. Dark mode is on by default because it is what most people see, but the toggle switches to the white theme with grey received bubbles.",
  },
  {
    q: "Is anything uploaded?",
    a: "No. The screenshot is drawn on your own device with the Canvas API and never leaves your browser. There is no account and no watermark.",
  },
  {
    q: "Can I use emoji?",
    a: "Yes — type or paste them directly into the message lines and they render using your device's emoji font.",
  },
  {
    q: "Is this allowed?",
    a: "It is intended for memes, UI mockups and jokes. Creating images to impersonate a real person, fabricate evidence, or defraud someone can be illegal regardless of the tool used. This tool is not affiliated with or endorsed by Instagram.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Fun Tools"
        sectionHref="/fun-tools"
        current="Fake Instagram DM"
      />
      <ToolHeader
        title="Fake Instagram DM Generator"
        description="Build a realistic Instagram direct message screenshot — story ring, gradient bubbles, dark mode and a Seen marker — then download it as a PNG."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span> The screenshot
        is drawn on your device with the Canvas API.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake Instagram DM"
        steps={[
          "Enter the username and status line",
          "Type messages — prefix sent lines with >",
          "Download the conversation as a PNG",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            This generator draws an Instagram-style direct message thread from
            text you type. The details that sell a mockup are handled for you:
            the multicolour story ring around the profile picture, the
            purple-to-blue gradient on messages you sent, the way consecutive
            messages from one person bunch together while a change of speaker
            opens a gap, and the &ldquo;Seen&rdquo; line under the final message.
          </p>
          <p>
            Beyond memes it is useful for mocking up social features in a design
            review, building screenshots for a tutorial, or illustrating a
            support article without exposing a real conversation.
          </p>
          <p>
            Everything renders locally with the Canvas API, so nothing you type
            is transmitted. Want a different platform? There is also a{" "}
            <Link
              href="/fun/fake-whatsapp"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake WhatsApp chat generator
            </Link>
            , a{" "}
            <Link
              href="/fun/fake-text-message"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake iMessage generator
            </Link>{" "}
            and a{" "}
            <Link
              href="/fun/fake-discord"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              fake Discord chat generator
            </Link>
            .
          </p>
        </div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-instagram-dm" />
    </div>
  );
}
