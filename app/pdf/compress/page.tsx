import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  PrivacyNote,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { ToolDemo, CompressDemo } from "@/components/ToolDemo";
import { ToolExtraContent } from "@/components/ToolExtraContent";
import { toolMeta, softwareAppSchema } from "@/lib/seo";
import Link from "next/link";
import { sizePresetsByKind } from "@/lib/sizePresets";

export const metadata = toolMeta({
  title:
    "Compress PDF Online Free — Reduce PDF File Size Fast",
  description:
    "Compress PDF files online for free. Reduce PDF file size for email and uploads — pick a compression level to balance size and quality. No signup, no watermark, no daily limits. 100% in your browser, files never uploaded.",
  keywords:
    "compress pdf, compress pdf online free, reduce pdf size, pdf compressor, shrink pdf, pdf file size reducer, compress pdf without losing quality, pdf compressor no watermark, smallpdf alternative",
  path: "/pdf/compress",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF Compressor",
  description:
    "Compress PDF files online free. No signup, no watermark, no daily limits.",
  path: "/pdf/compress",
  ratingCount: 1247,
});

const CompressPDF = dynamic(() => import("@/components/tools/CompressPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How much can I shrink a PDF?",
    a: "It depends on the content. Scanned or image-heavy PDFs can shrink dramatically (often 50–90%), while PDFs that are mostly plain text may compress little since they’re already small.",
  },
  {
    q: "Why does my text become non-selectable?",
    a: "To guarantee a smaller file, each page is re-rendered as a compressed image. This flattens the page, so text can no longer be selected. If you need selectable text, keep the original.",
  },
  {
    q: "What do the compression levels mean?",
    a: "Low produces the smallest file at lower visual quality, High keeps the best quality with more modest savings, and Medium balances the two.",
  },
  {
    q: "Will there be a watermark?",
    a: "No. The compressed PDF has no watermark or branding.",
  },
  {
    q: "Are my files uploaded to a server?",
    a: "No. Compression runs entirely in your browser, so your PDF never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="PDF Tools"
        sectionHref="/pdf-tools"
        current="Compress PDF"
      />
      <ToolHeader
        title="Compress PDF"
        description="Shrink large PDFs so they’re easy to email and upload — ideal for scanned documents, processed privately in your browser."
      />
      <div className="mt-8">
        <CompressPDF />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-text-primary">
          Compress PDF to a specific size
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizePresetsByKind("pdf").map((p) => (
            <Link
              key={p.slug}
              href={`/pdf/compress/${p.slug}`}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary/50 hover:text-primary"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </section>

      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Pick a compression level",
          "Download the smaller PDF",
        ]}
      />
      <ToolDemo
        title="What compression does"
        caption="A large PDF becomes a much smaller file that is easy to email and upload. The exact saving depends on the document and the level you pick."
      >
        <CompressDemo kind="pdf" />
      </ToolDemo>
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF compressor reduces your PDF file size without
          compromising readability. Whether you need to email a large report,
          upload a document to a portal with a file size limit, or simply save
          storage space, the tool handles it instantly in your browser. Unlike
          many free tiers that cap how many files you can process each day,
          GetFreeToolsAI has no daily task limits. Your PDF is never uploaded to any
          server — everything happens locally using WebAssembly technology, so
          your confidential documents, financial reports, and personal files
          stay completely private. Simply upload your PDF, choose a compression
          level, and download the result in seconds. It works in every modern
          browser including Chrome, Firefox, Safari, and Edge, with no
          installation, no signup, and no watermark — ever.
        </p>
      </section>
      <ToolExtraContent href="/pdf/compress" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/compress" />
    </div>
  );
}
