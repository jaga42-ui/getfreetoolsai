import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-add-page-numbers-to-a-pdf",
  category: "pdf",
  title: "How to Add Page Numbers to a PDF (Free, No Upload)",
  description:
    "Add page numbers to a PDF and choose their position, format and starting number — for reports, contracts and dissertations.",
  keywords:
    "how to add page numbers to a pdf, page numbers pdf, number pdf pages, add pagination to pdf, pdf page numbering, page numbers pdf free, number pages without upload",
  excerpt:
    "Number a PDF's pages — position, format and starting number — for reports and contracts, free and private in your browser.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 3,
  tags: ["page numbers", "pdf"],
  relatedTools: ["/pdf/number-pages", "/pdf/merge", "/pdf/watermark"],
  relatedGuides: ["merge-pdf-files-free"],
  toc: [
    { id: "why", label: "Why number your pages" },
    { id: "steps", label: "Step-by-step" },
    { id: "options", label: "Position, format & start number" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Page numbers turn a loose stack of pages into a document people can navigate
        and cite. Reports, contracts, dissertations and anything that gets printed or
        referenced needs them — &ldquo;see page 12&rdquo; only works if there&apos;s a
        page 12. You can{" "}
        <Link href="/pdf/number-pages">add page numbers to a PDF for free</Link> in
        your browser, with no upload or watermark.
      </p>

      <h2 id="why">Why number your pages</h2>
      <ul>
        <li><strong>Navigation</strong> — readers and reviewers can point to a specific page.</li>
        <li><strong>Professionalism</strong> — numbered pages look finished, especially in print.</li>
        <li><strong>Order after merging</strong> — combine several files, then number the result so the sequence is clear.</li>
        <li><strong>Privacy</strong> — a contract or report is numbered on your device, not uploaded.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/pdf/number-pages">Add Page Numbers tool</Link>.</li>
        <li>Drop in your PDF.</li>
        <li>Choose where the numbers go and the format.</li>
        <li>Download the numbered PDF.</li>
      </ol>
      <p>Everything runs locally, so even a confidential document never leaves your device.</p>

      <h2 id="options">Position, format and starting number</h2>
      <p>
        A few choices make numbering look right for the job:
      </p>
      <ul>
        <li><strong>Position</strong> — bottom-centre is the classic; bottom-right suits reports; top corners work for headers.</li>
        <li><strong>Format</strong> — plain <code>1, 2, 3</code>, or <code>Page 1 of 20</code> for a clear total.</li>
        <li><strong>Starting number</strong> — start later if the first pages are a cover or table of contents you don&apos;t want numbered.</li>
      </ul>
      <p>
        Numbering a document you assembled from parts? Do the{" "}
        <Link href="/pdf/merge">merge</Link> first, then number, so the sequence runs
        continuously. For a draft stamp or logo across pages, use the{" "}
        <Link href="/pdf/watermark">Add Watermark tool</Link> instead.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Can I start numbering from a later page?</strong> Yes — set the starting number and position so covers or contents pages stay unnumbered.</p>
      <p><strong>Can I show &ldquo;Page X of Y&rdquo;?</strong> Yes — choose a format that includes the total page count.</p>
      <p><strong>Is my PDF uploaded?</strong> No. Numbering runs in your browser; the file never leaves your device.</p>
      <p><strong>Is it free?</strong> Yes — unlimited use, no signup, no watermark.</p>
    </>
  ),
};

export default guide;
