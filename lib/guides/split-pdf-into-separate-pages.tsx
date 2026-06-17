import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "split-pdf-into-separate-pages",
  category: "pdf",
  title: "How to Split a PDF into Separate Pages (Free, No Upload)",
  description:
    "Split a PDF into separate pages or extract just the pages you need — free, with no signup or watermark. Everything runs in your browser, so your file is never uploaded.",
  keywords:
    "split pdf, split pdf into pages, extract pages from pdf, separate pdf pages, split pdf free, split pdf without upload, pdf splitter, extract one page from pdf",
  excerpt:
    "Extract specific pages, split every N pages, or break a PDF into one file per page — free and privately in your browser.",
  datePublished: "2026-06-18",
  dateModified: "2026-06-18",
  authorId: "team",
  readingTime: 5,
  tags: ["split pdf", "extract pages", "pdf"],
  relatedTools: ["/pdf/split", "/pdf/merge", "/pdf/compress"],
  relatedGuides: ["merge-pdf-files-free", "compress-pdf-to-a-specific-size"],
  toc: [
    { id: "when", label: "When to split a PDF" },
    { id: "steps", label: "Step-by-step" },
    { id: "modes", label: "Three ways to split" },
    { id: "after", label: "After splitting" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Splitting a PDF is the everyday companion to merging one: pulling a single
        signed page out of a contract, breaking a scanned booklet into chapters, or
        separating an invoice from the email it arrived bundled with. Here is how to
        split a PDF — or extract just the pages you need — for free, without
        uploading the file to anyone&apos;s server.
      </p>

      <h2 id="when">When you need to split a PDF</h2>
      <ul>
        <li>Extracting one signed or stamped page from a longer agreement.</li>
        <li>Separating a single invoice or statement from a combined scan.</li>
        <li>Breaking a large report into per-chapter files to share individually.</li>
        <li>Turning a multi-page scan into one file per page for filing.</li>
        <li>Removing confidential pages before sending a document on.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/pdf/split">PDF splitter</Link>.</li>
        <li>Drop in the PDF you want to split.</li>
        <li>Choose how you want to split it (the three modes are explained below).</li>
        <li>Click <strong>Split PDF</strong>.</li>
        <li>Download the resulting file — or files, bundled together.</li>
      </ol>
      <p>
        The whole thing runs locally in your browser, so even sensitive PDFs like
        contracts, payslips and bank statements never leave your device.
      </p>

      <h2 id="modes">Three ways to split</h2>
      <p>
        Different jobs call for different splits, so the tool gives you three modes:
      </p>
      <ul>
        <li>
          <strong>Extract pages</strong> — type exactly the pages you want, for
          example <code>1,3,5-8,12</code>. You get a single PDF containing just
          those pages, in that order. This is the one to reach for when you need
          &ldquo;page 4&rdquo; or &ldquo;pages 10 to 15&rdquo; and nothing else.
        </li>
        <li>
          <strong>Every N pages</strong> — break the document into evenly sized
          chunks, such as one file for every 2 pages. Handy for splitting a
          double-sided scan or a booklet into consistent sections.
        </li>
        <li>
          <strong>Each page separately</strong> — produce one PDF per page. Best
          when you need every page as its own file, for instance to upload pages
          individually to a portal.
        </li>
      </ul>

      <h2 id="after">After splitting</h2>
      <p>
        Need the opposite next time? The{" "}
        <Link href="/pdf/merge">PDF merger</Link> recombines pages in any order, so
        you can extract a few pages, drop one, and stitch the rest back together. If
        a split-out file is still too large for an upload limit, run it through the{" "}
        <Link href="/pdf/compress">PDF compressor</Link> to shrink it — or compress
        it to an exact size in KB if a form demands one.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is splitting a PDF free?</strong> Yes — unlimited splits, no signup, and no watermark on the output.</p>
      <p><strong>How do I extract a single page?</strong> Choose &ldquo;Extract pages&rdquo; and type just that page number, e.g. <code>4</code>.</p>
      <p><strong>Will the page order be kept?</strong> Yes. Extracted pages keep the order you list them in, and chunked splits follow the original document order.</p>
      <p><strong>Are my files uploaded?</strong> No. Splitting happens entirely in your browser; your PDF never leaves your device.</p>
    </>
  ),
};

export default guide;
