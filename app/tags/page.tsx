import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "All Free Online Tools & Keywords | GetFreeToolsAI" },
  description:
    "Complete directory of all free online tools available on GetFreeToolsAI — PDF tools, image tools, AI writing tools, generators, video tools, calculators, developer tools and more.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://getfreetoolsai.com/tags" },
};

/** Keyword anchor link. */
function K({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
    >
      {children}
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-medium text-text-primary">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-[1.9] text-text-muted">
        {children}
      </p>
    </section>
  );
}

export default function TagsPage() {
  const home = "/";
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <p className="label">Tools directory &amp; keyword index</p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free Online Tools Directory
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        Complete keyword index for every free tool on GetFreeToolsAI — PDF
        tools, image tools, AI writing tools, generators, video tools,
        calculators, developer tools and social media tools. No signup, no
        watermark, no limits.
      </p>

      <Section title="Free PDF Tools — No Signup, No Watermark">
        Use our <K href="/pdf/compress">free PDF compressor to compress PDF
        online without losing quality</K> and shrink your{" "}
        <K href="/pdf/compress">PDF file size free with no watermark</K>. Need
        to <K href="/pdf/merge">merge PDF files</K>? Our{" "}
        <K href="/pdf/merge">free PDF merger combines multiple PDFs into one</K>{" "}
        with no file size limit — a true{" "}
        <K href="/pdf/merge">Smallpdf alternative and iLovePDF alternative</K>.{" "}
        <K href="/pdf/split">Split PDF pages, extract specific pages, or split
        every N pages</K> with our free PDF splitter. Convert{" "}
        <K href="/pdf/pdf-to-word">PDF to Word with our free PDF to Word
        converter — no watermark, no signup</K>. Use our{" "}
        <K href="/pdf/pdf-to-jpg">free PDF to JPG tool to convert each PDF page
        to a high-quality image</K>, or create a{" "}
        <K href="/pdf/jpg-to-pdf">PDF from images using our free JPG to PDF
        tool</K>. <K href="/pdf/unlock">Unlock password protected PDF files</K>{" "}
        with our free PDF unlocker, <K href="/pdf/rotate">rotate PDF pages
        online free</K> with our PDF rotation tool, and{" "}
        <K href="/pdf/ocr">extract text from scanned PDFs with our free PDF
        OCR tool</K>. These <K href="/pdf/compress">PDF tools are free with no
        limit</K> and run as a{" "}
        <K href="/pdf/compress">free online PDF editor with no signup</K>.
      </Section>

      <Section title="Free Image Tools — Browser-Based, 100% Private">
        <K href="/image/compress">Compress image to 200KB</K> or{" "}
        <K href="/image/compress">compress image to 100KB</K> with our{" "}
        <K href="/image/compress">free image compressor online</K> — perfect to{" "}
        <K href="/image/compress">reduce image size in KB</K> or{" "}
        <K href="/image/compress">reduce photo size for an online form</K>{" "}
        without losing quality. Convert{" "}
        <K href="/image/heic-to-jpg">HEIC to JPG</K> and{" "}
        <K href="/image/heic-to-jpg">turn iPhone photos into JPG</K> instantly.{" "}
        <K href="/image/background-remover">Remove the background from an image
        free</K> with our AI <K href="/image/background-remover">background
        remover with no signup</K> — a private{" "}
        <K href="/image/background-remover">Remove.bg alternative</K>.{" "}
        <K href="/image/resize">Resize an image online free</K>,{" "}
        <K href="/image/crop">crop an image online free</K>,{" "}
        <K href="/image/compress">compress JPG and compress PNG online free</K>,
        and convert <K href="/image/convert">WebP to JPG or JPG to PNG</K> with
        our free image converter. Pull text from pictures with our{" "}
        <K href="/image/image-to-text">free image to text converter</K>,{" "}
        <K href="/image/remove-exif">remove EXIF data and strip GPS from a
        photo</K>, or run a{" "}
        <K href="/image/compress">batch image compressor with no watermark</K> —
        a genuine <K href="/image/compress">TinyPNG alternative</K>.
      </Section>

      <Section title="Free AI Writing Tools — No Word Limits">
        Soon you will be able to use a{" "}
        <K href={home}>free AI text humanizer to humanize AI text</K> and{" "}
        <K href={home}>make AI text sound human</K> — an{" "}
        <K href={home}>AI humanizer with no word limit</K> and a{" "}
        <K href={home}>free AI humanizer for essays</K> that helps you{" "}
        <K href={home}>bypass AI detection</K>, a real{" "}
        <K href={home}>QuillBot alternative and Undetectable AI alternative</K>.
        Check your writing with a{" "}
        <K href={home}>free AI grammar checker</K> (a{" "}
        <K href={home}>Grammarly alternative</K>), a{" "}
        <K href={home}>free plagiarism checker with no signup</K>, and an{" "}
        <K href={home}>AI text detector and ChatGPT detector</K> (a{" "}
        <K href={home}>GPTZero alternative</K>). Use an{" "}
        <K href={home}>AI summarizer to summarize PDF files</K>,{" "}
        <K href={home}>paraphrase text free online</K>, run a{" "}
        <K href={home}>resume ATS checker</K> (a{" "}
        <K href={home}>Jobscan alternative</K>), generate a{" "}
        <K href={home}>free cover letter</K>, and analyze tone with a{" "}
        <K href={home}>readability checker and tone analyzer</K>.
      </Section>

      <Section title="Free Generator Tools — Create Instantly">
        Generate instantly with a{" "}
        <K href={home}>free QR code generator</K>, a{" "}
        <K href={home}>free meme generator with no watermark</K>, a{" "}
        <K href={home}>YouTube thumbnail generator</K>, a{" "}
        <K href={home}>free email signature generator</K>, a{" "}
        <K href={home}>free invoice generator</K>, a{" "}
        <K href={home}>certificate generator</K>, a{" "}
        <K href={home}>quote card maker</K>, a{" "}
        <K href={home}>business card generator</K>, a{" "}
        <K href={home}>color palette generator</K>, an{" "}
        <K href={home}>OG image generator</K>, a{" "}
        <K href={home}>lorem ipsum generator</K>, a{" "}
        <K href={home}>password generator</K> and a{" "}
        <K href={home}>free barcode generator</K>.
      </Section>

      <Section title="Free Video Tools — No Watermark">
        Coming soon: <K href={home}>extract audio from video</K> and{" "}
        <K href={home}>convert video to MP3 free</K>,{" "}
        <K href={home}>compress video free</K>,{" "}
        <K href={home}>trim video online</K>, convert{" "}
        <K href={home}>MOV to MP4</K>, turn{" "}
        <K href={home}>video to GIF</K>, all with a{" "}
        <K href={home}>video compressor that has no watermark</K>.
      </Section>

      <Section title="Free Calculator Tools — Instant Results">
        Coming soon: <K href={home}>EMI calculator</K> and{" "}
        <K href={home}>loan calculator</K>,{" "}
        <K href={home}>calorie calculator</K>,{" "}
        <K href={home}>BMI calculator</K>,{" "}
        <K href={home}>tip calculator</K>,{" "}
        <K href={home}>split bill calculator</K>,{" "}
        <K href={home}>age calculator</K> and{" "}
        <K href={home}>percentage calculator</K>.
      </Section>

      <Section title="Free Developer Tools">
        Coming soon: <K href={home}>JSON formatter</K>,{" "}
        <K href={home}>regex tester</K>,{" "}
        <K href={home}>CSS gradient generator</K>,{" "}
        <K href={home}>strong password generator</K>,{" "}
        <K href={home}>htaccess generator</K>,{" "}
        <K href={home}>Base64 encoder</K> and{" "}
        <K href={home}>URL encoder and decoder</K>.
      </Section>

      <Section title="Free Social Media Tools">
        Coming soon: <K href={home}>YouTube thumbnail downloader</K>,{" "}
        <K href={home}>LinkedIn banner maker</K>,{" "}
        <K href={home}>Instagram post resizer</K>,{" "}
        <K href={home}>social media image resizer</K> and{" "}
        <K href={home}>Twitter header maker</K>.
      </Section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Why GetFreeToolsAI
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
          GetFreeToolsAI provides free online tools that work entirely in your
          browser. Unlike Smallpdf, which limits free users to 2 tasks per day,
          or iLovePDF, which has file size caps, GetFreeToolsAI has no daily
          limits, no file size restrictions, no watermarks, and no signup
          requirements. Every tool is 100% free forever. Your files never leave
          your device — all processing happens locally in your browser using
          modern WebAssembly and JavaScript technology. Whether you need to{" "}
          <K href="/pdf/compress">compress a PDF for email</K>,{" "}
          <K href="/image/compress">resize an image for a government form</K>,
          humanize AI text for your essay, or generate a QR code for your
          business — GetFreeToolsAI has the right free tool for you.
        </p>
      </section>
    </div>
  );
}
