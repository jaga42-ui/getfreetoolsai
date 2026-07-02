import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "convert-png-to-jpg",
  category: "image",
  title: "How to Convert PNG to JPG for Free (No Upload)",
  description:
    "Convert PNG to JPG in seconds to shrink file size and fix upload rejections — free, no watermark. Everything runs in your browser, so your images are never uploaded to a server.",
  keywords:
    "how to convert png to jpg, png to jpg, png to jpeg, convert png to jpg free, change png to jpg, png to jpg without upload, png vs jpg",
  excerpt:
    "Turn PNGs into smaller, universally accepted JPGs — free, private, and instant, entirely in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["png to jpg", "convert image", "image"],
  relatedTools: ["/image/convert", "/image/compress", "/image/resize"],
  relatedGuides: ["compress-images-without-losing-quality", "convert-heic-to-jpg"],
  toc: [
    { id: "why", label: "Why convert PNG to JPG" },
    { id: "difference", label: "PNG vs JPG — which to use" },
    { id: "steps", label: "Step-by-step" },
    { id: "quality", label: "Keeping it sharp" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        PNG is brilliant for screenshots, logos and anything with sharp edges or
        transparency — but those files get big, and plenty of forms and portals
        only accept JPG. Converting a PNG to JPG usually makes the file several
        times smaller and gets it past upload filters. You can{" "}
        <Link href="/image/convert">convert PNG to JPG for free</Link> in your
        browser, with no upload and no watermark.
      </p>

      <h2 id="why">Why convert PNG to JPG</h2>
      <ul>
        <li>
          <strong>Much smaller files</strong> — a photo saved as PNG can be
          5–10× larger than the same image as JPG.
        </li>
        <li>
          <strong>Wider acceptance</strong> — job portals, government forms and
          older systems that reject PNG almost always take JPG.
        </li>
        <li>
          <strong>Faster to send</strong> — smaller files upload and email
          quicker and use less storage.
        </li>
        <li>
          <strong>Privacy</strong> — your images convert on your device instead
          of being uploaded to a converter.
        </li>
      </ul>

      <h2 id="difference">PNG vs JPG — which should you use?</h2>
      <p>
        Reach for <strong>JPG</strong> for photographs and anything you need
        small: it compresses smoothly graded colour beautifully, at the cost of
        not supporting transparency. Keep <strong>PNG</strong> for logos,
        screenshots, line art and images that need a transparent background,
        where its crisp edges matter. Converting a photo from PNG to JPG is
        almost always the right call; converting a logo you still need
        transparent usually isn&apos;t.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>
          Open the <Link href="/image/convert">Convert Image tool</Link>.
        </li>
        <li>Drop in your PNG file (or several at once).</li>
        <li>Choose <strong>JPG</strong> as the output format.</li>
        <li>Download the converted image.</li>
      </ol>
      <p>
        The conversion happens entirely in your browser, so your images never
        touch a server.
      </p>

      <h2 id="quality">Keeping the result sharp — and small</h2>
      <p>
        JPG is a &ldquo;lossy&rdquo; format, so very high compression can soften
        fine detail. For most photos the default quality is indistinguishable
        from the original while being far smaller. If you need to hit a specific
        file size — say under 200&nbsp;KB for a form — use the{" "}
        <Link href="/image/compress">Compress Image tool</Link>, which targets an
        exact size in KB. Need different dimensions too? The{" "}
        <Link href="/image/resize">Resize Image tool</Link> sets exact width and
        height.
      </p>

      <h2 id="faq">FAQ</h2>
      <p>
        <strong>Will I lose quality?</strong> JPG uses lossy compression, but at
        normal quality the difference is invisible for photos while the file is
        much smaller.
      </p>
      <p>
        <strong>What happens to transparency?</strong> JPG doesn&apos;t support
        it — transparent areas become a solid background. Keep PNG if you need
        transparency.
      </p>
      <p>
        <strong>Are my images uploaded?</strong> No. Conversion runs in your
        browser; nothing is sent to a server.
      </p>
      <p>
        <strong>Can I convert several at once?</strong> Yes — add multiple PNGs
        and convert them together.
      </p>
    </>
  ),
};

export default guide;
