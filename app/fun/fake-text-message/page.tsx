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
  title: "Fake Text Message Generator — iMessage Screenshot Maker",
  description:
    "Free fake text message generator. Create a realistic iMessage or SMS chat screenshot with your own contact name and messages, then download it as a PNG.",
  keywords:
    "fake text message, fake imessage, fake text generator, fake chat screenshot, imessage generator, fake text message maker",
  path: "/fun/fake-text-message",
});

const jsonLd = softwareAppSchema({
  name: "Fake Text Message Generator",
  description: "Create a fake iMessage or SMS chat screenshot image, in your browser.",
  path: "/fun/fake-text-message",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeTextMessage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I make a fake text message?", a: "Enter a contact name and type your messages one per line. Start a line with a '>' for messages you sent (blue, on the right); other lines are received (grey, on the left). Then download the chat as a PNG." },
  { q: "Can I switch between iMessage and SMS style?", a: "Yes. Toggle green (SMS) bubbles instead of blue (iMessage) to match the look you want." },
  { q: "Does it upload anything?", a: "No. The chat screenshot is drawn on your device with the Canvas API and never uploaded." },
  { q: "Is this okay to use?", a: "It's for memes and jokes. Please don't use it to impersonate real people or deceive anyone." },
];

const about = (
  <>
    <p>
      This fake text message generator builds a realistic phone-chat screenshot
      from text you type. Set the contact name, then write the conversation one
      message per line — prefix a line with <code>&gt;</code> for messages you sent
      (blue bubbles on the right) and leave others as received (grey, on the left).
      You can switch to green SMS bubbles, and download the whole chat as a PNG.
    </p>
    <p>
      Everything is drawn in your browser and nothing is uploaded. Keep it
      harmless. Also try the{" "}
      <a href="/fun/fake-tweet" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake tweet generator</a>{" "}
      or the{" "}
      <a href="/image/meme-maker" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">meme maker</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fake Text Message" />
      <ToolHeader
        title="Fake Text Message Generator"
        description="Create a realistic iMessage or SMS chat screenshot with your own contact and messages, then download it as a PNG."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The chat screenshot is drawn on your device with the Canvas API.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake text message"
        steps={["Set the contact name", "Type messages — prefix sent lines with >", "Download the chat as a PNG"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-text-message" />
    </div>
  );
}
