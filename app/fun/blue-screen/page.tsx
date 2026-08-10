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
  title: "Fake Blue Screen (BSOD) — Full-Screen Prank",
  description:
    "Free fake blue screen of death prank. Show a realistic full-screen Windows crash with a progress counter — a harmless joke, right in your browser.",
  keywords:
    "fake blue screen, bsod prank, blue screen of death, fake windows crash, fake bsod, blue screen prank",
  path: "/fun/blue-screen",
});

const jsonLd = softwareAppSchema({
  name: "Fake Blue Screen",
  description: "Show a realistic full-screen fake Windows BSOD crash, in your browser.",
  path: "/fun/blue-screen",
});

const Tool = dynamic(() => import("@/components/tools/fun/BlueScreen"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is a fake blue screen?", a: "It's a cosmetic full-screen recreation of the Windows 'blue screen of death' crash, complete with a progress percentage. It looks real but nothing is actually wrong with the computer." },
  { q: "How do I exit the blue screen?", a: "Press Escape or exit full screen at any time. Nothing has crashed, so you return to normal instantly." },
  { q: "Is it safe?", a: "Yes. It only displays a full-screen image on your own device. No system files are touched and nothing is downloaded or run." },
  { q: "Is anything uploaded?", a: "No. The prank runs entirely in your browser." },
];

const about = (
  <>
    <p>
      This fake blue screen recreates the infamous Windows &quot;blue screen of
      death&quot; as a full-screen page, including a ticking progress counter, so
      it looks like a real crash. Leave it up on a friend&apos;s screen for a
      harmless prank, then press Escape to bring everything back to normal.
    </p>
    <p>
      It&apos;s entirely cosmetic — no system files are touched and nothing is
      uploaded. For more, try{" "}
      <a href="/fun/hacker-typer" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">hacker typer</a>{" "}
      or the{" "}
      <a href="/fun/fake-error" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake error message</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fake Blue Screen" />
      <ToolHeader
        title="Fake Blue Screen (BSOD)"
        description="Show a realistic full-screen Windows crash with a progress counter — a harmless prank you can exit any time."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded or damaged.</span>{" "}
        It only shows a full-screen image on your device — press Escape to exit.
      </PrivacyNote>
      <HowItWorks
        name="How to use the fake blue screen"
        steps={["Start the full-screen blue screen", "Leave it up for the prank", "Press Escape to exit instantly"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/blue-screen" />
    </div>
  );
}
