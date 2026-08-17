import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "what-is-ocr-and-how-does-it-work",
  category: "ocr",
  title: "What is OCR and How Does It Work?",
  description:
    "What OCR is and how it turns scans and photos into editable, searchable text — why accuracy varies, and how to get the best results.",
  keywords:
    "what is ocr, how does ocr work, optical character recognition, ocr meaning, extract text from image, ocr accuracy, searchable pdf",
  excerpt:
    "How OCR turns pixels into editable text, why accuracy varies, and how to get the best results.",
  datePublished: "2026-06-04",
  dateModified: "2026-06-04",
  authorId: "team",
  readingTime: 7,
  tags: ["ocr", "document intelligence", "searchable pdf"],
  relatedTools: ["/pdf/ocr", "/image/image-to-text", "/pdf/pdf-to-word"],
  relatedGuides: ["convert-pdf-to-word"],
  toc: [
    { id: "definition", label: "What OCR means" },
    { id: "how", label: "How OCR works, step by step" },
    { id: "reconstruction", label: "Beyond text: document reconstruction" },
    { id: "accuracy", label: "Why accuracy varies" },
    { id: "uses", label: "What OCR is used for" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        <strong>OCR — Optical Character Recognition</strong> — is the technology that turns a picture
        of text into real, editable, searchable text. To a computer, a scanned page or a photo of a
        document is just a grid of coloured pixels. OCR looks at those pixels and works out which
        letters and words they represent, so the result is text you can select, copy, search and edit.
      </p>

      <h2 id="definition">What OCR means</h2>
      <p>
        If you can&apos;t select the text in a PDF or image, there is no text there — only an image of
        text. OCR creates the missing text layer. It&apos;s what lets you copy a paragraph from a
        scanned book, search inside a scanned contract, or turn a photographed receipt into a
        spreadsheet.
      </p>

      <h2 id="how">How OCR works, step by step</h2>
      <ol>
        <li><strong>Pre-processing:</strong> the image is cleaned up — straightened, contrast-adjusted and converted to make characters stand out.</li>
        <li><strong>Layout analysis:</strong> the page is split into regions — blocks, columns, lines and individual words — using the geometry of the ink.</li>
        <li><strong>Character recognition:</strong> a trained model matches the shapes of letters to characters, using a language model to choose between look-alikes (like “0” vs “O”).</li>
        <li><strong>Output:</strong> the recognised characters are assembled back into words and lines, each with a confidence score.</li>
      </ol>

      <h2 id="reconstruction">Beyond text: document reconstruction</h2>
      <p>
        Basic OCR stops at a flat wall of text. A better approach uses the <em>positions</em> of the
        words to rebuild the document&apos;s structure. Our{" "}
        <Link href="/pdf/ocr">OCR studio</Link> reads the geometry the engine produces and
        reconstructs <strong>headings</strong>, <strong>paragraphs</strong> (repairing words split
        across line breaks), <strong>lists</strong> and aligned <strong>tables</strong> — then lets
        you export to Word, HTML, Markdown or a searchable PDF. That&apos;s the difference between
        “extracted text” and a document you can actually use.
      </p>

      <h2 id="accuracy">Why accuracy varies</h2>
      <p>OCR is probabilistic, so quality of input drives quality of output:</p>
      <ul>
        <li><strong>Resolution:</strong> aim for at least 300 DPI; low-resolution scans blur characters.</li>
        <li><strong>Contrast &amp; lighting:</strong> dark text on a light background recognises best.</li>
        <li><strong>Skew:</strong> crooked pages confuse line detection — straighten first.</li>
        <li><strong>Language:</strong> pick the correct language so the right character model is used (English, Hindi, Bengali, Odia, Tamil, Telugu, Marathi, Gujarati, Punjabi and more are supported).</li>
        <li><strong>Handwriting &amp; stylised fonts</strong> are far harder than clean printed text.</li>
      </ul>
      <p>Confidence scores help here: our tools highlight low-confidence words so you can fix only the uncertain ones.</p>

      <h2 id="uses">What OCR is used for</h2>
      <ul>
        <li>Making a scanned PDF <strong>searchable</strong> without changing how it looks.</li>
        <li>Turning a scan into an editable <Link href="/pdf/pdf-to-word">Word document</Link>.</li>
        <li>Copying text from a <Link href="/image/image-to-text">photo or screenshot</Link>.</li>
        <li>Digitising receipts, forms, notes and old documents.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is OCR free here?</strong> Yes, and it runs entirely in your browser — your document is never uploaded.</p>
      <p><strong>Does it work on photos, not just scans?</strong> Yes — use <Link href="/image/image-to-text">Image to Text</Link> for photos and screenshots.</p>
      <p><strong>Why are some words wrong?</strong> Low resolution, skew or poor contrast reduce accuracy. A sharper image and the correct language usually fix it; you can also edit the result directly.</p>
      <p><strong>Can OCR read handwriting?</strong> Printed text is reliable; handwriting is much harder and results vary.</p>
    </>
  ),
};

export default guide;
