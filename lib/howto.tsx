import type { ReactNode } from "react";

/**
 * Niche-specific "how to" landing pages under /how-to/[slug].
 *
 * These target hyper-specific long-tail queries that tie a tool to a real-world
 * context big generic tool sites ignore — exam/form photo & signature specs,
 * platform image sizes, visa/passport photo sizes by country, and context-based
 * PDF size limits. Each page states the exact spec, links to the tool (or a
 * pre-armed compress-to-size page), and answers the niche's FAQs.
 *
 * Specs use widely published standard values; requirements can change, so every
 * page shows a "confirm against the official source" note. Nothing is uploaded —
 * all the linked tools run in the browser.
 */

export type HowToNiche = "exam" | "platform" | "visa" | "pdf";

export interface HowToNicheMeta {
  id: HowToNiche;
  label: string;
  blurb: string;
}

export const HOWTO_NICHES: HowToNicheMeta[] = [
  { id: "exam", label: "Exam & form photos", blurb: "Exact photo and signature size, dimensions and format for exam and recruitment applications." },
  { id: "platform", label: "Social & platform sizes", blurb: "The right image dimensions for profile pictures, thumbnails, banners and posts." },
  { id: "visa", label: "Visa & passport photos", blurb: "Photo size, dimensions and background rules for visas and passports by country." },
  { id: "pdf", label: "PDF size for uploads", blurb: "Get a PDF under the size limit for a specific portal, form or upload." },
];

/** A single required spec line rendered in the spec box. */
export type SpecRow = { label: string; value: string };

export interface HowTo {
  slug: string;
  niche: HowToNiche;
  /** SEO <title> */
  title: string;
  /** H1 */
  h1: string;
  description: string;
  keywords: string;
  /** short card blurb for the hub */
  excerpt: string;
  intro: ReactNode;
  /** the exact requirement, shown as a spec box */
  spec: SpecRow[];
  /** ordered step-by-step (also emitted as HowTo structured data) */
  steps: string[];
  /** tool hrefs to surface (pre-armed compress-to-size pages allowed) */
  tools: string[];
  faqs: { q: string; a: string }[];
  related: string[];
}

