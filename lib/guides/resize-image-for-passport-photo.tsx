import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "resize-image-for-passport-photo",
  category: "image",
  title: "How to Resize an Image for a Passport or Visa Photo",
  description:
    "Resize and compress a photo to the exact pixel dimensions and KB size required for passport, visa and exam forms — free, in your browser, with nothing uploaded.",
  keywords:
    "resize image for passport photo, passport photo size, visa photo dimensions, resize photo to pixels, compress passport photo to 50kb, exam photo size",
  excerpt:
    "Hit the exact pixel and KB requirements for passport, visa and exam photos — free and private.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  authorId: "team",
  readingTime: 6,
  tags: ["resize image", "passport photo", "upload requirements"],
  relatedTools: ["/image/resize", "/image/crop", "/image/compress"],
  relatedGuides: [
    "compress-images-without-losing-quality",
    "convert-heic-to-jpg",
  ],
  toc: [
    { id: "requirements", label: "Typical requirements" },
    { id: "crop", label: "1. Crop to the right shape" },
    { id: "resize", label: "2. Resize to exact pixels" },
    { id: "compress", label: "3. Compress to the KB limit" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Passport, visa and exam portals are strict: they want a photo at exact
        pixel dimensions <em>and</em> under a specific file size, often as a JPG.
        Here is a reliable three-step way to get there for free, with every step
        running in your browser so your photo is never uploaded.
      </p>

      <h2 id="requirements">Typical requirements</h2>
      <table>
        <thead>
          <tr><th>Use</th><th>Common spec</th></tr>
        </thead>
        <tbody>
          <tr><td>Indian passport / many exams</td><td>200×230 px, 20–50KB, JPG</td></tr>
          <tr><td>US visa (DV / DS-160)</td><td>600×600 px, under ~240KB, JPG</td></tr>
          <tr><td>Schengen / UK style</td><td>35×45 mm ratio, a few hundred KB</td></tr>
        </tbody>
      </table>
      <p>
        Always check your specific form — the numbers vary. The workflow below
        works for any of them.
      </p>

      <h2 id="crop">1. Crop to the right shape</h2>
      <p>
        Start by <Link href="/image/crop">cropping</Link> to the correct aspect
        ratio (for example 1:1 for a square visa photo) so your face sits in the
        frame correctly. Getting the shape right first means the resize step will
        not distort the photo.
      </p>

      <h2 id="resize">2. Resize to exact pixels</h2>
      <p>
        Open the <Link href="/image/resize">image resizer</Link>, switch to
        pixel mode, and enter the required width and height (for example 200×230).
        Keep the aspect lock on if the spec is a ratio, or turn it off to force
        exact dimensions.
      </p>

      <h2 id="compress">3. Compress to the KB limit</h2>
      <p>
        Finally, use the <Link href="/image/compress">image compressor</Link> in
        target-size mode and type the maximum KB (for example 50KB). It tunes the
        quality to land at or just under the limit while keeping your face clear.
        If you cropped from a HEIC iPhone photo, convert it to JPG first with the{" "}
        <Link href="/image/heic-to-jpg">HEIC to JPG tool</Link>.
      </p>
      <p>
        Tip: with our tools you can chain these steps — finish one and send the
        result straight into the next without re-uploading.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>How do I get a photo under 50KB?</strong> Use target-size compression and enter 50 as the KB limit; the tool lands at or just under it.</p>
      <p><strong>Will resizing stretch my face?</strong> Not if you crop to the correct ratio first, then resize to matching dimensions.</p>
      <p><strong>What format do forms want?</strong> Almost always JPG. Convert first if your photo is HEIC or PNG.</p>
      <p><strong>Is my photo uploaded?</strong> No. Cropping, resizing and compressing all run in your browser.</p>
    </>
  ),
};

export default guide;
