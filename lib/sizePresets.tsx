import type { ReactNode } from "react";

/**
 * Long-tail "compress to an exact size" landing pages (e.g. /pdf/compress/100kb,
 * /image/compress/50kb). These target genuinely winnable, high-intent queries
 * ("compress pdf to 100kb") that the generic compress pages don't. Each carries
 * unique use-case content + FAQ so it's a real, useful page — not a doorway —
 * and embeds the live compressor pre-armed to the target size.
 */

export type SizePreset = {
  kind: "pdf" | "image";
  slug: string; // "100kb"
  kb: number;
  label: string; // "100KB"
  title: string;
  h1: string;
  description: string;
  keywords: string;
  intro: ReactNode;
  uses: string[];
  faqs: { q: string; a: string }[];
};

const pdf: SizePreset[] = [
  {
    kind: "pdf",
    slug: "100kb",
    kb: 100,
    label: "100KB",
    title: "Compress PDF to 100KB Online Free — No Signup",
    h1: "Compress PDF to 100KB",
    description:
      "Compress a PDF to 100KB online free. Set the target and the tool tunes quality to land at or under 100KB — ideal for visa and government forms. No signup, no upload.",
    keywords:
      "compress pdf to 100kb, reduce pdf to 100kb, pdf 100kb, compress pdf under 100kb, pdf size reducer 100kb",
    intro: (
      <>
        <p>
          A 100KB limit is one of the strictest you will meet — visa
          applications, government e-forms and exam portals often demand it. This
          tool is pre-set to a 100KB target: drop in your PDF and it tunes the
          image quality to land at or just under 100KB while keeping the document
          readable.
        </p>
        <p>
          It works best on scanned, image-heavy PDFs (where most of the size
          lives). Everything runs in your browser, so even an ID scan or bank
          form is never uploaded.
        </p>
      </>
    ),
    uses: [
      "Visa and immigration document uploads",
      "Government and municipal e-forms with a 100KB cap",
      "Exam and admission portals",
    ],
    faqs: [
      { q: "How do I compress a PDF to exactly 100KB?", a: "Upload your PDF here — the target is already set to 100KB. The tool tunes quality to land at or just under 100KB and tells you the final size." },
      { q: "Will the text still be readable at 100KB?", a: "Yes for most documents. To guarantee 100KB the pages are rendered as compressed images, so text becomes non-selectable but stays legible." },
      { q: "Is my PDF uploaded?", a: "No. Compression runs entirely in your browser; your PDF never leaves your device." },
    ],
  },
  {
    kind: "pdf",
    slug: "200kb",
    kb: 200,
    label: "200KB",
    title: "Compress PDF to 200KB Online Free — No Signup",
    h1: "Compress PDF to 200KB",
    description:
      "Compress a PDF to 200KB online free. The tool is pre-set to a 200KB target and tunes quality automatically — perfect for job applications and KYC uploads. No upload.",
    keywords:
      "compress pdf to 200kb, reduce pdf to 200kb, pdf 200kb, compress pdf under 200kb",
    intro: (
      <>
        <p>
          200KB is a common ceiling for job-application portals, college
          admissions and bank KYC uploads. This page opens the compressor already
          aimed at a 200KB target — add your PDF and download a file that fits.
        </p>
        <p>
          A 200KB budget usually preserves noticeably more detail than tighter
          limits, so multi-page scans still look clean. Processing happens locally
          on your device.
        </p>
      </>
    ),
    uses: [
      "Job-application and resume portals",
      "College and university admissions",
      "Bank KYC and account-opening uploads",
    ],
    faqs: [
      { q: "How do I get my PDF under 200KB?", a: "Upload it here — the 200KB target is preset. The tool finds the highest quality that still fits 200KB and shows the result size." },
      { q: "Can I compress a multi-page PDF to 200KB?", a: "Yes. The whole document is fitted within the target. Very long scans may need a lower quality or splitting out unneeded pages first." },
      { q: "Are my files private?", a: "Yes — nothing is uploaded. The PDF is processed in your browser." },
    ],
  },
  {
    kind: "pdf",
    slug: "500kb",
    kb: 500,
    label: "500KB",
    title: "Compress PDF to 500KB Online Free — No Signup",
    h1: "Compress PDF to 500KB",
    description:
      "Compress a PDF to 500KB online free. Pre-set to a 500KB target with automatic quality tuning — great for e-filing and email attachments. 100% in your browser.",
    keywords:
      "compress pdf to 500kb, reduce pdf to 500kb, pdf 500kb, compress pdf for email",
    intro: (
      <>
        <p>
          500KB is a comfortable target for court e-filing systems, email
          attachments and document-management uploads. This page loads the
          compressor aimed at 500KB, so you can keep good quality while still
          slimming a large file.
        </p>
        <p>
          Because the budget is generous, even detailed scans and mixed
          text/image PDFs come through looking sharp. Files are compressed locally
          and never uploaded.
        </p>
      </>
    ),
    uses: [
      "Court and legal e-filing systems",
      "Email attachment size limits",
      "Document-management and HR uploads",
    ],
    faqs: [
      { q: "How do I compress a PDF to 500KB?", a: "Upload it here — the 500KB target is already set. The tool tunes quality to fit and reports the final size." },
      { q: "Will quality be good at 500KB?", a: "Usually yes. 500KB is generous enough to keep scans and graphics clean for most documents." },
      { q: "Is anything uploaded?", a: "No. All compression runs in your browser." },
    ],
  },
  {
    kind: "pdf",
    slug: "1mb",
    kb: 1024,
    label: "1MB",
    title: "Compress PDF to 1MB Online Free — No Signup",
    h1: "Compress PDF to 1MB",
    description:
      "Compress a PDF to 1MB online free. Pre-set to a 1MB target with automatic quality tuning — ideal for general uploads and email. No signup, nothing uploaded.",
    keywords:
      "compress pdf to 1mb, reduce pdf to 1mb, pdf under 1mb, compress large pdf",
    intro: (
      <>
        <p>
          1MB is the everyday upload limit on most portals and email systems. This
          page opens the compressor aimed at a 1MB target — useful when a big
          scanned report or brochure is just over the line.
        </p>
        <p>
          With a 1MB budget the tool can keep high quality while still cutting a
          large file down to size. Everything is processed on your own device.
        </p>
      </>
    ),
    uses: [
      "General document and form uploads",
      "Email attachment limits",
      "Shrinking large scanned reports and brochures",
    ],
    faqs: [
      { q: "How do I compress a PDF to 1MB?", a: "Upload it here — the 1MB target is preset. The tool tunes quality to land under 1MB and shows the result." },
      { q: "My PDF is huge — can it still hit 1MB?", a: "Often yes. Very large or high-page-count scans may need a lower target or splitting out unneeded pages." },
      { q: "Do you upload my PDF?", a: "No — compression is entirely in-browser." },
    ],
  },
];

