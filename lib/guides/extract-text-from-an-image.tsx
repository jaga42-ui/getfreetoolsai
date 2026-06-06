import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "extract-text-from-an-image",
  category: "ocr",
  title: "How to Extract Text from an Image (OCR) for Free",
  description:
    "Copy text out of a screenshot, photo or scan using free in-browser OCR. Learn how to extract editable text from an image accurately — no signup, no upload.",
  keywords:
    "extract text from image, image to text, ocr image free, copy text from picture, photo to text, screenshot to text, ocr no upload",
  excerpt:
    "Turn a screenshot, photo or scan into editable text with free, private, in-browser OCR.",
  datePublished: "2026-06-06",
  dateModified: "2026-06-06",
  authorId: "team",
  readingTime: 6,
  tags: ["ocr", "image to text", "text extraction"],
  relatedTools: ["/image/image-to-text", "/pdf/ocr"],
  relatedGuides: ["what-is-ocr-and-how-does-it-work", "convert-pdf-to-word"],
  toc: [
    { id: "what", label: "What OCR does" },
    { id: "steps", label: "Step-by-step" },
    { id: "accuracy", label: "Getting accurate results" },
    { id: "uses", label: "Common uses" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        You cannot select text in an image — a screenshot, a photo of a page, a
        scanned receipt. OCR (optical character recognition) reads the pixels and
        turns them back into real, editable text. Here is how to extract text
        from an image for free, with the recognition running in your browser.
      </p>

      <h2 id="what">What OCR actually does</h2>
      <p>
        OCR detects characters in an image and outputs them as text you can copy,
        search and edit. Modern OCR handles printed text in many languages well;
        results depend heavily on the quality of the source image. For a deeper
        explanation, see our guide on{" "}
        <Link href="/guides/ocr/what-is-ocr-and-how-does-it-work">
          what OCR is and how it works
        </Link>
        .
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/image-to-text">image to text tool</Link>.</li>
        <li>Drop in a JPG or PNG — or paste a screenshot with Ctrl/Cmd+V.</li>
        <li>The tool recognises the text on your device.</li>
        <li>Copy the extracted text, or download it.</li>
      </ol>
      <p>The image and the recognition stay in your browser; nothing is uploaded.</p>

      <h2 id="accuracy">Getting accurate results</h2>
      <ul>
        <li><strong>Use a sharp, straight image.</strong> Blur and skew are the biggest accuracy killers.</li>
        <li><strong>Good contrast.</strong> Dark text on a light background reads best.</li>
        <li><strong>Crop to the text.</strong> Remove busy backgrounds so the engine focuses on the words.</li>
        <li><strong>Higher resolution helps</strong> — small or low-res text is harder to read.</li>
      </ul>

      <h2 id="uses">Common uses</h2>
      <ul>
        <li>Copying a quote or address out of a photo or screenshot.</li>
        <li>Digitising a printed receipt, note or business card.</li>
        <li>Pulling text from a scanned page to edit in a document.</li>
      </ul>
      <p>
        Working with a scanned PDF instead of an image? Use{" "}
        <Link href="/pdf/ocr">PDF OCR</Link>, or convert it with{" "}
        <Link href="/pdf/pdf-to-word">PDF to Word</Link>.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is OCR free here?</strong> Yes, with no signup and no limits.</p>
      <p><strong>How accurate is it?</strong> Very accurate on clear printed text; handwriting and low-quality photos are harder.</p>
      <p><strong>Can I paste a screenshot?</strong> Yes — copy it and paste with Ctrl/Cmd+V straight into the tool.</p>
      <p><strong>Is my image uploaded?</strong> No. OCR runs entirely in your browser, so your image never leaves your device.</p>
    </>
  ),
};

export default guide;
