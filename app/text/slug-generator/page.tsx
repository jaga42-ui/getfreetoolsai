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
  title: "Slug Generator — Free Online URL Slug Maker",
  description:
    "Turn any title into a clean, SEO-friendly URL slug. Handles accents, spaces and punctuation, with hyphen or underscore separators.",
  keywords:
    "slug generator, url slug maker, permalink generator, seo slug, convert title to slug, url friendly text",
  path: "/text/slug-generator",
});

const jsonLd = softwareAppSchema({
  name: "Slug Generator",
  description:
    "Convert titles and text into clean, URL-friendly slugs with hyphen or underscore separators.",
  path: "/text/slug-generator",
});

const Tool = dynamic(() => import("@/components/tools/SlugGenerator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What is a URL slug?",
    a: "A slug is the readable part of a URL that identifies a page, e.g. 'best-free-pdf-tools' in /blog/best-free-pdf-tools. A clean slug is lowercase, uses hyphens between words and avoids special characters.",
  },
  {
    q: "How does it handle accented characters?",
    a: "Accented letters are transliterated to their closest ASCII form — 'café' becomes 'cafe' — so the slug stays safe for URLs across all browsers and servers.",
  },
  {
    q: "Can I use underscores instead of hyphens?",
    a: "Yes. Choose hyphen (recommended for SEO) or underscore as the word separator. Repeated separators are collapsed and trimmed automatically.",
  },
  {
    q: "Can I convert many titles at once?",
    a: "Yes. Paste one title per line and the tool returns one slug per line, ready to copy into your CMS or spreadsheet.",
  },
  {
    q: "Is my text sent anywhere?",
    a: "No. Slugs are generated in your browser with JavaScript, so nothing you enter is uploaded.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Text Tools"
        sectionHref="/text-tools"
        current="Slug Generator"
      />
      <ToolHeader
        title="Slug Generator"
        description="Convert any title into a clean, SEO-friendly URL slug — accents removed, spaces and punctuation replaced, ready to paste into your CMS."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Everything runs in your browser.</span>{" "}
        Your titles are turned into slugs on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to generate a URL slug"
        steps={[
          "Paste a title (or one per line)",
          "Choose separator and lowercase",
          "Copy the ready-to-use slug",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          A slug generator turns a human title into the URL-safe string that
          goes in a page’s address. Good slugs are short, lowercase, use hyphens
          between words and strip out accents, punctuation and emoji — which
          helps both readers and search engines understand the page. This tool
          normalises accented characters to plain ASCII, replaces anything that
          is not a letter or number with your chosen separator, collapses
          repeats and trims the ends. Paste a single headline or a whole list of
          titles and get one clean slug per line. It is perfect for blog posts,
          product pages, documentation and anywhere you need tidy permalinks.
          Writing the headline first? Run it through the{" "}
          <a
            href="/text/case-converter"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            case converter
          </a>{" "}
          before you slugify.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/text/slug-generator" />
    </div>
  );
}
