import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-convert-png-to-pdf",
  category: "pdf",
  title: "How to Convert PNG to PDF for Free (No Upload, No Watermark)",
  description:
    "Turn one or many PNG images — screenshots, scans, receipts — into a single PDF, in the order you choose. Everything runs in your browser, so your images are never uploaded.",
  keywords:
    "how to convert png to pdf, png to pdf, screenshots to pdf, combine png into pdf, png to pdf free, convert png to pdf without upload, images to pdf",
  excerpt:
    "Combine PNG screenshots or scans into one tidy PDF — reorder pages, no watermark — free and private in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["png to pdf", "images to pdf", "pdf"],
  relatedTools: ["/pdf/png-to-pdf", "/pdf/jpg-to-pdf", "/pdf/merge"],
  relatedGuides: ["merge-pdf-files-free", "compress-pdf-to-a-specific-size"],
  toc: [
    { id: "why", label: "Why convert PNG to PDF" },
    { id: "steps", label: "Step-by-step" },
    { id: "multiple", label: "Combining many PNGs" },
    { id: "after", label: "After converting" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        PNG is the default for screenshots and anything with crisp edges or
        transparency — but a folder of loose PNGs is awkward to send, and plenty of
        portals want a single PDF. Bundling them into one PDF keeps the pages in
        order and makes the whole thing one clean download. You can{" "}
        <Link href="/pdf/png-to-pdf">convert PNG to PDF for free</Link> in your
        browser, with no upload, signup or watermark.
      </p>

      <h2 id="why">Why convert PNG to PDF</h2>
      <ul>
        <li><strong>One file, in order</strong> — combine multiple screenshots or scans into a single document.</li>
        <li><strong>Universally accepted</strong> — forms and portals that reject images almost always take PDF.</li>
        <li><strong>Prints predictably</strong> — a PDF keeps page size and layout instead of stretching to a photo print.</li>
        <li><strong>Privacy</strong> — screenshots of chats, receipts or documents stay on your device.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/pdf/png-to-pdf">PNG to PDF tool</Link>.</li>
        <li>Drop in one PNG or several at once.</li>
        <li>Drag the thumbnails to set the page order.</li>
        <li>Click <strong>Convert to PDF</strong> and download.</li>
      </ol>
      <p>The conversion runs locally, so even sensitive screenshots never leave your device.</p>

      <h2 id="multiple">Combining many PNGs into one PDF</h2>
      <p>
        Add all your images together and reorder them before converting — ideal for
        turning a sequence of screenshots into a step-by-step document, or a set of
        scanned pages into one file. Have photos instead of screenshots? The{" "}
        <Link href="/pdf/jpg-to-pdf">JPG to PDF tool</Link> works the same way.
        Already have several PDFs to join? Use the{" "}
        <Link href="/pdf/merge">PDF merger</Link>.
      </p>

      <h2 id="after">After converting</h2>
      <p>
        PNG screenshots can be large, so a PNG-heavy PDF can balloon in size. If it
        exceeds an upload limit, run it through the{" "}
        <Link href="/pdf/compress">PDF compressor</Link> — you can even target an
        exact size in KB when a form demands one.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is it free?</strong> Yes — unlimited conversions, no signup, no watermark.</p>
      <p><strong>Are my images uploaded?</strong> No. The conversion happens in your browser; your PNGs never leave your device.</p>
      <p><strong>Can I put several PNGs in one PDF?</strong> Yes — add them all and drag to set the page order before converting.</p>
      <p><strong>What about transparency?</strong> Transparent areas are placed on a white page background in the PDF.</p>
    </>
  ),
};

export default guide;
