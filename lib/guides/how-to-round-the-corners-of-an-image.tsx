import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-round-the-corners-of-an-image",
  category: "image",
  title: "How to Round the Corners of an Image (Free, No Upload)",
  description:
    "Add smooth rounded corners to an image and export it as a transparent PNG — perfect for avatars, app icons, cards and thumbnails. Runs in your browser, so your image is never uploaded.",
  keywords:
    "how to round the corners of an image, rounded corners image, add rounded corners to photo, rounded image png, avatar rounded corners, round image corners free",
  excerpt:
    "Give any image soft rounded corners and export a transparent PNG — for avatars, icons and cards — free and private in your browser.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 3,
  tags: ["rounded corners", "png", "image"],
  relatedTools: ["/image/rounded-corners", "/image/crop", "/image/resize"],
  relatedGuides: ["how-to-crop-an-image"],
  toc: [
    { id: "why", label: "Why round the corners" },
    { id: "steps", label: "Step-by-step" },
    { id: "png", label: "Why the result is a PNG" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Rounded corners are a small touch that makes an image look modern and
        intentional — the difference between a raw screenshot and a polished card.
        Avatars, app icons, thumbnails and UI mockups nearly all use them. You can{" "}
        <Link href="/image/rounded-corners">round the corners of an image for
        free</Link> in your browser, with no upload or watermark.
      </p>

      <h2 id="why">Why round the corners</h2>
      <ul>
        <li><strong>A softer, friendlier look</strong> — rounded corners feel less harsh than sharp ones.</li>
        <li><strong>Match a design system</strong> — most apps and sites use rounded cards and avatars.</li>
        <li><strong>Profile pictures</strong> — many platforms display avatars with rounded or circular masks.</li>
        <li><strong>Privacy</strong> — the image is processed on your device, never uploaded.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/rounded-corners">Round Corners tool</Link>.</li>
        <li>Drop in your image.</li>
        <li>Set the corner radius — a little for a subtle curve, more for a pill or circle.</li>
        <li>Download the rounded image as a PNG.</li>
      </ol>

      <h2 id="png">Why the result is a PNG</h2>
      <p>
        Rounding a corner means the area outside the curve has to become{" "}
        <em>transparent</em> — and only formats that support transparency can store
        that. JPG can&apos;t, so it would fill the corners with a solid colour and
        undo the effect. That&apos;s why the tool exports a <strong>PNG</strong>,
        which keeps the corners see-through so the image sits cleanly on any
        background. If you need an exact size first, crop or resize with the{" "}
        <Link href="/image/crop">Crop</Link> and{" "}
        <Link href="/image/resize">Resize</Link> tools, then round.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Can I make the image a circle?</strong> Yes — set the radius to the maximum on a square image for a full circle.</p>
      <p><strong>Why is it a PNG, not a JPG?</strong> The rounded corners need transparency, which JPG doesn&apos;t support.</p>
      <p><strong>Is my image uploaded?</strong> No. Processing runs in your browser; your image never leaves your device.</p>
      <p><strong>Is it free?</strong> Yes — unlimited use, no signup, no watermark.</p>
    </>
  ),
};

export default guide;