const image: SizePreset[] = [
  {
    kind: "image",
    slug: "20kb",
    kb: 20,
    label: "20KB",
    title: "Compress Image to 20KB Online Free — JPG/PNG",
    h1: "Compress Image to 20KB",
    description:
      "Compress a JPG or PNG to 20KB online free. Pre-set to a 20KB target — ideal for signature and exam-form photos. Runs in your browser, nothing uploaded.",
    keywords:
      "compress image to 20kb, reduce photo to 20kb, signature 20kb, compress jpg to 20kb, photo 20kb",
    intro: (
      <>
        <p>
          A 20KB limit is typical for signature images and small photo fields on
          exam and visa forms. This page opens the image compressor aimed at 20KB
          — drop in your image and it squeezes down to fit.
        </p>
        <p>
          For a target this small, a tightly cropped image works best. Everything
          runs locally, so your photo or signature is never uploaded.
        </p>
      </>
    ),
    uses: [
      "Signature images for online forms",
      "Small photo fields on exam and visa portals",
      "Thumbnail-size uploads",
    ],
    faqs: [
      { q: "How do I compress an image to 20KB?", a: "Upload your JPG or PNG here — the 20KB target is preset. The tool lowers quality (and downscales if needed) to fit 20KB." },
      { q: "My signature looks rough at 20KB — why?", a: "20KB is very small. Crop tightly to just the signature and use a clean white background for the best result." },
      { q: "Is my image uploaded?", a: "No. Compression happens in your browser only." },
    ],
  },
  {
    kind: "image",
    slug: "50kb",
    kb: 50,
    label: "50KB",
    title: "Compress Image to 50KB Online Free — JPG/PNG",
    h1: "Compress Image to 50KB",
    description:
      "Compress a JPG or PNG to 50KB online free. Pre-set to a 50KB target — perfect for passport and visa photos. 100% in your browser, no signup, no upload.",
    keywords:
      "compress image to 50kb, photo to 50kb, passport photo 50kb, compress jpg to 50kb, reduce image to 50kb",
    intro: (
      <>
        <p>
          50KB is the classic target for passport and visa photos and many exam
          application forms. This page loads the compressor aimed at 50KB so your
          photo fits the requirement without guesswork.
        </p>
        <p>
          Crop to the required aspect ratio first for the cleanest result. Your
          photo is compressed on your device and never uploaded.
        </p>
      </>
    ),
    uses: [
      "Passport and visa photo uploads",
      "Exam and admission application photos",
      "ID and KYC photo fields",
    ],
    faqs: [
      { q: "How do I compress a photo to 50KB?", a: "Upload your image here — the 50KB target is preset, and the tool tunes quality to land at or under 50KB." },
      { q: "Should I resize before compressing to 50KB?", a: "Yes — resize to the required pixel dimensions first, then this tool handles the 50KB file-size limit." },
      { q: "Is it private?", a: "Yes. The image never leaves your browser." },
    ],
  },
  {
    kind: "image",
    slug: "100kb",
    kb: 100,
    label: "100KB",
    title: "Compress Image to 100KB Online Free — JPG/PNG",
    h1: "Compress Image to 100KB",
    description:
      "Compress a JPG or PNG to 100KB online free. Pre-set to a 100KB target — great for government portals and fast web images. Runs in your browser, nothing uploaded.",
    keywords:
      "compress image to 100kb, photo to 100kb, compress jpg to 100kb, reduce image to 100kb, image under 100kb",
    intro: (
      <>
        <p>
          100KB is a common limit on government portals and a good target for
          fast-loading web images. This page opens the compressor aimed at 100KB
          so you can fit the requirement while keeping the picture clear.
        </p>
        <p>
          A 100KB budget keeps most photos looking good at typical screen sizes.
          Compression runs entirely on your device.
        </p>
      </>
    ),
    uses: [
      "Government and municipal portal uploads",
      "Fast-loading website and blog images",
      "Form photo fields with a 100KB cap",
    ],
    faqs: [
      { q: "How do I compress an image to 100KB?", a: "Upload it here — the 100KB target is preset. The tool finds the highest quality that fits 100KB." },
      { q: "Does compressing to 100KB lose quality?", a: "At 100KB most photos look identical on screen. Quality only drops visibly when the image is large and pushed far below its natural size." },
      { q: "Are my images uploaded?", a: "No — everything is processed in your browser." },
    ],
  },
  {
    kind: "image",
    slug: "200kb",
    kb: 200,
    label: "200KB",
    title: "Compress Image to 200KB Online Free — JPG/PNG",
    h1: "Compress Image to 200KB",
    description:
      "Compress a JPG or PNG to 200KB online free. Pre-set to a 200KB target with automatic quality tuning — ideal for KYC and detailed form photos. No upload.",
    keywords:
      "compress image to 200kb, photo to 200kb, compress jpg to 200kb, reduce image to 200kb, image under 200kb",
    intro: (
      <>
        <p>
          200KB is a generous photo target used by KYC checks, detailed form
          uploads and higher-quality web images. This page loads the compressor
          aimed at 200KB so you keep plenty of detail while meeting the limit.
        </p>
        <p>
          With 200KB to work with, even high-resolution photos stay crisp.
          Everything is compressed locally and never uploaded.
        </p>
      </>
    ),
    uses: [
      "Bank KYC and verification photos",
      "Detailed document and form photo fields",
      "High-quality web and product images",
    ],
    faqs: [
      { q: "How do I compress an image to 200KB?", a: "Upload it here — the 200KB target is preset, and the tool tunes quality to land at or under 200KB." },
      { q: "Will a high-res photo still look good at 200KB?", a: "Yes, in most cases. 200KB is enough to keep photos sharp at normal viewing sizes." },
      { q: "Is my photo private?", a: "Yes — it is compressed in your browser and never uploaded." },
    ],
  },
];

export const sizePresets: SizePreset[] = [...pdf, ...image];

export const getSizePreset = (kind: "pdf" | "image", slug: string) =>
  sizePresets.find((p) => p.kind === kind && p.slug === slug);

export const sizePresetsByKind = (kind: "pdf" | "image") =>
  sizePresets.filter((p) => p.kind === kind);
