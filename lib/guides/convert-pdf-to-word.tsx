import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "convert-pdf-to-word",
  category: "pdf",
  title: "How to Convert a PDF to Word (Editable, Free)",
  description:
    "Convert a PDF into an editable Word document for free — how text-layer extraction works, when you need OCR, and how to keep formatting. Runs in your browser, nothing uploaded.",
  keywords:
    "convert pdf to word, pdf to word free, pdf to docx, editable word from pdf, pdf to word without losing formatting, scanned pdf to word",
  excerpt:
    "Text-layer extraction vs OCR, when to use each, and how to get an editable Word file with minimal cleanup.",
  datePublished: "2026-06-04",
  dateModified: "2026-06-04",
  authorId: "team",
  readingTime: 6,
  tags: ["pdf to word", "docx", "document conversion"],
  relatedTools: ["/pdf/pdf-to-word", "/pdf/ocr", "/pdf/compress"],
  relatedGuides: ["what-is-ocr-and-how-does-it-work"],
  toc: [
    { id: "two-types", label: "Two kinds of PDF" },
    { id: "digital", label: "Converting a digital PDF" },
    { id: "scanned", label: "Converting a scanned PDF (OCR)" },
    { id: "formatting", label: "Keeping formatting" },
    { id: "steps", label: "Step-by-step" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        “PDF to Word” sounds like one task, but there are really two — and picking the right one is
        the difference between clean, editable text and a frustrating mess. The deciding factor is
        whether your PDF is <strong>digital</strong> or <strong>scanned</strong>.
      </p>

      <h2 id="two-types">The two kinds of PDF</h2>
      <ul>
        <li><strong>Digital PDF:</strong> created from a document (exported from Word, a report tool or a website). It contains a real <em>text layer</em> — you can already select and copy the text inside it.</li>
        <li><strong>Scanned PDF:</strong> a photo or scan of pages. To a computer it&apos;s just images of text — there is no text layer to extract, only pixels.</li>
      </ul>
      <p>Quick test: open the PDF and try to select a sentence. If you can highlight the text, it&apos;s digital. If your cursor selects a whole image, it&apos;s scanned.</p>

      <h2 id="digital">Converting a digital PDF</h2>
      <p>
        For digital PDFs, conversion reads the existing text layer and rebuilds it as an editable{" "}
        <strong>.docx</strong>. Because it works from real characters, the words come through
        accurately — no recognition errors. Use the{" "}
        <Link href="/pdf/pdf-to-word">PDF to Word converter</Link>: upload, review the extracted
        text, and download.
      </p>

      <h2 id="scanned">Converting a scanned PDF (you need OCR)</h2>
      <p>
        A scanned PDF has no text to extract, so a plain converter will report “no text found”. You
        first need <strong>OCR</strong> (Optical Character Recognition) to <em>recognise</em> the
        text from the image. Our <Link href="/pdf/ocr">PDF OCR studio</Link> does this in your
        browser and goes a step further — it rebuilds headings, paragraphs, lists and tables, then
        exports an editable Word document directly. If you want to learn how OCR works, see{" "}
        <Link href="/guides/ocr/what-is-ocr-and-how-does-it-work">What is OCR</Link>.
      </p>

      <h2 id="formatting">Keeping the formatting</h2>
      <p>
        No converter produces a pixel-perfect clone of a complex magazine layout — and you usually
        don&apos;t want one, because the goal is <em>editable</em> text. What carries over well:
      </p>
      <ul>
        <li>Readable text content, paragraph by paragraph.</li>
        <li>Basic structure — headings, lists and (with our reconstruction engine) tables.</li>
      </ul>
      <p>
        What typically doesn&apos;t survive intact: exact fonts, multi-column magazine layouts and
        precisely positioned images. Expect light cleanup on heavily designed documents.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Check whether your PDF is digital or scanned (try selecting text).</li>
        <li>Digital → use <Link href="/pdf/pdf-to-word">PDF to Word</Link>.</li>
        <li>Scanned → use <Link href="/pdf/ocr">PDF OCR</Link> and export to Word.</li>
        <li>Open the .docx, do any light cleanup, and you&apos;re done.</li>
      </ol>
      <p>If the PDF is large, <Link href="/pdf/compress">compress it</Link> first to speed things up.</p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is it free?</strong> Yes, with no signup or watermark.</p>
      <p><strong>Is my document uploaded?</strong> No — extraction and OCR both run entirely in your browser.</p>
      <p><strong>Why did it say “no text found”?</strong> Your PDF is a scan. Run it through OCR first.</p>
      <p><strong>Can I edit before downloading?</strong> Yes — the extracted text appears in an editable box so you can fix it, then export.</p>
    </>
  ),
};

export default guide;
