import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-add-a-watermark-to-a-pdf",
  category: "pdf",
  title: "How to Add a Watermark to a PDF (Free, No Upload)",
  description:
    "Stamp a PDF with a text watermark — DRAFT, CONFIDENTIAL, a company name or ©️ — across every page, with control over opacity and angle. Runs in your browser; the file is never uploaded.",
  keywords:
    "how to add a watermark to a pdf, watermark pdf, add draft watermark pdf, confidential stamp pdf, pdf watermark free, watermark pdf without upload, text watermark pdf",
  excerpt:
    "Stamp DRAFT, CONFIDENTIAL or your brand across every PDF page — with opacity and angle control — free and private in your browser.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 3,
  tags: ["watermark", "pdf"],
  relatedTools: ["/pdf/watermark", "/pdf/number-pages", "/pdf/protect"],
  relatedGuides: ["how-to-add-page-numbers-to-a-pdf", "merge-pdf-files-free"],
  toc: [
    { id: "why", label: "Why watermark a PDF" },
    { id: "steps", label: "Step-by-step" },
    { id: "settings", label: "Opacity, angle & placement" },
    { id: "protect", label: "Watermark vs real protection" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        A watermark stamps a message across every page of a PDF — <strong>DRAFT</strong>,{" "}
        <strong>CONFIDENTIAL</strong>, a company name, or a copyright notice — so its
        status or ownership is obvious at a glance and travels with the file. You can{" "}
        <Link href="/pdf/watermark">add a watermark to a PDF for free</Link> in your
        browser, with no upload and no watermark from us on top.
      </p>

      <h2 id="why">Why watermark a PDF</h2>
      <ul>
        <li><strong>Mark status</strong> — DRAFT or SAMPLE stops a work-in-progress being mistaken for final.</li>
        <li><strong>Flag sensitivity</strong> — CONFIDENTIAL or INTERNAL sets expectations for handling.</li>
        <li><strong>Claim ownership</strong> — a company name or © notice brands every page.</li>
        <li><strong>Privacy</strong> — the document is stamped on your device, never uploaded.</li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/pdf/watermark">Add Watermark tool</Link>.</li>
        <li>Drop in your PDF.</li>
        <li>Type the watermark text.</li>
        <li>Set the opacity, angle and size, then download.</li>
      </ol>

      <h2 id="settings">Getting opacity, angle and placement right</h2>
      <p>
        A watermark should be visible without making the text underneath unreadable.
        A light grey mark at around 20–40% opacity, set diagonally across the page,
        is the classic look — legible but not obstructive. A bold, near-opaque stamp
        suits SAMPLE pages you specifically <em>don&apos;t</em> want reused as-is.
        Pair it with <Link href="/pdf/number-pages">page numbers</Link> for a polished,
        clearly-marked document.
      </p>

      <h2 id="protect">A watermark isn&apos;t real protection</h2>
      <p>
        A watermark deters casual reuse and signals intent, but it doesn&apos;t stop
        anyone opening, copying or printing the file. If you need to actually restrict
        access, add a password with the{" "}
        <Link href="/pdf/protect">Protect PDF tool</Link> so only people with the
        password can open it — use both together for documents that are both sensitive
        and clearly marked.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Does the watermark go on every page?</strong> Yes — it&apos;s applied across all pages of the PDF.</p>
      <p><strong>Will the text underneath stay readable?</strong> Yes, if you keep the opacity low — that&apos;s what the opacity control is for.</p>
      <p><strong>Is my PDF uploaded?</strong> No. Watermarking runs in your browser; the file never leaves your device.</p>
      <p><strong>Is it free?</strong> Yes — unlimited use, no signup, and no watermark added by the tool itself.</p>
    </>
  ),
};

export default guide;
