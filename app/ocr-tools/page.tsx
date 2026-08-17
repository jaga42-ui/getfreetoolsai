import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { allTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Free OCR Online — Extract Text from Images & PDFs, No Upload",
  description:
    "Free OCR that runs entirely in your browser — extract text from images and scanned PDFs in 13 languages including Hindi, Tamil, Bengali and Telugu. Keeps tables and headings. Nothing is uploaded.",
  keywords:
    "free ocr online, ocr no upload, extract text from image, scanned pdf to text, hindi ocr, tamil ocr, bengali ocr, offline ocr browser",
  path: "/ocr-tools",
});

/**
 * The OCR cluster head. OCR is the site's strongest category in Search Console
 * but its two tools live in different sections (/image, /pdf) and had no shared
 * parent — so nothing ranked for the head term "OCR" and neither tool passed
 * equity to the other. This hub is that parent.
 *
 * Everything below is verifiable against the implementation: the language list
 * mirrors LANGUAGES in components/tools/OcrStudio.tsx, and the layout claims
 * (headings, lists, tables, low-confidence flagging) mirror lib/ocr.ts.
 */
const OCR_HREFS = ["/image/image-to-text", "/pdf/ocr"];

/**
 * Mirrors LANGUAGES in components/tools/OcrStudio.tsx. Indian languages are
 * flagged because they are both the bulk of the list and the site's real
 * audience — and because "Hindi OCR" / "Tamil OCR" are queries almost no
 * free browser-based tool targets.
 */
const LANGUAGES: { name: string; script: string; indian: boolean }[] = [
  { name: "English", script: "Latin", indian: false },
  { name: "Hindi", script: "Devanagari", indian: true },
  { name: "Bengali", script: "Bengali", indian: true },
  { name: "Odia", script: "Odia", indian: true },
  { name: "Tamil", script: "Tamil", indian: true },
  { name: "Telugu", script: "Telugu", indian: true },
  { name: "Marathi", script: "Devanagari", indian: true },
  { name: "Gujarati", script: "Gujarati", indian: true },
  { name: "Punjabi", script: "Gurmukhi", indian: true },
  { name: "Arabic", script: "Arabic", indian: false },
  { name: "French", script: "Latin", indian: false },
  { name: "Spanish", script: "Latin", indian: false },
  { name: "German", script: "Latin", indian: false },
];

const faqs = [
  {
    q: "Is this OCR really free, with no signup?",
    a: "Yes. There is no account, no daily page limit and no watermark. The recognition engine downloads into your browser the first time you use it and then runs on your own device.",
  },
  {
    q: "Are my documents uploaded to a server?",
    a: "No. Both OCR tools run entirely in your browser using WebAssembly. Your image or PDF is read from disk into memory on your device and never transmitted. You can confirm this by opening your browser's Network tab while the tool runs — you will see the engine download, but no upload of your file.",
  },
  {
    q: "Which languages are supported?",
    a: "Thirteen: English, Hindi, Bengali, Odia, Tamil, Telugu, Marathi, Gujarati, Punjabi, Arabic, French, Spanish and German. Pick the document's language before running — accuracy drops sharply if the selected language does not match the script on the page.",
  },
  {
    q: "Does it keep tables and formatting, or just dump plain text?",
    a: "It reconstructs structure. The engine reads each word's position on the page and rebuilds headings, bullet lists and tables rather than returning one flat block of text. You can export the result as Word, HTML, Markdown or plain text.",
  },
  {
    q: "Can it read handwriting?",
    a: "Not reliably. The engine is trained on printed type. Neat block capitals sometimes work, but cursive and casual handwriting will produce poor results. This is a genuine limitation, not a setting you can change.",
  },
  {
    q: "Why is my accuracy poor?",
    a: "Almost always resolution or contrast. A photo of a page taken at an angle in dim light is the worst case; a flat, well-lit scan at 300 DPI is the best. See the accuracy checklist above — following it typically matters more than any option in the tool.",
  },
  {
    q: "Is there a file size or page limit?",
    a: "There is no artificial cap. The practical limit is your device's memory, since the whole job runs locally. Very long scanned PDFs on an older phone may run out of memory — split them first if that happens.",
  },
];

