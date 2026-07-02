import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-add-a-watermark-to-a-photo",
  category: "image",
  title: "How to Add a Watermark to a Photo (Free, No Upload)",
  description:
    "Protect your images with a text watermark — your name, handle or ©. Control opacity, size and placement, then export. Runs in your browser, so your photos are never uploaded.",
  keywords:
    "how to add a watermark to a photo, add watermark to image, watermark photo online, text watermark, copyright watermark, watermark image free, watermark without upload",
  excerpt:
    "Stamp your name, handle or © across a photo — with control over opacity and placement — free and private in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["watermark", "copyright", "image"],
  relatedTools: ["/image/watermark", "/image/resize", "/image/compress"],
  relatedGuides: ["remove-exif-metadata-from-photos"],
  toc: [
    { id: "why", label: "Why watermark your photos" },
    { id: "steps", label: "Step-by-step" },
    { id: "placement", label: "Placement and opacity" },
    { id: "protect", label: "What a watermark can and can't do" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        A watermark is your signature on an image — your name, social handle or a ©
        notice — that travels with the photo wherever it&apos;s reposted. It deters
        casual theft and quietly advertises you every time the image is shared. You
        can <Link href="/image/watermark">add a watermark to a photo for free</Link>{" "}
        in your browser, with no upload and no watermark from <em>us</em> on top of
        yours.
      </p>

      <h2 id="why">Why watermark your photos</h2>
      <ul>
        <li><strong>Claim authorship</strong> — make it clear the image is yours.</li>
        <li><strong>Deter reuse</strong> — a visible mark discourages people lifting your work.</li>
        <li><strong>Free promotion</strong> — your handle rides along on every repost.</li>
        <li><strong>Privacy</strong> — the photo is stamped on your device, never uploaded.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/watermark">Add Watermark tool</Link>.</li>
        <li>Drop in your photo.</li>
        <li>Type your watermark text — name, @handle or © notice.</li>
        <li>Set the opacity, size and position.</li>
        <li>Download the watermarked image.</li>
      </ol>

      <h2 id="placement">Getting placement and opacity right</h2>
      <p>
        There&apos;s a trade-off: a faint corner watermark looks clean but is easy
        to crop out; a bold mark across the centre is theft-proof but distracting.
        For portfolios, a semi-transparent mark (around 30–50% opacity) placed over
        the subject — not the empty corner — is the sweet spot: visible enough to
        protect, subtle enough not to ruin the image. Keep it consistent across a
        set so your brand is recognisable.
      </p>

      <h2 id="protect">What a watermark can — and can&apos;t — do</h2>
      <p>
        A watermark deters casual copying, but a determined editor can crop or clone
        it out, so treat it as a deterrent, not a lock. For a second layer, strip
        the hidden metadata before sharing with the{" "}
        <Link href="/image/remove-exif">Remove EXIF tool</Link> so your camera model
        and GPS location don&apos;t leak. Resizing down for the web with the{" "}
        <Link href="/image/resize">Resize Image tool</Link> also makes stolen copies
        less useful at print size.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Will there be a watermark from the tool too?</strong> No — only your text is added; the tool adds nothing of its own.</p>
      <p><strong>Are my photos uploaded?</strong> No. Watermarking runs in your browser; your image never leaves your device.</p>
      <p><strong>Can someone remove my watermark?</strong> A visible watermark can be cropped or edited out by a determined user — it&apos;s a deterrent, not a guarantee.</p>
      <p><strong>Is it free?</strong> Yes — unlimited images, no signup.</p>
    </>
  ),
};

export default guide;
