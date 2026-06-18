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
  title: "Fill PDF Forms Free Online",
  description:
    "Fill out PDF forms free online. Type into text fields, tick checkboxes and pick options, then flatten and download. No signup, no watermark. 100% private — runs in your browser.",
  keywords:
    "fill pdf form free, pdf form filler online, fill out pdf online free, complete pdf form, edit pdf form fields free",
  path: "/pdf/fill",
});

const jsonLd = softwareAppSchema({
  name: "Free Fill PDF Forms",
  description:
    "Fill out interactive PDF forms free online and flatten them. 100% private — your document never leaves your browser.",
  path: "/pdf/fill",
  ratingCount: 261,
});

const FillPDF = dynamic(() => import("@/components/tools/FillPDF"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I fill out a PDF form?",
    a: "Upload a PDF that contains interactive form fields. We detect each field and show it as a simple input — type your text, tick checkboxes and choose options, then download the completed file.",
  },
  {
    q: "My PDF has no fields to fill. Why?",
    a: "The PDF must contain real, interactive (AcroForm) fields. Many forms are just flat scans or images with lines drawn on them. For those, use our Sign PDF tool to type or draw directly onto the page.",
  },
  {
    q: "What does “flatten” do?",
    a: "Flattening bakes your answers permanently into the page so the fields can no longer be edited or cleared. It's useful when you're sending a final, locked copy. Untick it if you want the form to stay editable.",
  },
  {
    q: "Is my form data uploaded anywhere?",
    a: "No. The PDF is read and filled entirely inside your browser, so neither the document nor anything you type is sent to a server.",
  },
  {
    q: "Is it really free with no watermark?",
    a: "Yes. There's no signup, no daily limit and nothing is stamped onto your document.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="PDF Tools" sectionHref="/pdf-tools" current="Fill PDF" />
      <ToolHeader
        title="Fill PDF Forms Online"
        description="Detect the fields in an interactive PDF form, fill them in, optionally flatten, and download — privately, in your browser."
      />
      <div className="mt-8">
        <FillPDF />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your PDF form",
          "Fill in the detected fields",
          "Flatten if needed and download",
        ]}
      />
      <ToolDemo kind="fill" />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free fill-PDF tool reads the interactive form fields built into a
          PDF — text boxes, checkboxes, dropdowns and radio buttons — and lays
          them out as a clean form you can complete in the browser. It&apos;s
          ideal for application forms, tax and government forms, onboarding
          paperwork and any document that was designed to be filled in digitally.
          When you&apos;re done you can flatten the form so your answers are
          locked into the page, then download a finished copy. The advantage over
          most free PDF form fillers is privacy and freedom: there&apos;s no
          signup, no limit and no watermark, and the document is processed
          entirely on your device so nothing is ever uploaded. If your PDF is a
          flat scan with no real fields, use the Sign PDF tool to write or sign
          directly on the page instead. Works in Chrome, Firefox, Safari and Edge
          with no installation.
        </p>
      </section>
      <ToolExtraContent href="/pdf/fill" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/pdf/fill" />
    </div>
  );
}
