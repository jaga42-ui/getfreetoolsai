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
import { HeroShowcase } from "@/components/HeroShowcase";
import { PrivacyProof } from "@/components/PrivacyProof";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { catalogItemListSchema } from "@/lib/seo";
import { TOOL_COUNT_LABEL } from "@/lib/siteTools";

// Newsletter shows only once the backend is configured (BUTTONDOWN_API_KEY on
// the server + this flag), so a non-working form never ships to production.
const newsletterEnabled =
  process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true";

const homeFaqs = [
  {
    q: "Are all tools on GetFreeToolsAI completely free?",
    a: "Yes. Every tool on GetFreeToolsAI is 100% free forever. There are no daily limits, no premium plans, and no hidden fees. Unlike many free tools that cap how many tasks you can run per day, ours have no such restrictions.",
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
    a: "Many free tools cap how many tasks you can run per day and upload your files to their servers. GetFreeToolsAI has no daily limits, no artificial size caps, no watermarks, and no signup, and every file is processed privately in your browser.",
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

// High-intent shortcuts surfaced in the hero so visitors can jump straight to a
// top tool instead of scrolling. Doubles as internal links to flagship pages.
//
// "Popular" should mean what visitors actually arrive for, and this list did
// not: /fun/fake-error is 77 of the site's 131 organic clicks and was missing,
// while /pdf/compress and /image/compress have 0 and 3 impressions between
// them. The two earners below are added rather than swapped in, so no existing
// shortcut is taken away from visitors who use it.
const popularTools = [
  { name: "Error Message Generator", href: "/fun/fake-error" },
  { name: "Compress PDF", href: "/pdf/compress" },
  { name: "Background Remover", href: "/image/background-remover" },
  { name: "PDF OCR", href: "/pdf/ocr" },
  { name: "PDF to Word", href: "/pdf/pdf-to-word" },
  { name: "Compress Image", href: "/image/compress" },
];

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
        <div className="grid items-center gap-x-12 gap-y-4 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left column — content */}
          <div>
            <p className="label">{TOOL_COUNT_LABEL} free tools · nothing uploaded · no limits</p>
            <h1 className="mt-5 max-w-3xl font-display text-[2.75rem] font-medium leading-[1.05] tracking-tight text-text-primary sm:text-6xl">
              Free online tools that
              <br className="hidden sm:block" /> never upload your files.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              {TOOL_COUNT_LABEL} PDF, image, calculator and developer tools —
              all in one place, each running 100% in your browser. No signup. No
              watermark. No limits. Ever.
            </p>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/[0.07] px-4 py-1.5 text-sm font-medium text-secondary">
              <Lock className="h-4 w-4" strokeWidth={2} />
              Your files never leave your browser — verify it in DevTools
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {trustItems.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-primary shadow-[0_1px_2px_rgba(33,31,26,0.04)]"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary/15">
                    <Check className="h-2.5 w-2.5 text-secondary" strokeWidth={3} aria-hidden="true" />
                  </span>
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

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-text-muted">Popular:</span>
              {popularTools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-[13px] text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right column — product showcase */}
          <HeroShowcase />
        </div>
      </section>

      {/* TOOL GRID + SEARCH */}
      <ToolExplorer />

      {/* PRIVACY WEDGE — comparison + verify-it-yourself */}
      <PrivacyProof />

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

      {/* LONG-FORM CONTENT */}
      <section className="border-t border-border py-16">
        <div className="max-w-3xl space-y-12">
          <div>
            <h2 className="font-display text-2xl font-medium text-text-primary">
              Free tools that actually work
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              GetFreeToolsAI is a growing collection of free online tools for
              PDF, image, video, text, calculator and developer work. Every tool
              is genuinely free — there is
              no premium plan, no credit card, and no trial that quietly expires.
              You can compress a PDF, merge several documents into one, convert
              HEIC photos from an iPhone to JPG, remove an image background, or
              extract text from a scanned page without ever creating an account.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              Most “free” tools online are really paywalls in disguise: they cap
              you at two tasks a day, stamp a watermark across your file, or ask
              for an email before you can download. Our browser-based tools take
              the opposite approach. Open the tool you need, drop in your file,
              and download the result — no signup, no watermark, and no daily
              limit. Because each tool is purpose-built and lightweight, it loads
              quickly and does one job well rather than burying you in menus.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium text-text-primary">
              No limits, ever
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              There are no usage limits on GetFreeToolsAI. Convert one image or a
              hundred, compress a single PDF or a stack of scanned contracts, run
              the background remover as many times as you like — nothing is
              throttled and nothing is metered. The only practical ceiling is your
              own device’s memory, because the work happens locally rather than on
              a shared server with a queue.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              That also means there is no file-size cap imposed by an upload
              limit. Large PDFs and high-resolution photos that get rejected by
              other sites are handled here, since your file is never uploaded in
              the first place. Whether you are reducing an image to an exact KB
              size for a government form, adding page numbers to a long report, or
              watermarking a batch of documents, you can keep going for as long as
              you need without hitting an arbitrary wall.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium text-text-primary">
              Your files stay private
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              Privacy is the core idea behind GetFreeToolsAI. Every PDF tool and
              image tool runs entirely in your browser using modern WebAssembly
              and JavaScript, so your files are processed on your own device and
              never sent to our servers. When you sign a PDF, unlock a
              password-protected document, or strip GPS metadata from a photo, the
              sensitive data simply never leaves your computer or phone.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              This local-first, private processing model matters most for the
              documents you care about — bank statements, contracts, ID scans,
              medical forms and personal photos. There is no upload to intercept,
              no copy sitting in a temporary folder somewhere, and nothing to
              delete afterwards. Close the tab and the file is gone from memory.
              It is the kind of guarantee a server-based tool can promise but can
              never truly deliver.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium text-text-primary">
              Built for everyone
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              The tools are designed to feel obvious whether you are a student
              compressing an assignment to fit a portal’s upload limit, a
              freelancer converting a Word document to a polished PDF for a
              client, or a small business adding a watermark and page numbers to a
              proposal. No tutorials, no jargon — each page is a single focused
              app with a clear drop zone, a big download button, and sensible
              defaults.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              Everything is fully responsive and touch-friendly, so the same
              tools work on a phone, a tablet or a desktop browser. Students can
              fix a file from their phone between classes, freelancers can prepare
              deliverables on the move, and businesses can standardise documents
              without installing software or buying licences. With image tools,
              PDF tools, calculators and developer tools under one roof,
              GetFreeToolsAI replaces a dozen separate single-purpose websites.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium text-text-primary">
              Always getting better
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              The toolbox keeps growing. The newest additions are browser-based
              video tools — compress a video, convert it to a GIF or pull the
              audio out as MP3 — which, like everything here, run entirely on
              your device with no upload, no watermark and no signup. New tools
              are added regularly based on what people actually search for and
              need.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              If a tool you want isn’t here yet, it is very likely on the roadmap.
              The goal is simple: one trustworthy home for the small file tasks
              that come up every day, that respects your time, your privacy and
              your wallet. Bookmark GetFreeToolsAI and check back — the suite will
              keep expanding while staying completely free.
            </p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER — only when the backend is configured */}
      {newsletterEnabled && (
        <section className="border-t border-border py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium leading-tight text-text-primary">
              Get new tools the moment they ship.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              We add tools every week based on what people actually search for.
              Drop your email and we&apos;ll send a short note when something
              useful goes live — nothing else.
            </p>
            <NewsletterSignup className="mt-6" />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-border py-16">
        {/* Catalog ItemList belongs here — this is the page that actually lists
            every tool. It used to be emitted sitewide from the root layout. */}
        <JsonLd data={catalogItemListSchema} />
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
