import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "compress-images-without-losing-quality",
  category: "image",
  title: "How to Compress Images Without Losing Quality",
  description:
    "How image compression really works, how to hit an exact size like 100KB, and how to shrink photos for forms and the web without visible quality loss.",
  keywords:
    "compress image without losing quality, reduce image size, compress to 100kb, image compression guide, jpg vs png vs webp, optimise images for web",
  excerpt:
    "How compression works, how to hit an exact KB target, and how to shrink photos with no visible quality loss.",
  datePublished: "2026-06-04",
  dateModified: "2026-06-04",
  authorId: "team",
  readingTime: 7,
  tags: ["image compression", "file size", "web performance"],
  relatedTools: ["/image/compress", "/image/resize", "/image/convert"],
  relatedGuides: ["remove-background-from-images"],
  toc: [
    { id: "lossy-lossless", label: "Lossy vs lossless" },
    { id: "quality", label: "Why “without losing quality” is possible" },
    { id: "exact-size", label: "Hitting an exact KB target" },
    { id: "formats", label: "Choosing the right format" },
    { id: "steps", label: "Step-by-step" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Whether you&apos;re fitting a photo under a form&apos;s 100KB limit or speeding up a web
        page, the goal is the same: a much smaller file that still looks good. Here&apos;s how
        compression actually works and how to get the smallest file with no visible quality loss.
      </p>

      <h2 id="lossy-lossless">Lossy vs lossless compression</h2>
      <p>
        There are two families. <strong>Lossy</strong> compression (JPG, WebP) permanently discards
        information the eye barely notices to achieve dramatically smaller files. <strong>Lossless</strong>{" "}
        compression (PNG) keeps every pixel exactly, so files stay larger but perfect. For
        photographs, lossy is the right choice; for sharp graphics, logos and screenshots with text,
        lossless preserves crisp edges.
      </p>

      <h2 id="quality">Why “without losing quality” is achievable</h2>
      <p>
        Lossy compression has a quality dial. At high quality (roughly 80–95%), the data removed is
        invisible to the human eye on a typical screen — you get a 60–80% smaller file that looks
        identical. Quality only becomes visible (blocky artefacts, fuzzy edges) when you push
        compression aggressively. So “without losing quality” really means “staying in the range
        where the loss is imperceptible”.
      </p>

      <h2 id="exact-size">Hitting an exact file-size target (e.g. 100KB)</h2>
      <p>
        Government portals, exam sites and job applications often demand an exact maximum like 20KB,
        100KB or 200KB. Guessing at a quality percentage is frustrating. Our{" "}
        <Link href="/image/compress">image compressor</Link> lets you type the target size and runs a
        binary search across quality levels — downscaling only if it must — to land at or just under
        your limit while keeping the most detail possible.
      </p>
      <p>Typical real-world targets:</p>
      <table>
        <thead>
          <tr><th>Target</th><th>Common use</th></tr>
        </thead>
        <tbody>
          <tr><td>20–50KB</td><td>Passport/signature photos for exam &amp; visa forms</td></tr>
          <tr><td>100–200KB</td><td>Government portals, college admissions, bank KYC</td></tr>
          <tr><td>Under 1MB</td><td>Most job-application photo fields</td></tr>
          <tr><td>Under 100KB</td><td>Fast-loading web images (better Core Web Vitals)</td></tr>
        </tbody>
      </table>

      <h2 id="formats">Choosing the right format</h2>
      <ul>
        <li><strong>JPG</strong> — best all-rounder for photos; compresses aggressively and is accepted everywhere.</li>
        <li><strong>WebP</strong> — typically 25–35% smaller than JPG at the same quality; ideal for the web where supported.</li>
        <li><strong>PNG</strong> — keep for screenshots, logos and anything with transparency or sharp text.</li>
      </ul>
      <p>
        Need to switch formats first? Use the <Link href="/image/convert">image converter</Link>.
        If the image is far larger than it will be displayed, <Link href="/image/resize">resize the
        dimensions</Link> before compressing — a 4000px photo shown at 800px wastes most of its bytes.
      </p>

      <h2 id="steps">Step-by-step</h2>
      <ol>
        <li>Open the <Link href="/image/compress">image compressor</Link>.</li>
        <li>Upload your JPG, PNG or WebP.</li>
        <li>Choose “compress to target size” and enter your KB limit (or use the quality slider).</li>
        <li>Download — and check it still looks right at full size.</li>
      </ol>
      <p>Everything runs on your device; your photo is never uploaded.</p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Will compressing reduce quality?</strong> Lossy compression always trades some data, but at 80–95% quality the difference is invisible. The tool keeps the highest quality possible for your target size.</p>
      <p><strong>Can I compress to exactly 50KB?</strong> Yes — type the target and the tool lands at or just under it.</p>
      <p><strong>Does re-compressing a JPG hurt it?</strong> Yes; each save discards more data. Always compress once from the original.</p>
      <p><strong>Is it private?</strong> Compression runs entirely in your browser — nothing is uploaded.</p>
    </>
  ),
};

export default guide;
