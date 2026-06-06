import type { ReactNode } from "react";

/**
 * "Free [competitor] alternative" comparison pages. High commercial-intent SEO
 * targeting "<competitor> alternative" / "<competitor> free" searches, won on
 * our genuine differentiators: free forever, no signup, no watermark, no daily
 * limits, and 100% in-browser (files never uploaded).
 *
 * Comparison claims reflect competitors' publicly documented free tiers as of
 * mid-2026 and are phrased conservatively; a dated note appears on each page.
 */

export type CompareRow = {
  feature: string;
  us: string;
  them: string;
  /** true => our column is the favourable one (gets the accent check). */
  usWins?: boolean;
};

export type Comparison = {
  slug: string;
  competitor: string;
  /** SEO <title> */
  title: string;
  /** H1 */
  h1: string;
  description: string;
  keywords: string;
  /** short card blurb for the hub */
  excerpt: string;
  intro: ReactNode;
  rows: CompareRow[];
  /** featured tool hrefs to surface as the practical replacement */
  tools: string[];
  reasons: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

const PRIVATE = "100% in your browser — never uploaded";

export const comparisons: Comparison[] = [
  {
    slug: "smallpdf-alternative",
    competitor: "Smallpdf",
    title:
      "Free Smallpdf Alternative — No Signup, No Watermark, No Daily Limit | GetFreeToolsAI",
    h1: "A Free Smallpdf Alternative — No Signup, No Limits",
    description:
      "Looking for a free Smallpdf alternative? GetFreeToolsAI compresses, merges, splits and converts PDFs with no signup, no watermark and no daily task limit — and your files never leave your browser.",
    keywords:
      "smallpdf alternative, free smallpdf alternative, smallpdf free, smallpdf without account, compress pdf free no limit, smallpdf alternative no signup",
    excerpt:
      "Compress, merge, split and convert PDFs free — no account, no watermark, no daily cap, nothing uploaded.",
    intro: (
      <>
        <p>
          Smallpdf is a polished PDF suite, but its free tier caps how many
          tasks you can run per day, asks you to sign in for some features, and
          uploads your documents to its servers to process them. If you just
          want to compress or merge a PDF without those strings attached,
          GetFreeToolsAI is a genuinely free alternative that runs entirely in
          your browser.
        </p>
        <p>
          Every PDF tool here is free forever with no daily task limit, adds no
          watermark, and processes your file on your own device — so a contract,
          bank statement or ID scan is never sent to a server.
        </p>
      </>
    ),
    rows: [
      { feature: "Price", us: "Free forever", them: "Free tier, then paid plans", usWins: true },
      { feature: "Account / signup", us: "Never required", them: "Needed for some features", usWins: true },
      { feature: "Daily task limit", us: "None", them: "Free use is capped per day", usWins: true },
      { feature: "Watermark", us: "Never", them: "None on output", usWins: false },
      { feature: "File handling", us: PRIVATE, them: "Uploaded to their servers", usWins: true },
      { feature: "Works offline", us: "Yes, after first load", them: "No (server-based)", usWins: true },
      { feature: "PDF tools", us: "Compress, merge, split, convert, OCR, more", them: "Broad PDF suite", usWins: false },
    ],
    tools: ["/pdf/compress", "/pdf/merge", "/pdf/split", "/pdf/pdf-to-word"],
    reasons: [
      { title: "No daily limits", body: "Compress or merge as many PDFs as you want — there's no 2-task-a-day wall and no upgrade prompt." },
      { title: "Nothing is uploaded", body: "Files are processed locally with WebAssembly, so confidential documents never leave your device." },
      { title: "No signup, no watermark", body: "Open a tool and go. The PDF you download is clean — no account and no branding stamped on it." },
    ],
    faqs: [
      { q: "Is GetFreeToolsAI really free?", a: "Yes. Every PDF tool is free forever with no daily task limit, no premium tier and no credit card. There's nothing to upgrade to." },
      { q: "Do I need an account like Smallpdf?", a: "No. There's no signup or login of any kind — open any tool and start immediately." },
      { q: "Are my PDFs uploaded to a server?", a: "No. Unlike server-based tools, processing happens entirely in your browser, so your files never leave your device." },
      { q: "Will the output have a watermark?", a: "No. None of our tools add a watermark or branding to your files." },
    ],
    related: ["ilovepdf-alternative"],
  },
  {
    slug: "ilovepdf-alternative",
    competitor: "iLovePDF",
    title:
      "Free iLovePDF Alternative — No Account, No Watermark, No Limits | GetFreeToolsAI",
    h1: "A Free iLovePDF Alternative — Private & Unlimited",
    description:
      "A free iLovePDF alternative that runs in your browser. Compress, merge, split, rotate and convert PDFs with no signup, no watermark and no daily limits — files are never uploaded.",
    keywords:
      "ilovepdf alternative, free ilovepdf alternative, ilovepdf without account, ilovepdf free, merge pdf free no limit, pdf tools no upload",
    excerpt:
      "All the everyday PDF tools, free and unlimited, with local in-browser processing instead of uploads.",
    intro: (
      <>
        <p>
          iLovePDF offers a wide range of PDF tools, but free use is limited,
          larger files and batches push you toward a paid plan, and your
          documents are uploaded to its servers for processing. GetFreeToolsAI
          covers the same everyday jobs — compress, merge, split, rotate,
          convert — with no limits and no upload.
        </p>
        <p>
          Because everything runs locally in your browser, there&apos;s no
          queue, no round-trip to a server, and no copy of your file sitting in
          someone else&apos;s cloud.
        </p>
      </>
    ),
    rows: [
      { feature: "Price", us: "Free forever", them: "Free tier, then paid plans", usWins: true },
      { feature: "Account / signup", us: "Never required", them: "Needed for higher limits", usWins: true },
      { feature: "Task / size limits", us: "None (limited only by your device)", them: "Free tier limited", usWins: true },
      { feature: "Watermark", us: "Never", them: "None on output", usWins: false },
      { feature: "File handling", us: PRIVATE, them: "Uploaded to their servers", usWins: true },
      { feature: "Works offline", us: "Yes, after first load", them: "No (server-based)", usWins: true },
    ],
    tools: ["/pdf/merge", "/pdf/compress", "/pdf/split", "/pdf/rotate"],
    reasons: [
      { title: "Unlimited and free", body: "No per-day caps and no paywall on larger files — the only limit is your own device's memory." },
      { title: "Local-first privacy", body: "Your PDFs are processed on your device and never uploaded, which matters for contracts and personal records." },
      { title: "Fast, no queue", body: "There's no server round-trip, so tools respond instantly even on big documents." },
    ],
    faqs: [
      { q: "Is this a free iLovePDF alternative?", a: "Yes. The everyday PDF tools — compress, merge, split, rotate, convert — are free with no daily limits and no account." },
      { q: "Is there a file-size cap?", a: "There's no server-imposed cap because nothing is uploaded. Large PDFs are handled locally, limited only by your device's memory." },
      { q: "Do my files get uploaded?", a: "No. Every tool runs in your browser, so your documents never leave your device." },
      { q: "Are there watermarks?", a: "No. Output PDFs are clean, with no watermark or branding." },
    ],
    related: ["smallpdf-alternative"],
  },
  {
    slug: "tinypng-alternative",
    competitor: "TinyPNG",
    title:
      "Free TinyPNG Alternative — Compress Images Privately, No Upload | GetFreeToolsAI",
    h1: "A Free TinyPNG Alternative — No Upload, No Limits",
    description:
      "A free TinyPNG alternative that compresses JPG, PNG and WebP images in your browser. No upload, no monthly cap, and you can compress to an exact KB target — files never leave your device.",
    keywords:
      "tinypng alternative, free tinypng alternative, compress png free, compress image without upload, tinypng without upload, bulk image compressor free",
    excerpt:
      "Compress JPG, PNG and WebP — in bulk and to an exact KB size — without uploading a single file.",
    intro: (
      <>
        <p>
          TinyPNG is great at shrinking PNG and JPG files, but it uploads your
          images to its servers and limits free use (file size and batch count),
          with an API and paid plans beyond that. GetFreeToolsAI compresses JPG,
          PNG and WebP entirely in your browser — in bulk, with no upload and no
          monthly cap.
        </p>
        <p>
          You can also compress to an <strong>exact KB target</strong> (handy for
          forms and upload limits), resize, and convert between formats without
          ever sending a file to a server.
        </p>
      </>
    ),
    rows: [
      { feature: "Price", us: "Free forever", them: "Free tier, then paid/API", usWins: true },
      { feature: "Monthly / batch limit", us: "None", them: "Capped on free tier", usWins: true },
      { feature: "File handling", us: PRIVATE, them: "Uploaded to their servers", usWins: true },
      { feature: "Compress to exact KB", us: "Yes", them: "No", usWins: true },
      { feature: "Formats", us: "JPG, PNG, WebP", them: "PNG, JPG, WebP", usWins: false },
      { feature: "Bulk compression", us: "Yes, with ZIP download", them: "Yes (limited free)", usWins: true },
    ],
    tools: ["/image/compress", "/image/convert", "/image/resize"],
    reasons: [
      { title: "Nothing uploaded", body: "Images are compressed on your device, so private photos and screenshots never touch a server." },
      { title: "Exact-size targeting", body: "Type a KB target and the tool binary-searches quality to land at or under it — ideal for forms." },
      { title: "Unlimited bulk", body: "Drop in many images at once and download them all as a ZIP, with no monthly quota." },
    ],
    faqs: [
      { q: "Does this upload my images like TinyPNG?", a: "No. Compression runs entirely in your browser, so your images are never uploaded to any server." },
      { q: "Can I compress to an exact size?", a: "Yes. Enter a KB target (e.g. 100KB) and the compressor lands at or just under it while keeping the most detail possible." },
      { q: "Is there a monthly limit?", a: "No. There's no monthly cap or batch limit — compress as many images as you like." },
      { q: "Which formats are supported?", a: "JPG, PNG and WebP, with conversion between them available too." },
    ],
    related: ["remove-bg-alternative"],
  },
  {
    slug: "remove-bg-alternative",
    competitor: "remove.bg",
    title:
      "Free remove.bg Alternative — Full-Resolution, No Credits | GetFreeToolsAI",
    h1: "A Free remove.bg Alternative — Full-Res, No Credits",
    description:
      "A free remove.bg alternative that removes image backgrounds in your browser at full resolution — no credits, no signup, no upload. The AI runs locally on your device.",
    keywords:
      "remove.bg alternative, free remove.bg alternative, remove background free full resolution, background remover no signup, remove background without upload",
    excerpt:
      "Remove backgrounds at full resolution with on-device AI — no credits, no signup, no upload.",
    intro: (
      <>
        <p>
          remove.bg does a great job cutting out subjects, but full-resolution
          downloads cost credits or a subscription, and your image is uploaded
          to its servers. GetFreeToolsAI&apos;s background remover runs the AI
          model{" "}
          <strong>locally in your browser</strong>, so you get full-resolution
          results for free and your photo never leaves your device.
        </p>
        <p>
          Swap the background for transparent, white, black or any colour, then
          download — no credits, no account, no watermark.
        </p>
      </>
    ),
    rows: [
      { feature: "Price", us: "Free forever", them: "Credits / subscription for full-res", usWins: true },
      { feature: "Full-resolution output", us: "Always free", them: "Paid", usWins: true },
      { feature: "Account / signup", us: "Never required", them: "Account needed", usWins: true },
      { feature: "File handling", us: PRIVATE, them: "Uploaded to their servers", usWins: true },
      { feature: "Background replace", us: "Transparent / colour", them: "Transparent / colour", usWins: false },
    ],
    tools: ["/image/background-remover", "/image/crop", "/image/convert"],
    reasons: [
      { title: "Full-res, free", body: "Download the full-resolution cutout at no cost — there are no credits or subscriptions." },
      { title: "On-device AI", body: "The model runs in your browser, so your photo is never uploaded to a server." },
      { title: "Pick any background", body: "Keep it transparent or drop in white, black or a custom colour before downloading." },
    ],
    faqs: [
      { q: "Is full-resolution really free?", a: "Yes. Unlike credit-based tools, you download the full-resolution result for free, every time." },
      { q: "Does it upload my photo?", a: "No. The background-removal AI runs locally in your browser, so your image never leaves your device." },
      { q: "Do I need an account?", a: "No signup or login is required — open the tool and start." },
      { q: "Can I change the background colour?", a: "Yes — transparent, white, black or a custom colour, then download as PNG." },
    ],
    related: ["tinypng-alternative"],
  },
];

export const getComparison = (slug: string) =>
  comparisons.find((c) => c.slug === slug);
