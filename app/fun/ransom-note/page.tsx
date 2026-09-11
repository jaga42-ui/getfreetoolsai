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
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Ransom Note Generator — Download PNG Free",
  description:
    "Make a cut-out ransom note from magazine letters and download it as a PNG. Free, no signup, works on your phone, runs in your browser.",
  keywords:
    "ransom note generator, ransom note maker, cut out letter generator, magazine letter generator, ransom note font generator, kidnapper note generator, ransom letter maker",
  path: "/fun/ransom-note",
});

const jsonLd = softwareAppSchema({
  name: "Ransom Note Generator",
  description:
    "Turn any message into a cut-out ransom note of mismatched magazine letters and download it as a PNG, in your browser.",
  path: "/fun/ransom-note",
});

const faqs = [
  { q: "How do I make a ransom note?", a: "Type your message. Every letter is cut from a different typeface onto its own scrap of paper as you type. Shuffle until you like the mix, then click Download PNG." },
  { q: "Can I download it as an image?", a: "Yes. Download PNG gives you a crisp 2x-scale image with no watermark, no signup and no daily limit. It saves straight to your device." },
  { q: "Does it work on a phone?", a: "Yes. The editor and the note both scale to a phone screen, and the note re-wraps to fit. Most ransom note generators are desktop-only." },
  { q: "Why does every letter look different?", a: "That is the ransom note effect — a message assembled from letters clipped out of magazines and newspapers, so no two share a typeface, size or angle. Each scrap here gets its own font, tilt, paper colour and ink." },
  { q: "Can I get a different set of letters for the same message?", a: "Click Shuffle letters. The wording stays, but every scrap is re-cut with a new typeface, tilt and paper. The same note always looks the same until you shuffle, so it will not change under you while you type." },
  { q: "Can I share the note I made?", a: "Yes. Click \"Copy link to this note\" and the link reopens the generator with your message and settings already filled in." },
  { q: "Is anything uploaded?", a: "No. The note is drawn entirely in your browser and never leaves your device." },
  { q: "What is it for?", a: "Party and murder-mystery invitations, escape-room props, book covers, band and poster art, birthday cards, classroom projects and memes. It is a novelty image — do not use it to threaten or intimidate anyone." },
];

const about = (
  <>
    <p>
      In typography the <em>ransom note effect</em> is what happens when too
      many mismatched typefaces sit side by side. It is named after the
      stereotype of a note assembled from letters snipped out of magazines so no
      two characters match. This generator recreates it properly: every letter
      gets its own typeface, weight, size, tilt, paper stock and ink colour, and
      is drawn on its own shadowed scrap rather than typed in a single novelty
      font.
    </p>
    <p>
      Because the note is drawn on a canvas in your browser, the PNG comes out
      at full resolution and prints cleanly for party invitations, escape-room
      clues, poster and zine art, and book covers. Nothing is uploaded, there is
      no watermark and the image does not expire.
    </p>
    <p>
      For more image generators, try the{" "}
      <Link href="/fun/newspaper-clipping" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">newspaper clipping generator</Link>{" "}
      and the{" "}
      <Link href="/fun/fake-error" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">error message generator</Link>.
    </p>
  </>
);

const Tool = dynamic(() => import("@/components/tools/fun/RansomNote"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Ransom Note Generator" />
      <ToolHeader
        title="Ransom Note Generator"
        description="Type a message and get it back as cut-out magazine letters — mismatched fonts, tilted scraps and all. Download the PNG free."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The note is drawn on your device, and the PNG never expires.
      </PrivacyNote>

      <HowItWorks
        name="How to make a ransom note"
        steps={[
          "Type your message",
          "Pick a background and shuffle until you like the letters",
          "Download the PNG",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/ransom-note" />
    </div>
  );
}
