import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { pdfTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Free PDF Tools Online — Compress, Merge, Convert & Edit PDF",
  description:
    "All-in-one free PDF tools that run 100% in your browser — compress, merge, split, convert, unlock, rotate and OCR PDFs. No signup, no watermark, no upload. Your files never leave your device.",
  keywords:
    "free pdf tools, online pdf tools free, pdf converter free, compress pdf, merge pdf, split pdf, pdf to word, pdf editor free no signup, smallpdf alternative, ilovepdf alternative",
  path: "/pdf-tools",
});

const faqs = [
  {
    q: "Are these PDF tools really free?",
    a: "Yes. Every PDF tool on GetFreeToolsAI is completely free with no daily limits, no signup, and no watermark added to your files.",
  },
  {
    q: "Do my PDF files get uploaded to a server?",
    a: "No. All of our PDF tools process your files entirely inside your browser using WebAssembly. Your documents never leave your device, which makes them safe for confidential and financial files.",
  },
  {
    q: "Is there a file size limit?",
    a: "There is no server-side cap because nothing is uploaded. The only practical limit is your own device's available memory, so very large files depend on your computer or phone.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The tools run in any modern browser — Chrome, Firefox, Safari or Edge — with nothing to download or install.",
  },
  {
    q: "Which PDF tool should I use?",
    a: "Use Compress to shrink a PDF for email, Merge to combine files, Split to extract pages, PDF to Word to edit text, and OCR to pull text out of scanned documents. Browse the full list above.",
  },
];

export default function PdfToolsHub() {
  const ready = pdfTools.filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PDF Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free PDF Tools",
          ready.map((t) => ({ name: t.name, href: t.href }))
        )}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">PDF Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free PDF Tools Online
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        A complete set of free PDF tools for everything you need to do with a
        document — compress a PDF for email, merge several files into one, split
        out the pages you want, convert to and from Word and images, unlock a
        password-protected file, rotate pages, add page numbers or watermarks,
        and pull text out of scans with OCR. Unlike{" "}
        <Link href="/compare/smallpdf-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          Smallpdf
        </Link>{" "}
        and{" "}
        <Link href="/compare/ilovepdf-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          iLovePDF
        </Link>
        , there are no daily limits and no watermark on your output. Everything
        runs privately in your browser using WebAssembly, so your documents are
        never uploaded to any server and stay completely on your device.
      </p>

      <TrustBadges className="mt-6" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ready.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <p className="mt-8 text-[15px] text-text-muted">
        New to this?{" "}
        <Link href="/guides/pdf" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          Read our PDF guides
        </Link>{" "}
        or see how we compare to{" "}
        <Link href="/compare/smallpdf-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          Smallpdf
        </Link>{" "}
        and{" "}
        <Link href="/compare/ilovepdf-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          iLovePDF
        </Link>
        .
      </p>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />
    </div>
  );
}
