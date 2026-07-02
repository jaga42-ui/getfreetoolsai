import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-crop-an-image",
  category: "image",
  title: "How to Crop an Image to a Specific Size or Ratio (Free, No Upload)",
  description:
    "Crop a photo to a square, a fixed aspect ratio, or exact pixel dimensions for profiles, uploads and prints. Runs in your browser, so your image is never uploaded — free, no watermark.",
  keywords:
    "how to crop an image, crop image, crop photo to square, crop image to aspect ratio, crop picture online, crop image free, crop image without upload",
  excerpt:
    "Cut a photo to a square, a fixed ratio, or exact pixels — for a profile, upload or print — free and private in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["crop image", "aspect ratio", "image"],
  relatedTools: ["/image/crop", "/image/resize", "/image/compress"],
  relatedGuides: ["resize-image-for-passport-photo", "how-to-upscale-an-image"],
  toc: [
    { id: "why", label: "Why crop an image" },
    { id: "steps", label: "Step-by-step" },
    { id: "ratios", label: "Common crop ratios" },
    { id: "crop-vs-resize", label: "Crop vs resize" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Cropping cuts away the parts of a photo you don&apos;t want — to tighten
        the framing, straighten a composition, or force an exact shape a platform
        demands. A square for a profile picture, a 16:9 banner, or a tightly
        framed product shot all start with a crop. You can{" "}
        <Link href="/image/crop">crop an image for free</Link> in your browser,
        with no upload, signup or watermark.
      </p>

      <h2 id="why">Why crop an image</h2>
      <ul>
        <li>
          <strong>Fit a required shape</strong> — a square avatar, a wide cover,
          or a fixed ratio a marketplace insists on.
        </li>
        <li>
          <strong>Improve the composition</strong> — remove distractions and put
          the subject where it belongs.
        </li>
        <li>
          <strong>Remove sensitive edges</strong> — crop out a face, a plate or a
          document corner before sharing.
        </li>
        <li>
          <strong>Privacy</strong> — the photo is cropped on your device, never
          uploaded to an editor.
        </li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>
          Open the <Link href="/image/crop">Crop Image tool</Link>.
        </li>
        <li>Drop in your photo.</li>
        <li>
          Drag the crop box, or lock it to a ratio like 1:1 or 16:9 for a precise
          shape.
        </li>
        <li>Download the cropped image.</li>
      </ol>

      <h2 id="ratios">Common crop ratios worth knowing</h2>
      <ul>
        <li><strong>1:1</strong> — square profile pictures and Instagram posts.</li>
        <li><strong>16:9</strong> — video thumbnails, banners and slides.</li>
        <li><strong>4:5</strong> — tall Instagram portraits.</li>
        <li><strong>3:2 / 4:3</strong> — classic photo prints.</li>
      </ul>

      <h2 id="crop-vs-resize">Crop vs resize — which do you need?</h2>
      <p>
        <strong>Cropping</strong> removes part of the image to change its shape or
        framing. <strong>Resizing</strong> keeps the whole image but changes its
        pixel dimensions. For an exact size that isn&apos;t the photo&apos;s
        original shape, do both: crop to the right ratio first, then set exact
        pixels with the{" "}
        <Link href="/image/resize">Resize Image tool</Link>. If you only need to
        hit a file-size limit in KB, use the{" "}
        <Link href="/image/compress">Compress Image tool</Link> instead.
      </p>

      <h2 id="faq">FAQ</h2>
      <p>
        <strong>How do I crop to a perfect square?</strong> Lock the crop box to a
        1:1 ratio, then position it over the part you want to keep.
      </p>
      <p>
        <strong>Will cropping lower the quality?</strong> No — cropping keeps the
        remaining pixels exactly as they were; it just removes the rest.
      </p>
      <p>
        <strong>Is my photo uploaded?</strong> No. Cropping runs in your browser;
        your image never leaves your device.
      </p>
      <p>
        <strong>Is it free?</strong> Yes — unlimited crops, no signup, no
        watermark.
      </p>
    </>
  ),
};

export default guide;
