import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-flip-or-rotate-an-image",
  category: "image",
  title: "How to Flip or Rotate an Image (Free, No Upload)",
  description:
    "Rotate a sideways photo upright or flip it to mirror it — and understand the difference between the two. Runs in your browser, so your image is never uploaded. Free, no watermark.",
  keywords:
    "how to flip an image, rotate an image, mirror image, flip photo horizontally, rotate photo online, flip vs rotate, rotate image free, flip image without upload",
  excerpt:
    "Turn a sideways photo upright or mirror it — and know when to flip vs rotate — free and private in your browser.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 3,
  tags: ["flip image", "rotate image", "image"],
  relatedTools: ["/image/flip-rotate", "/image/crop", "/image/resize"],
  relatedGuides: ["how-to-crop-an-image"],
  toc: [
    { id: "difference", label: "Flip vs rotate" },
    { id: "steps", label: "Step-by-step" },
    { id: "when", label: "When to use each" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Phones and scanners constantly save photos the wrong way round, and
        selfies come out mirrored. Flipping and rotating fix both — but they&apos;re
        different operations, and mixing them up is why a corrected photo sometimes
        still looks off. You can{" "}
        <Link href="/image/flip-rotate">flip or rotate an image for free</Link> in
        your browser, with no upload or watermark.
      </p>

      <h2 id="difference">Flip vs rotate — what&apos;s the difference?</h2>
      <ul>
        <li>
          <strong>Rotate</strong> turns the image around its centre — 90°, 180° or
          270° — like spinning a photo on a table. Text stays readable (just
          reoriented).
        </li>
        <li>
          <strong>Flip</strong> mirrors the image across an axis. A horizontal flip
          swaps left and right (undoing a mirrored selfie); a vertical flip swaps top
          and bottom. Flipping <em>reverses</em> text, so it reads backwards.
        </li>
      </ul>
      <p>
        Rule of thumb: if a photo is sideways, <strong>rotate</strong>. If it&apos;s
        mirrored (a selfie, or writing that looks back-to-front), <strong>flip</strong>.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/flip-rotate">Flip &amp; Rotate tool</Link>.</li>
        <li>Drop in your photo.</li>
        <li>Rotate in 90° steps, or flip horizontally / vertically.</li>
        <li>Download the corrected image.</li>
      </ol>
      <p>Everything runs locally, so your photo never leaves your device.</p>

      <h2 id="when">When to use each</h2>
      <ul>
        <li><strong>Rotate</strong> — a portrait photo saved landscape, or a scan that came out sideways.</li>
        <li><strong>Horizontal flip</strong> — un-mirror a front-camera selfie, or face a subject the other way for a layout.</li>
        <li><strong>Vertical flip</strong> — correct an upside-down scan, or create a reflection effect.</li>
      </ul>
      <p>
        Need to change the shape or trim edges too? Follow up with the{" "}
        <Link href="/image/crop">Crop Image tool</Link>.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>What&apos;s the difference between flip and rotate?</strong> Rotate turns the image; flip mirrors it. Flipping reverses text, rotating doesn&apos;t.</p>
      <p><strong>How do I un-mirror a selfie?</strong> Flip it horizontally.</p>
      <p><strong>Is my photo uploaded?</strong> No. It&apos;s processed in your browser and never leaves your device.</p>
      <p><strong>Is it free?</strong> Yes — unlimited use, no signup, no watermark.</p>
    </>
  ),
};

export default guide;
