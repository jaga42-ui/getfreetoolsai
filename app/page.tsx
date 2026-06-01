import Link from "next/link";
import {
  Lock,
  Gauge,
  Infinity as InfinityIcon,
  Smartphone,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { ToolExplorer } from "@/components/ToolExplorer";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";

const homeFaqs = [
  {
    q: "Are all tools on GetFreeToolsAI completely free?",
    a: "Yes. Every tool on GetFreeToolsAI is 100% free forever. There are no daily limits, no premium plans, and no hidden fees. Unlike Smallpdf, which limits free users to 2 tasks per day, our tools have no restrictions.",
  },
  {
    q: "Do my files get uploaded to your servers?",
    a: "No. Every tool runs entirely in your browser, so your files never leave your device. Whether you compress a PDF or remove an image background, the processing happens locally — nothing is uploaded to us.",
  },
  {
    q: "Is there a file size limit?",
    a: "There is no server-side file size cap because we never upload your files. The only practical limit is your own device's available memory, so large PDFs and high-resolution images work fine.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There is no signup, login, or registration of any kind. Open any tool and start working immediately — GetFreeToolsAI is free online tools with no signup required.",
  },
  {
    q: "What PDF tools are available for free?",
    a: "You can compress PDF, merge PDF, split PDF, convert PDF to Word, convert PDF to JPG, convert JPG to PDF, unlock password-protected PDFs, rotate PDF pages, and run PDF OCR on scanned documents — all free with no watermark.",
  },
  {
    q: "What image tools are available for free?",
    a: "You can compress an image to an exact KB size, convert HEIC to JPG, remove an image background with AI, convert between JPG/PNG/WebP, resize images, crop images, remove EXIF and GPS metadata, and extract text from images with OCR.",
  },
  {
    q: "How is GetFreeToolsAI different from Smallpdf?",
    a: "Smallpdf limits free users to a couple of tasks per day and uploads your files to its servers. GetFreeToolsAI has no daily limits, no file size caps, no watermarks, and no signup, and every file is processed privately in your browser.",
  },
  {
    q: "Does GetFreeToolsAI add watermarks?",
    a: "Never. None of our tools add a watermark, logo, or branding to your output files. The PDFs and images you download are clean.",
  },
  {
    q: "Which browsers are supported?",
    a: "GetFreeToolsAI works in all modern browsers including Chrome, Edge, Firefox, and Safari, on desktop and mobile. For the heaviest tools, a recent version of Chrome or Edge gives the best performance.",
  },
  {
    q: "Is GetFreeToolsAI safe for sensitive documents?",
    a: "Yes. Because nothing is uploaded and all processing happens locally in your browser, it is safe for bank statements, contracts, and other private files. Closing the tab clears everything from memory.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const trustItems = ["No signup", "Files stay on your device", "Free forever"];

const whyUs: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lock,
    title: "Private by design",
    body: "Every tool runs in your browser. Your files are never uploaded — not to us, not to anyone.",
  },
  {
    icon: Gauge,
    title: "Fast, no waiting",
    body: "No queues and no round-trips to a server. Processing happens instantly on your own device.",
  },
  {
    icon: InfinityIcon,
    title: "Free, with no catch",
    body: "No accounts, no credit card, no premium tier. Every tool is completely free, always.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    body: "Carefully built to feel right on a phone, a tablet, or a desktop browser.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* HERO */}
      <section className="border-b border-border py-16 sm:py-24">
        <p className="label">42 tools · 7 categories · no signup ever</p>
        <h1 className="mt-5 max-w-3xl font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-text-primary sm:text-6xl">
          Every free tool
          <br className="hidden sm:block" /> you&apos;ll ever need.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
          PDF, Image, AI Writing, Generators, Video, Calculators and more — all
          in one place. No signup. No watermark. No limits. Ever.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          {trustItems.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 text-sm text-text-muted"
            >
              <Check className="h-4 w-4 text-secondary" strokeWidth={2} />
              {t}
            </span>
          ))}
        </div>

        <div className="mt-9">
          <Link
            href="#all-tools"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-[15px] font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
          >
            Browse all tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* TOOL GRID + SEARCH */}
      <ToolExplorer />

      {/* WHY US */}
      <section className="border-t border-border py-16">
        <h2 className="max-w-2xl font-display text-3xl font-medium leading-tight text-text-primary">
          Tools that respect your time and your privacy.
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {whyUs.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon
                className="mt-1 h-5 w-5 shrink-0 text-primary"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="font-display text-lg font-medium text-text-primary">
                  {title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-16">
        <JsonLd data={faqSchema} />
        <h2 className="font-display text-3xl font-medium leading-tight text-text-primary">
          Frequently asked questions
        </h2>
        <div className="mt-8 max-w-3xl">
          <Faq items={homeFaqs} />
        </div>
      </section>
    </div>
  );
}
