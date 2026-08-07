import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-resize-an-image",
  category: "image",
  title: "How to Resize an Image to Exact Dimensions (Free, No Upload)",
  description:
    "Resize an image to exact pixel dimensions for uploads, profiles and prints — lock the aspect ratio to avoid stretching.",
  keywords:
    "how to resize an image, resize image, resize photo to exact size, change image dimensions, resize image in pixels, resize image without upload, resize image free",
  excerpt:
    "Set exact width and height for any upload or profile picture — without stretching — free and private in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 5,
  tags: ["resize image", "image dimensions", "image"],
  relatedTools: ["/image/resize", "/image/crop", "/image/compress"],
  relatedGuides: ["resize-image-for-passport-photo", "compress-images-without-losing-quality"],
  toc: [
    { id: "why", label: "Why resize an image" },
    { id: "steps", label: "Step-by-step" },
    { id: "ratio", label: "Aspect ratio: avoid stretching" },
    { id: "resize-vs-crop", label: "Resize vs crop vs compress" },
    { id: "sizes", label: "Common sizes to know" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        &ldquo;Image must be 600&nbsp;×&nbsp;600 pixels.&rdquo; &ldquo;Profile
        photo too large.&rdquo; Almost every upload form has an opinion about
        dimensions, and phone cameras produce images far bigger than any of them
        want. Resizing sets your image to the exact width and height you need.
        You can <Link href="/image/resize">resize an image for free</Link> in
        your browser — no upload, no signup, no watermark.
      </p>

      <h2 id="why">Why resize an image</h2>
      <ul>
        <li>
          <strong>Meet upload rules</strong> — hit an exact pixel size a portal,
          form or marketplace demands.
        </li>
        <li>
          <strong>Fit a profile or banner</strong> — social platforms expect
          specific dimensions for avatars and cover images.
        </li>
        <li>
          <strong>Shrink for the web</strong> — a smaller image loads faster and
          uses less bandwidth.
        </li>
        <li>
          <strong>Privacy</strong> — the photo is resized on your device, not
          uploaded to a resizer.
        </li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>
          Open the <Link href="/image/resize">Resize Image tool</Link>.
        </li>
        <li>Drop in your photo.</li>
        <li>Type the width and height you need, in pixels.</li>
        <li>
          Keep <strong>lock aspect ratio</strong> on unless you deliberately want
          to change the shape.
        </li>
        <li>Download the resized image.</li>
      </ol>

      <h2 id="ratio">Aspect ratio: how to avoid stretching</h2>
      <p>
        Aspect ratio is the relationship between width and height. If you change
        one without the other, the image stretches or squashes — faces look wide,
        text looks tall. Keeping the ratio locked means you set one dimension and
        the other follows automatically, so the picture stays natural. When you
        genuinely need an exact square or a fixed size that <em>doesn&apos;t</em>{" "}
        match the original shape, crop first (below), then resize.
      </p>

      <h2 id="resize-vs-crop">Resize vs crop vs compress</h2>
      <ul>
        <li>
          <strong>Resize</strong> changes the pixel dimensions of the whole
          image — everything stays in frame, just larger or smaller.
        </li>
        <li>
          <strong>Crop</strong> cuts away part of the image to change its shape or
          framing. Use the{" "}
          <Link href="/image/crop">Crop Image tool</Link> to get an exact square
          or aspect ratio, then resize.
        </li>
        <li>
          <strong>Compress</strong> lowers the <em>file size</em> in KB without
          changing dimensions. Use the{" "}
          <Link href="/image/compress">Compress Image tool</Link> when a form
          caps the file size rather than the pixels.
        </li>
      </ul>

      <h2 id="sizes">Common sizes worth knowing</h2>
      <ul>
        <li>
          <strong>Passport photo</strong> — often 600&nbsp;×&nbsp;600&nbsp;px;
          the <Link href="/guides/image/resize-image-for-passport-photo">passport photo guide</Link>{" "}
          covers country sizes.
        </li>
        <li><strong>Profile picture</strong> — commonly 400&nbsp;×&nbsp;400&nbsp;px.</li>
        <li><strong>Full-HD wallpaper</strong> — 1920&nbsp;×&nbsp;1080&nbsp;px.</li>
        <li><strong>Instagram square post</strong> — 1080&nbsp;×&nbsp;1080&nbsp;px.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p>
        <strong>Will resizing blur my image?</strong> Making an image smaller
        stays crisp. Enlarging a small image can soften it — for that, try the{" "}
        <Link href="/image/upscale">Image Upscaler</Link>, which adds detail with
        AI.
      </p>
      <p>
        <strong>How do I resize without stretching?</strong> Keep &ldquo;lock
        aspect ratio&rdquo; on, or crop to the target shape first, then resize.
      </p>
      <p>
        <strong>Are my photos uploaded?</strong> No. Resizing runs in your
        browser; your image never leaves your device.
      </p>
      <p>
        <strong>Resize or compress for a file-size limit?</strong> If the limit
        is in KB or MB, compress. If it&apos;s in pixels, resize.
      </p>
    </>
  ),
};

export default guide;
