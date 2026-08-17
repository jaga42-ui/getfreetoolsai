import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-convert-pdf-to-jpg",
  category: "pdf",
  title: "How to Convert PDF to JPG for Free (No Upload, No Watermark)",
  description:
    "Turn every page of a PDF into a JPG — pick the pages you need and keep full quality. Runs in your browser, so your PDF is never uploaded.",
  keywords:
    "how to convert pdf to jpg, pdf to jpg, pdf to image, convert pdf pages to images, pdf to jpg free, pdf to jpg without upload, save pdf page as image",
  excerpt:
    "Export PDF pages as JPG images — every page or just the ones you need — free and private in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["pdf to jpg", "pdf to image", "pdf"],
  relatedTools: ["/pdf/pdf-to-jpg", "/pdf/jpg-to-pdf", "/image/compress"],
  relatedGuides: ["split-pdf-into-separate-pages", "compress-pdf-to-a-specific-size"],
  toc: [
    { id: "why", label: "Why convert PDF to JPG" },
    { id: "steps", label: "Step-by-step" },
    { id: "pages", label: "Choosing pages and quality" },
    { id: "after", label: "After converting" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Sometimes you don&apos;t want a PDF — you want a picture. Posting a page to
        social media, dropping a diagram into a slide, previewing a document as a
        thumbnail, or uploading to a form that only takes images all call for a
        JPG. You can{" "}
        <Link href="/pdf/pdf-to-jpg">convert a PDF to JPG for free</Link> in your
        browser, with no upload, no signup and no watermark.
      </p>

      <h2 id="why">Why convert PDF to JPG</h2>
      <ul>
        <li>
          <strong>Share a single page as an image</strong> — no PDF reader needed
          to view it.
        </li>
        <li>
          <strong>Drop pages into slides or docs</strong> — a JPG places like any
          other picture.
        </li>
        <li>
          <strong>Meet image-only upload rules</strong> — portals that reject PDFs
          usually accept JPGs.
        </li>
        <li>
          <strong>Privacy</strong> — contracts, statements and forms are converted
          on your device, never uploaded.
        </li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>
          Open the <Link href="/pdf/pdf-to-jpg">PDF to JPG tool</Link>.
        </li>
        <li>Drop in your PDF.</li>
        <li>Let it render each page to an image in your browser.</li>
        <li>Download the page you need — or all of them, bundled together.</li>
      </ol>
      <p>
        Every page is rasterised locally, so even a confidential document never
        leaves your device.
      </p>

      <h2 id="pages">Choosing pages and keeping quality</h2>
      <p>
        A multi-page PDF becomes one JPG per page, so you can grab just page 3 or
        export the lot. JPG is ideal for pages with photos or colour; for a page
        that&apos;s mostly sharp text or line art you may prefer a crisper result,
        in which case keep it as a PDF or export at the highest quality on offer.
        If the images come out larger than you need, shrink them with the{" "}
        <Link href="/image/compress">Compress Image tool</Link>.
      </p>

      <h2 id="after">After converting</h2>
      <p>
        Need to go back the other way and turn images into a PDF again? The{" "}
        <Link href="/pdf/jpg-to-pdf">JPG to PDF tool</Link> rebuilds a document
        from your images. Only need certain pages as images? Use the{" "}
        <Link href="/pdf/split">PDF splitter</Link> first to pull those pages,
        then convert.
      </p>

      <h2 id="faq">FAQ</h2>
      <p>
        <strong>Is it free?</strong> Yes — unlimited conversions, no signup, no
        watermark.
      </p>
      <p>
        <strong>Is my PDF uploaded?</strong> No. Pages are converted in your
        browser; the file never leaves your device.
      </p>
      <p>
        <strong>Can I convert just one page?</strong> Yes — each page becomes its
        own JPG, so download only the ones you want.
      </p>
      <p>
        <strong>Will text stay sharp?</strong> JPG suits colour and photos; for
        pages of fine text, export at the highest quality or keep the PDF.
      </p>
    </>
  ),
};

export default guide;
