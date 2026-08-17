import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-password-protect-a-pdf",
  category: "pdf",
  title: "How to Password Protect a PDF for Free (No Upload)",
  description:
    "Add a password to a PDF free so only people with it can open the file. Encrypted entirely in your browser and never uploaded.",
  keywords:
    "how to password protect a pdf, password protect pdf, encrypt pdf, add password to pdf, secure pdf free, lock pdf with password, protect pdf without upload",
  excerpt:
    "Encrypt a PDF with a password so only the right people can open it — free and private, entirely in your browser.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 5,
  tags: ["protect pdf", "encrypt pdf", "pdf"],
  relatedTools: ["/pdf/protect", "/pdf/unlock", "/pdf/sign"],
  relatedGuides: ["unlock-a-pdf-without-the-password", "how-to-sign-a-pdf-online-free"],
  toc: [
    { id: "why", label: "Why password protect a PDF" },
    { id: "steps", label: "Step-by-step" },
    { id: "password", label: "Choosing a strong password" },
    { id: "private", label: "Why in-browser is safer" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Bank statements, payslips, contracts, medical letters and scanned IDs all
        end up as PDFs — and all of them are things you don&apos;t want opened by
        the wrong person if an email is forwarded or a laptop is lost. Adding a
        password encrypts the file so it can only be opened by someone who knows
        it. You can{" "}
        <Link href="/pdf/protect">password protect a PDF for free</Link> without
        uploading the document anywhere — the encryption happens in your browser.
      </p>

      <h2 id="why">Why password protect a PDF</h2>
      <ul>
        <li>
          <strong>Control who can open it</strong> — a forwarded email or shared
          drive no longer exposes the contents to everyone with the link.
        </li>
        <li>
          <strong>Protect sensitive documents</strong> — statements, tax forms,
          contracts and IDs stay unreadable without the password.
        </li>
        <li>
          <strong>Meet requirements</strong> — many organisations require
          financial or HR documents to be encrypted before they&apos;re emailed.
        </li>
      </ul>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>
          Open the <Link href="/pdf/protect">Protect PDF tool</Link>.
        </li>
        <li>Drop in the PDF you want to secure.</li>
        <li>Type the password you want people to need in order to open it.</li>
        <li>
          Click <strong>Protect PDF</strong> — the file is encrypted right there
          in your browser.
        </li>
        <li>Download the protected copy and share it safely.</li>
      </ol>
      <p>
        Anyone who opens the file afterwards — in any PDF reader — will be asked
        for the password before a single page is shown.
      </p>

      <h2 id="password">Choosing a strong password</h2>
      <ul>
        <li>
          Use at least 12 characters mixing upper and lower case, numbers and a
          symbol.
        </li>
        <li>
          Avoid names, birthdays or the document&apos;s own subject — those are
          the first things guessed.
        </li>
        <li>
          <strong>Send the password separately</strong> from the file — a
          different channel (a text or a call), never in the same email.
        </li>
        <li>Store it in a password manager so you don&apos;t lock yourself out.</li>
      </ul>

      <h2 id="private">Why encrypting in the browser is safer</h2>
      <p>
        With most online tools, &ldquo;protecting&rdquo; a PDF means uploading an
        unprotected copy to a stranger&apos;s server first — the exact document
        you&apos;re trying to keep private travels over the internet and sits in
        their storage. Here the encryption runs locally, so the unprotected file
        never leaves your device. The only copy that goes anywhere is the one
        already locked with your password.
      </p>

      <h2 id="faq">FAQ</h2>
      <p>
        <strong>Is it free?</strong> Yes — no signup, no watermark, and no limit
        on how many PDFs you protect.
      </p>
      <p>
        <strong>Is my file uploaded?</strong> No. The PDF is encrypted in your
        browser and never sent to a server.
      </p>
      <p>
        <strong>Can I remove the password later?</strong> Yes — if you know the
        password you can remove it again with the{" "}
        <Link href="/pdf/unlock">Unlock PDF tool</Link>.
      </p>
      <p>
        <strong>What if I forget the password?</strong> There is no back door — a
        forgotten password can&apos;t be recovered, so store it somewhere safe.
      </p>
    </>
  ),
};

export default guide;
