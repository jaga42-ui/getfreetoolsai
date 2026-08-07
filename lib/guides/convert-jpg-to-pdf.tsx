import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "convert-jpg-to-pdf",
  category: "pdf",
  title: "How to Convert JPG to PDF for Free (No Upload, No Watermark)",
  description:
    "Turn one or many JPG photos into a single PDF — reorder pages, keep full quality, and add no watermark.",
  keywords:
    "how to convert jpg to pdf, jpg to pdf, images to pdf, combine photos into pdf, jpg to pdf free, convert photo to pdf without upload, picture to pdf",
  excerpt:
    "Combine photos into one clean PDF — reorder pages, keep quality, no watermark — free and private in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["jpg to pdf", "images to pdf", "pdf"],
  relatedTools: ["/pdf/jpg-to-pdf", "/pdf/png-to-pdf", "/pdf/compress"],
  relatedGuides: ["merge-pdf-files-free", "compress-pdf-to-a-specific-size"],
  toc: [
    { id: "why", label: "Why convert JPG to PDF" },
    { id: "steps", label: "Step-by-step" },
    { id: "multiple", label: "Combining many photos" },
    { id: "quality", label: "Keeping quality and size in check" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        A PDF is the format everyone can open and print the same way, which is
        why forms, portals and offices ask for one even when all you have is a
        photo. Scanned receipts, snapshots of documents, ID photos and homework
        are all easier to send as a single PDF than as a pile of loose images.
        You can <Link href="/pdf/jpg-to-pdf">convert JPG to PDF for free</Link>{" "}
        right in your browser — no upload, no signup, no watermark.
      </p>

      <h2 id="why">Why convert JPG to PDF</h2>
      <ul>
        <li>
          <strong>One file, in order</strong> — combine several photos into a
          single document with the pages in the sequence you want.
        </li>
        <li>
          <strong>Universally accepted</strong> — portals and forms that reject
          image uploads almost always accept a PDF.
        </li>
        <li>
          <strong>Prints predictably</strong> — a PDF keeps its layout and page
          size instead of stretching to fill a photo print.
        </li>
        <li>
          <strong>Privacy</strong> — photos of IDs, receipts or documents stay on
          your device instead of being uploaded to a converter.
        </li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>
          Open the <Link href="/pdf/jpg-to-pdf">JPG to PDF tool</Link>.
        </li>
        <li>Drop in one photo or several at once.</li>
        <li>Drag the thumbnails to put the pages in the right order.</li>
        <li>
          Click <strong>Convert to PDF</strong> and download the finished file.
        </li>
      </ol>
      <p>
        The conversion runs locally, so even photos of sensitive documents never
        leave your device.
      </p>

      <h2 id="multiple">Combining many photos into one PDF</h2>
      <p>
        Add all the images together and reorder them before converting — perfect
        for turning a multi-page paper document you photographed into one tidy
        PDF. Have PNG screenshots instead? Use the{" "}
        <Link href="/pdf/png-to-pdf">PNG to PDF tool</Link>, which works exactly
        the same way. Already have several PDFs to join? The{" "}
        <Link href="/pdf/merge">PDF merger</Link> stitches them together.
      </p>

      <h2 id="quality">Keeping quality and file size in check</h2>
      <p>
        The tool preserves your photos at full quality, so text in a scanned
        document stays sharp and readable. If the resulting PDF is larger than an
        upload limit allows, run it through the{" "}
        <Link href="/pdf/compress">PDF compressor</Link> — you can even compress
        it to an exact size in KB when a form demands one.
      </p>

      <h2 id="faq">FAQ</h2>
      <p>
        <strong>Is it free?</strong> Yes — unlimited conversions, no signup, and
        no watermark.
      </p>
      <p>
        <strong>Are my photos uploaded?</strong> No. The conversion happens in
        your browser; your images never leave your device.
      </p>
      <p>
        <strong>Can I put several photos in one PDF?</strong> Yes — add them all
        and drag to set the page order before converting.
      </p>
      <p>
        <strong>What about PNG or HEIC images?</strong> Use the{" "}
        <Link href="/pdf/png-to-pdf">PNG to PDF tool</Link> for PNGs; for iPhone
        HEIC photos, convert them with the{" "}
        <Link href="/image/heic-to-jpg">HEIC to JPG tool</Link> first.
      </p>
    </>
  ),
};

export default guide;
