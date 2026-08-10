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
  title: "Fake Error Message Generator — Windows-Style Popup",
  description:
    "Free fake error message generator. Build a custom Windows-style error popup with your own title, message, icon and buttons for harmless pranks.",
  keywords:
    "fake error message, error message generator, fake windows error, error popup maker, fake error generator, windows error prank",
  path: "/fun/fake-error",
});

const jsonLd = softwareAppSchema({
  name: "Fake Error Message Generator",
  description: "Create custom Windows-style error popups for memes and pranks, in your browser.",
  path: "/fun/fake-error",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeError"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I make a fake error message?", a: "Type your own title and message text, choose an icon (error, warning, info) and the buttons, then preview the Windows-style popup. It's perfect for a meme or a harmless desktop prank." },
  { q: "Is this a real error?", a: "No. It's a cosmetic popup you create — nothing is actually wrong with your computer and no real system dialog is triggered." },
  { q: "Can I use it in a meme?", a: "Yes. Screenshot the popup and use it in a meme or joke. Please keep it harmless and don't use it to scare or scam anyone." },
  { q: "Is anything uploaded?", a: "No. The generator runs entirely in your browser." },
];

const about = (
  <>
    <p>
      This fake error message generator recreates the classic Windows-style
      dialog box, but with text you control. Set the window title, the message,
      the icon (error, warning or information) and which buttons appear, then use
      the result for a meme, a joke screenshot or a lighthearted desktop prank.
    </p>
    <p>
      It&apos;s purely cosmetic — nothing is actually wrong and nothing is
      uploaded. For more pranks, see the{" "}
      <a href="/fun/blue-screen" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake blue screen</a>{" "}
      and{" "}
      <a href="/fun/hacker-typer" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">hacker typer</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fake Error Message" />
      <ToolHeader
        title="Fake Error Message Generator"
        description="Build a custom Windows-style error popup with your own title, message, icon and buttons — for memes and harmless pranks."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The popup is generated on your device — it&apos;s cosmetic only.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake error message"
        steps={["Enter your title and message", "Pick an icon and buttons", "Preview or screenshot the popup"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-error" />
    </div>
  );
}