// ── Exam & recruitment form specs (India) ───────────────────────────────────
const exam: HowTo[] = [
  {
    slug: "resize-photo-and-signature-for-ssc",
    niche: "exam",
    title: "Photo & Signature Size for SSC Applications (Free Resizer)",
    h1: "Resize Your Photo & Signature for SSC Forms",
    description:
      "Get your photo and signature to the exact size SSC online applications need — dimensions, KB limit and format — free and in your browser, with nothing uploaded.",
    keywords:
      "ssc photo size, ssc signature size, resize photo for ssc, ssc cgl photo signature size, ssc photo 20kb, ssc signature 20kb",
    excerpt: "Exact photo & signature dimensions and KB limits for SSC online forms.",
    intro: (
      <>
        <p>
          SSC online applications (CGL, CHSL, MTS and others) reject a photo or
          signature that is the wrong dimensions, format or file size. Below are
          the commonly required specs, and the free tools to hit them — your
          image is resized and compressed in your browser and never uploaded.
        </p>
      </>
    ),
    spec: [
      { label: "Photo dimensions", value: "≈ 3.5 cm × 4.5 cm (passport style)" },
      { label: "Photo file size", value: "20 KB – 50 KB" },
      { label: "Signature file size", value: "10 KB – 20 KB" },
      { label: "Format", value: "JPEG / JPG" },
    ],
    steps: [
      "Crop your photo to a passport-style 3.5:4.5 ratio, then resize it to the required pixels.",
      "Compress the photo to fit the 20–50 KB limit using the pre-armed 50 KB compressor.",
      "Sign on white paper, photograph or scan it, and crop tightly to the signature.",
      "Compress the signature to fit 10–20 KB, then upload both to the SSC portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/50kb"],
    faqs: [
      { q: "What photo size does SSC need?", a: "Typically a passport-style photo around 3.5 × 4.5 cm saved as JPEG between 20 KB and 50 KB. Always check the current notification for exact values." },
      { q: "What is the SSC signature size?", a: "Usually a JPEG between 10 KB and 20 KB. Sign on white paper, crop tightly, then compress to fit." },
      { q: "Is my photo uploaded anywhere?", a: "No. Resizing and compression run entirely in your browser, so your photo and signature never leave your device." },
    ],
    related: ["resize-photo-and-signature-for-upsc", "resize-photo-and-signature-for-neet"],
  },
  {
    slug: "resize-photo-and-signature-for-upsc",
    niche: "exam",
    title: "Photo & Signature Size for UPSC Applications (Free Resizer)",
    h1: "Resize Your Photo & Signature for UPSC Forms",
    description:
      "Resize your photo and signature to the size UPSC online applications require — dimensions, KB range and format — free, in your browser, with nothing uploaded.",
    keywords:
      "upsc photo size, upsc signature size, resize photo for upsc, upsc photo 300kb, upsc signature 20kb, upsc application photo",
    excerpt: "Photo & signature dimensions and KB limits for UPSC online forms.",
    intro: (
      <>
        <p>
          UPSC online forms need a recent photo and a signature within specific
          size limits, or the upload fails. Here are the usual specs and the free
          tools to match them — everything runs locally in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Photo file size", value: "20 KB – 300 KB" },
      { label: "Signature file size", value: "20 KB – 300 KB" },
      { label: "Format", value: "JPG / JPEG" },
      { label: "Note", value: "Recent photo, plain background, name & date often required on it" },
    ],
    steps: [
      "Crop the photo to a clean head-and-shoulders frame on a plain background.",
      "Resize to the required pixel dimensions, then compress to sit within the KB range.",
      "Scan or photograph your signature on white paper and crop it tightly.",
      "Compress the signature to fit, then upload both files to the UPSC portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/200kb"],
    faqs: [
      { q: "What is the UPSC photo size?", a: "Commonly a JPG between 20 KB and 300 KB with a plain background; recent notifications sometimes require your name and the date printed on the photo. Confirm in the current notice." },
      { q: "What signature size does UPSC need?", a: "Usually a JPG within the same 20–300 KB window. Sign on white paper, crop tightly, then compress." },
      { q: "Are my files private?", a: "Yes — the photo and signature are processed in your browser and never uploaded." },
    ],
    related: ["resize-photo-and-signature-for-ssc", "resize-photo-and-signature-for-ibps"],
  },
  {
    slug: "resize-photo-and-signature-for-neet",
    niche: "exam",
    title: "Photo & Signature Size for NEET / NTA Forms (Free Resizer)",
    h1: "Resize Your Photo & Signature for NEET (NTA) Forms",
    description:
      "Get your photo and signature to NEET/NTA specifications — dimensions, KB range and format — free and in your browser, with nothing uploaded to a server.",
    keywords:
      "neet photo size, neet signature size, nta photo size, resize photo for neet, neet postcard photo, neet photo 10kb to 200kb",
    excerpt: "Photo (passport & postcard) and signature specs for NEET/NTA forms.",
    intro: (
      <>
        <p>
          NEET and other NTA exams ask for a passport photo, sometimes a postcard
          (4×6) photo, and a signature — each within set size limits. Here are the
          typical specs and the free tools to hit them, all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Passport photo size", value: "10 KB – 200 KB" },
      { label: "Postcard photo (4×6 in)", value: "10 KB – 200 KB (if required)" },
      { label: "Signature file size", value: "4 KB – 30 KB" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the passport photo to 3.5:4.5 and, if needed, prepare a 4×6 postcard version.",
      "Resize to the required pixels and compress to sit within 10–200 KB.",
      "Photograph or scan your signature on white paper and crop it tightly.",
      "Compress the signature to fit 4–30 KB, then upload to the NTA portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What photo size is needed for NEET?", a: "Usually a passport photo as JPG between 10 KB and 200 KB, plus a postcard (4×6) photo in some years. Check the current NTA information bulletin." },
      { q: "What is the NEET signature size?", a: "Typically a JPG between 4 KB and 30 KB. Sign on white paper, crop tightly, then compress." },
      { q: "Does anything get uploaded?", a: "No. Everything is processed in your browser; your images never leave your device." },
    ],
    related: ["resize-photo-and-signature-for-ssc", "resize-photo-and-signature-for-gate"],
  },
  {
    slug: "resize-photo-and-signature-for-ibps",
    niche: "exam",
    title: "Photo & Signature Size for IBPS / Bank Exams (Free Resizer)",
    h1: "Resize Your Photo & Signature for IBPS Bank Forms",
    description:
      "Resize your photo and signature to IBPS bank-exam specifications — dimensions, KB range and format — free, in your browser, with nothing uploaded.",
    keywords:
      "ibps photo size, ibps signature size, bank exam photo size, resize photo for ibps, ibps photo 20kb to 50kb, sbi po photo size",
    excerpt: "Photo, signature (and thumb/hand-writing) specs for IBPS bank exams.",
    intro: (
      <>
        <p>
          IBPS and bank recruitment forms (PO, Clerk, SBI and others) require a
          photo, signature and sometimes a left-thumb impression and a
          handwritten declaration — each within tight size limits. Here are the
          usual specs and the free tools to match them.
        </p>
      </>
    ),
    spec: [
      { label: "Photo file size", value: "20 KB – 50 KB (≈ 200 × 230 px)" },
      { label: "Signature file size", value: "10 KB – 20 KB" },
      { label: "Thumb impression", value: "20 KB – 50 KB (if required)" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the photo to roughly 200 × 230 px on a light background.",
      "Compress it to fit the 20–50 KB limit with the pre-armed 50 KB compressor.",
      "Scan or photograph the signature (and thumb impression) on white paper and crop tightly.",
      "Compress each to its limit, then upload to the IBPS/bank portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/50kb"],
    faqs: [
      { q: "What is the IBPS photo size?", a: "Usually a JPG around 200 × 230 px between 20 KB and 50 KB. Confirm the exact values in the current advertisement." },
      { q: "What signature size do bank exams need?", a: "Typically a JPG between 10 KB and 20 KB, signed on white paper and cropped tightly." },
      { q: "Is my photo uploaded?", a: "No — resizing and compression run in your browser, so nothing leaves your device." },
    ],
    related: ["resize-photo-and-signature-for-ssc", "resize-photo-and-signature-for-rrb"],
  },
  {
    slug: "resize-photo-and-signature-for-rrb",
    niche: "exam",
    title: "Photo & Signature Size for RRB / Railway Forms (Free Resizer)",
    h1: "Resize Your Photo & Signature for RRB Railway Forms",
    description:
      "Get your photo and signature to RRB railway-recruitment specifications — dimensions, KB range and format — free and in your browser, with nothing uploaded.",
    keywords:
      "rrb photo size, railway exam photo size, rrb signature size, resize photo for rrb, rrb ntpc photo size, railway group d photo size",
    excerpt: "Photo & signature dimensions and KB limits for RRB railway forms.",
    intro: (
      <>
        <p>
          RRB railway recruitment (NTPC, Group D, ALP) forms require a recent
          colour photo and a signature within set size limits. Here are the
          typical specs and the free tools to hit them, all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Photo file size", value: "15 KB – 40 KB" },
      { label: "Photo dimensions", value: "≈ 35 mm × 45 mm, colour, plain background" },
      { label: "Signature file size", value: "10 KB – 40 KB" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the photo to a 35:45 passport ratio on a plain light background.",
      "Resize and compress it to sit within the 15–40 KB limit.",
      "Photograph or scan your signature on white paper and crop tightly.",
      "Compress the signature to fit, then upload both to the RRB portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/50kb"],
    faqs: [
      { q: "What photo size does RRB need?", a: "Commonly a recent colour JPG around 35 × 45 mm between 15 KB and 40 KB. Check the current CEN notice for exact values." },
      { q: "What is the RRB signature size?", a: "Usually a JPG between 10 KB and 40 KB, signed on white paper and cropped tightly." },
      { q: "Does it upload my files?", a: "No. Everything runs in your browser; your photo and signature never leave your device." },
    ],
    related: ["resize-photo-and-signature-for-ibps", "resize-photo-and-signature-for-neet"],
  },
  {
    slug: "resize-photo-and-signature-for-gate",
    niche: "exam",
    title: "Photo & Signature Size for GATE Applications (Free Resizer)",
    h1: "Resize Your Photo & Signature for GATE Forms",
    description:
      "Resize your photo and signature to GATE specifications — dimensions, KB range and format — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "gate photo size, gate signature size, resize photo for gate, gate application photo, gate photo dimensions, gate signature dimensions",
    excerpt: "Photo & signature dimensions and KB limits for GATE online forms.",
    intro: (
      <>
        <p>
          GATE online applications need a good-quality photo and signature within
          defined pixel and file-size limits. Below are the usual specs and the
          free tools to match them — your images are processed in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Photo dimensions", value: "≈ 480 × 640 px (3.5 × 4.5 cm)" },
      { label: "Photo file size", value: "up to ~1 MB (portal-dependent)" },
      { label: "Signature dimensions", value: "≈ 160 × 560 px" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the photo to a 3.5:4.5 frame and resize to about 480 × 640 px.",
      "If it exceeds the portal's file-size limit, compress it to fit.",
      "Scan or photograph the signature on white paper and crop to a wide strip.",
      "Resize the signature to roughly 160 × 560 px, then upload both.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/200kb"],
    faqs: [
      { q: "What is the GATE photo size?", a: "Usually around 480 × 640 px (3.5 × 4.5 cm) as JPG. The file-size cap varies by year, so check the current GATE brochure." },
      { q: "What signature dimensions does GATE need?", a: "Commonly about 160 × 560 px as JPG — a wide strip of your signature on white paper." },
      { q: "Is anything uploaded?", a: "No. Cropping, resizing and compression all happen in your browser." },
    ],
    related: ["resize-photo-and-signature-for-neet", "resize-photo-and-signature-for-upsc"],
  },
  {
    slug: "resize-photo-and-signature-for-jee-main",
    niche: "exam",
    title: "Photo & Signature Size for JEE Main (NTA) — Free Resizer",
    h1: "Resize Your Photo & Signature for JEE Main Forms",
    description:
      "Get your photo and signature to JEE Main (NTA) specifications — dimensions, KB range and format — free and in your browser, with nothing uploaded to a server.",
    keywords:
      "jee main photo size, jee main signature size, nta photo size, resize photo for jee main, jee photo 10kb to 200kb, jee main application photo",
    excerpt: "Photo & signature specs for JEE Main (NTA) online applications.",
    intro: (
      <>
        <p>
          JEE Main and other NTA engineering exams need a passport photo and a
          signature within set size limits, or the upload is rejected. Here are
          the usual specs and the free tools to hit them, all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Photo file size", value: "10 KB – 200 KB" },
      { label: "Signature file size", value: "4 KB – 30 KB" },
      { label: "Photo", value: "Recent passport-style, 80% face, light background" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the photo to a passport 3.5:4.5 frame on a light background.",
      "Resize and compress it to sit within the 10–200 KB range.",
      "Photograph or scan your signature on white paper and crop it tightly.",
      "Compress the signature to fit 4–30 KB, then upload both to the NTA portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What photo size is needed for JEE Main?", a: "Usually a passport JPG between 10 KB and 200 KB with a light background. Confirm the exact values in the current NTA information bulletin." },
      { q: "What is the JEE Main signature size?", a: "Typically a JPG between 4 KB and 30 KB. Sign on white paper, crop tightly, then compress." },
      { q: "Is my photo uploaded?", a: "No — resizing and compression run in your browser, so nothing leaves your device." },
    ],
    related: ["resize-photo-and-signature-for-neet", "resize-photo-and-signature-for-gate"],
  },
  {
    slug: "resize-photo-and-signature-for-cat",
    niche: "exam",
    title: "Photo Size for CAT (MBA) Applications — Free Resizer",
    h1: "Resize Your Photo for CAT Applications",
    description:
      "Get your photo to CAT (IIM MBA) application specifications — dimensions, KB range and format — free and in your browser, with nothing uploaded to a server.",
    keywords:
      "cat photo size, cat application photo, resize photo for cat exam, iim cat photo size, cat exam photo dimensions, mba entrance photo size",
    excerpt: "Photo dimensions and file-size specs for CAT (IIM) applications.",
    intro: (
      <>
        <p>
          The CAT application for IIM admissions needs a recent photograph within
          set dimensions and file size. Here are the usual specs and the free
          tools to match them, all done in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Photo dimensions", value: "≈ 1200 × 1200 px (square), recent" },
      { label: "Photo file size", value: "up to ~80 KB (portal-dependent)" },
      { label: "Background", value: "Plain, light colour" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the photo to a clean square on a plain light background.",
      "Resize it to the required dimensions.",
      "Compress it to sit under the portal's file-size limit, then upload.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What photo size is needed for CAT?", a: "A recent photograph, commonly a square up to around 80 KB. Confirm the exact dimensions and size in the current CAT notification." },
      { q: "Can I use the same photo for other MBA exams?", a: "Often yes, if it meets each exam's dimension and size rules — check XAT, NMAT and others individually." },
      { q: "Are my files private?", a: "Yes — everything runs in your browser and is never uploaded." },
    ],
    related: ["resize-photo-and-signature-for-gate", "resize-photo-and-signature-for-clat"],
  },
  {
    slug: "resize-photo-and-signature-for-ctet",
    niche: "exam",
    title: "Photo & Signature Size for CTET (Teaching) — Free Resizer",
    h1: "Resize Your Photo & Signature for CTET Forms",
    description:
      "Get your photo and signature to CTET teaching-exam specifications — dimensions, KB range and format — free and in your browser, with nothing uploaded.",
    keywords:
      "ctet photo size, ctet signature size, resize photo for ctet, ctet application photo, teaching exam photo size, ctet photo dimensions",
    excerpt: "Photo & signature file-size specs for CTET teaching-exam forms.",
    intro: (
      <>
        <p>
          CTET (Central Teacher Eligibility Test) applications require a photo and
          a signature within specific size limits. Here are the usual specs and
          the free tools to hit them, all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Photo file size", value: "10 KB – 100 KB" },
      { label: "Signature file size", value: "3 KB – 30 KB" },
      { label: "Photo", value: "Recent passport-style, light background" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the photo to a passport 3.5:4.5 frame on a light background.",
      "Resize and compress it to sit within 10–100 KB.",
      "Scan or photograph your signature on white paper and crop it tightly.",
      "Compress the signature to fit 3–30 KB, then upload both to the CTET portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/50kb"],
    faqs: [
      { q: "What is the CTET photo size?", a: "Usually a passport JPG between 10 KB and 100 KB. Confirm the current bulletin for exact values." },
      { q: "What signature size does CTET need?", a: "Typically a JPG between 3 KB and 30 KB, signed on white paper and cropped tightly." },
      { q: "Does it upload my files?", a: "No — everything runs in your browser." },
    ],
    related: ["resize-photo-and-signature-for-rrb", "resize-photo-and-signature-for-ibps"],
  },
  {
    slug: "resize-photo-and-signature-for-clat",
    niche: "exam",
    title: "Photo & Signature Size for CLAT (Law) — Free Resizer",
    h1: "Resize Your Photo & Signature for CLAT Forms",
    description:
      "Get your photo and signature to CLAT law-entrance specifications — dimensions, KB range and format — free and in your browser, with nothing uploaded to a server.",
    keywords:
      "clat photo size, clat signature size, resize photo for clat, clat application photo, law entrance photo size, clat photo dimensions",
    excerpt: "Photo & signature file-size specs for CLAT law-entrance forms.",
    intro: (
      <>
        <p>
          CLAT (Common Law Admission Test) applications need a recent photo and a
          signature within set size limits. Here are the usual specs and the free
          tools to hit them, all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Photo file size", value: "10 KB – 200 KB" },
      { label: "Signature file size", value: "10 KB – 100 KB" },
      { label: "Photo", value: "Recent passport-style, light background" },
      { label: "Format", value: "JPG / JPEG" },
    ],
    steps: [
      "Crop the photo to a passport 3.5:4.5 frame on a light background.",
      "Resize and compress it to sit within 10–200 KB.",
      "Scan or photograph your signature on white paper and crop it tightly.",
      "Compress the signature to fit, then upload both to the CLAT portal.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What is the CLAT photo size?", a: "Usually a passport JPG between 10 KB and 200 KB. Confirm the current notification for exact values." },
      { q: "What signature size does CLAT need?", a: "Typically a JPG between 10 KB and 100 KB, signed on white paper and cropped tightly." },
      { q: "Are my files private?", a: "Yes — everything runs in your browser and is never uploaded." },
    ],
    related: ["resize-photo-and-signature-for-cat", "resize-photo-and-signature-for-upsc"],
  },
];

// ── Social / platform image sizes ───────────────────────────────────────────
const platform: HowTo[] = [
  {
    slug: "resize-image-for-whatsapp-dp",
    niche: "platform",
    title: "WhatsApp DP Size — Resize Your Profile Photo (Free)",
    h1: "Resize an Image for Your WhatsApp DP",
    description:
      "Crop and resize any photo to the perfect square for a crisp WhatsApp DP (profile photo) — free, in your browser, with nothing uploaded.",
    keywords:
      "whatsapp dp size, whatsapp profile photo size, resize image for whatsapp dp, whatsapp dp dimensions, square photo for whatsapp",
    excerpt: "The square dimensions for a sharp, un-cropped WhatsApp profile photo.",
    intro: (
      <>
        <p>
          WhatsApp shows your DP as a circle cropped from a square, so a
          non-square photo gets awkwardly cut off. Crop to a square and resize,
          and your profile photo stays sharp and centred — all done in your
          browser.
        </p>
      </>
    ),
    spec: [
      { label: "Shape", value: "Square (1:1), shown as a circle" },
      { label: "Recommended size", value: "500 × 500 px (min ~192 × 192 px)" },
      { label: "Keep the subject", value: "Centred, away from the edges" },
      { label: "Format", value: "JPG or PNG" },
    ],
    steps: [
      "Crop your photo to a 1:1 square with the face or subject centred.",
      "Resize the square to 500 × 500 px for a crisp result.",
      "Save and set it as your WhatsApp DP.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What is the best WhatsApp DP size?", a: "A 1:1 square around 500 × 500 px. WhatsApp crops the DP to a circle, so keep the subject centred." },
      { q: "Why is my WhatsApp DP getting cropped?", a: "Because the photo isn't square — WhatsApp fits a circle inside a square, cutting the edges. Crop to 1:1 first." },
      { q: "Is my photo uploaded?", a: "No — cropping and resizing run in your browser, so nothing leaves your device." },
    ],
    related: ["resize-image-for-instagram-post", "resize-image-for-youtube-thumbnail"],
  },
  {
    slug: "resize-image-for-youtube-thumbnail",
    niche: "platform",
    title: "YouTube Thumbnail Size — 1280×720 (Free Resizer)",
    h1: "Resize an Image to YouTube Thumbnail Size",
    description:
      "Resize any image to the recommended 1280 × 720 YouTube thumbnail size (16:9) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "youtube thumbnail size, youtube thumbnail dimensions, 1280x720 thumbnail, resize image for youtube thumbnail, youtube thumbnail 16:9",
    excerpt: "The recommended 1280×720 (16:9) size for a crisp YouTube thumbnail.",
    intro: (
      <>
        <p>
          YouTube recommends a 1280 × 720 thumbnail (16:9), and staying under the
          2 MB limit keeps it sharp. Crop to 16:9 and resize, and your thumbnail
          looks crisp on every device — all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Dimensions", value: "1280 × 720 px" },
      { label: "Aspect ratio", value: "16:9" },
      { label: "Max file size", value: "2 MB" },
      { label: "Format", value: "JPG, PNG or GIF" },
    ],
    steps: [
      "Crop your image to a 16:9 aspect ratio.",
      "Resize it to exactly 1280 × 720 px.",
      "If it's over 2 MB, compress it, then upload it as your thumbnail.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What size should a YouTube thumbnail be?", a: "1280 × 720 px at a 16:9 ratio, kept under 2 MB, as JPG, PNG or GIF." },
      { q: "What's the minimum thumbnail width?", a: "YouTube recommends at least 640 px wide, but 1280 px keeps it sharp on large screens." },
      { q: "Are my images uploaded?", a: "No. Cropping, resizing and compression all run in your browser." },
    ],
    related: ["resize-image-for-instagram-post", "resize-image-for-facebook-cover"],
  },
  {
    slug: "resize-image-for-instagram-post",
    niche: "platform",
    title: "Instagram Post Size — Square & Portrait (Free Resizer)",
    h1: "Resize an Image for an Instagram Post",
    description:
      "Resize photos to the right Instagram size — 1080 × 1080 square or 1080 × 1350 portrait — free, in your browser, with nothing uploaded.",
    keywords:
      "instagram post size, instagram image size, 1080x1080, instagram portrait size 1080x1350, resize image for instagram",
    excerpt: "Square (1080×1080) and portrait (1080×1350) sizes for Instagram posts.",
    intro: (
      <>
        <p>
          Instagram uploads look best at 1080 px wide — square for feed posts,
          portrait for maximum screen space. Crop to the right ratio and resize
          so Instagram doesn&apos;t recompress or crop your photo awkwardly.
        </p>
      </>
    ),
    spec: [
      { label: "Square post", value: "1080 × 1080 px (1:1)" },
      { label: "Portrait post", value: "1080 × 1350 px (4:5)" },
      { label: "Landscape post", value: "1080 × 566 px (1.91:1)" },
      { label: "Format", value: "JPG or PNG" },
    ],
    steps: [
      "Pick your layout — square, portrait or landscape — and crop to that ratio.",
      "Resize the width to 1080 px (height follows the ratio).",
      "Save and upload to Instagram.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What is the best Instagram post size?", a: "1080 px wide — 1080 × 1080 for square, 1080 × 1350 for portrait, or 1080 × 566 for landscape." },
      { q: "Why does Instagram crop my photo?", a: "Because it isn't a supported ratio. Crop to 1:1, 4:5 or 1.91:1 first so nothing is cut off." },
      { q: "Is my photo uploaded to your server?", a: "No — everything runs in your browser." },
    ],
    related: ["resize-image-for-whatsapp-dp", "resize-image-for-youtube-thumbnail"],
  },
  {
    slug: "resize-image-for-linkedin-banner",
    niche: "platform",
    title: "LinkedIn Banner Size — 1584×396 (Free Resizer)",
    h1: "Resize an Image for a LinkedIn Banner",
    description:
      "Resize any image to the 1584 × 396 LinkedIn banner (cover) size — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "linkedin banner size, linkedin cover photo size, 1584x396, resize image for linkedin banner, linkedin background image size",
    excerpt: "The 1584×396 size for a crisp LinkedIn profile banner.",
    intro: (
      <>
        <p>
          LinkedIn&apos;s profile banner is 1584 × 396 px, and parts are hidden
          behind your profile photo and text on mobile. Crop to 4:1 and resize,
          keeping key elements away from the lower-left, for a clean banner.
        </p>
      </>
    ),
    spec: [
      { label: "Dimensions", value: "1584 × 396 px" },
      { label: "Aspect ratio", value: "4:1" },
      { label: "Keep clear", value: "Lower-left (profile photo overlaps there)" },
      { label: "Format", value: "JPG or PNG" },
    ],
    steps: [
      "Crop your image to a 4:1 aspect ratio.",
      "Resize it to exactly 1584 × 396 px.",
      "Keep text away from the lower-left, then upload it as your banner.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What size is a LinkedIn banner?", a: "1584 × 396 px at a 4:1 ratio, as JPG or PNG." },
      { q: "Why is part of my LinkedIn banner hidden?", a: "Your profile photo and name overlap the lower-left, so keep important content out of that corner." },
      { q: "Do you upload my image?", a: "No — resizing runs entirely in your browser." },
    ],
    related: ["resize-image-for-facebook-cover", "resize-image-for-twitter-header"],
  },
  {
    slug: "resize-image-for-facebook-cover",
    niche: "platform",
    title: "Facebook Cover Photo Size — 851×315 (Free Resizer)",
    h1: "Resize an Image for a Facebook Cover Photo",
    description:
      "Resize any image to the Facebook cover-photo size (851 × 315 desktop) — free, in your browser, with nothing uploaded.",
    keywords:
      "facebook cover photo size, facebook cover size, 851x315, resize image for facebook cover, facebook banner size",
    excerpt: "The 851×315 desktop size for a sharp Facebook cover photo.",
    intro: (
      <>
        <p>
          A Facebook cover photo displays at 851 × 315 px on desktop and is
          cropped differently on mobile. Crop to about 2.7:1 and resize, keeping
          key content centred so it survives both layouts.
        </p>
      </>
    ),
    spec: [
      { label: "Desktop size", value: "851 × 315 px" },
      { label: "Uploads best at", value: "1200 × 445 px (sharper)" },
      { label: "Keep the subject", value: "Centred (mobile crops the sides)" },
      { label: "Format", value: "JPG or PNG" },
    ],
    steps: [
      "Crop your image to roughly a 2.7:1 ratio with the subject centred.",
      "Resize it to 1200 × 445 px for a crisp result on all screens.",
      "Save and upload it as your cover photo.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What size is a Facebook cover photo?", a: "851 × 315 px on desktop; uploading at 1200 × 445 px keeps it sharp. Mobile crops the sides, so centre the subject." },
      { q: "Why does my cover photo look blurry?", a: "Facebook compresses large uploads — resizing to the right size yourself first keeps it crisp." },
      { q: "Is my photo uploaded?", a: "No — everything runs in your browser." },
    ],
    related: ["resize-image-for-linkedin-banner", "resize-image-for-twitter-header"],
  },
  {
    slug: "resize-image-for-twitter-header",
    niche: "platform",
    title: "X (Twitter) Header Size — 1500×500 (Free Resizer)",
    h1: "Resize an Image for an X (Twitter) Header",
    description:
      "Resize any image to the 1500 × 500 X (Twitter) header size (3:1) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "twitter header size, x header size, 1500x500, resize image for twitter header, twitter banner size, x banner dimensions",
    excerpt: "The 1500×500 (3:1) size for a clean X/Twitter header.",
    intro: (
      <>
        <p>
          The X (Twitter) header is 1500 × 500 px (3:1), with the lower-left
          covered by your profile photo and name. Crop to 3:1 and resize, keeping
          key content clear of that corner.
        </p>
      </>
    ),
    spec: [
      { label: "Dimensions", value: "1500 × 500 px" },
      { label: "Aspect ratio", value: "3:1" },
      { label: "Keep clear", value: "Lower-left (avatar & name overlap)" },
      { label: "Format", value: "JPG or PNG" },
    ],
    steps: [
      "Crop your image to a 3:1 aspect ratio.",
      "Resize it to exactly 1500 × 500 px.",
      "Keep important content out of the lower-left, then upload it as your header.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What size is an X/Twitter header?", a: "1500 × 500 px at a 3:1 ratio, as JPG or PNG." },
      { q: "Why is part of my header hidden?", a: "Your profile photo and name overlap the lower-left corner, so keep it clear there." },
      { q: "Are my images uploaded?", a: "No — resizing runs in your browser." },
    ],
    related: ["resize-image-for-linkedin-banner", "resize-image-for-facebook-cover"],
  },
  {
    slug: "resize-image-for-pinterest-pin",
    niche: "platform",
    title: "Pinterest Pin Size — 1000×1500 (2:3) Free Resizer",
    h1: "Resize an Image for a Pinterest Pin",
    description:
      "Resize any image to the recommended 1000 × 1500 Pinterest pin size (2:3 ratio) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "pinterest pin size, pinterest image size, 1000x1500, 2:3 pin ratio, resize image for pinterest, pinterest pin dimensions",
    excerpt: "The recommended 1000×1500 (2:3) size for a Pinterest pin.",
    intro: (
      <>
        <p>
          Pinterest favours tall pins at a 2:3 ratio — 1000 × 1500 px is the sweet
          spot. Taller than 2:3 gets truncated in the feed. Crop to 2:3 and
          resize so your pin shows in full — all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Recommended size", value: "1000 × 1500 px" },
      { label: "Aspect ratio", value: "2:3" },
      { label: "Avoid", value: "Ratios taller than 2:3 (get cut off)" },
      { label: "Format", value: "JPG or PNG" },
    ],
    steps: [
      "Crop your image to a 2:3 aspect ratio.",
      "Resize it to 1000 × 1500 px.",
      "Save and upload it as a pin.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What is the best Pinterest pin size?", a: "1000 × 1500 px at a 2:3 ratio. Taller pins can be truncated in the feed." },
      { q: "Can I use a square image?", a: "You can, but tall 2:3 pins take up more feed space and typically perform better." },
      { q: "Is my image uploaded?", a: "No — cropping and resizing run in your browser." },
    ],
    related: ["resize-image-for-instagram-post", "resize-image-for-youtube-thumbnail"],
  },
  {
    slug: "resize-image-for-twitch-banner",
    niche: "platform",
    title: "Twitch Banner Size — 1200×480 (Free Resizer)",
    h1: "Resize an Image for a Twitch Banner",
    description:
      "Resize any image to the Twitch profile banner size (1200 × 480) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "twitch banner size, twitch profile banner, 1200x480, resize image for twitch, twitch banner dimensions, twitch header size",
    excerpt: "The 1200×480 size for a crisp Twitch profile banner.",
    intro: (
      <>
        <p>
          A Twitch profile banner displays at 1200 × 480 px (2.5:1). Crop to that
          ratio and resize so your banner looks sharp on your channel page — all
          done in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Dimensions", value: "1200 × 480 px" },
      { label: "Aspect ratio", value: "2.5:1" },
      { label: "Max file size", value: "10 MB" },
      { label: "Format", value: "JPG or PNG" },
    ],
    steps: [
      "Crop your image to a 2.5:1 aspect ratio.",
      "Resize it to exactly 1200 × 480 px.",
      "Save and upload it as your channel banner.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What size is a Twitch banner?", a: "1200 × 480 px (2.5:1), as JPG or PNG, under 10 MB." },
      { q: "What about a Twitch offline banner?", a: "The video-player offline banner is 1920 × 1080 px (16:9) — different from the profile banner." },
      { q: "Are my images uploaded?", a: "No — resizing runs in your browser." },
    ],
    related: ["resize-image-for-youtube-thumbnail", "resize-image-for-twitter-header"],
  },
  {
    slug: "resize-image-for-discord-banner",
    niche: "platform",
    title: "Discord Banner Size — 960×540 (Free Resizer)",
    h1: "Resize an Image for a Discord Banner",
    description:
      "Resize any image to the Discord profile/server banner size (960 × 540, 16:9) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "discord banner size, discord profile banner, discord server banner, 960x540, resize image for discord, discord banner dimensions",
    excerpt: "The 960×540 (16:9) size for a Discord profile or server banner.",
    intro: (
      <>
        <p>
          Discord profile and server banners use a 16:9 ratio, with 960 × 540 px
          a safe, crisp size. Crop to 16:9 and resize so nothing important is cut
          off — all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Recommended size", value: "960 × 540 px" },
      { label: "Aspect ratio", value: "16:9" },
      { label: "Format", value: "JPG, PNG or GIF" },
      { label: "Note", value: "Animated GIF banners need Nitro" },
    ],
    steps: [
      "Crop your image to a 16:9 aspect ratio.",
      "Resize it to 960 × 540 px.",
      "Save and upload it as your profile or server banner.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What size is a Discord banner?", a: "A 16:9 image; 960 × 540 px is a safe, crisp size for profile and server banners." },
      { q: "Can I use an animated banner?", a: "Animated GIF banners require Discord Nitro; a static JPG or PNG works on any account." },
      { q: "Is my image uploaded?", a: "No — everything runs in your browser." },
    ],
    related: ["resize-image-for-twitch-banner", "resize-image-for-twitter-header"],
  },
  {
    slug: "resize-image-for-zoom-background",
    niche: "platform",
    title: "Zoom Virtual Background Size — 1920×1080 (Free Resizer)",
    h1: "Resize an Image for a Zoom Virtual Background",
    description:
      "Resize any image to the recommended Zoom virtual background size (1920 × 1080, 16:9) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "zoom virtual background size, zoom background dimensions, 1920x1080 background, resize image for zoom background, zoom background 16:9",
    excerpt: "The recommended 1920×1080 (16:9) size for a Zoom virtual background.",
    intro: (
      <>
        <p>
          Zoom recommends a 1920 × 1080 px (16:9) image for a crisp virtual
          background that fills the frame without stretching. Crop to 16:9 and
          resize to match — all done in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Recommended size", value: "1920 × 1080 px" },
      { label: "Aspect ratio", value: "16:9" },
      { label: "Minimum", value: "1280 × 720 px" },
      { label: "Format", value: "JPG or PNG (GIF also supported)" },
    ],
    steps: [
      "Crop your image to a 16:9 aspect ratio.",
      "Resize it to 1920 × 1080 px.",
      "Save it, then add it under Zoom's virtual-background settings.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress"],
    faqs: [
      { q: "What size should a Zoom virtual background be?", a: "1920 × 1080 px at 16:9 for the crispest result; 1280 × 720 px is the practical minimum." },
      { q: "Why does my background look stretched?", a: "It isn't 16:9 — crop to 16:9 first so it fills the frame without distortion." },
      { q: "Is my image uploaded?", a: "No — resizing runs in your browser." },
    ],
    related: ["resize-image-for-youtube-thumbnail", "resize-image-for-discord-banner"],
  },
];

