import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-adjust-brightness-and-contrast",
  category: "image",
  title: "How to Adjust Brightness, Contrast & Filters on a Photo (Free)",
  description:
    "Rescue a dark, flat or dull photo by adjusting brightness, contrast, saturation and filters — what each control actually does, in the right order. Runs in your browser, no upload.",
  keywords:
    "how to adjust brightness and contrast, image filters, brighten a photo, increase contrast, saturation, photo editing online, adjust photo free, filters without upload",
  excerpt:
    "What brightness, contrast and saturation each do — and the order to adjust them in — free and private in your browser.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 4,
  tags: ["filters", "brightness", "image"],
  relatedTools: ["/image/filters", "/image/upscale", "/image/crop"],
  relatedGuides: ["compress-images-without-losing-quality"],
  toc: [
    { id: "controls", label: "What each control does" },
    { id: "order", label: "The order to adjust in" },
    { id: "steps", label: "Step-by-step" },
    { id: "tips", label: "Common fixes" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Most photos need only small adjustments to go from flat to punchy — a nudge
        of brightness here, a little contrast there. The trick is knowing what each
        slider actually does so you&apos;re fixing the real problem, not fighting it.
        You can <Link href="/image/filters">adjust brightness, contrast and
        filters for free</Link> in your browser, with no upload or watermark.
      </p>

      <h2 id="controls">What each control does</h2>
      <ul>
        <li><strong>Brightness</strong> — lightens or darkens the whole image evenly. Fixes an under- or over-exposed shot.</li>
        <li><strong>Contrast</strong> — the gap between lights and darks. More contrast adds punch; too much crushes detail in shadows and highlights.</li>
        <li><strong>Saturation</strong> — how vivid the colours are. A little adds life; too much looks artificial.</li>
        <li><strong>Filters</strong> — preset combinations (e.g. grayscale, sepia, vintage) that apply a whole look in one tap.</li>
      </ul>

      <h2 id="order">The order to adjust in</h2>
      <p>
        Work broad to fine: fix <strong>brightness</strong> first so the overall
        exposure is right, then <strong>contrast</strong> to restore depth, then{" "}
        <strong>saturation</strong> last for colour. Doing it in this order stops you
        chasing your tail — over-brightening, then over-contrasting to compensate,
        then wondering why it looks wrong.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/filters">Image Filters tool</Link>.</li>
        <li>Drop in your photo.</li>
        <li>Adjust brightness, then contrast, then saturation — or pick a preset filter.</li>
        <li>Download the edited image.</li>
      </ol>

      <h2 id="tips">Common fixes</h2>
      <ul>
        <li><strong>Dark indoor photo</strong> — raise brightness a little, add a touch of contrast.</li>
        <li><strong>Flat, hazy shot</strong> — increase contrast to bring back depth.</li>
        <li><strong>Washed-out colours</strong> — nudge saturation up slightly.</li>
        <li><strong>Small or soft image</strong> — filters won&apos;t fix resolution; try the <Link href="/image/upscale">Image Upscaler</Link> for that.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>What&apos;s the difference between brightness and contrast?</strong> Brightness shifts everything lighter or darker; contrast changes the difference between the light and dark areas.</p>
      <p><strong>Why does my edited photo look worse?</strong> Usually over-adjustment — small changes almost always beat big ones.</p>
      <p><strong>Is my photo uploaded?</strong> No. Editing runs in your browser; your image never leaves your device.</p>
      <p><strong>Is it free?</strong> Yes — unlimited use, no signup, no watermark.</p>
    </>
  ),
};

export default guide;
