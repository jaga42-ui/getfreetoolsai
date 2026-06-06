import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "merge-pdf-files-free",
  category: "pdf",
  title: "How to Merge PDF Files for Free (Without Uploading Them)",
  description:
    "Combine multiple PDFs into one file for free, in any order, without signup or watermarks. Everything runs in your browser — your documents are never uploaded.",
  keywords:
    "merge pdf, combine pdf, merge pdf free, join pdf files, merge pdf without upload, combine pdf no watermark, merge pdf offline",
  excerpt:
    "Combine several PDFs into one, in any order, free and privately in your browser.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  authorId: "team",
  readingTime: 5,
  tags: ["merge pdf", "combine documents", "pdf"],
  relatedTools: ["/pdf/merge", "/pdf/split", "/pdf/compress"],
  relatedGuides: ["compress-pdf-to-a-specific-size", "convert-pdf-to-word"],
  toc: [
    { id: "when", label: "When to merge PDFs" },
    { id: "steps", label: "Step-by-step" },
    { id: "order", label: "Getting the order right" },
    { id: "after", label: "After merging" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Merging PDFs is one of those everyday jobs that should be instant and
        free — combining scanned pages into a single document, stitching a cover
        letter to a CV, or bundling receipts for an expense claim. Here is how to
        merge PDF files for free without uploading anything to a server.
      </p>

      <h2 id="when">When you need to merge PDFs</h2>
      <ul>
        <li>Joining a cover letter, CV and portfolio into one application file.</li>
        <li>Combining individually scanned pages into a single contract.</li>
        <li>Bundling invoices or receipts for accounting.</li>
        <li>Assembling chapters or sections into one report.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/pdf/merge">PDF merger</Link>.</li>
        <li>Drop in two or more PDFs (you can add more at any time).</li>
        <li>Drag the files — or use the up/down arrows — to set the order.</li>
        <li>Click <strong>Merge all</strong> (or press Enter).</li>
        <li>Download your combined PDF.</li>
      </ol>
      <p>
        Everything happens locally in your browser, so even sensitive documents
        like contracts and statements never leave your device.
      </p>

      <h2 id="order">Getting the page order right</h2>
      <p>
        Order matters: the merged file follows the list top to bottom. Each item
        shows its page count, so you can confirm you are combining the right
        documents before you merge. Need only certain pages from a file first?
        Use the <Link href="/pdf/split">PDF splitter</Link> to extract them, then
        merge the results.
      </p>

      <h2 id="after">After merging</h2>
      <p>
        A combined PDF — especially from scans — can get large. If you need to
        email or upload it, run it through the{" "}
        <Link href="/pdf/compress">PDF compressor</Link> to shrink it, or compress
        to an exact size if a form imposes a limit. You can also add page numbers
        or a watermark to the finished document.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is merging PDFs free?</strong> Yes — unlimited merges, no signup, no watermark.</p>
      <p><strong>How many files can I combine?</strong> As many as your device can hold in memory; there is no fixed cap because nothing is uploaded.</p>
      <p><strong>Can I reorder pages?</strong> Yes. Drag files or use the arrows to set the exact order before merging.</p>
      <p><strong>Are my files uploaded?</strong> No. Merging runs entirely in your browser; your PDFs never leave your device.</p>
    </>
  ),
};

export default guide;
