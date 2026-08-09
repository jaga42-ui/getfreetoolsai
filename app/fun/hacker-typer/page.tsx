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
  title: "Hacker Typer — Fake Hacking Screen Prank",
  description:
    "Free hacker typer prank. Mash any keys and watch realistic code fill a full-screen terminal like a movie hacker — a harmless in-browser joke.",
  keywords:
    "hacker typer, fake hacking, hacker simulator, fake hacking screen, hacker prank, fake code typer",
  path: "/fun/hacker-typer",
});

const jsonLd = softwareAppSchema({
  name: "Hacker Typer",
  description: "A fake hacking screen that fills with code as you type, in your browser.",
  path: "/fun/hacker-typer",
});

const Tool = dynamic(() => import("@/components/tools/fun/HackerTyper"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How does hacker typer work?", a: "Start typing — mash any keys — and pre-written code appears on screen at a realistic pace, as if you were a movie hacker. You're not actually running anything; it just displays code." },
  { q: "Is this actually hacking?", a: "No. It's purely for fun. Nothing is executed, nothing connects to any system, and no real code runs — it only shows text on your own screen." },
  { q: "Can I go full screen?", a: "Yes. Enter full screen for the most convincing effect, then press Escape to exit at any time." },
  { q: "Does it send anything anywhere?", a: "No. It runs entirely in your browser and makes no network requests." },
];

const about = (
  <>
    <p>
      Hacker typer is a harmless prank that makes it look like you&apos;re
      furiously coding something top-secret. As you tap any keys, realistic-looking
      code streams onto a full-screen terminal at a natural pace — perfect for a
      movie-style &quot;I&apos;m in&quot; joke with friends.
    </p>
    <p>
      Nothing is actually executed and nothing leaves your browser; it only
      displays text on your screen. For more pranks, try the{" "}
      <a href="/fun/blue-screen" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake blue screen</a>{" "}
      or{" "}
      <a href="/fun/fake-error" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake error message</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Hacker Typer" />
      <ToolHeader
        title="Hacker Typer"
        description="Mash any keys and watch realistic code fill the screen like a movie hacker — a harmless prank, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded or executed.</span>{" "}
        Hacker typer only displays text on your own screen.
      </PrivacyNote>
      <HowItWorks
        name="How to use hacker typer"
        steps={["Open the tool (go full screen for effect)", "Mash any keys on your keyboard", "Watch the fake code stream in"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/hacker-typer" />
    </div>
  );
}
