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
  title: "Newspaper Clipping Generator — Download PNG Free",
  description:
    "Make a fake newspaper clipping with your own masthead, headline and story, then download it as a PNG. Free, no signup, runs in your browser.",
  keywords:
    "newspaper clipping generator, fake newspaper generator, newspaper generator, fake news article generator, old newspaper generator, newspaper headline generator, custom newspaper clipping",
  path: "/fun/newspaper-clipping",
});

const jsonLd = softwareAppSchema({
  name: "Newspaper Clipping Generator",
  description:
    "Create a vintage newspaper clipping with your own headline and story and download it as a PNG, in your browser.",
  path: "/fun/newspaper-clipping",
});

const faqs = [
  { q: "How do I make a fake newspaper clipping?", a: "Type the newspaper's name, the date, your headline and your story. The clipping is drawn as you type — set the tilt and paper age you want, then click Download PNG." },
  { q: "Can I download it as an image?", a: "Yes. Click Download PNG and you get a crisp 2x-scale image with no watermark, no signup and no daily limit. It saves straight to your device and stays there." },
  { q: "Does the image expire?", a: "No. Older clipping generators render the picture on their server and delete it after a short time, which breaks the link you shared. Here the PNG is drawn on your device and is yours to keep." },
  { q: "Does it work on a phone?", a: "Yes. The editor and the clipping both scale to a phone screen, so you can make and save one without a desktop." },
  { q: "Can I share the clipping I made?", a: "Yes. Click \"Copy link to this clipping\" and the link reopens the generator with your masthead, headline and story already filled in, so anyone can tweak it." },
  { q: "Is this real news?", a: "No. It is a picture you write yourself, for gifts, party invitations, classroom projects, birthday keepsakes and memes. Do not present it as a genuine news report." },
  { q: "Is anything uploaded?", a: "No. The clipping is drawn entirely in your browser and never leaves your device." },
];

const about = (
  <>
    <p>
      This generator draws a newspaper clipping the way a real one is set: a
      masthead in small caps over a double rule, a dateline, a headline across
      the full measure, and the story in two justified columns. You supply the
      words; the layout, the torn edges and the yellowed paper are drawn for
      you.
    </p>
    <p>
      It is a favourite for milestone birthday gifts (&ldquo;born the day the
      paper said&hellip;&rdquo;), retirement and anniversary presents, wedding
      table props, classroom history projects and memes. Because the clipping
      is drawn on a canvas in your browser, the PNG is full resolution and
      prints cleanly.
    </p>
    <p>
      Nothing is uploaded and the image does not expire. For more image
      generators, try the{" "}
      <Link href="/fun/fake-tweet" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake tweet generator</Link>{" "}
      and the{" "}
      <Link href="/fun/fake-error" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">error message generator</Link>.
    </p>
  </>
);

const Tool = dynamic(() => import("@/components/tools/fun/NewspaperClipping"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Newspaper Clipping Generator" />
      <ToolHeader
        title="Newspaper Clipping Generator"
        description="Write your own masthead, headline and story, then download the clipping as a PNG — aged paper and torn edges included."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The clipping is drawn on your device, and the PNG never expires.
      </PrivacyNote>

      <HowItWorks
        name="How to make a fake newspaper clipping"
        steps={[
          "Enter the newspaper name, date and headline",
          "Write your story — a blank line starts a new paragraph",
          "Set the tilt and paper age, then download the PNG",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/newspaper-clipping" />
    </div>
  );
}
