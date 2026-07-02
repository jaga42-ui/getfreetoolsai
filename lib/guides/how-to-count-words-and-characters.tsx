import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-count-words-and-characters",
  category: "calculator",
  title: "How to Count Words and Characters (Free, No Upload)",
  description:
    "Count words, characters, sentences and reading time in any text — for essays, tweets, meta descriptions and forms with strict limits. Runs in your browser; your text is never uploaded.",
  keywords:
    "how to count words, word counter, character count, count characters, words to reading time, character limit, word count tool, count words online",
  excerpt:
    "Count words, characters, sentences and reading time — and hit strict limits with confidence — free and private in your browser.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 3,
  tags: ["word count", "writing", "text"],
  relatedTools: ["/calculators/word-counter", "/image/image-to-text", "/calculators/percentage"],
  relatedGuides: ["extract-text-from-an-image"],
  toc: [
    { id: "why", label: "Why counts matter" },
    { id: "steps", label: "How to count" },
    { id: "limits", label: "Common limits to know" },
    { id: "reading", label: "How reading time is estimated" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Word and character limits are everywhere: an essay that must be 500 words, a
        meta description under 160 characters, a bio capped at 150, a tweet at 280. A{" "}
        <Link href="/calculators/word-counter">word counter</Link> tells you exactly
        where you stand as you write — and does it entirely in your browser, so your
        text is never uploaded.
      </p>

      <h2 id="why">Why the count matters</h2>
      <ul>
        <li><strong>Hard limits</strong> — forms and platforms reject text that&apos;s over, and pad awkwardly if under.</li>
        <li><strong>SEO</strong> — titles and meta descriptions get truncated in search results past a certain length.</li>
        <li><strong>Assignments</strong> — essays and applications often specify an exact word range.</li>
        <li><strong>Readability</strong> — reading time helps you gauge if an article is the right length.</li>
      </ul>

      <h2 id="steps">How to count</h2>
      <ol>
        <li>Open the <Link href="/calculators/word-counter">word counter</Link>.</li>
        <li>Type or paste your text.</li>
        <li>See words, characters (with and without spaces), sentences and reading time update live.</li>
      </ol>
      <p>Nothing is sent anywhere — even a confidential draft stays on your device.</p>

      <h2 id="limits">Common limits worth knowing</h2>
      <ul>
        <li><strong>SEO title</strong> — aim for ~60 characters before truncation.</li>
        <li><strong>Meta description</strong> — ~150–160 characters.</li>
        <li><strong>Tweet / X post</strong> — 280 characters.</li>
        <li><strong>Instagram caption</strong> — 2,200 characters.</li>
      </ul>

      <h2 id="reading">How reading time is estimated</h2>
      <p>
        Reading time is words ÷ reading speed. Most tools assume about 200–250
        words per minute for silent reading, so a 1,000-word article is roughly a
        4–5 minute read. It&apos;s an estimate — dense or technical text reads slower.
        Working from a photo or scan instead of typed text? Pull the words out first
        with the{" "}
        <Link href="/image/image-to-text">Image to Text tool</Link>, then paste them
        in to count.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Does it count characters with spaces?</strong> Yes — both with and without spaces, since different platforms count differently.</p>
      <p><strong>Is my text uploaded?</strong> No. Counting happens in your browser; nothing is sent to a server.</p>
      <p><strong>How is reading time calculated?</strong> Word count divided by an average reading speed of around 200–250 words per minute.</p>
      <p><strong>Is it free?</strong> Yes — no signup, unlimited use.</p>
    </>
  ),
};

export default guide;
