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
  title: "Fake Windows Update Screen — Full Screen Prank",
  description:
    "Free fake Windows update prank. Show a convincing full-screen “Working on updates” screen that never finishes. Nothing is installed or changed.",
  keywords:
    "fake windows update, windows update prank, fake update screen, working on updates prank, fake windows 11 update, computer prank",
  path: "/fun/fake-windows-update",
});

const jsonLd = softwareAppSchema({
  name: "Fake Windows Update Screen",
  description:
    "Show a full-screen fake Windows update prank that never finishes, in your browser.",
  path: "/fun/fake-windows-update",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeWindowsUpdate"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I start the prank?", a: "Pick Windows 11 or Windows 10, then press “Start full screen”. The page fills the screen with a “Working on updates” message and a percentage that climbs but never finishes." },
  { q: "How do I stop it?", a: "Press Esc, or click anywhere on the screen. Closing the tab also ends it immediately." },
  { q: "Does it actually change anything on the computer?", a: "No. It is a web page drawing a picture of an update screen. Nothing is installed, downloaded, restarted or modified, and no setting is touched." },
  { q: "Why does the percentage stop in the nineties?", a: "Because that is what a real update does, and it is the reason nobody waits it out. A bar that reaches 100% would end the joke." },
  { q: "Will it work on a Mac?", a: "Yes — it is just a full-screen web page, so it runs in any modern browser. It will look like a Windows machine regardless of the computer it is on, which is part of the gag." },
  { q: "Is this okay to use?", a: "On a friend who will laugh, yes. Don't run it on someone in the middle of real work, on a shared or work machine, or on anyone who will genuinely panic." },
];

const about = (
  <>
    <p>
      This is the classic office prank: the screen someone comes back to and
      cannot do anything about. It fills the display with the{" "}
      <strong>“Working on updates”</strong> message, the spinning ring of dots
      and a percentage that climbs in uneven steps and then stalls in the
      nineties — the detail that makes people give up and walk away rather than
      wait.
    </p>
    <p>
      Nothing is installed, downloaded or changed. It is a web page drawing a
      picture of an update screen, and pressing Esc ends it instantly. Because
      it is only a page, it works on any computer, including a Mac.
    </p>
    <p>
      If you want the crash rather than the update, try the{" "}
      <a href="/fun/blue-screen" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake blue screen of death</a>,
      the{" "}
      <a href="/fun/fake-error" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake error message generator</a>{" "}
      or{" "}
      <a href="/fun/hacker-typer" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">hacker typer</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fake Windows Update" />
      <ToolHeader
        title="Fake Windows Update Screen"
        description="Show a convincing full-screen “Working on updates” prank that never finishes. Press Esc to exit."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is installed or changed.</span>{" "}
        This is a web page drawing an update screen — closing the tab ends it.
      </PrivacyNote>
      <HowItWorks
        name="How to run the fake Windows update prank"
        steps={["Pick Windows 11 or Windows 10", "Press Start full screen", "Press Esc or click to exit"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this prank</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-windows-update" />
    </div>
  );
}