// ── Visa / passport photos by country ───────────────────────────────────────
const visa: HowTo[] = [
  {
    slug: "us-visa-photo-size",
    niche: "visa",
    title: "US Visa Photo Size — 2×2 Inch / 600×600 px (Free)",
    h1: "Make a US Visa Photo (2×2 inch, 600×600 px)",
    description:
      "Crop, resize and compress a photo to the US visa / passport 2×2 inch (600 × 600 px) requirement — free, in your browser, with nothing uploaded.",
    keywords:
      "us visa photo size, 2x2 inch photo, 600x600 photo, us passport photo size, ds-160 photo size, resize photo for us visa",
    excerpt: "The 2×2 inch (600×600 px) square spec for US visa and passport photos.",
    intro: (
      <>
        <p>
          US visa and passport photos must be a 2 × 2 inch square (600 × 600 px
          to 1200 × 1200 px) with a plain white or off-white background and your
          head at the right size. Crop to a square and resize to hit it — all in
          your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Size", value: "2 × 2 inch (51 × 51 mm), square" },
      { label: "Pixels", value: "600 × 600 px (up to 1200 × 1200)" },
      { label: "Head height", value: "≈ 50–69% of the photo height" },
      { label: "Background", value: "Plain white / off-white" },
    ],
    steps: [
      "Crop your photo to a 1:1 square with your head centred and correctly sized.",
      "Resize the square to 600 × 600 px.",
      "If the portal needs a smaller file, compress it, then upload.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/200kb"],
    faqs: [
      { q: "What size is a US visa photo?", a: "2 × 2 inches (51 × 51 mm), square, at 600 × 600 px up to 1200 × 1200 px, with a plain white background." },
      { q: "What is the DS-160 photo size?", a: "The same 2 × 2 inch / 600 × 600 px square. Head height should be about 50–69% of the image." },
      { q: "Is my photo uploaded?", a: "No — cropping, resizing and compression run in your browser, so your photo stays private." },
    ],
    related: ["schengen-visa-photo-size", "canada-visa-photo-size"],
  },
  {
    slug: "schengen-visa-photo-size",
    niche: "visa",
    title: "Schengen Visa Photo Size — 35×45 mm (Free Resizer)",
    h1: "Make a Schengen Visa Photo (35×45 mm)",
    description:
      "Crop and resize a photo to the Schengen visa 35 × 45 mm requirement with a light background — free, in your browser, with nothing uploaded.",
    keywords:
      "schengen visa photo size, 35x45mm photo, europe visa photo size, resize photo for schengen visa, schengen photo dimensions",
    excerpt: "The 35×45 mm spec for Schengen (Europe) visa photos.",
    intro: (
      <>
        <p>
          Schengen visa photos are 35 × 45 mm with a neutral, light-grey or
          off-white background and the face filling most of the frame. Crop to a
          35:45 ratio and resize to match — all done in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Size", value: "35 × 45 mm" },
      { label: "Pixels (at 300 dpi)", value: "≈ 413 × 531 px" },
      { label: "Head height", value: "70–80% of the photo (≈ 32–36 mm)" },
      { label: "Background", value: "Light grey / off-white, plain" },
    ],
    steps: [
      "Crop your photo to a 35:45 ratio with the face filling most of the frame.",
      "Resize to about 413 × 531 px (35 × 45 mm at 300 dpi).",
      "Compress if the portal has a file-size limit, then upload.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What size is a Schengen visa photo?", a: "35 × 45 mm (about 413 × 531 px at 300 dpi) with a plain light background and the head filling 70–80% of the frame." },
      { q: "Does it work for European passport photos too?", a: "Most EU passport photos also use 35 × 45 mm, so the same crop and size apply — but confirm your country's rules." },
      { q: "Are my photos private?", a: "Yes — everything is processed in your browser and never uploaded." },
    ],
    related: ["us-visa-photo-size", "uk-passport-photo-size"],
  },
  {
    slug: "uk-passport-photo-size",
    niche: "visa",
    title: "UK Passport Photo Size — 35×45 mm (Free Resizer)",
    h1: "Make a UK Passport Photo (35×45 mm)",
    description:
      "Crop and resize a photo to the UK passport 35 × 45 mm requirement with a light background — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "uk passport photo size, 35x45mm passport photo, uk passport photo dimensions, resize photo for uk passport, british passport photo size",
    excerpt: "The 35×45 mm spec for UK passport and visa photos.",
    intro: (
      <>
        <p>
          UK passport photos are 35 × 45 mm with a plain light-grey or cream
          background and a neutral expression. The digital route also has a
          minimum pixel size. Crop to 35:45 and resize to match — all in your
          browser.
        </p>
      </>
    ),
    spec: [
      { label: "Printed size", value: "35 × 45 mm" },
      { label: "Digital minimum", value: "≈ 600 × 750 px" },
      { label: "Head height", value: "29–34 mm chin to crown" },
      { label: "Background", value: "Plain light grey / cream" },
    ],
    steps: [
      "Crop your photo to a 35:45 ratio with a neutral expression and plain background.",
      "Resize to at least 600 × 750 px for the digital application.",
      "Compress if needed for an online upload, then submit.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/200kb"],
    faqs: [
      { q: "What size is a UK passport photo?", a: "35 × 45 mm printed; digital photos should be at least about 600 × 750 px, with a plain light background." },
      { q: "Can I use it for a UK visa photo?", a: "UK visa photos use the same 35 × 45 mm format, so the same crop and size apply — check the specific service's rules." },
      { q: "Is my photo uploaded?", a: "No — cropping and resizing run in your browser." },
    ],
    related: ["schengen-visa-photo-size", "us-visa-photo-size"],
  },
  {
    slug: "canada-visa-photo-size",
    niche: "visa",
    title: "Canada Visa Photo Size — 35×45 mm / 420×540 px (Free)",
    h1: "Make a Canada Visa Photo (35×45 mm)",
    description:
      "Crop and resize a photo to the Canada visa 35 × 45 mm requirement (about 420 × 540 px) — free, in your browser, with nothing uploaded.",
    keywords:
      "canada visa photo size, canada visa photo dimensions, 35x45mm canada, resize photo for canada visa, ircc photo size",
    excerpt: "The 35×45 mm / ~420×540 px spec for Canada visa photos.",
    intro: (
      <>
        <p>
          Canada visa photos are 35 × 45 mm with the head between 31–36 mm and a
          plain white background. Digital IRCC uploads have their own pixel and
          file-size limits. Crop to 35:45 and resize to match — all in your
          browser.
        </p>
      </>
    ),
    spec: [
      { label: "Size", value: "35 × 45 mm" },
      { label: "Pixels", value: "≈ 420 × 540 px (min)" },
      { label: "Head height", value: "31–36 mm chin to crown" },
      { label: "Background", value: "Plain white" },
    ],
    steps: [
      "Crop your photo to a 35:45 ratio with the head correctly sized on a white background.",
      "Resize to at least about 420 × 540 px.",
      "Compress to the portal's file-size limit if needed, then upload.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What size is a Canada visa photo?", a: "35 × 45 mm (about 420 × 540 px), head 31–36 mm, on a plain white background." },
      { q: "What about IRCC digital photo rules?", a: "Online applications add pixel and file-size limits; resize and compress to fit the specific form's requirement." },
      { q: "Are my photos private?", a: "Yes — everything runs in your browser and is never uploaded." },
    ],
    related: ["us-visa-photo-size", "australia-visa-photo-size"],
  },
  {
    slug: "australia-visa-photo-size",
    niche: "visa",
    title: "Australia Visa Photo Size — 35×45 mm (Free Resizer)",
    h1: "Make an Australia Visa Photo (35×45 mm)",
    description:
      "Crop and resize a photo to the Australia visa 35 × 45 mm requirement with a plain background — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "australia visa photo size, 35x45mm australia, australian visa photo dimensions, resize photo for australia visa, australia passport photo size",
    excerpt: "The 35×45 mm spec for Australia visa and passport photos.",
    intro: (
      <>
        <p>
          Australian visa and passport photos are 45 × 35 mm with the face
          filling most of the frame and a plain, light-coloured background. Crop
          to a 35:45 ratio and resize to match — all done in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Size", value: "45 × 35 mm" },
      { label: "Pixels (at 300 dpi)", value: "≈ 413 × 531 px" },
      { label: "Face height", value: "≈ 32–36 mm chin to crown" },
      { label: "Background", value: "Plain, light colour" },
    ],
    steps: [
      "Crop your photo to a 35:45 ratio with the face filling most of the frame.",
      "Resize to about 413 × 531 px on a plain light background.",
      "Compress to any required file-size limit, then upload.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What size is an Australian visa photo?", a: "45 × 35 mm (about 413 × 531 px at 300 dpi), face 32–36 mm, on a plain light background." },
      { q: "Does it work for an Australian passport photo?", a: "Yes — the passport photo uses the same 45 × 35 mm format, so the same crop and size apply." },
      { q: "Is my photo uploaded?", a: "No — cropping, resizing and compression run in your browser." },
    ],
    related: ["canada-visa-photo-size", "schengen-visa-photo-size"],
  },
  {
    slug: "india-passport-photo-size",
    niche: "visa",
    title: "India Passport Photo Size — 35×45 mm / 2×2 inch (Free)",
    h1: "Make an India Passport Photo (35×45 mm)",
    description:
      "Crop and resize a photo to the India passport requirement — 35 × 45 mm (or 2 × 2 inch for online) with a white background — free, in your browser, with nothing uploaded.",
    keywords:
      "india passport photo size, indian passport photo dimensions, 35x45mm passport, 2x2 inch passport photo india, passport seva photo size, resize photo for passport",
    excerpt: "The 35×45 mm (and 2×2 inch online) spec for India passport photos.",
    intro: (
      <>
        <p>
          Indian passport photos are 35 × 45 mm with a plain white background; the
          Passport Seva online form accepts a 2 × 2 inch (roughly square) photo
          within a file-size limit. Crop and resize to match — all in your
          browser.
        </p>
      </>
    ),
    spec: [
      { label: "Printed size", value: "35 × 45 mm" },
      { label: "Online (Passport Seva)", value: "2 × 2 inch, ≈ 4.5 KB – 1 MB JPEG" },
      { label: "Head", value: "Centred, ~70–80% of frame" },
      { label: "Background", value: "Plain white" },
    ],
    steps: [
      "Crop your photo to 35:45 (or a 1:1 square for the online 2×2 form) on white.",
      "Resize to the required dimensions.",
      "Compress to the portal's file-size limit if uploading, then submit.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What size is an India passport photo?", a: "35 × 45 mm printed, on a plain white background; the online Passport Seva form takes a 2 × 2 inch JPEG within its size limit." },
      { q: "What's the file-size limit for the online photo?", a: "It varies, commonly up to around 1 MB. Compress to fit and confirm on the Passport Seva portal." },
      { q: "Is my photo uploaded?", a: "No — cropping, resizing and compression run in your browser." },
    ],
    related: ["us-visa-photo-size", "uk-passport-photo-size"],
  },
  {
    slug: "china-visa-photo-size",
    niche: "visa",
    title: "China Visa Photo Size — 33×48 mm (Free Resizer)",
    h1: "Make a China Visa Photo (33×48 mm)",
    description:
      "Crop and resize a photo to the China visa requirement — 33 × 48 mm on a white background — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "china visa photo size, 33x48mm photo, china visa photo dimensions, resize photo for china visa, china visa photo requirements",
    excerpt: "The 33×48 mm spec for China visa photos, white background.",
    intro: (
      <>
        <p>
          China visa photos are 33 × 48 mm with a plain white background and the
          head at a set size. Digital uploads have their own pixel and file-size
          limits. Crop to 33:48 and resize to match — all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Size", value: "33 × 48 mm" },
      { label: "Pixels (digital)", value: "354 × 472 to 420 × 560 px" },
      { label: "Head height", value: "28–33 mm chin to crown" },
      { label: "Background", value: "Plain white" },
    ],
    steps: [
      "Crop your photo to a 33:48 ratio with the head correctly sized on white.",
      "Resize to within 354 × 472 – 420 × 560 px for a digital upload.",
      "Compress to the portal's file-size limit if needed, then submit.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What size is a China visa photo?", a: "33 × 48 mm with a plain white background; digital photos are typically 354 × 472 to 420 × 560 px." },
      { q: "What's the head-size rule?", a: "The head should be about 28–33 mm from chin to crown, centred in the frame." },
      { q: "Are my photos private?", a: "Yes — everything runs in your browser and is never uploaded." },
    ],
    related: ["japan-visa-photo-size", "us-visa-photo-size"],
  },
  {
    slug: "japan-visa-photo-size",
    niche: "visa",
    title: "Japan Visa Photo Size — 45×45 mm (Free Resizer)",
    h1: "Make a Japan Visa Photo (45×45 mm)",
    description:
      "Crop and resize a photo to the Japan visa requirement — 45 × 45 mm square with a plain background — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "japan visa photo size, 45x45mm photo, japan visa photo dimensions, 2x2 japan visa, resize photo for japan visa",
    excerpt: "The 45×45 mm square spec for Japan visa photos.",
    intro: (
      <>
        <p>
          Japan visa photos are a 45 × 45 mm square (about 2 × 2 inch) with a
          plain, light background and the face centred. Crop to a square and
          resize to match — all done in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Size", value: "45 × 45 mm (square)" },
      { label: "Pixels (at 300 dpi)", value: "≈ 531 × 531 px" },
      { label: "Face height", value: "≈ 34 mm chin to crown" },
      { label: "Background", value: "Plain, light colour" },
    ],
    steps: [
      "Crop your photo to a 1:1 square with the face centred.",
      "Resize to about 531 × 531 px on a plain light background.",
      "Compress to any required file-size limit, then submit.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What size is a Japan visa photo?", a: "A 45 × 45 mm square (about 531 × 531 px at 300 dpi) with a plain light background and the face centred." },
      { q: "Is it the same as a 2×2 inch photo?", a: "45 × 45 mm is very close to 2 × 2 inch (51 × 51 mm) but not identical — use the 45 mm square to be safe." },
      { q: "Is my photo uploaded?", a: "No — cropping and resizing run in your browser." },
    ],
    related: ["china-visa-photo-size", "us-visa-photo-size"],
  },
  {
    slug: "uae-visa-photo-size",
    niche: "visa",
    title: "UAE Visa Photo Size — White Background (Free Resizer)",
    h1: "Make a UAE Visa Photo (White Background)",
    description:
      "Crop and resize a photo to UAE visa requirements — 43 × 55 mm on a plain white background — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "uae visa photo size, dubai visa photo size, 43x55mm photo, uae visa photo white background, resize photo for uae visa",
    excerpt: "The 43×55 mm, white-background spec for UAE / Dubai visa photos.",
    intro: (
      <>
        <p>
          UAE (including Dubai) visa photos are typically 43 × 55 mm with a plain
          white background and the face filling most of the frame. Crop to a
          43:55 ratio and resize to match — all in your browser.
        </p>
      </>
    ),
    spec: [
      { label: "Size", value: "43 × 55 mm" },
      { label: "Pixels (at 300 dpi)", value: "≈ 508 × 650 px" },
      { label: "Face", value: "≈ 70–80% of the frame" },
      { label: "Background", value: "Plain white (strictly)" },
    ],
    steps: [
      "Crop your photo to a 43:55 ratio with the face filling most of the frame.",
      "Resize to about 508 × 650 px on a plain white background.",
      "Compress to any required file-size limit, then submit.",
    ],
    tools: ["/image/crop", "/image/resize", "/image/compress/100kb"],
    faqs: [
      { q: "What size is a UAE visa photo?", a: "Typically 43 × 55 mm (about 508 × 650 px at 300 dpi) with a strictly plain white background." },
      { q: "Does Dubai use the same requirement?", a: "Dubai visas follow UAE rules, so the same size and white-background requirement apply — confirm with your typing centre or portal." },
      { q: "Are my photos private?", a: "Yes — everything runs in your browser and is never uploaded." },
    ],
    related: ["india-passport-photo-size", "china-visa-photo-size"],
  },
];

