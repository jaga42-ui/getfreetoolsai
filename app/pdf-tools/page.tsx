import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { pdfTools } from "@/lib/tools";
import { sizePresetsByKind } from "@/lib/sizePresets";
import { howtos } from "@/lib/howto";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

const readyPdfTools = pdfTools.filter((t) => t.ready);

/**
 * Grouping for the hub. 18 cards in a flat grid gave the page no heading
 * structure, so nothing described what the category actually covers.
 *
 * As on the other hubs, anything missing from a group falls through to a
 * "More" bucket automatically — since the footer no longer lists every tool,
 * this hub is the crawl path to each PDF tool.
 */
const GROUPS: { id: string; title: string; blurb: string; hrefs: string[] }[] = [
  {
    id: "compress",
    title: "Compress & optimise",
    blurb:
      "Get a PDF under an upload limit without turning the text to mush.",
    hrefs: ["/pdf/compress"],
  },
  {
    id: "organise",
    title: "Organise pages",
    blurb:
      "Combine, separate and reorder documents — merge several files into one, pull out a page range, or drop the pages you do not need.",
    hrefs: [
      "/pdf/merge",
      "/pdf/split",
      "/pdf/organize",
      "/pdf/delete-pages",
      "/pdf/rotate",
      "/pdf/number-pages",
    ],
  },
  {
    id: "convert",
    title: "Convert to and from PDF",
    blurb:
      "Move between PDF, Word and images in both directions, keeping the formatting intact.",
    hrefs: [
      "/pdf/pdf-to-word",
      "/pdf/word-to-pdf",
      "/pdf/pdf-to-jpg",
      "/pdf/jpg-to-pdf",
      "/pdf/png-to-pdf",
    ],
  },
  {
    id: "sign",
    title: "Sign, fill & mark up",
    blurb:
      "Complete and return a document without printing it — type into form fields, drop in a signature, or stamp a watermark.",
    hrefs: ["/pdf/sign", "/pdf/fill", "/pdf/watermark"],
  },
  {
    id: "secure",
    title: "Passwords & security",
    blurb:
      "Encrypt a document before sending it, or remove a password you already know from a file you own.",
    hrefs: ["/pdf/protect", "/pdf/unlock"],
  },
  {
    id: "ocr",
    title: "Extract text from scans",
    blurb:
      "Turn a scanned or photographed document into text you can search, copy and edit.",
    hrefs: ["/pdf/ocr"],
  },
];

const byHref = new Map(readyPdfTools.map((t) => [t.href, t]));
const claimed = new Set(GROUPS.flatMap((g) => g.hrefs));
const leftover = readyPdfTools.filter((t) => !claimed.has(t.href));

const grouped = [
  ...GROUPS.map((g) => ({
    ...g,
    tools: g.hrefs.map((h) => byHref.get(h)).filter(Boolean),
  })),
  ...(leftover.length
    ? [
        {
          id: "more",
          title: "More PDF tools",
          blurb: "Everything else in the collection.",
          tools: leftover,
        },
      ]
    : []),
].filter((g) => g.tools.length > 0);

const pdfSizePresets = sizePresetsByKind("pdf");
/** The purpose-specific compression guides — real, distinct upload scenarios. */
const pdfHowTos = howtos.filter((h) => h.niche === "pdf");

export const metadata = toolMeta({
  title:
    "Free PDF Tools Online — Compress, Merge, Convert & Edit PDF",
  description:
    "Free all-in-one PDF tools: compress, merge, split, convert, unlock, rotate and OCR. 100% in your browser — no signup, no watermark, no upload.",
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
          readyPdfTools.map((t) => ({ name: t.name, href: t.href }))
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

      {grouped.map((g) => (
        <section key={g.id} className="mt-12" id={g.id}>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            {g.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            {g.blurb}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.tools.map((t) => (
              <ToolCard key={t!.href} tool={t!} />
            ))}
          </div>

          {/* Long-tail shortcuts, shown only in the group they belong to.
              These pages previously had no link from the hub. */}
          {g.id === "compress" && (
            <p className="mt-5 text-sm leading-relaxed text-text-muted">
              <span className="font-medium text-text-primary">
                Know the limit you need to hit?
              </span>{" "}
              Go straight to{" "}
              {pdfSizePresets.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && (i === pdfSizePresets.length - 1 ? " or " : ", ")}
                  <Link
                    href={`/pdf/compress/${p.slug}`}
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    {p.label}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
        </section>
      ))}

      <p className="mt-10 text-[15px] text-text-muted">
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

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Getting a PDF under a portal&rsquo;s upload limit
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            Almost every PDF that needs compressing is going somewhere specific —
            a visa application, a bank KYC upload, a court e-filing system, an
            email that keeps bouncing. Each of those enforces its own ceiling,
            which is why{" "}
            <Link href="/pdf/compress" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
              the compressor
            </Link>{" "}
            lets you set an exact target rather than offering a vague
            &ldquo;high / medium / low&rdquo; choice.
          </p>
          <p>
            One thing worth knowing before you compress: most of a large PDF&rsquo;s
            weight is images, not text. A scanned document is really a stack of
            photographs, so it compresses dramatically. A text-only PDF exported
            from Word is already small and has little left to give — if that file
            is over a limit, the pages are usually the problem, and{" "}
            <Link href="/pdf/split" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
              splitting out
            </Link>{" "}
            the ones you actually need will do more than compression.
          </p>
          <p>
            We keep a walkthrough for each of the common cases, with the specific
            limit each one enforces:
          </p>
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {pdfHowTos.map((h) => (
              <li key={h.slug}>
                <Link
                  href={`/how-to/${h.slug}`}
                  className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                >
                  {h.h1}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/pdf-tools" />
    </div>
  );
}
