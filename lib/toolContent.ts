export type ToolExtra = {
  benefitsTitle?: string;
  benefits: { title: string; body: string }[];
  useCases: string[];
};

/**
 * Per-tool "Why use it" + "Common use cases" content. Tool-specific and concise
 * by design — scannable, genuinely useful, no padded filler.
 */
export const toolExtraContent: Record<string, ToolExtra> = {
  "/image/compress": {
    benefits: [
      { title: "Hit an exact KB target", body: "Type a size like 200KB or 50KB and the tool searches quality levels (and downscales if needed) to land at or just under it — the feature most compressors lack." },
      { title: "Quality you control", body: "Keep the highest possible quality for your chosen size. For mild compression the difference is invisible to the eye." },
      { title: "Truly private", body: "Every image is processed on your own device with nothing uploaded — safe for IDs, certificates and personal photos." },
    ],
    useCases: [
      "Shrink a photo to fit a government or exam portal's upload limit",
      "Compress images so a web page loads faster and scores better on Core Web Vitals",
      "Reduce a batch of product shots before emailing or listing them",
      "Get a passport or signature photo under a strict KB cap",
    ],
  },
  "/image/heic-to-jpg": {
    benefits: [
      { title: "Open iPhone photos anywhere", body: "Convert HEIC/HEIF to JPG so images open on Windows, Android, older software and any website that rejects HEIC." },
      { title: "Batch in one go", body: "Drop in many photos at once and convert them all, then download individually or as a single ZIP." },
      { title: "Choose your quality", body: "A quality slider lets you balance file size against detail; at 85–100% the result is visually identical." },
    ],
    useCases: [
      "Upload iPhone photos to a site that only accepts JPG or PNG",
      "Share pictures with someone on a non-Apple device",
      "Attach photos to a form that can't read HEIC",
      "Archive iPhone shots in a universally-supported format",
    ],
  },
  "/image/background-remover": {
    benefits: [
      { title: "One-click AI cutout", body: "Automatically detect the subject and erase the background, producing a clean transparent PNG — no manual tracing." },
      { title: "Unlimited and watermark-free", body: "Unlike Remove.bg's one-free-image limit, there are no daily caps and never a watermark on your result." },
      { title: "Processed on your device", body: "The AI model runs locally in your browser; your photo is never uploaded, only the model files are fetched once." },
    ],
    useCases: [
      "Create transparent product images for a marketplace or store",
      "Make a clean profile picture or headshot",
      "Prepare a passport-style photo on a white or coloured background",
      "Drop a subject onto a new background for a design or thumbnail",
    ],
  },
  "/image/convert": {
    benefits: [
      { title: "Every everyday format", body: "Convert between JPG, PNG, WebP and BMP in seconds, covering nearly all common image needs." },
      { title: "Batch with quality control", body: "Convert many files at once and set a quality slider for JPG/WebP to balance size and detail." },
      { title: "Faster, modern WebP", body: "Switch to WebP for noticeably smaller files at similar quality, helping pages load faster." },
    ],
    useCases: [
      "Turn a PNG screenshot into a smaller JPG for email",
      "Convert images to WebP to speed up a website",
      "Change a WebP download back to JPG for older software",
      "Standardise a mixed folder of images to one format",
    ],
  },
  "/image/resize": {
    benefits: [
      { title: "Exact pixel dimensions", body: "Set the precise width and height you need — ideal for forms, marketplaces and social profiles that demand a specific size." },
      { title: "Aspect ratio locked", body: "Keep proportions by default so images never look stretched, or unlock to set each dimension independently." },
      { title: "Private and instant", body: "Resizing runs on the HTML canvas in your browser; your image never leaves your device." },
    ],
    useCases: [
      "Resize a photo to an exact size required by a form or portal",
      "Make a large image smaller for the web",
      "Fit an image to a social-media or profile-picture spec",
      "Downscale a batch of images to consistent dimensions",
    ],
  },
  "/image/crop": {
    benefits: [
      { title: "Keep exactly what matters", body: "Drag to select the area you want and discard the rest, at full original quality with no re-scaling." },
      { title: "Preset aspect ratios", body: "Lock to 1:1, 4:3 or 16:9 to crop perfectly for avatars, thumbnails and banners." },
      { title: "No quality loss", body: "Cropping keeps a region of the original pixels untouched, so the kept area stays pixel-perfect." },
    ],
    useCases: [
      "Crop a profile picture to a clean square",
      "Straighten and tidy a scanned document or photo",
      "Frame a product shot by removing distracting edges",
      "Cut an image to a fixed ratio for social media",
    ],
  },
  "/image/flip-rotate": {
    benefits: [
      { title: "Any angle, plus flips", body: "Rotate 90°, 180° or a custom angle and mirror horizontally or vertically, with a live preview." },
      { title: "Clean edges", body: "PNG and WebP keep transparent corners; JPG fills them white so rotated images stay tidy." },
      { title: "Runs locally", body: "Everything happens on the canvas in your browser — nothing is uploaded." },
    ],
    useCases: [
      "Fix a photo that imported sideways or upside down",
      "Mirror a selfie so text reads the right way round",
      "Rotate a scanned page to the correct orientation",
      "Straighten a tilted image by a custom angle",
    ],
  },
  "/image/upscale": {
    benefits: [
      { title: "2×–4× larger", body: "Enlarge images with high-quality resampling that keeps edges smooth instead of blocky." },
      { title: "Honest results", body: "Great for general enlargement; it improves smoothness rather than inventing detail that was never captured." },
      { title: "No upload", body: "The work runs entirely in your browser, so even large images stay private." },
    ],
    useCases: [
      "Make a small image big enough for a print or banner",
      "Enlarge a logo or product shot for a larger display",
      "Scale up a thumbnail for reuse",
      "Get a higher-resolution copy without a desktop editor",
    ],
  },
  "/image/filters": {
    benefits: [
      { title: "14 one-click presets", body: "Grayscale, Sepia, Vintage, Cool, Warm, Vivid, Matte, Dramatic and more — applied instantly." },
      { title: "Fine-tune manually", body: "Adjust brightness, contrast, saturation, hue and blur on top of any preset, with a live preview." },
      { title: "Private editing", body: "All editing happens on the canvas in your browser; photos are never uploaded." },
    ],
    useCases: [
      "Give social posts a consistent look",
      "Warm up or cool down a dull photo",
      "Convert an image to clean black and white",
      "Quickly correct exposure or saturation before sharing",
    ],
  },
  "/image/rounded-corners": {
    benefits: [
      { title: "Smooth corners or a circle", body: "Pick a radius preset — Slight to Circle — and round any image, with a live preview." },
      { title: "Transparent PNG output", body: "Export with fully transparent corners so the image drops cleanly onto any background." },
      { title: "In-browser", body: "Rounding happens locally; your image never leaves your device." },
    ],
    useCases: [
      "Make a circular avatar or profile picture",
      "Create rounded app icons or UI thumbnails",
      "Soften product images for a card layout",
      "Prepare avatars for a website or presentation",
    ],
  },
  "/image/color-picker": {
    benefits: [
      { title: "Pixel-perfect colours", body: "Click anywhere on an image to read its exact HEX, RGB and HSL value." },
      { title: "Instant palette", body: "Automatically extract the dominant colours from the whole image as a ready-made palette." },
      { title: "Copy in one click", body: "Tap any value to copy it; recent colours are kept for the session." },
    ],
    useCases: [
      "Match a brand colour from a logo",
      "Build a palette from a reference photo",
      "Grab an exact shade for CSS or design",
      "Sample accent colours for a presentation or site",
    ],
  },
  "/image/remove-exif": {
    benefits: [
      { title: "Strip hidden GPS data", body: "Remove the location, device and timestamp metadata cameras embed, so shared photos can't reveal where they were taken." },
      { title: "Looks identical", body: "Only the hidden metadata is removed; the visible image is unchanged." },
      { title: "Stays on your device", body: "The entire process runs in your browser — exactly why it's safe for personal photos." },
    ],
    useCases: [
      "Remove GPS location before posting a photo online",
      "Clean metadata before selling an item with pictures",
      "Protect your privacy when sending images to strangers",
      "Scrub device and timestamp data from a batch of photos",
    ],
  },
  "/image/image-to-text": {
    benefits: [
      { title: "OCR in your browser", body: "Pull editable text out of a screenshot, photo or scan without retyping it by hand." },
      { title: "Multiple languages", body: "Recognises English, Hindi, Arabic, French and Spanish for accurate extraction." },
      { title: "Edit before you save", body: "The text appears in an editable box so you can fix any mistakes, then copy or download as TXT or DOCX." },
    ],
    useCases: [
      "Copy text from a screenshot or photo",
      "Digitise printed notes or a page from a book",
      "Pull a code, address or quote out of an image",
      "Extract text from a receipt or document scan",
    ],
  },
};
