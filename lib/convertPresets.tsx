import type { ReactNode } from "react";
import type { OutputFormat } from "@/lib/image";

/**
 * Long-tail image-conversion landing pages (e.g. /image/convert/png-to-webp).
 * Each targets a genuinely-searched "X to Y" query that the generic converter
 * page doesn't rank for, carries unique use-case content + FAQ so it's a real
 * useful page (not a doorway), and embeds the live converter pre-armed to the
 * target output format.
 *
 * Only pairs the in-browser converter actually supports are listed: inputs are
 * what the DropZone accepts (JPG/PNG/WebP/GIF/BMP) and `to` is one of the three
 * raster outputs it can encode. HEIC has its own dedicated tool, so it is not
 * mixed in here.
 */
export type ConvertPreset = {
  slug: string; // "png-to-webp"
  from: string; // "PNG"
  to: OutputFormat; // "image/webp"
  toLabel: string; // "WebP"
  title: string;
  h1: string;
  description: string;
  keywords: string;
  intro: ReactNode;
  uses: string[];
  faqs: { q: string; a: string }[];
};

export const convertPresets: ConvertPreset[] = [
  {
    slug: "png-to-webp",
    from: "PNG",
    to: "image/webp",
    toLabel: "WebP",
    title: "PNG to WebP Converter — Free, No Upload",
    h1: "Convert PNG to WebP",
    description:
      "Convert PNG to WebP online free. WebP is typically 25–35% smaller than PNG at the same quality, ideal for faster sites. In your browser, nothing uploaded.",
    keywords:
      "png to webp, convert png to webp, png to webp converter, png webp online free",
    intro: (
      <>
        <p>
          WebP usually saves 25–35% over PNG at the same visual quality, which is
          why it&apos;s the format of choice for fast-loading websites. This page
          opens the converter already set to WebP output — drop in your PNG (or a
          batch of them) and download smaller files in seconds.
        </p>
        <p>
          WebP keeps PNG&apos;s transparency, so logos and UI assets convert
          cleanly. Every image is converted in your browser, so nothing is ever
          uploaded to a server.
        </p>
      </>
    ),
    uses: [
      "Shrinking site images for better Core Web Vitals / PageSpeed",
      "Converting PNG logos and icons while keeping transparency",
      "Cutting bandwidth on image-heavy pages and galleries",
    ],
    faqs: [
      { q: "Is WebP smaller than PNG?", a: "Almost always. For photographic and detailed images WebP is typically 25–35% smaller than PNG at equivalent quality, and often much more for large images." },
      { q: "Does PNG transparency survive the conversion?", a: "Yes. WebP supports an alpha channel, so transparent areas in your PNG stay transparent in the WebP output." },
      { q: "Are my PNG files uploaded?", a: "No. Conversion runs entirely in your browser — your images never leave your device." },
    ],
  },
  {
    slug: "jpg-to-webp",
    from: "JPG",
    to: "image/webp",
    toLabel: "WebP",
    title: "JPG to WebP Converter — Free, No Upload",
    h1: "Convert JPG to WebP",
    description:
      "Convert JPG to WebP online free. WebP gives smaller files than JPEG at the same quality for faster pages. In your browser — no signup, nothing uploaded.",
    keywords:
      "jpg to webp, jpeg to webp, convert jpg to webp, jpg to webp converter online free",
    intro: (
      <>
        <p>
          WebP compresses photos more efficiently than JPEG, so you get the same
          picture at a smaller file size — better for page speed and SEO. This
          page is preset to WebP output: add your JPGs and convert the whole batch
          at once.
        </p>
        <p>
          A quality slider lets you trade a little detail for an even smaller
          file. Everything is processed locally, so your photos are never
          uploaded.
        </p>
      </>
    ),
    uses: [
      "Speeding up websites and blogs with lighter photos",
      "Bulk-converting a folder of JPEGs for the web",
      "Reducing storage and bandwidth without a visible quality drop",
    ],
    faqs: [
      { q: "Is WebP better than JPG for the web?", a: "Generally yes. WebP produces smaller files than JPEG at the same quality, and every modern browser supports it — so pages load faster with no visible difference." },
      { q: "Can I control the WebP quality?", a: "Yes. The converter has a quality slider; lower it for smaller files or keep it high to stay visually identical to the original." },
      { q: "Do you upload my JPGs?", a: "No — the conversion happens in your browser and your files stay on your device." },
    ],
  },
  {
    slug: "webp-to-png",
    from: "WebP",
    to: "image/png",
    toLabel: "PNG",
    title: "WebP to PNG Converter — Free, No Upload",
    h1: "Convert WebP to PNG",
    description:
      "Convert WebP to PNG online free. Turn WebP downloads into universally supported PNGs with transparency intact. In your browser, nothing uploaded.",
    keywords:
      "webp to png, convert webp to png, webp to png converter, save webp as png free",
    intro: (
      <>
        <p>
          Saved a WebP image and need a PNG that every app and editor accepts?
          This page opens the converter set to PNG output — drop in your WebP
          files and download standard PNGs you can use anywhere.
        </p>
        <p>
          Transparency is preserved, so WebP graphics with see-through areas
          become proper transparent PNGs. All conversion happens in your browser.
        </p>
      </>
    ),
    uses: [
      "Using WebP images in apps or editors that don't accept WebP",
      "Getting a lossless PNG with transparency from a WebP",
      "Preparing images for tools that only import PNG/JPG",
    ],
    faqs: [
      { q: "Why convert WebP to PNG?", a: "Some older apps, editors and upload forms don't accept WebP. PNG is supported virtually everywhere and keeps transparency, making it the safe universal choice." },
      { q: "Will the PNG keep transparent areas?", a: "Yes. PNG supports an alpha channel, so any transparency in the WebP is preserved in the converted PNG." },
      { q: "Is my WebP uploaded anywhere?", a: "No. Everything is converted locally in your browser." },
    ],
  },
  {
    slug: "webp-to-jpg",
    from: "WebP",
    to: "image/jpeg",
    toLabel: "JPG",
    title: "WebP to JPG Converter — Free, No Upload",
    h1: "Convert WebP to JPG",
    description:
      "Convert WebP to JPG online free. Turn WebP images into widely-compatible JPEGs for sharing, printing and uploads. 100% in your browser — nothing uploaded.",
    keywords:
      "webp to jpg, webp to jpeg, convert webp to jpg, webp to jpg converter online free",
    intro: (
      <>
        <p>
          JPG is the most widely accepted photo format — handy when a site, app or
          print service rejects WebP. This page is preset to JPG output: add your
          WebP files and download ready-to-share JPEGs.
        </p>
        <p>
          Transparent areas are flattened onto a white background (JPG has no
          transparency), and everything is converted on your own device, never
          uploaded.
        </p>
      </>
    ),
    uses: [
      "Uploading photos to sites that reject WebP files",
      "Sharing images with apps or contacts that expect JPG",
      "Preparing photos for printing services",
    ],
    faqs: [
      { q: "Why convert WebP to JPG?", a: "JPG is accepted by virtually every website, app and print service. Converting from WebP avoids 'unsupported file type' errors when sharing or uploading." },
      { q: "What happens to transparency?", a: "JPG can't store transparency, so transparent areas are filled with a white background during conversion." },
      { q: "Are my files private?", a: "Yes. The conversion runs in your browser and your images are never uploaded." },
    ],
  },
  {
    slug: "png-to-jpg",
    from: "PNG",
    to: "image/jpeg",
    toLabel: "JPG",
    title: "PNG to JPG Converter — Free, No Upload",
    h1: "Convert PNG to JPG",
    description:
      "Convert PNG to JPG online free. Turn large PNGs into smaller, universally compatible JPEGs for email and uploads. In your browser, nothing uploaded.",
    keywords:
      "png to jpg, png to jpeg, convert png to jpg, png to jpg converter online free",
    intro: (
      <>
        <p>
          Photographs saved as PNG are often far larger than they need to be —
          converting to JPG can shrink them dramatically with no visible
          difference. This page opens the converter set to JPG output, ready for
          your PNGs.
        </p>
        <p>
          Because JPG has no transparency, any transparent areas are placed on a
          white background. Conversion is entirely in-browser, so files stay
          private.
        </p>
      </>
    ),
    uses: [
      "Shrinking oversized PNG photos for email and uploads",
      "Meeting forms that only accept JPG/JPEG",
      "Sharing screenshots and pictures at a smaller size",
    ],
    faqs: [
      { q: "Does converting PNG to JPG reduce file size?", a: "Usually a lot, for photos. JPEG compression is far more efficient than PNG for photographic images, often cutting size by 70% or more with no visible loss." },
      { q: "Why did my transparent background turn white?", a: "JPG doesn't support transparency, so transparent pixels are filled with white. If you need to keep transparency, convert to PNG or WebP instead." },
      { q: "Is my PNG uploaded?", a: "No. The whole conversion happens locally in your browser." },
    ],
  },
  {
    slug: "jpg-to-png",
    from: "JPG",
    to: "image/png",
    toLabel: "PNG",
    title: "JPG to PNG Converter — Free, No Upload",
    h1: "Convert JPG to PNG",
    description:
      "Convert JPG to PNG online free. Get a lossless PNG from any JPEG for editing, logos or tools that require PNG. In your browser, nothing uploaded.",
    keywords:
      "jpg to png, jpeg to png, convert jpg to png, jpg to png converter online free",
    intro: (
      <>
        <p>
          PNG is a lossless format that many design tools, slide decks and upload
          forms specifically require. This page is preset to PNG output — drop in
          your JPGs and download PNGs ready for editing or upload.
        </p>
        <p>
          Note that converting a JPG to PNG won&apos;t recover detail JPEG already
          discarded, and the PNG may be larger. Everything runs in your browser,
          so your images are never uploaded.
        </p>
      </>
    ),
    uses: [
      "Meeting tools or forms that only accept PNG",
      "Getting a lossless copy to edit without further JPEG artifacts",
      "Placing a photo into design software that prefers PNG",
    ],
    faqs: [
      { q: "Does JPG to PNG improve quality?", a: "No — it can't restore detail JPEG already compressed away. It gives you a lossless PNG container, which is useful for editing or for tools that require PNG, but the file will usually be larger." },
      { q: "When should I convert JPG to PNG?", a: "When a tool or form requires PNG, or when you want to edit without adding more JPEG compression artifacts on each save." },
      { q: "Are my JPGs uploaded?", a: "No. Conversion is done entirely in your browser." },
    ],
  },
  {
    slug: "gif-to-png",
    from: "GIF",
    to: "image/png",
    toLabel: "PNG",
    title: "GIF to PNG Converter — Free, No Upload",
    h1: "Convert GIF to PNG",
    description:
      "Convert GIF to PNG online free. Get a lossless PNG with transparency preserved — no signup, no watermark, and nothing is ever uploaded to a server.",
    keywords:
      "gif to png, convert gif to png, gif to png converter, gif to png online free",
    intro: (
      <>
        <p>
          PNG gives you a lossless image with a full alpha channel, so a GIF&apos;s
          transparent areas stay clean instead of showing the jagged edges GIF&apos;s
          1-bit transparency often produces. This page opens the converter already
          set to PNG output.
        </p>
        <p>
          GIF is limited to 256 colours; PNG is not. The conversion cannot invent
          detail that GIF already discarded, but it does give you a format that
          edits and re-saves without further loss.
        </p>
      </>
    ),
    uses: [
      "Turning a GIF sticker or logo into a clean transparent PNG",
      "Preparing a frame for editing without adding more compression",
      "Meeting an upload form that accepts PNG but rejects GIF",
    ],
    faqs: [
      { q: "What happens to an animated GIF?", a: "Only the first frame is converted. PNG is a single-image format, so animation is not preserved — if you need the motion, keep the original GIF." },
      { q: "Is transparency kept?", a: "Yes. PNG supports a full alpha channel, so transparent regions in the GIF stay transparent and get smoother edges." },
      { q: "Are my GIFs uploaded?", a: "No. Conversion runs entirely in your browser — the file never leaves your device." },
    ],
  },
  {
    slug: "gif-to-jpg",
    from: "GIF",
    to: "image/jpeg",
    toLabel: "JPG",
    title: "GIF to JPG Converter — Free, No Upload",
    h1: "Convert GIF to JPG",
    description:
      "Convert GIF to JPG online free. Get a small, universally accepted JPEG with an adjustable quality slider. Runs in your browser — no signup, nothing uploaded.",
    keywords:
      "gif to jpg, gif to jpeg, convert gif to jpg, gif to jpg converter online free",
    intro: (
      <>
        <p>
          JPG is accepted almost everywhere GIF is not — application forms, photo
          printers and older upload widgets. This page is preset to JPEG output,
          with a quality slider so you can trade a little detail for a smaller
          file.
        </p>
        <p>
          Because JPEG has no transparency, any transparent area in the GIF is
          flattened onto a solid background rather than kept as an alpha channel.
        </p>
      </>
    ),
    uses: [
      "Submitting an image to a form that only accepts JPG",
      "Shrinking a large GIF still into a compact photo file",
      "Printing a single frame from a GIF",
    ],
    faqs: [
      { q: "Does the animation survive?", a: "No. JPG holds one image, so only the first frame of an animated GIF is converted." },
      { q: "What happens to transparent pixels?", a: "JPEG has no alpha channel, so transparency is flattened onto a solid background. Convert to PNG instead if you need to keep it." },
      { q: "Is my GIF uploaded anywhere?", a: "No — the conversion happens locally in your browser." },
    ],
  },
  {
    slug: "gif-to-webp",
    from: "GIF",
    to: "image/webp",
    toLabel: "WebP",
    title: "GIF to WebP Converter — Free, No Upload",
    h1: "Convert GIF to WebP",
    description:
      "Convert GIF to WebP online free. WebP keeps transparency at a far smaller size than GIF, ideal for faster pages. In your browser, nothing uploaded.",
    keywords:
      "gif to webp, convert gif to webp, gif to webp converter, gif webp online free",
    intro: (
      <>
        <p>
          WebP stores the same image far more efficiently than GIF and supports
          full alpha transparency instead of GIF&apos;s hard 1-bit mask, so edges
          look smoother and the file is smaller. That combination makes it a good
          swap for web graphics.
        </p>
        <p>
          The converter on this page is already set to WebP output — add your GIF
          and download the result in seconds.
        </p>
      </>
    ),
    uses: [
      "Replacing GIF web graphics to improve Core Web Vitals",
      "Keeping transparency while cutting file size",
      "Modernising an old asset library to a current format",
    ],
    faqs: [
      { q: "Will an animated GIF stay animated?", a: "No. This converter writes a still WebP from the first frame. Animated WebP is a different encode and is not produced here." },
      { q: "Is WebP smaller than GIF?", a: "Usually by a wide margin, because GIF is limited to 256 colours and uses much older compression." },
      { q: "Does it upload my file?", a: "No. Everything runs in your browser." },
    ],
  },
  {
    slug: "bmp-to-jpg",
    from: "BMP",
    to: "image/jpeg",
    toLabel: "JPG",
    title: "BMP to JPG Converter — Free, No Upload",
    h1: "Convert BMP to JPG",
    description:
      "Convert BMP to JPG online free. BMP files are uncompressed and huge — JPEG typically cuts them by 90% or more. Runs in your browser, nothing uploaded.",
    keywords:
      "bmp to jpg, bmp to jpeg, convert bmp to jpg, bmp to jpg converter online free",
    intro: (
      <>
        <p>
          BMP stores pixels essentially uncompressed, which is why a screenshot
          saved as BMP can be tens of megabytes. Converting to JPEG usually cuts
          that by 90% or more with no visible difference at normal viewing sizes.
        </p>
        <p>
          This page opens the converter preset to JPEG, with a quality slider if
          you want to push the size down further.
        </p>
      </>
    ),
    uses: [
      "Shrinking huge BMP screenshots or scans for email",
      "Making legacy Windows images usable on the web",
      "Meeting a form that accepts JPG but not BMP",
    ],
    faqs: [
      { q: "Why is my BMP so large?", a: "BMP is effectively uncompressed — it stores every pixel literally. JPEG applies real compression, which is why the converted file is dramatically smaller." },
      { q: "Will I lose quality?", a: "JPEG is lossy, so there is some loss, but at the default quality it is not visible at normal viewing sizes. Use PNG instead if you need lossless." },
      { q: "Are my BMP files uploaded?", a: "No. Conversion runs entirely in your browser." },
    ],
  },
  {
    slug: "bmp-to-png",
    from: "BMP",
    to: "image/png",
    toLabel: "PNG",
    title: "BMP to PNG Converter — Free, No Upload",
    h1: "Convert BMP to PNG",
    description:
      "Convert BMP to PNG online free. PNG is lossless like BMP but far smaller, and it is supported everywhere. In your browser — no signup, nothing uploaded.",
    keywords:
      "bmp to png, convert bmp to png, bmp to png converter, bmp png online free",
    intro: (
      <>
        <p>
          PNG is the natural replacement for BMP: both are lossless, but PNG
          compresses properly, so you keep every pixel exactly while the file gets
          much smaller. It is also supported by browsers and modern software that
          often refuse BMP.
        </p>
        <p>
          The converter here is preset to PNG output — drop in your BMP files and
          convert the batch at once.
        </p>
      </>
    ),
    uses: [
      "Archiving legacy BMP images without losing any pixel data",
      "Making old Windows bitmaps display on the web",
      "Reducing storage while keeping lossless quality",
    ],
    faqs: [
      { q: "Is PNG lossless like BMP?", a: "Yes. PNG compression is completely lossless, so the converted image is pixel-identical to the BMP — just stored far more efficiently." },
      { q: "How much smaller will it be?", a: "It varies with content. Screenshots and flat-colour graphics often shrink by 80–95%; dense photographic images compress less." },
      { q: "Is anything uploaded?", a: "No — the conversion happens locally in your browser." },
    ],
  },
  {
    slug: "png-to-bmp",
    from: "PNG",
    to: "image/bmp",
    toLabel: "BMP",
    title: "PNG to BMP Converter — Free, No Upload",
    h1: "Convert PNG to BMP",
    description:
      "Convert PNG to BMP online free. Produce an uncompressed bitmap for legacy software and hardware that requires it. Runs in your browser, nothing uploaded.",
    keywords:
      "png to bmp, convert png to bmp, png to bmp converter, png bmp online free",
    intro: (
      <>
        <p>
          Some legacy Windows software, embedded displays, sign-making tools and
          lab instruments still require an uncompressed BMP. This page converts
          your PNG straight to that format without installing anything.
        </p>
        <p>
          Expect the output to be considerably larger than the PNG — that is
          inherent to BMP, which stores pixels without compression.
        </p>
      </>
    ),
    uses: [
      "Feeding images to legacy Windows or industrial software",
      "Preparing bitmaps for embedded screens and signage hardware",
      "Meeting a specification that explicitly demands BMP",
    ],
    faqs: [
      { q: "Why is the BMP bigger than my PNG?", a: "BMP does not compress. A PNG that is a few hundred KB can become several megabytes as a BMP — that is expected, not a fault." },
      { q: "Is transparency preserved?", a: "No. The BMP output here is flattened, so transparent areas are rendered against a solid background." },
      { q: "Are my files uploaded?", a: "No. Conversion runs entirely in your browser." },
    ],
  },
];

export const getConvertPreset = (slug: string) =>
  convertPresets.find((p) => p.slug === slug);
