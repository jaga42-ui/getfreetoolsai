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
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Compress PDF Online Free — Reduce PDF Size Without Quality Loss | GetFreeToolsAI",
  description:
    "Compress PDF files online for free. Reduce PDF file size without losing quality. No signup, no watermark, no file size limit. Works in your browser — files never uploaded. Better than Smallpdf free tier.",
  keywords:
    "compress pdf, compress pdf online free, reduce pdf size, pdf compressor, shrink pdf, pdf file size reducer, compress pdf without losing quality, pdf compressor no watermark, smallpdf alternative",
  path: "/pdf/compress",
});

const jsonLd = softwareAppSchema({
  name: "Free PDF Compressor",
  description:
    "Compress PDF files online free. No signup, no watermark, no file size limit.",
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
        sectionHref="/#all-tools"
        current="Compress PDF"
      />
      <ToolHeader
        title="Compress PDF"
        description="Shrink large PDFs so they’re easy to email and upload — ideal for scanned documents, processed privately in your browser."
      />
      <div className="mt-8">
        <CompressPDF />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Pick a compression level",
          "Download the smaller PDF",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free PDF compressor reduces your PDF file size without
          compromising readability. Whether you need to email a large report,
          upload a document to a portal with a file size limit, or simply save
          storage space, the tool handles it instantly in your browser. Unlike
          Smallpdf, which limits free users to just two compressions per day,
          GetFreeToolsAI has zero daily limits. Your PDF is never uploaded to any
          server — everything happens locally using WebAssembly technology, so
          your confidential documents, financial reports, and personal files
          stay completely private. Simply upload your PDF, choose a compression
          level, and download the result in seconds. It works in every modern
          browser including Chrome, Firefox, Safari, and Edge, with no
          installation, no signup, and no watermark — ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/compress" />
    </div>
  );
}