// ── Context-specific PDF size limits ─────────────────────────────────────────
const pdf: HowTo[] = [
  {
    slug: "compress-pdf-for-a-job-application",
    niche: "pdf",
    title: "Compress a PDF for a Job Application (Under the Limit, Free)",
    h1: "Compress a PDF for a Job Application",
    description:
      "Get your resume or documents PDF under a job portal's upload limit (often 500 KB–2 MB) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "compress pdf for job application, reduce resume pdf size, resume under 500kb, cv pdf size limit, compress cv pdf, shrink resume pdf",
    excerpt: "Shrink a resume or documents PDF to fit a job portal's upload cap.",
    intro: (
      <>
        <p>
          Job portals usually cap resume and document uploads at 500 KB, 1 MB or
          2 MB. Compress your PDF to fit while keeping it readable — the tool is
          pre-armed to a target and runs entirely in your browser, so your CV
          isn&apos;t uploaded anywhere.
        </p>
      </>
    ),
    spec: [
      { label: "Common limits", value: "500 KB, 1 MB or 2 MB" },
      { label: "Best for", value: "Resume/CV, certificates, ID scans" },
      { label: "Keep readable", value: "Text stays legible at 500 KB+" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Check the portal's exact size limit (e.g. under 1 MB).",
      "Open the pre-armed compressor for that target and drop in your PDF.",
      "Download the compressed file and upload it to the application.",
    ],
    tools: ["/pdf/compress/500kb", "/pdf/compress/1mb", "/pdf/compress"],
    faqs: [
      { q: "How do I reduce my resume PDF size?", a: "Use the pre-armed compressor at your portal's limit (e.g. 500 KB or 1 MB); it tunes quality to fit while keeping text readable." },
      { q: "Will my resume still look good?", a: "Yes. At 500 KB and above, text-based resumes stay crisp; only very image-heavy PDFs lose visible detail." },
      { q: "Is my CV uploaded?", a: "No — compression runs entirely in your browser, so your documents never leave your device." },
    ],
    related: ["compress-pdf-for-a-government-form", "compress-pdf-for-email"],
  },
  {
    slug: "compress-pdf-for-a-government-form",
    niche: "pdf",
    title: "Compress a PDF for a Government Form (Free, No Upload)",
    h1: "Compress a PDF for a Government Form",
    description:
      "Get a scanned document PDF under a government portal's strict limit (often 100–200 KB) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "compress pdf for government form, reduce pdf to 100kb, pdf 200kb for form, compress scanned pdf, government portal pdf size limit",
    excerpt: "Fit a scanned PDF under a government portal's 100–200 KB cap.",
    intro: (
      <>
        <p>
          Government e-forms often demand tiny PDFs — 100 KB or 200 KB — which is
          tough for scanned documents. The pre-armed compressor tunes quality to
          land under the cap while keeping pages legible, all in your browser, so
          your ID or certificate scan is never uploaded.
        </p>
      </>
    ),
    spec: [
      { label: "Common limits", value: "100 KB or 200 KB" },
      { label: "Best for", value: "Scanned IDs, certificates, forms" },
      { label: "Tip", value: "Scan in greyscale to start smaller" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Note the portal's limit (often 100 KB or 200 KB).",
      "Open the pre-armed compressor at that target and add your PDF.",
      "Download the file and upload it to the form.",
    ],
    tools: ["/pdf/compress/100kb", "/pdf/compress/200kb", "/pdf/compress"],
    faqs: [
      { q: "How do I compress a PDF to 100 KB for a form?", a: "Open the 100 KB compressor and drop in your PDF; it renders pages as compressed images to hit the target while keeping them legible." },
      { q: "Why is my scanned PDF so large?", a: "Scans store each page as a high-resolution image. Compressing (or scanning in greyscale) shrinks them dramatically." },
      { q: "Are my documents private?", a: "Yes — compression runs in your browser, so nothing is uploaded." },
    ],
    related: ["compress-pdf-for-a-job-application", "compress-pdf-for-visa-application"],
  },
  {
    slug: "compress-pdf-for-email",
    niche: "pdf",
    title: "Compress a PDF for Email (Under 25 MB / 10 MB, Free)",
    h1: "Compress a PDF to Email It",
    description:
      "Shrink a PDF to fit an email attachment limit (often 25 MB or 10 MB) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "compress pdf for email, reduce pdf for email attachment, pdf too big to email, shrink pdf under 25mb, email pdf size limit",
    excerpt: "Get a large PDF under your email provider's attachment limit.",
    intro: (
      <>
        <p>
          Email providers cap attachments — around 25 MB for Gmail and Outlook,
          less on many corporate systems. Compress a large PDF to fit and send it
          directly instead of using a file link. It all runs in your browser, so
          the document stays private.
        </p>
      </>
    ),
    spec: [
      { label: "Gmail / Outlook limit", value: "≈ 25 MB" },
      { label: "Many corporate limits", value: "5–10 MB" },
      { label: "Best for", value: "Reports, brochures, scanned bundles" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Check your (and the recipient's) attachment limit.",
      "Compress the PDF to comfortably fit — 1 MB is a safe, universal target.",
      "Attach the smaller file and send.",
    ],
    tools: ["/pdf/compress/1mb", "/pdf/compress/500kb", "/pdf/compress"],
    faqs: [
      { q: "My PDF is too big to email — what do I do?", a: "Compress it. Aiming for 1 MB or less keeps it well under Gmail/Outlook's 25 MB limit and any stricter corporate cap." },
      { q: "Will compressing hurt quality?", a: "For text PDFs, no visible change. Image-heavy PDFs lose some detail but stay readable." },
      { q: "Is my PDF uploaded?", a: "No — it's compressed in your browser and never sent to a server." },
    ],
    related: ["compress-pdf-for-a-job-application", "compress-pdf-for-college-admission"],
  },
  {
    slug: "compress-pdf-for-visa-application",
    niche: "pdf",
    title: "Compress a PDF for a Visa Application (Free, No Upload)",
    h1: "Compress a PDF for a Visa Application",
    description:
      "Get supporting-document PDFs under a visa portal's upload limit (often 1–2 MB per file) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "compress pdf for visa application, visa document pdf size, reduce pdf for visa upload, compress bank statement pdf, visa portal pdf limit",
    excerpt: "Fit visa supporting-document PDFs under the portal's per-file limit.",
    intro: (
      <>
        <p>
          Visa portals often limit each supporting document (bank statements,
          itineraries, letters) to 1–2 MB. Compress them to fit without losing
          readability. Because it runs in your browser, sensitive financial
          documents are never uploaded to a third party.
        </p>
      </>
    ),
    spec: [
      { label: "Common per-file limit", value: "1 MB – 2 MB" },
      { label: "Best for", value: "Bank statements, letters, itineraries" },
      { label: "Privacy", value: "Financial docs stay on your device" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Check the visa portal's per-document size limit.",
      "Compress each PDF to fit — 1 MB is a safe target for most portals.",
      "Download and upload each document to the application.",
    ],
    tools: ["/pdf/compress/1mb", "/pdf/compress/500kb", "/pdf/compress"],
    faqs: [
      { q: "How do I compress a bank statement for a visa upload?", a: "Open the 1 MB compressor and drop in the PDF; it shrinks the file to fit while keeping the figures legible — and never uploads it." },
      { q: "Is it safe to compress financial documents here?", a: "Yes. Everything runs in your browser, so your statements are never sent to any server." },
      { q: "Will the document stay readable?", a: "Yes — at 1 MB, statements and letters remain clear." },
    ],
    related: ["compress-pdf-for-a-government-form", "compress-pdf-for-a-job-application"],
  },
  {
    slug: "compress-pdf-for-college-admission",
    niche: "pdf",
    title: "Compress a PDF for College Admission (Free, No Upload)",
    h1: "Compress a PDF for a College Admission Form",
    description:
      "Get marksheets and certificate PDFs under a college portal's upload limit (often 200 KB–1 MB) — free, in your browser, with nothing uploaded.",
    keywords:
      "compress pdf for college admission, marksheet pdf size, reduce certificate pdf, college application pdf limit, compress marksheet pdf",
    excerpt: "Fit marksheets and certificates under a college portal's upload cap.",
    intro: (
      <>
        <p>
          College and university admission portals cap uploaded marksheets and
          certificates — commonly 200 KB to 1 MB each. Compress your scans to fit
          while keeping them readable, all in your browser, so your documents
          aren&apos;t uploaded to a third party.
        </p>
      </>
    ),
    spec: [
      { label: "Common limits", value: "200 KB – 1 MB per file" },
      { label: "Best for", value: "Marksheets, certificates, ID proofs" },
      { label: "Tip", value: "Greyscale scans start much smaller" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Check the admission portal's size limit for each document.",
      "Open the pre-armed compressor at that target and add your scan.",
      "Download and upload each file to the admission form.",
    ],
    tools: ["/pdf/compress/200kb", "/pdf/compress/500kb", "/pdf/compress"],
    faqs: [
      { q: "How do I reduce a marksheet PDF size?", a: "Use the pre-armed compressor at the portal's limit (e.g. 200 KB or 500 KB); it fits the scan to the target while keeping it legible." },
      { q: "My scanned certificate is huge — why?", a: "Scans store pages as high-resolution images. Compressing (or scanning in greyscale) shrinks them a lot." },
      { q: "Are my documents uploaded?", a: "No — compression runs in your browser, so nothing leaves your device." },
    ],
    related: ["compress-pdf-for-a-job-application", "compress-pdf-for-a-government-form"],
  },
  {
    slug: "compress-pdf-for-whatsapp",
    niche: "pdf",
    title: "Compress a PDF to Send on WhatsApp (Free, No Upload)",
    h1: "Compress a PDF to Send on WhatsApp",
    description:
      "Shrink a PDF to send it as a WhatsApp document (100 MB cap, but smaller sends faster) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "compress pdf for whatsapp, reduce pdf size for whatsapp, send pdf on whatsapp, whatsapp document size limit, shrink pdf whatsapp",
    excerpt: "Slim a PDF so it sends quickly as a WhatsApp document.",
    intro: (
      <>
        <p>
          WhatsApp lets you send documents up to 100 MB, but a smaller PDF sends
          faster, uses less of the recipient&apos;s data, and dodges failures on
          slow connections. Compress it first — all in your browser, so the
          document stays private.
        </p>
      </>
    ),
    spec: [
      { label: "WhatsApp document limit", value: "100 MB" },
      { label: "Practical target", value: "1 MB or less (fast send)" },
      { label: "Best for", value: "Scanned notes, forms, brochures" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Open the pre-armed 1 MB compressor and drop in your PDF.",
      "Download the smaller file.",
      "Attach it as a document in WhatsApp and send.",
    ],
    tools: ["/pdf/compress/1mb", "/pdf/compress/500kb", "/pdf/compress"],
    faqs: [
      { q: "What's the PDF size limit on WhatsApp?", a: "You can send documents up to 100 MB, but compressing to 1 MB or less makes it send far faster." },
      { q: "Why won't my PDF send on WhatsApp?", a: "Usually a slow connection with a large file. Compressing it makes the send far more reliable." },
      { q: "Is my PDF uploaded?", a: "No — it's compressed in your browser and never sent to a server." },
    ],
    related: ["compress-pdf-for-email", "compress-pdf-for-a-job-application"],
  },
  {
    slug: "compress-pdf-for-court-e-filing",
    niche: "pdf",
    title: "Compress a PDF for Court e-Filing (Free, No Upload)",
    h1: "Compress a PDF for Court e-Filing",
    description:
      "Get a PDF under a court e-filing system's per-document limit (often a few MB) — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "compress pdf for court e-filing, e-filing pdf size limit, reduce pdf for court, ecourts pdf size, compress legal pdf, court filing pdf under 10mb",
    excerpt: "Fit legal PDFs under a court e-filing system's size limit.",
    intro: (
      <>
        <p>
          Court e-filing portals cap each uploaded document — often a few MB — and
          scanned exhibits blow past that fast. Compress them to fit while keeping
          every page legible, all in your browser, so confidential filings are
          never uploaded to a third party.
        </p>
      </>
    ),
    spec: [
      { label: "Common per-file limit", value: "A few MB (portal-dependent)" },
      { label: "Safe target", value: "1 MB (comfortably fits most)" },
      { label: "Best for", value: "Scanned exhibits, petitions, affidavits" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Check your court portal's per-document size limit.",
      "Compress each PDF to comfortably fit (1 MB is a safe target).",
      "Download and upload each document to the filing.",
    ],
    tools: ["/pdf/compress/1mb", "/pdf/compress/500kb", "/pdf/compress"],
    faqs: [
      { q: "How do I reduce a PDF for court e-filing?", a: "Compress it to fit the portal's per-document limit; 1 MB is a safe target that keeps scanned pages legible." },
      { q: "Will the pages stay readable?", a: "Yes. Compression tunes quality to keep text and exhibits legible while cutting the file size." },
      { q: "Are my filings private?", a: "Yes — compression runs in your browser, so nothing is uploaded." },
    ],
    related: ["compress-pdf-for-a-government-form", "compress-pdf-for-visa-application"],
  },
  {
    slug: "compress-pdf-for-passport-application",
    niche: "pdf",
    title: "Compress a PDF for a Passport Application (Free, No Upload)",
    h1: "Compress a PDF for a Passport Application",
    description:
      "Get supporting-document PDFs under a passport portal's upload limit — free, in your browser, with nothing uploaded to a server.",
    keywords:
      "compress pdf for passport application, passport seva pdf size, reduce pdf for passport, passport document upload size, compress passport documents pdf",
    excerpt: "Fit passport supporting-document PDFs under the portal's limit.",
    intro: (
      <>
        <p>
          Passport application portals cap uploaded supporting documents (address
          proof, ID, birth proof) at a set size. Compress your scans to fit while
          keeping them readable, all in your browser, so your identity documents
          are never uploaded to a third party.
        </p>
      </>
    ),
    spec: [
      { label: "Common limits", value: "A few hundred KB to a few MB" },
      { label: "Best for", value: "Address & ID proof, birth certificate" },
      { label: "Tip", value: "Greyscale scans start much smaller" },
      { label: "Format", value: "PDF" },
    ],
    steps: [
      "Check the passport portal's size limit for each document.",
      "Open the pre-armed compressor at that target and add your scan.",
      "Download and upload each document to the application.",
    ],
    tools: ["/pdf/compress/500kb", "/pdf/compress/1mb", "/pdf/compress"],
    faqs: [
      { q: "How do I compress documents for a passport application?", a: "Use the pre-armed compressor at the portal's limit; it fits each scan to the target while keeping it legible — and never uploads it." },
      { q: "Is it safe to compress ID documents here?", a: "Yes. Everything runs in your browser, so your identity documents are never sent to any server." },
      { q: "Why are my scans so large?", a: "Scans store each page as a high-resolution image; compressing (or scanning in greyscale) shrinks them a lot." },
    ],
    related: ["compress-pdf-for-a-government-form", "india-passport-photo-size"],
  },
];

export const howtos: HowTo[] = [...exam, ...platform, ...visa, ...pdf];

export const getHowTo = (slug: string) => howtos.find((h) => h.slug === slug);
export const howtosByNiche = (niche: HowToNiche) =>
  howtos.filter((h) => h.niche === niche);
export const getHowToNiche = (id: string) =>
  HOWTO_NICHES.find((n) => n.id === id);
