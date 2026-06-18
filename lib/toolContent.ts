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

  "/pdf/compress": {
    benefits: [
      { title: "Email-ready in seconds", body: "Shrink a heavy PDF so it slips under email and upload size limits without a desktop app." },
      { title: "Choose your level", body: "Pick Low, Medium or High to balance how small the file gets against visual quality." },
      { title: "Stays on your device", body: "Compression runs in your browser with WebAssembly — confidential reports are never uploaded." },
    ],
    useCases: [
      "Email a large scanned document or report",
      "Upload a PDF to a portal with a strict size limit",
      "Save storage on a folder of heavy PDFs",
      "Speed up sharing a brochure or deck",
    ],
  },
  "/pdf/merge": {
    benefits: [
      { title: "Combine in any order", body: "Add as many PDFs as you like and drag them into the exact sequence before merging." },
      { title: "No watermark, no limits", body: "Unlike iLovePDF and Smallpdf free tiers, there are no daily caps and never a watermark." },
      { title: "Private by design", body: "Files are merged locally with pdf-lib and never leave your device." },
    ],
    useCases: [
      "Join scanned contract pages into one file",
      "Bundle invoices or receipts for an expense claim",
      "Combine chapters or reports before sending",
      "Merge a cover letter and résumé into a single PDF",
    ],
  },
  "/pdf/split": {
    benefits: [
      { title: "Extract exactly what you need", body: "Type a printer-style range like 1,3,5-8 to pull only the pages you want." },
      { title: "Split into separate files", body: "Break a document into individual pages, bundled as a convenient ZIP." },
      { title: "Byte-perfect pages", body: "Pages are copied exactly, so text, fonts and layout are preserved." },
    ],
    useCases: [
      "Pull a single page out of a long statement",
      "Separate a signed form from a scanned packet",
      "Break a merged file back into chapters",
      "Share just the relevant pages of a report",
    ],
  },
  "/pdf/pdf-to-jpg": {
    benefits: [
      { title: "Crisp page images", body: "Render any PDF page to a high-quality JPG at the resolution you choose." },
      { title: "Pick pages and quality", body: "Convert all pages or a specific range, and download individually or as a ZIP." },
      { title: "No queue, no upload", body: "Pages are rendered locally with pdf.js — nothing waits in a server queue." },
    ],
    useCases: [
      "Post a PDF page as an image to social media",
      "Upload a document where only images are accepted",
      "Create a thumbnail or preview of a PDF",
      "Grab a single chart or figure from a report",
    ],
  },
  "/pdf/jpg-to-pdf": {
    benefits: [
      { title: "Photos into one PDF", body: "Turn many images into a single, shareable document in the order you arrange them." },
      { title: "Fit or A4 pages", body: "Match each page to its image, or place images centred on standard A4 for printing." },
      { title: "Clean output", body: "The PDF is assembled in your browser with no watermark or branding." },
    ],
    useCases: [
      "Combine photos of documents into one file",
      "Submit scanned receipts as a single attachment",
      "Package a set of images for printing",
      "Turn whiteboard or note photos into a PDF",
    ],
  },
  "/pdf/png-to-pdf": {
    benefits: [
      { title: "Lossless screenshots", body: "PNG keeps sharp edges and transparency — ideal for screenshots, logos and diagrams." },
      { title: "Merge or per-image", body: "Combine PNGs into one PDF or export one PDF per image as a ZIP." },
      { title: "Standard page sizes", body: "Choose Fit, A4 or Letter with orientation and margins to suit printing." },
    ],
    useCases: [
      "Turn screenshots into a single PDF",
      "Convert logos or diagrams for a document",
      "Package design exports for a client",
      "Create a printable PDF from PNG graphics",
    ],
  },
  "/pdf/unlock": {
    benefits: [
      { title: "Remove the password", body: "Open and re-save a PDF you own without re-entering the password each time." },
      { title: "Lift restrictions", body: "Clear printing and copying limits so you can use a document normally." },
      { title: "Safe for sensitive files", body: "Your password and PDF are used only in your browser and never uploaded." },
    ],
    useCases: [
      "Stop retyping a password on your bank statement",
      "Enable printing or copying on a restricted PDF",
      "Open a policy or salary document repeatedly with ease",
      "Prepare an authorised PDF for editing",
    ],
  },
  "/pdf/rotate": {
    benefits: [
      { title: "Fix any orientation", body: "Rotate all pages or just a chosen range by 90°, 180° or 270°." },
      { title: "Zero quality loss", body: "Rotation only changes each page's orientation flag, leaving content untouched." },
      { title: "Private and instant", body: "Runs locally with pdf-lib; your document never leaves your device." },
    ],
    useCases: [
      "Correct pages that scanned in sideways",
      "Turn a landscape page upright",
      "Rotate only the few pages that need it",
      "Fix a phone-scanned document before sending",
    ],
  },
  "/pdf/pdf-to-word": {
    benefits: [
      { title: "Editable text out", body: "Pull the text from a PDF into a Word (.docx) file you can open and edit anywhere." },
      { title: "Review before saving", body: "The extracted text appears in an editable box so you can clean it up first." },
      { title: "Stays private", body: "Runs in your browser with pdf.js — your document is never uploaded." },
    ],
    useCases: [
      "Update a contract you only have as a PDF",
      "Reuse paragraphs from a report",
      "Fix a typo in a PDF document",
      "Move PDF text into Word or Google Docs",
    ],
  },
  "/pdf/word-to-pdf": {
    benefits: [
      { title: "Formatting preserved", body: "Headings, bold, lists and paragraphs are rendered faithfully into a clean PDF." },
      { title: "Batch + ZIP", body: "Convert several .docx files at once and download them together." },
      { title: "No watermark", body: "Conversion runs in your browser with no branding added and nothing uploaded." },
    ],
    useCases: [
      "Send a résumé or cover letter as a tamper-resistant PDF",
      "Submit an assignment in PDF format",
      "Lock a contract's layout before sharing",
      "Make a document look identical on every device",
    ],
  },
  "/pdf/ocr": {
    benefits: [
      { title: "Scans become searchable", body: "Turn image-based, scanned PDFs into real, selectable, copyable text." },
      { title: "Multiple languages", body: "Recognises English, Hindi, Arabic, French and Spanish with per-page progress." },
      { title: "Never uploaded", body: "OCR runs in your browser with Tesseract.js; only the language model is fetched." },
    ],
    useCases: [
      "Make a scanned contract searchable",
      "Copy text from an old scanned book or page",
      "Extract text from a photographed document",
      "Turn a scan into an editable draft",
    ],
  },
  "/pdf/number-pages": {
    benefits: [
      { title: "Full control", body: "Choose position, format (1, Page 1, 1 of N, - 1 -), starting number and font size." },
      { title: "Skip the cover", body: "Begin numbering on page 2 when page 1 is a title or cover sheet." },
      { title: "Clean and local", body: "Only the numbers are added — no watermark — and nothing is uploaded." },
    ],
    useCases: [
      "Number a thesis or dissertation",
      "Paginate a legal bundle or contract",
      "Add page numbers to a multi-chapter report",
      "Prepare a document for professional printing",
    ],
  },
  "/pdf/watermark": {
    benefits: [
      { title: "Text or logo", body: "Stamp custom text or upload a PNG/JPG logo across every page." },
      { title: "Full styling", body: "Control opacity, position and rotation, or tile text diagonally across the page." },
      { title: "Your mark only", body: "No third-party branding is added, and the file never leaves your browser." },
    ],
    useCases: [
      "Mark a document CONFIDENTIAL or DRAFT",
      "Brand a proposal with your company logo",
      "Protect work shared for review",
      "Add a copyright stamp before distributing",
    ],
  },
  "/pdf/protect": {
    benefits: [
      { title: "Real password encryption", body: "Locks the PDF with standard AES encryption so it simply can't be opened without the password — not just hidden behind a prompt." },
      { title: "Restrict, don't just block", body: "Optionally keep the file readable but stop people from printing, copying text or editing it." },
      { title: "Private by design", body: "Both the encryption and your password stay in your browser; the document is never uploaded." },
    ],
    useCases: [
      "Password-protect a contract or NDA before emailing it",
      "Lock a bank statement, payslip or tax document",
      "Stop a shared report from being printed or copied",
      "Secure a PDF on a shared or work computer",
    ],
  },
  "/pdf/sign": {
    benefits: [
      { title: "Draw or type", body: "Sign by hand with a mouse, trackpad or finger, or type your name in a signature-style font." },
      { title: "Place it exactly", body: "Drag your signature anywhere on the page and resize it to fit the signature line." },
      { title: "No print-and-scan", body: "Sign and return a document in seconds, entirely in your browser with nothing uploaded." },
    ],
    useCases: [
      "Sign a contract, offer letter or NDA",
      "Complete a consent or permission form",
      "Add your signature to a rental or service agreement",
      "Return a signed document without a printer or scanner",
    ],
  },
  "/pdf/fill": {
    benefits: [
      { title: "Auto-detects fields", body: "Reads the interactive text boxes, checkboxes and dropdowns in a PDF and lays them out as a simple form." },
      { title: "Flatten when final", body: "Optionally lock your answers into the page so the form can't be edited or cleared later." },
      { title: "Stays on your device", body: "The form and everything you type are processed locally and never uploaded." },
    ],
    useCases: [
      "Complete an application or onboarding form",
      "Fill in a government or tax form digitally",
      "Type answers neatly instead of by hand",
      "Send a locked, finished copy of a form",
    ],
  },
  "/image/blur-background": {
    benefits: [
      { title: "Portrait-style depth", body: "Keeps your subject sharp while softly blurring the background for a clean, professional look." },
      { title: "Adjustable strength", body: "A slider takes you from a subtle softening to a strong, dramatic blur, with a live preview." },
      { title: "AI runs on your device", body: "The subject is detected automatically — no manual masking — and your photo is never uploaded." },
    ],
    useCases: [
      "Clean up a busy background in a profile picture",
      "Give a product photo a distraction-free backdrop",
      "Add a depth-of-field look to a portrait",
      "Hide a messy room behind a video-call headshot",
    ],
  },
  "/audio/transcribe": {
    benefits: [
      { title: "Speech to text + subtitles", body: "Get a clean transcript and a timestamped .srt subtitle file from any audio or video with speech." },
      { title: "Private by default", body: "The AI model runs on your device — your recording is never uploaded, so it's safe for confidential interviews." },
      { title: "No limits, no signup", body: "No per-minute caps and no watermark; the model is cached after the first run so it starts instantly next time." },
    ],
    useCases: [
      "Transcribe an interview or podcast episode",
      "Caption a video with a downloadable .srt",
      "Turn a lecture or meeting recording into notes",
      "Pull quotes from a voice memo",
    ],
  },
  "/image/metadata-viewer": {
    benefits: [
      { title: "See what your file leaks", body: "Reveals the hidden EXIF and document metadata most people never see — GPS location, camera serial, software, author and timestamps." },
      { title: "Location risk, flagged", body: "If a photo carries GPS coordinates, it's highlighted with a map link so you know before you post it publicly." },
      { title: "Private by design", body: "The file is read entirely in your browser — nothing is uploaded — so it's safe to inspect sensitive documents and photos." },
    ],
    useCases: [
      "Check whether a photo reveals your home or location before posting",
      "Audit a PDF for a hidden author name or originating software",
      "See which camera and settings took a shot",
      "Confirm a file is clean after stripping its metadata",
    ],
  },

  "/calculators/emi": {
    benefits: [
      { title: "Full repayment picture", body: "See your monthly EMI, total interest and total amount payable instantly as you change the inputs." },
      { title: "Reducing-balance accuracy", body: "Uses the standard reducing-balance formula banks use, with a complete month-by-month schedule." },
      { title: "Any loan type", body: "Works for home, car, personal and education loans in years or months." },
    ],
    useCases: [
      "Plan a home or car loan before applying",
      "Compare EMIs across tenures and rates",
      "Check how a prepayment changes total interest",
      "Budget your monthly outgo on a new loan",
    ],
  },
  "/calculators/loan": {
    benefits: [
      { title: "Monthly payment + schedule", body: "Get your payment, total interest and a full amortization breakdown in seconds." },
      { title: "Flexible inputs", body: "Adjust amount, rate and term to instantly see the effect on cost." },
      { title: "Private", body: "All maths runs in your browser — nothing you enter is stored." },
    ],
    useCases: [
      "Estimate payments on any loan",
      "See the interest cost of a longer term",
      "Compare two loan offers side by side",
      "Plan a repayment budget",
    ],
  },
  "/calculators/sip": {
    benefits: [
      { title: "Project SIP growth", body: "See the future value of monthly mutual-fund investments with compounding returns." },
      { title: "Invested vs returns", body: "Understand how much is your contribution versus market growth." },
      { title: "Plan any goal", body: "Model different amounts, rates and durations to hit a target corpus." },
    ],
    useCases: [
      "Plan a SIP towards a financial goal",
      "See how monthly amount affects the final corpus",
      "Compare short vs long investment horizons",
      "Estimate retirement or education savings",
    ],
  },
  "/calculators/compound-interest": {
    benefits: [
      { title: "See compounding work", body: "Watch how interest on interest grows a principal over time." },
      { title: "Flexible frequency", body: "Model yearly, half-yearly, quarterly or monthly compounding." },
      { title: "Clear breakdown", body: "Separate your principal from the interest earned." },
    ],
    useCases: [
      "Project growth of a fixed deposit or savings",
      "Compare compounding frequencies",
      "Plan a lump-sum investment",
      "Understand long-term wealth growth",
    ],
  },
  "/calculators/gst": {
    benefits: [
      { title: "Add or remove GST", body: "Calculate GST-inclusive and GST-exclusive prices both ways." },
      { title: "All slabs", body: "Works with 5%, 12%, 18% and 28% or any custom rate." },
      { title: "Instant split", body: "See the base amount, GST amount and final total clearly." },
    ],
    useCases: [
      "Work out the GST on an invoice",
      "Find the pre-tax price from a final amount",
      "Check the tax on a purchase",
      "Prepare quotes with correct GST",
    ],
  },
  "/calculators/salary": {
    benefits: [
      { title: "CTC to in-hand", body: "Estimate your monthly take-home from CTC after PF, professional tax and income tax." },
      { title: "New vs old regime", body: "Compare both tax regimes side by side using the latest slabs." },
      { title: "Transparent deductions", body: "See exactly what's deducted on the way from gross to net." },
    ],
    useCases: [
      "Understand a job offer's real take-home pay",
      "Compare in-hand under old vs new regime",
      "Plan monthly budget from your salary",
      "Check the impact of a raise on take-home",
    ],
  },
  "/calculators/bmi": {
    benefits: [
      { title: "Instant BMI + category", body: "Get your body mass index and where it falls (underweight to obese)." },
      { title: "Metric or imperial", body: "Enter height and weight in the units you prefer." },
      { title: "Healthy range", body: "See the weight range considered healthy for your height." },
    ],
    useCases: [
      "Check your BMI quickly",
      "Track progress towards a healthy weight",
      "See your healthy weight range",
      "Compare BMI before and after a fitness plan",
    ],
  },
  "/calculators/calorie": {
    benefits: [
      { title: "BMR and TDEE", body: "Calculate the calories you burn at rest and with activity using Mifflin-St Jeor." },
      { title: "Goal targets", body: "Get calorie targets for losing, maintaining or gaining weight." },
      { title: "Activity-aware", body: "Adjust for your real activity level for a realistic number." },
    ],
    useCases: [
      "Find your daily maintenance calories",
      "Set a deficit for weight loss",
      "Plan a surplus to gain muscle",
      "Understand how activity changes your needs",
    ],
  },
  "/calculators/percentage": {
    benefits: [
      { title: "Seven calculations", body: "Cover every common percentage question in one tool." },
      { title: "Instant answers", body: "Results update as you type, with the formula made clear." },
      { title: "No setup", body: "Just enter your numbers — no signup, no maths by hand." },
    ],
    useCases: [
      "Work out a percentage of a number",
      "Find percentage increase or decrease",
      "Calculate what percent one number is of another",
      "Check a discount or markup",
    ],
  },
  "/calculators/age": {
    benefits: [
      { title: "Exact age", body: "Get age in years, months and days from a date of birth, accurate to leap years." },
      { title: "More detail", body: "See total days, weeks and your next-birthday countdown." },
      { title: "Any date", body: "Measure age as of any past or future date." },
    ],
    useCases: [
      "Find your exact age from your date of birth",
      "Check age for an eligibility cut-off",
      "Count days until a birthday",
      "Work out the age gap between two people",
    ],
  },
  "/calculators/tip": {
    benefits: [
      { title: "Tip and total", body: "Calculate the tip and final bill at any percentage." },
      { title: "Split the bill", body: "Divide the total evenly across any number of people." },
      { title: "Instant", body: "Adjust the percentage or party size and see updates immediately." },
    ],
    useCases: [
      "Work out a restaurant tip",
      "Split a bill among friends",
      "Decide a fair gratuity",
      "Calculate per-person cost quickly",
    ],
  },
  "/calculators/discount": {
    benefits: [
      { title: "Sale price + savings", body: "See the final price and how much you save at any discount." },
      { title: "Any percentage", body: "Works for single or stacked discounts." },
      { title: "Quick checks", body: "Confirm a deal before you buy." },
    ],
    useCases: [
      "Find the price after a percentage off",
      "See how much a sale saves you",
      "Compare two discounted offers",
      "Check a coupon's real value",
    ],
  },
  "/calculators/word-counter": {
    benefits: [
      { title: "Words and characters", body: "Count words, characters, sentences and paragraphs in real time." },
      { title: "Reading time", body: "Estimate how long your text takes to read." },
      { title: "Private", body: "Your text is analysed in your browser and never uploaded." },
    ],
    useCases: [
      "Stay within an essay or article word limit",
      "Check character counts for meta tags or bios",
      "Estimate reading time for a post",
      "Count words in a draft quickly",
    ],
  },
  "/calculators/unit-converter": {
    benefits: [
      { title: "Every category", body: "Convert length, weight, temperature, volume, area, speed, data and time." },
      { title: "All units at once", body: "Enter a value and read every equivalent unit instantly." },
      { title: "Accurate", body: "Uses exact formulas and standard conversion factors." },
    ],
    useCases: [
      "Convert cm to inches or kg to lbs",
      "Switch Celsius and Fahrenheit",
      "Convert units while cooking or travelling",
      "Handle quick engineering or study conversions",
    ],
  },
  "/calculators/date": {
    benefits: [
      { title: "Days between dates", body: "Find the gap in years, months, days, plus total days and business days." },
      { title: "Add or subtract", body: "Shift a date forward or back by any number of days." },
      { title: "Week numbers", body: "Look up ISO week numbers and quarters for any date." },
    ],
    useCases: [
      "Count days until a deadline",
      "Work out a notice period or due date",
      "Add days to a start date",
      "Find business days between two dates",
    ],
  },

  "/image/watermark": {
    benefits: [
      { title: "Text watermark, your way", body: "Control the text, size, colour, opacity and position, or tile it diagonally across the whole image." },
      { title: "No third-party mark", body: "Only your watermark is added — never any GetFreeToolsAI branding." },
      { title: "Stays private", body: "The image is drawn on a canvas in your browser and never uploaded." },
    ],
    useCases: [
      "Protect photos before posting them online",
      "Brand product images with your name or handle",
      "Mark proofs as a sample before payment",
      "Add a copyright line to your work",
    ],
  },
  "/image/meme-maker": {
    benefits: [
      { title: "Classic meme style", body: "Bold uppercase text with a black outline, top and bottom, just like the originals." },
      { title: "No watermark", body: "Your meme downloads clean — no branding, no signup." },
      { title: "In your browser", body: "The image never leaves your device; everything renders on a canvas locally." },
    ],
    useCases: [
      "Make a quick reaction meme",
      "Add a caption to a screenshot",
      "Create memes for social posts",
      "Put top and bottom text on any photo",
    ],
  },
};
