import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "compress-pdf-to-a-specific-size",
  category: "pdf",
  title: "How to Compress a PDF to a Specific Size (100KB, 200KB, 500KB)",
  description:
    "Need a PDF under 100KB, 200KB or 500KB for an upload form? Learn how to compress a PDF to an exact target size for free, in your browser, without losing readability.",
  keywords:
    "compress pdf to 100kb, compress pdf to 200kb, compress pdf to 500kb, reduce pdf size for upload, compress pdf to specific size, pdf size reducer free",
  excerpt:
    "Hit an exact PDF size limit (100KB, 200KB, 500KB) for upload forms — free and in-browser.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  authorId: "team",
  readingTime: 6,
  tags: ["pdf compression", "file size", "upload limits"],
  relatedTools: ["/pdf/compress", "/pdf/split", "/pdf/merge"],
  relatedGuides: ["convert-pdf-to-word", "merge-pdf-files-free"],
  toc: [
    { id: "why", label: "Why a specific size?" },
    { id: "how", label: "How target-size compression works" },
    { id: "steps", label: "Step-by-step" },
    { id: "tips", label: "If it will not get small enough" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Upload forms love hard limits: a job portal wants your CV under 200KB, a
        visa site demands a PDF below 100KB, a court e-filing caps documents at
        500KB. Guessing at a &quot;compression level&quot; and re-trying is
        frustrating. Here is how to compress a PDF to an exact target size for
        free, with the work happening entirely in your browser.
      </p>

      <h2 id="why">Why a portal asks for a specific size</h2>
      <p>
        Servers that accept uploads set size caps to control storage and
        bandwidth. The number is usually arbitrary (100KB, 1MB) but the rejection
        is real — go one kilobyte over and the form refuses your file. The fix is
        to aim <em>at or just under</em> the limit while keeping the document as
        readable as possible.
      </p>

      <h2 id="how">How target-size compression works</h2>
      <p>
        Our <Link href="/pdf/compress">PDF compressor</Link> has a{" "}
        <strong>Target size</strong> mode. It re-renders each page as an image,
        then runs a binary search across image-quality settings to find the
        highest quality whose total size still fits your target. If even the
        lowest quality is too big, it uses that as a best effort and tells you.
        This works best on scanned or image-heavy PDFs, where most of the bytes
        live in the page images.
      </p>
      <p>Common targets and where they show up:</p>
      <table>
        <thead>
          <tr><th>Target</th><th>Typical requirement</th></tr>
        </thead>
        <tbody>
          <tr><td>Under 100KB</td><td>Visa / government forms, exam portals</td></tr>
          <tr><td>Under 200KB</td><td>Job applications, college admissions, KYC</td></tr>
          <tr><td>Under 500KB</td><td>E-filing, email attachment caps</td></tr>
          <tr><td>Under 1MB</td><td>Most general upload fields</td></tr>
        </tbody>
      </table>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/pdf/compress">PDF compressor</Link>.</li>
        <li>Drop in your PDF (or paste it with Ctrl/Cmd+V).</li>
        <li>Switch to <strong>Target size</strong> and type your limit in KB.</li>
        <li>Click compress — it renders, tunes the quality, and builds the file.</li>
        <li>Download and confirm it is under the limit and still readable.</li>
      </ol>
      <p>Your PDF is processed locally and is never uploaded to a server.</p>

      <h2 id="tips">If it will not get small enough</h2>
      <ul>
        <li>
          <strong>Split out pages you do not need.</strong> Fewer pages means a
          smaller file — use the <Link href="/pdf/split">PDF splitter</Link> to
          extract just the pages required.
        </li>
        <li>
          <strong>Accept a slightly lower quality.</strong> Text-as-image at a
          modest quality is still perfectly legible for most forms.
        </li>
        <li>
          <strong>Combine first, then compress.</strong> If you have several
          files, <Link href="/pdf/merge">merge them</Link> and compress once for
          a better size/quality balance.
        </li>
      </ul>
      <p>
        Note: because target mode flattens pages to images, text in the output is
        no longer selectable. If you must keep selectable text, use a level-based
        compression instead and keep the result a little larger.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Can I compress a PDF to exactly 100KB?</strong> You can land at or just under 100KB. The tool keeps the most quality possible while staying inside your target.</p>
      <p><strong>Will the text stay selectable?</strong> In Target size mode, no — pages become images. Use level-based compression if you need selectable text.</p>
      <p><strong>Is my file uploaded?</strong> No. Compression runs entirely in your browser, so your PDF never leaves your device.</p>
      <p><strong>Is there a watermark?</strong> Never. The output is clean.</p>
    </>
  ),
};

export default guide;
