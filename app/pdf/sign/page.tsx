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
import { ToolDemo } from "@/components/ToolDemo";
import { ToolExtraContent } from "@/components/ToolExtraContent";

export const metadata = toolMeta({
  title: "Sign PDF Free Online — Add Your Signature",
  description:
    "Sign a PDF free online. Draw or type your signature, place it anywhere on the page, and download. No signup, no watermark. 100% private — runs in your browser.",
  keywords:
    "sign pdf free, esign pdf online, add signature to pdf, electronic signature pdf free, draw signature on pdf",
  path: "/pdf/sign",
});

const jsonLd = softwareAppSchema({
  name: "Free Sign PDF",
  description:
    "Add a drawn or typed signature to a PDF free online. 100% private — your document never leaves your browser.",
  path: "/pdf/sign",
  ratingCount: 274,
});

const SignPDF = dynamic(() => import("@/components/tools/SignPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I sign a PDF?",
    a: "Upload your PDF, then draw your signature with a mouse, trackpad or finger, or type your name in a signature font. Drag it to the right spot on the page, resize it, and download the signed file.",
  },
  {
    q: "Is my document uploaded anywhere?",
    a: "No. The PDF is opened and signed entirely inside your browser, so your document never leaves your device — which makes it safe for contracts and agreements.",
  },
  {
    q: "Is an electronic signature like this legal?",
    a: "In most countries a clear, intentional electronic signature is valid for everyday agreements. For documents that legally require a certificate-based digital signature, use a dedicated e-signature service. This tool adds a standard visible signature image.",
  },
  {
    q: "Can I sign more than one page?",
    a: "You place a signature on the page you have open. For a multi-page document, sign one page, download it, and repeat for any other pages you need to sign.",
  },
  {
    q: "Will the signature reduce the quality of my PDF?",
    a: "No. Your signature is added as a sharp transparent overlay and the rest of the document is left untouched.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="PDF Tools" sectionHref="/pdf-tools" current="Sign PDF" />
      <ToolHeader
        title="Sign PDF — Add Your Signature"
        description="Draw or type your signature, drop it exactly where it belongs, and download a signed PDF — privately, in your browser."
      />
      <div className="mt-8">
        <SignPDF />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF",
          "Draw or type your signature",
          "Position it and download",
        ]}
      />
      <ToolDemo kind="sign" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free sign-PDF tool lets you add your signature to a document
          without printing, scanning or installing anything. Draw your signature
          with a mouse, trackpad or touchscreen for a natural handwritten look,
          or type your name and pick a signature-style font. Then drag the
          signature to the right place on the page, resize it to fit the line,
          and download. It&apos;s exactly what you need for contracts, consent
          forms, offer letters, NDAs and rental agreements that ask for a
          signature. Unlike many free e-sign sites, there&apos;s no signup, no
          daily limit and no watermark — and because the whole document is opened
          and signed inside your browser, your file is never uploaded to a
          server. It works in Chrome, Firefox, Safari and Edge on desktop and
          mobile.
        </p>
      </section>
      <ToolExtraContent href="/pdf/sign" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/sign" />
    </div>
  );
}
