import Link from "next/link";
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
import { toolMeta, softwareAppSchema, itemListSchema } from "@/lib/seo";
import { errorStyles } from "@/lib/errorStyles";

export const metadata = toolMeta({
  title: "Windows Error Message Generator — Download PNG Free",
  description:
    "Make a custom Windows error popup with your own title, message, icon and buttons, then download it as a PNG. Free, no signup, runs in your browser.",
  keywords:
    "windows error message generator, error message maker, windows popup generator, error popup maker, custom windows error message, windows dialog generator, fake error generator",
  path: "/fun/fake-error",
  ownOgImage: true,
});

const jsonLd = softwareAppSchema({
  name: "Windows Error Message Generator",
  description:
    "Create custom Windows-style error popups and download them as a PNG, in your browser.",
  path: "/fun/fake-error",
});

const versionList = itemListSchema(
  "Error message generators by operating system",
  errorStyles.map((s) => ({ name: s.h1, href: `/fun/fake-error/${s.slug}` }))
);

const Tool = dynamic(() => import("@/components/tools/fun/FakeError"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I make a fake error message?", a: "Type your own title and message, choose an icon (error, warning, info or success) and the buttons, then click Download PNG. The image is drawn in your browser and saves straight to your device." },
  { q: "Can I download it as an image?", a: "Yes. Click Download PNG and you get a crisp 2x-scale PNG of the dialog — no watermark, no signup, no daily limit." },
  { q: "Can I make a Windows XP or Windows 11 error instead?", a: "Yes. Each Windows version drew its dialogs differently, so there is a dedicated generator for Windows 11, 10, 7, XP and 98, plus a macOS alert generator. Pick one from the version list on this page." },
  { q: "Can I share the popup I made?", a: "Yes. Click \"Copy link to this popup\" and the link reopens the generator with your exact text, icon and buttons already filled in." },
  { q: "Is this a real error?", a: "No. It is a cosmetic image you create — nothing is actually wrong with your computer and no real system dialog is triggered." },
  { q: "Is anything uploaded?", a: "No. The generator runs entirely in your browser and the image never leaves your device." },
];

const about = (
  <>
    <p>
      This error message generator recreates the classic Windows dialog box, but
      with text you control. Set the window title, the message, the icon and
      which buttons appear, then download the result as a PNG for a meme, a
      joke screenshot, a mockup or a lighthearted desktop prank.
    </p>
    <p>
      It is purely cosmetic — nothing is actually wrong and nothing is uploaded.
      For more pranks, see the{" "}
      <Link href="/fun/blue-screen" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake blue screen</Link>{" "}
      and{" "}
      <Link href="/fun/hacker-typer" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">hacker typer</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <JsonLd data={versionList} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Error Message Generator" />
      <ToolHeader
        title="Windows Error Message Generator"
        description="Build a custom Windows-style error popup with your own title, message, icon and buttons — then download it as a PNG."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The popup is drawn on your device — it&apos;s cosmetic only.
      </PrivacyNote>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Pick your Windows version
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
          The generator above draws the Windows 10 dialog. Every Windows release
          styled its error boxes differently — XP&rsquo;s Luna blue title bar,
          Windows 7&rsquo;s Aero glass, Windows 11&rsquo;s rounded Fluent
          chrome — so each one has its own generator that draws it properly.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {errorStyles.map((s) => (
            <Link
              key={s.slug}
              href={`/fun/fake-error/${s.slug}`}
              className="flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/50"
            >
              <span className="font-display text-[17px] font-medium text-text-primary">
                {s.label}
              </span>
              <span className="mt-0.5 text-xs uppercase tracking-wide text-text-muted">
                {s.era}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <HowItWorks
        name="How to make a fake error message"
        steps={[
          "Enter your title and message",
          "Pick an icon and buttons",
          "Download the PNG or copy a link to it",
        ]}
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
