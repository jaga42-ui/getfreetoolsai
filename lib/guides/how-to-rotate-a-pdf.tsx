import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-rotate-a-pdf",
  category: "pdf",
  title: "How to Rotate a PDF and Save It (Free, No Upload)",
  description:
    "Rotate a sideways or upside-down PDF and save it permanently so it opens the right way up everywhere.",
  keywords:
    "how to rotate a pdf, rotate pdf, rotate pdf and save, turn pdf sideways, fix upside down pdf, rotate pdf free, rotate pdf without upload",
  excerpt:
    "Turn a sideways scan the right way up and save it for good — free and private, entirely in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["rotate pdf", "pdf"],
  relatedTools: ["/pdf/rotate", "/pdf/split", "/pdf/merge"],
  relatedGuides: ["split-pdf-into-separate-pages", "how-to-convert-pdf-to-jpg"],
  toc: [
    { id: "why", label: "Rotate vs. view rotated" },
    { id: "steps", label: "Step-by-step" },
    { id: "pages", label: "Rotating specific pages" },
    { id: "after", label: "After rotating" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Scanners and phone cameras love to save pages sideways or upside down.
        You can spin the view in your PDF reader, but that fix is temporary — the
        next person who opens it sees it wrong again. To fix it{" "}
        <em>permanently</em>, you need to rotate the pages and save. You can{" "}
        <Link href="/pdf/rotate">rotate a PDF and save it for free</Link> in your
        browser, with no upload, signup or watermark.
      </p>

      <h2 id="why">Rotating vs. just viewing rotated</h2>
      <p>
        Pressing &ldquo;rotate view&rdquo; in a reader only changes how{" "}
        <em>you</em> see it right now; the file&apos;s stored orientation
        doesn&apos;t change, so it prints and reopens the old way. Rotating and
        saving bakes the correct orientation into the file, so it&apos;s right for
        everyone, on every device, forever.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>
          Open the <Link href="/pdf/rotate">Rotate PDF tool</Link>.
        </li>
        <li>Drop in the PDF that&apos;s the wrong way up.</li>
        <li>Rotate it 90°, 180° or 270° until it&apos;s upright.</li>
        <li>
          Click <strong>Rotate PDF</strong> and download the corrected file.
        </li>
      </ol>
      <p>
        Everything happens locally, so even a sensitive scan never leaves your
        device.
      </p>

      <h2 id="pages">Rotating specific pages</h2>
      <p>
        Often only one or two pages in a scan are sideways while the rest are
        fine. Rotate just those pages so the whole document reads consistently. If
        you need to pull those pages out first — or drop pages you don&apos;t need
        — use the <Link href="/pdf/split">PDF splitter</Link>, then rotate and{" "}
        <Link href="/pdf/merge">merge</Link> them back in order.
      </p>

      <h2 id="after">After rotating</h2>
      <p>
        A correctly oriented PDF is easier to read, print and{" "}
        <Link href="/pdf/pdf-to-jpg">convert to images</Link>. If the rotated file
        is larger than an upload limit allows, run it through the{" "}
        <Link href="/pdf/compress">PDF compressor</Link>.
      </p>

      <h2 id="faq">FAQ</h2>
      <p>
        <strong>Does the rotation stick?</strong> Yes — it&apos;s saved into the
        file, so it opens upright for everyone, not just in your viewer.
      </p>
      <p>
        <strong>Can I rotate one page only?</strong> Yes — rotate individual pages
        and leave the rest untouched.
      </p>
      <p>
        <strong>Is my file uploaded?</strong> No. Rotation runs in your browser;
        the PDF never leaves your device.
      </p>
      <p>
        <strong>Is it free?</strong> Yes — unlimited use, no signup, no watermark.
      </p>
    </>
  ),
};

export default guide;