export default function OcrToolsHub() {
  const tools = OCR_HREFS.map((href) => allTools.find((t) => t.href === href)).filter(
    (t): t is NonNullable<typeof t> => Boolean(t)
  );
  const indianCount = LANGUAGES.filter((l) => l.indian).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "OCR Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free OCR Tools",
          tools.map((t) => ({ name: t.name, href: t.href }))
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
        <span className="text-text-primary">OCR Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free OCR Tools — Extract Text from Images &amp; PDFs
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        OCR (optical character recognition) turns a picture of text into text you
        can actually select, copy and edit. These tools do it without uploading
        anything: the recognition engine runs inside your browser, so a payslip,
        an ID scan or a contract never leaves your device. Thirteen languages are
        supported, {indianCount} of them Indian scripts.
      </p>

      <TrustBadges className="mt-6" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      {/* ---------------- Which tool to use ---------------- */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Which OCR tool should I use?
        </h2>
        <p className="mt-2 text-[15px] text-text-muted">
          Both use the same recognition engine. The difference is what you feed
          them.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 font-medium text-text-primary">
                  If you have…
                </th>
                <th className="py-3 pr-4 font-medium text-text-primary">
                  Use
                </th>
                <th className="py-3 font-medium text-text-primary">Why</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4">A screenshot or photo</td>
                <td className="py-3 pr-4">
                  <Link
                    href="/image/image-to-text"
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    Image to Text
                  </Link>
                </td>
                <td className="py-3">
                  Takes JPG, PNG, WebP and HEIC directly — no conversion step.
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4">A scanned PDF</td>
                <td className="py-3 pr-4">
                  <Link
                    href="/pdf/ocr"
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    PDF OCR
                  </Link>
                </td>
                <td className="py-3">
                  Renders every page and runs recognition across the whole
                  document in one pass.
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="py-3 pr-4">
                  A PDF whose text is already selectable
                </td>
                <td className="py-3 pr-4">
                  <Link
                    href="/pdf/pdf-to-word"
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    PDF to Word
                  </Link>
                </td>
                <td className="py-3">
                  You do not need OCR at all — the text is already there, and
                  extracting it directly is both faster and perfectly accurate.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4">A photo that is hard to read</td>
                <td className="py-3 pr-4">
                  <Link
                    href="/image/filters"
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    Image Filters
                  </Link>{" "}
                  first
                </td>
                <td className="py-3">
                  Raising contrast before OCR usually beats any post-processing.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- What makes it different ---------------- */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          What this does that most free OCR sites don&apos;t
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              It rebuilds layout, not just text
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              Most tools return one undifferentiated block of text. This engine
              uses each word&apos;s position on the page to reconstruct headings,
              bullet lists and tables — so a scanned invoice comes back as a
              table you can paste into a spreadsheet.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              It shows you what it wasn&apos;t sure about
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              Every recognised word carries a confidence score. Words the engine
              was unsure of are highlighted, so you can proofread the three words
              that need it instead of re-reading the whole page.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              It exports somewhere useful
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              Results download as Word, HTML, Markdown or plain text — and the
              PDF tool can rebuild a searchable PDF with an invisible text layer
              over the original scan.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="font-medium text-text-primary">
              Nothing is uploaded
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-muted">
              This matters most for exactly the documents people OCR: ID cards,
              bank statements, medical letters. Open your Network tab and watch —
              the engine downloads, your file does not upload.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Languages ---------------- */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Supported languages
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
          Select the document&apos;s language before running. This matters more
          than people expect: recognition is script-specific, and running a
          Devanagari page as English produces near-total garbage rather than
          slightly worse output.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 font-medium text-text-primary">
                  Language
                </th>
                <th className="py-3 pr-4 font-medium text-text-primary">
                  Script
                </th>
                <th className="py-3 font-medium text-text-primary">Region</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {LANGUAGES.map((l) => (
                <tr key={l.name} className="border-b border-border/60">
                  <td className="py-2.5 pr-4 text-text-primary">{l.name}</td>
                  <td className="py-2.5 pr-4">{l.script}</td>
                  <td className="py-2.5">{l.indian ? "India" : "International"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- Accuracy checklist ---------------- */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          How to get accurate OCR results
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">
          OCR accuracy is decided almost entirely by the input. In roughly
          descending order of impact:
        </p>
        <ol className="mt-6 space-y-4">
          {[
            {
              h: "Scan flat, don't photograph at an angle",
              p: "Perspective distortion is the single biggest killer of accuracy. A page photographed from an angle has letters that skew progressively across the line. If you must use a phone camera, hold it parallel to the page and fill the frame.",
            },
            {
              h: "Aim for 300 DPI or a wide screenshot",
              p: "Below roughly 200 DPI, letterforms start to merge and the engine guesses. If you are scanning, 300 DPI is the sweet spot. Going far above 600 DPI mostly costs memory without improving results.",
            },
            {
              h: "Get contrast up and shadows out",
              p: "Black text on white is ideal. Grey text on grey, a shadow falling across half the page, or a photo taken in warm indoor light all reduce accuracy. Raising contrast before OCR often fixes a bad result outright.",
            },
            {
              h: "Straighten the page",
              p: "Even a few degrees of rotation hurts, because line detection assumes roughly horizontal text. Crop and rotate so the lines run flat before running recognition.",
            },
            {
              h: "Match the language to the script",
              p: "Set the language selector to the actual language on the page. Mixed-script documents will always have one script recognised worse than the other — run them twice if accuracy matters.",
            },
            {
              h: "Then proofread the highlighted words",
              p: "Words the engine flagged as low-confidence are marked in the output. Those are where the errors are concentrated — checking them is far more efficient than re-reading everything.",
            },
          ].map((s, i) => (
            <li key={s.h} className="flex gap-4">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium text-text-primary">{s.h}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-text-muted">
                  {s.p}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-10 text-[15px] leading-relaxed text-text-muted">
        Extracted text you need to tidy up? The{" "}
        <Link
          href="/text-tools"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          text tools
        </Link>{" "}
        can strip stray line breaks and collapse extra spaces — both very common
        after OCR. If the scan also carries metadata you would rather not share,{" "}
        <Link
          href="/image/remove-exif"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          remove its EXIF data
        </Link>{" "}
        first.
      </p>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/ocr-tools" />
    </div>
  );
}
