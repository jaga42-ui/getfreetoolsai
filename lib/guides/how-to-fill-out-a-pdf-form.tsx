import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-fill-out-a-pdf-form",
  category: "pdf",
  title: "How to Fill Out a PDF Form Online for Free (No Upload)",
  description:
    "Fill in any PDF form — even a flat scan with no interactive fields — by typing onto the page, then sign and download. Nothing is uploaded.",
  keywords:
    "how to fill out a pdf form, fill pdf form online, fill in pdf free, type on pdf, complete pdf form, fill flat pdf, fill pdf without upload, fillable pdf",
  excerpt:
    "Type onto any PDF — including flat scans with no fields — then sign and download, free and private in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["fill pdf", "pdf forms", "pdf"],
  relatedTools: ["/pdf/fill", "/pdf/sign", "/pdf/merge"],
  relatedGuides: ["convert-pdf-to-word"],
  toc: [
    { id: "problem", label: "The flat-form problem" },
    { id: "steps", label: "Step-by-step" },
    { id: "sign", label: "Signing as well as filling" },
    { id: "tips", label: "Tips for clean forms" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        You&apos;re sent a PDF form, you click a box to type — and nothing happens.
        Most forms are &ldquo;flat&rdquo;: a scanned or printed page with no
        interactive fields, so the usual advice is to print, fill by hand and scan
        back. You don&apos;t have to. You can{" "}
        <Link href="/pdf/fill">fill out any PDF form for free</Link> by typing
        straight onto the page in your browser — no printer, no upload, no watermark.
      </p>

      <h2 id="problem">Why some PDFs won&apos;t let you type</h2>
      <p>
        A truly &ldquo;fillable&rdquo; PDF has form fields built in by whoever made
        it. Most everyday forms — government paperwork, school slips, scanned
        applications — are just flat images of a page, with no fields to click.
        Rather than fighting that, the fill tool lets you drop text boxes anywhere
        on the page, so it doesn&apos;t matter whether real fields exist.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/pdf/fill">Fill PDF tool</Link>.</li>
        <li>Drop in the form.</li>
        <li>Click anywhere on the page and type — add a text box per field.</li>
        <li>Add checkmarks or dates where needed and line everything up.</li>
        <li>Download the completed form.</li>
      </ol>
      <p>Everything happens locally, so a form full of personal details never leaves your device.</p>

      <h2 id="sign">Signing as well as filling</h2>
      <p>
        Many forms need a signature at the end. The fill tool lets you sign as you
        go, or you can finish filling and then add a signature with the dedicated{" "}
        <Link href="/pdf/sign">Sign PDF tool</Link> — draw, type or upload your
        signature and drop it on the line. Between them, filling and signing a form
        end-to-end never requires printing anything.
      </p>

      <h2 id="tips">Tips for clean, professional forms</h2>
      <ul>
        <li><strong>Match the text size</strong> to the printed labels so it looks native.</li>
        <li><strong>Align to the lines</strong> — nudge boxes so text sits on the field, not floating above it.</li>
        <li><strong>Zoom in</strong> for tight boxes to place text precisely.</li>
        <li>
          <strong>Need to rearrange pages?</strong> Combine or reorder with the{" "}
          <Link href="/pdf/merge">PDF merger</Link> before or after filling.
        </li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>Can I fill a form with no fillable fields?</strong> Yes — you add text boxes yourself, so flat scans work fine.</p>
      <p><strong>Can I sign it too?</strong> Yes — sign within the fill tool or with the <Link href="/pdf/sign">Sign PDF tool</Link>.</p>
      <p><strong>Is my form uploaded?</strong> No. Filling happens in your browser; the PDF never leaves your device.</p>
      <p><strong>Is it free?</strong> Yes — no signup, no watermark, unlimited use.</p>
    </>
  ),
};

export default guide;
