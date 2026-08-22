import {
  FileArchive,
  Combine,
  Scissors,
  FileImage,
  FileUp,
  LockOpen,
  RotateCw,
  FileType2,
  ScanText,
  ImageDown,
  Smartphone,
  Eraser,
  Replace,
  Maximize2,
  Crop,
  ShieldOff,
  TextCursorInput,
  ScanSearch,
  Images,
  ShieldCheck,
  FileType,
  Signature,
  FormInput,
  Hash,
  Stamp,
  Expand,
  Droplets,
  FlipHorizontal,
  Aperture,
  SlidersHorizontal,
  Frame,
  Pipette,
  Smile,
  Landmark,
  Scale,
  Flame,
  Percent,
  CalendarDays,
  HandCoins,
  ReceiptIndianRupee,
  TrendingUp,
  Tag,
  Banknote,
  LineChart,
  Wallet,
  Type,
  Ruler,
  CalendarClock,
  Captions,
  CaseSensitive,
  Pilcrow,
  WrapText,
  ArrowDownAZ,
  Link2,
  Minimize2,
  Music,
  Clapperboard,
  Receipt,
  PiggyBank,
  Repeat,
  Vault,
  Award,
  LayoutGrid,
  FileMinus2,
  House,
  Umbrella,
  Coins,
  Baby,
  HeartPulse,
  PersonStanding,
  AppWindow,
  Braces,
  Contact,
  Sparkles,
  Ghost,
  FlipVertical2,
  Terminal,
  TriangleAlert,
  MonitorX,
  MessageCircle,
  MessageSquareText,
  RadioTower,
  HousePlus,
  Car,
  Briefcase,
  CreditCard,
  Store,
  FlipHorizontal2,
  Repeat2,
  TextSearch,
  Space,
  ArrowUpDown,
  CircleDollarSign,
  Gauge,
  Rocket,
  TrendingDown,
  Sprout,
  Building2,
  GraduationCap,
  School,
  ScrollText,
  BadgeIndianRupee,
  ShoppingBasket,
  Armchair,
  Disc3,
  Keyboard,
  Zap,
  Disc,
  MessageSquareDashed,
  MessagesSquare,
  MessageSquareQuote,
  Bot,
  MonitorDown,
  GitCompareArrows,
  Volume2,
  Sigma,
  // NB: lucide's `Instagram` icon is deprecated (brand icons were retired), so
  // the DM generator uses the generic handle glyph instead.
  AtSign,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Whether the tool has a working page built. */
  ready: boolean;
};

export const pdfTools: Tool[] = [
  { name: "Compress PDF", description: "Shrink PDF without quality loss", href: "/pdf/compress", icon: FileArchive, ready: true },
  { name: "Merge PDF", description: "Combine multiple PDFs into one", href: "/pdf/merge", icon: Combine, ready: true },
  { name: "Split PDF", description: "Extract pages from any PDF", href: "/pdf/split", icon: Scissors, ready: true },
  { name: "PDF to JPG", description: "Convert PDF pages to images", href: "/pdf/pdf-to-jpg", icon: FileImage, ready: true },
  { name: "JPG to PDF", description: "Convert images to PDF document", href: "/pdf/jpg-to-pdf", icon: FileUp, ready: true },
  { name: "PNG to PDF", description: "Convert PNG images to PDF", href: "/pdf/png-to-pdf", icon: Images, ready: true },
  { name: "Unlock PDF", description: "Remove PDF password protection", href: "/pdf/unlock", icon: LockOpen, ready: true },
  { name: "Protect PDF", description: "Add a password to your PDF", href: "/pdf/protect", icon: ShieldCheck, ready: true },
  { name: "Rotate PDF", description: "Rotate PDF pages instantly", href: "/pdf/rotate", icon: RotateCw, ready: true },
  { name: "PDF to Word", description: "Convert PDF to editable Word doc", href: "/pdf/pdf-to-word", icon: FileType2, ready: true },
  { name: "Word to PDF", description: "Convert Word documents to PDF", href: "/pdf/word-to-pdf", icon: FileType, ready: true },
  { name: "Sign PDF", description: "Draw, type or upload a signature", href: "/pdf/sign", icon: Signature, ready: true },
  { name: "Fill PDF", description: "Fill out PDF forms online", href: "/pdf/fill", icon: FormInput, ready: true },
  { name: "PDF OCR", description: "Extract text from scanned PDFs", href: "/pdf/ocr", icon: ScanText, ready: true },
  { name: "Add Page Numbers", description: "Number your PDF pages", href: "/pdf/number-pages", icon: Hash, ready: true },
  { name: "Add Watermark", description: "Add a watermark to your PDF", href: "/pdf/watermark", icon: Stamp, ready: true },
  { name: "Organize PDF", description: "Reorder, rotate & delete pages", href: "/pdf/organize", icon: LayoutGrid, ready: true },
  { name: "Delete PDF Pages", description: "Remove pages from a PDF", href: "/pdf/delete-pages", icon: FileMinus2, ready: true },
];

export const imageTools: Tool[] = [
  { name: "Compress Image", description: "Compress to exact KB size", href: "/image/compress", icon: ImageDown, ready: true },
  { name: "HEIC to JPG", description: "Convert iPhone photos to JPG", href: "/image/heic-to-jpg", icon: Smartphone, ready: true },
  { name: "Background Remover", description: "Remove image background", href: "/image/background-remover", icon: Eraser, ready: true },
  { name: "Convert Image", description: "JPG PNG WebP conversion", href: "/image/convert", icon: Replace, ready: true },
  { name: "Resize Image", description: "Resize to exact dimensions", href: "/image/resize", icon: Maximize2, ready: true },
  { name: "Crop Image", description: "Crop images in browser", href: "/image/crop", icon: Crop, ready: true },
  { name: "Flip & Rotate", description: "Rotate and flip images", href: "/image/flip-rotate", icon: FlipHorizontal, ready: true },
  { name: "Image Upscaler", description: "Enhance & upscale resolution", href: "/image/upscale", icon: Expand, ready: true },
  { name: "Image Filters", description: "Filters, brightness & contrast", href: "/image/filters", icon: SlidersHorizontal, ready: true },
  { name: "Blur Background", description: "Blur the background with AI", href: "/image/blur-background", icon: Aperture, ready: true },
  { name: "Add Watermark", description: "Add a text watermark to images", href: "/image/watermark", icon: Droplets, ready: true },
  { name: "Round Corners", description: "Add rounded corners to images", href: "/image/rounded-corners", icon: Frame, ready: true },
  { name: "Color Picker", description: "Pick colors from any image", href: "/image/color-picker", icon: Pipette, ready: true },
  { name: "Meme Maker", description: "Create memes, no watermark", href: "/image/meme-maker", icon: Smile, ready: true },
  { name: "Remove EXIF", description: "Strip photo metadata & GPS", href: "/image/remove-exif", icon: ShieldOff, ready: true },
  { name: "Image to Text", description: "Extract text from any image", href: "/image/image-to-text", icon: TextCursorInput, ready: true },
  { name: "Metadata Viewer", description: "See hidden EXIF, GPS & metadata", href: "/image/metadata-viewer", icon: ScanSearch, ready: true },
  { name: "Favicon Generator", description: "Make favicons in every size + ICO", href: "/image/favicon", icon: AppWindow, ready: true },
  { name: "Passport Photo Maker", description: "Crop to passport size & print sheet", href: "/image/passport-photo", icon: Contact, ready: true },
  { name: "Image to Base64", description: "Encode images to data URI, CSS & HTML", href: "/image/to-base64", icon: Braces, ready: true },
];

export const calculatorTools: Tool[] = [
  { name: "EMI Calculator", description: "Loan EMI, interest & schedule", href: "/calculators/emi", icon: Landmark, ready: true },
  { name: "Loan Calculator", description: "Monthly payment & amortization", href: "/calculators/loan", icon: Banknote, ready: true },
  { name: "SIP Calculator", description: "Mutual fund SIP returns", href: "/calculators/sip", icon: TrendingUp, ready: true },
  { name: "Compound Interest", description: "Investment growth over time", href: "/calculators/compound-interest", icon: LineChart, ready: true },
  { name: "GST Calculator", description: "Add or remove GST", href: "/calculators/gst", icon: ReceiptIndianRupee, ready: true },
  { name: "Salary Calculator", description: "CTC to in-hand salary", href: "/calculators/salary", icon: Wallet, ready: true },
  { name: "BMI Calculator", description: "Body mass index & range", href: "/calculators/bmi", icon: Scale, ready: true },
  { name: "Calorie Calculator", description: "BMR, TDEE & macros", href: "/calculators/calorie", icon: Flame, ready: true },
  { name: "Percentage Calculator", description: "7 percentage calculations", href: "/calculators/percentage", icon: Percent, ready: true },
  { name: "Age Calculator", description: "Exact age in years, days", href: "/calculators/age", icon: CalendarDays, ready: true },
  { name: "Tip Calculator", description: "Tip & split the bill", href: "/calculators/tip", icon: HandCoins, ready: true },
  { name: "Discount Calculator", description: "Sale price & savings", href: "/calculators/discount", icon: Tag, ready: true },
  { name: "Word Counter", description: "Words, characters & reading time", href: "/calculators/word-counter", icon: Type, ready: true },
  { name: "Unit Converter", description: "Length, weight, temperature", href: "/calculators/unit-converter", icon: Ruler, ready: true },
  { name: "Date Calculator", description: "Days between dates", href: "/calculators/date", icon: CalendarClock, ready: true },
  { name: "Income Tax Calculator", description: "Old vs new regime, FY 2025-26", href: "/calculators/income-tax", icon: Receipt, ready: true },
  { name: "FD Calculator", description: "Fixed deposit maturity & interest", href: "/calculators/fd", icon: PiggyBank, ready: true },
  { name: "RD Calculator", description: "Recurring deposit maturity", href: "/calculators/rd", icon: Repeat, ready: true },
  { name: "PPF Calculator", description: "PPF maturity over 15 years", href: "/calculators/ppf", icon: Vault, ready: true },
  { name: "Gratuity Calculator", description: "Gratuity from years of service", href: "/calculators/gratuity", icon: Award, ready: true },
  { name: "HRA Calculator", description: "House rent allowance exemption", href: "/calculators/hra", icon: House, ready: true },
  { name: "NPS Calculator", description: "Pension corpus & monthly pension", href: "/calculators/nps", icon: Umbrella, ready: true },
  { name: "Simple Interest Calculator", description: "Interest on a principal amount", href: "/calculators/simple-interest", icon: Coins, ready: true },
  { name: "Due Date Calculator", description: "Pregnancy due date & week", href: "/calculators/due-date", icon: Baby, ready: true },
  { name: "Ovulation Calculator", description: "Fertile window & ovulation day", href: "/calculators/ovulation", icon: HeartPulse, ready: true },
  { name: "Body Fat Calculator", description: "Body fat % (US Navy method)", href: "/calculators/body-fat", icon: PersonStanding, ready: true },
  { name: "Roman Numeral Converter", description: "Numbers to Roman numerals & back", href: "/calculators/roman-numerals", icon: Sigma, ready: true },
  { name: "Mortgage Calculator", description: "Monthly payment with taxes, insurance & PMI", href: "/calculators/mortgage", icon: HousePlus, ready: true },
  { name: "Auto Loan Calculator", description: "Car payment with tax, trade-in & down payment", href: "/calculators/auto-loan", icon: Car, ready: true },
  { name: "401(k) Calculator", description: "Retirement balance with employer match", href: "/calculators/401k", icon: Briefcase, ready: true },
  { name: "Credit Card Payoff", description: "Months to pay off & total interest", href: "/calculators/credit-card-payoff", icon: CreditCard, ready: true },
  { name: "Sales Tax Calculator", description: "Add or back out US sales tax", href: "/calculators/sales-tax", icon: Store, ready: true },
  { name: "Lumpsum Calculator", description: "One-time mutual fund investment returns", href: "/calculators/lumpsum", icon: CircleDollarSign, ready: true },
  { name: "Step Up SIP Calculator", description: "SIP that increases every year", href: "/calculators/step-up-sip", icon: Rocket, ready: true },
  { name: "SWP Calculator", description: "Systematic withdrawal plan income", href: "/calculators/swp", icon: TrendingDown, ready: true },
  { name: "CAGR Calculator", description: "Compound annual growth rate", href: "/calculators/cagr", icon: Gauge, ready: true },
  { name: "SSY Calculator", description: "Sukanya Samriddhi Yojana maturity", href: "/calculators/ssy", icon: Sprout, ready: true },
  { name: "EPF Calculator", description: "Provident fund corpus at retirement", href: "/calculators/epf", icon: Building2, ready: true },
  { name: "CGPA to Percentage", description: "Convert CGPA to percentage (CBSE)", href: "/calculators/cgpa-to-percentage", icon: GraduationCap, ready: true },
  { name: "Percentage to CGPA", description: "Convert percentage to CGPA", href: "/calculators/percentage-to-cgpa", icon: School, ready: true },
  { name: "NSC Calculator", description: "National Savings Certificate maturity", href: "/calculators/nsc", icon: ScrollText, ready: true },
  { name: "SCSS Calculator", description: "Senior Citizen Savings Scheme income", href: "/calculators/scss", icon: BadgeIndianRupee, ready: true },
  { name: "Inflation Calculator", description: "Future cost & buying power of money", href: "/calculators/inflation", icon: ShoppingBasket, ready: true },
  { name: "Retirement Calculator", description: "Corpus you need to retire", href: "/calculators/retirement", icon: Armchair, ready: true },
];

export const audioTools: Tool[] = [
  { name: "Transcribe Audio & Video", description: "Speech to text + subtitles, on-device", href: "/audio/transcribe", icon: Captions, ready: true },
];

export const videoTools: Tool[] = [
  { name: "Compress Video", description: "Shrink video size, no upload", href: "/video/compress", icon: Minimize2, ready: true },
  { name: "Video to MP3", description: "Extract audio from any video", href: "/video/to-mp3", icon: Music, ready: true },
  { name: "Video to GIF", description: "Turn a clip into an animated GIF", href: "/video/to-gif", icon: Clapperboard, ready: true },
];

export const textTools: Tool[] = [
  { name: "Case Converter", description: "UPPER, lower, Title, camelCase & more", href: "/text/case-converter", icon: CaseSensitive, ready: true },
  { name: "Lorem Ipsum Generator", description: "Placeholder text by words or paragraphs", href: "/text/lorem-ipsum", icon: Pilcrow, ready: true },
  { name: "Remove Line Breaks", description: "Flatten text & clean up spacing", href: "/text/remove-line-breaks", icon: WrapText, ready: true },
  { name: "Remove Duplicate Lines", description: "Dedupe, sort & trim lines", href: "/text/remove-duplicate-lines", icon: ArrowDownAZ, ready: true },
  { name: "Slug Generator", description: "Turn any text into a URL slug", href: "/text/slug-generator", icon: Link2, ready: true },
  { name: "Reverse Text", description: "Flip text, words or lines backwards", href: "/text/reverse-text", icon: FlipHorizontal2, ready: true },
  { name: "Text Repeater", description: "Repeat text any number of times", href: "/text/repeat-text", icon: Repeat2, ready: true },
  { name: "Find and Replace", description: "Replace words or patterns in bulk", href: "/text/find-and-replace", icon: TextSearch, ready: true },
  { name: "Remove Extra Spaces", description: "Trim spaces, tabs & blank lines", href: "/text/remove-extra-spaces", icon: Space, ready: true },
  { name: "Sort Lines", description: "Alphabetize & sort lines of text", href: "/text/sort-lines", icon: ArrowUpDown, ready: true },
  { name: "Text Compare", description: "Diff two texts & highlight changes", href: "/text/compare", icon: GitCompareArrows, ready: true },
  { name: "Text to Speech", description: "Read any text aloud, on-device", href: "/text/to-speech", icon: Volume2, ready: true },
];

export const funTools: Tool[] = [
  { name: "Fancy Text Generator", description: "𝓒𝓸𝓸𝓵 fonts & stylish text", href: "/fun/fancy-text", icon: Sparkles, ready: true },
  { name: "Glitch Text Generator", description: "Cursed z̸a̸l̸g̸o̸ glitch text", href: "/fun/glitch-text", icon: Ghost, ready: true },
  { name: "Upside Down Text", description: "Flip text ˙uʍop ǝpısdn", href: "/fun/upside-down-text", icon: FlipVertical2, ready: true },
  { name: "Hacker Typer", description: "Fake hacking screen prank", href: "/fun/hacker-typer", icon: Terminal, ready: true },
  { name: "Fake Error Message", description: "Windows-style error popup maker", href: "/fun/fake-error", icon: TriangleAlert, ready: true },
  { name: "Fake Blue Screen", description: "Full-screen BSOD prank", href: "/fun/blue-screen", icon: MonitorX, ready: true },
  { name: "Fake Tweet Generator", description: "Meme tweet mockups as images", href: "/fun/fake-tweet", icon: MessageCircle, ready: true },
  { name: "Fake Text Message", description: "Fake phone chat screenshots", href: "/fun/fake-text-message", icon: MessageSquareText, ready: true },
  { name: "Fake WhatsApp Chat", description: "Chat mockups with ticks & times", href: "/fun/fake-whatsapp", icon: MessageSquareDashed, ready: true },
  { name: "Fake Instagram DM", description: "DM screenshots with story ring", href: "/fun/fake-instagram-dm", icon: AtSign, ready: true },
  { name: "Fake Discord Chat", description: "Channel mockups with role colours", href: "/fun/fake-discord", icon: MessagesSquare, ready: true },
  { name: "Fake Reddit Post", description: "Thread screenshots with upvotes", href: "/fun/fake-reddit", icon: MessageSquareQuote, ready: true },
  { name: "Fake AI Chat", description: "ChatGPT-style chat screenshots", href: "/fun/fake-chatgpt", icon: Bot, ready: true },
  { name: "Fake Windows Update", description: "Full-screen update prank", href: "/fun/fake-windows-update", icon: MonitorDown, ready: true },
  { name: "Morse Code Translator", description: "Text ↔ Morse, with sound", href: "/fun/morse-code", icon: RadioTower, ready: true },
  { name: "Spin the Wheel", description: "Random picker wheel of names", href: "/fun/spin-wheel", icon: Disc3, ready: true },
  { name: "Typing Speed Test", description: "Measure your WPM & accuracy", href: "/fun/typing-test", icon: Keyboard, ready: true },
  { name: "Reaction Time Test", description: "How fast are your reflexes?", href: "/fun/reaction-time", icon: Zap, ready: true },
  { name: "Flip a Coin", description: "Heads or tails, with tally", href: "/fun/coin-flip", icon: Disc, ready: true },
];

export const allTools = [...pdfTools, ...imageTools, ...calculatorTools, ...audioTools, ...videoTools, ...textTools, ...funTools];

/**
 * Hand-tuned topical clusters. Each tool points first at its strongest
 * neighbours (inverse converters, adjacent workflows, cross-category bridges)
 * so authority flows along genuinely related paths instead of by list order.
 */
const relatedOverrides: Record<string, string[]> = {
  // PDF cluster + image bridges
  "/pdf/compress": ["/pdf/merge", "/pdf/split", "/image/compress", "/pdf/pdf-to-word"],
  "/pdf/merge": ["/pdf/split", "/pdf/compress", "/pdf/jpg-to-pdf", "/pdf/number-pages"],
  "/pdf/split": ["/pdf/merge", "/pdf/compress", "/pdf/rotate", "/pdf/pdf-to-jpg"],
  "/pdf/pdf-to-jpg": ["/pdf/jpg-to-pdf", "/image/compress", "/pdf/compress", "/pdf/split"],
  "/pdf/jpg-to-pdf": ["/pdf/pdf-to-jpg", "/pdf/png-to-pdf", "/image/compress", "/pdf/merge"],
  "/pdf/png-to-pdf": ["/pdf/jpg-to-pdf", "/pdf/pdf-to-jpg", "/image/convert", "/pdf/merge"],
  "/pdf/pdf-to-word": ["/pdf/ocr", "/pdf/word-to-pdf", "/pdf/compress", "/pdf/pdf-to-jpg"],
  "/pdf/word-to-pdf": ["/pdf/pdf-to-word", "/pdf/compress", "/pdf/merge", "/pdf/png-to-pdf"],
  "/pdf/ocr": ["/image/image-to-text", "/pdf/pdf-to-word", "/pdf/compress", "/pdf/split"],
  "/pdf/unlock": ["/pdf/protect", "/pdf/compress", "/pdf/merge", "/pdf/rotate"],
  "/pdf/protect": ["/pdf/unlock", "/pdf/sign", "/pdf/watermark", "/pdf/compress"],
  "/pdf/sign": ["/pdf/fill", "/pdf/protect", "/pdf/watermark", "/pdf/merge"],
  "/pdf/fill": ["/pdf/sign", "/pdf/pdf-to-word", "/pdf/merge", "/pdf/compress"],
  "/pdf/rotate": ["/pdf/split", "/pdf/merge", "/pdf/compress", "/image/flip-rotate"],
  "/pdf/number-pages": ["/pdf/merge", "/pdf/watermark", "/pdf/split", "/pdf/compress"],
  "/pdf/watermark": ["/pdf/number-pages", "/image/watermark", "/pdf/compress", "/pdf/merge"],
  "/pdf/organize": ["/pdf/delete-pages", "/pdf/split", "/pdf/merge", "/pdf/rotate"],
  "/pdf/delete-pages": ["/pdf/organize", "/pdf/split", "/pdf/merge", "/pdf/compress"],
  // Image cluster + pdf bridges
  "/image/compress": ["/image/resize", "/image/convert", "/pdf/compress", "/image/crop"],
  "/image/resize": ["/image/crop", "/image/compress", "/image/convert", "/image/upscale"],
  // Cropping is the step before a passport/visa photo sheet, and the passport
  // tool was otherwise reachable only from the /passport-photo-sizes hub.
  "/image/crop": ["/image/resize", "/image/passport-photo", "/image/rounded-corners", "/image/compress"],
  "/image/convert": ["/image/compress", "/image/heic-to-jpg", "/pdf/jpg-to-pdf", "/image/resize"],
  "/image/heic-to-jpg": ["/image/convert", "/image/compress", "/image/resize", "/pdf/jpg-to-pdf"],
  "/image/background-remover": ["/image/blur-background", "/image/passport-photo", "/image/crop", "/image/rounded-corners"],
  "/image/blur-background": ["/image/background-remover", "/image/filters", "/image/crop", "/image/resize"],
  "/image/upscale": ["/image/resize", "/image/compress", "/image/convert", "/image/filters"],
  "/image/flip-rotate": ["/image/crop", "/image/resize", "/pdf/rotate", "/image/filters"],
  "/image/filters": ["/image/upscale", "/image/crop", "/image/convert", "/image/rounded-corners"],
  "/image/rounded-corners": ["/image/crop", "/image/background-remover", "/image/resize", "/image/filters"],
  "/image/color-picker": ["/image/filters", "/image/convert", "/image/compress", "/image/crop"],
  "/image/remove-exif": ["/image/metadata-viewer", "/image/compress", "/image/convert", "/image/resize"],
  "/image/metadata-viewer": ["/image/remove-exif", "/image/compress", "/image/convert", "/image/color-picker"],
  "/image/image-to-text": ["/pdf/ocr", "/pdf/pdf-to-word", "/image/convert", "/image/compress"],
  "/image/favicon": ["/image/to-base64", "/image/convert", "/image/resize", "/image/rounded-corners"],
  "/image/passport-photo": ["/image/crop", "/image/resize", "/image/compress", "/image/background-remover"],
  "/image/to-base64": ["/image/favicon", "/image/convert", "/image/compress", "/image/resize"],
  // Text cluster
  "/text/case-converter": ["/text/slug-generator", "/text/to-speech", "/text/remove-line-breaks", "/text/remove-duplicate-lines"],
  "/text/lorem-ipsum": ["/text/case-converter", "/text/slug-generator", "/text/remove-line-breaks", "/calculators/word-counter"],
  "/text/remove-line-breaks": ["/text/remove-duplicate-lines", "/text/case-converter", "/text/slug-generator", "/calculators/word-counter"],
  "/text/remove-duplicate-lines": ["/text/compare", "/text/remove-line-breaks", "/text/case-converter", "/text/slug-generator"],
  "/text/slug-generator": ["/text/case-converter", "/text/remove-line-breaks", "/text/lorem-ipsum", "/calculators/word-counter"],
  "/text/reverse-text": ["/text/case-converter", "/text/sort-lines", "/text/repeat-text", "/text/find-and-replace"],
  "/text/repeat-text": ["/text/reverse-text", "/text/lorem-ipsum", "/text/case-converter", "/text/remove-extra-spaces"],
  "/text/find-and-replace": ["/text/compare", "/text/remove-extra-spaces", "/text/remove-line-breaks", "/text/case-converter"],
  "/text/remove-extra-spaces": ["/text/remove-line-breaks", "/text/remove-duplicate-lines", "/text/find-and-replace", "/text/sort-lines"],
  "/text/sort-lines": ["/text/remove-duplicate-lines", "/text/remove-extra-spaces", "/text/reverse-text", "/text/case-converter"],
  "/text/compare": ["/text/find-and-replace", "/text/remove-duplicate-lines", "/text/sort-lines", "/text/case-converter"],
  "/text/to-speech": ["/audio/transcribe", "/text/case-converter", "/text/remove-line-breaks", "/text/lorem-ipsum"],
  // Roman numerals sit with the other everyday conversions rather than the
  // finance cluster, which is what a visitor converting a date actually wants next.
  "/calculators/roman-numerals": ["/calculators/unit-converter", "/calculators/percentage", "/calculators/date", "/calculators/age"],
  // Fun / prank cluster
  "/fun/fancy-text": ["/fun/glitch-text", "/fun/upside-down-text", "/fun/morse-code", "/text/case-converter"],
  "/fun/glitch-text": ["/fun/fancy-text", "/fun/upside-down-text", "/fun/fake-tweet", "/fun/morse-code"],
  "/fun/upside-down-text": ["/fun/fancy-text", "/fun/glitch-text", "/fun/morse-code", "/text/case-converter"],
  // Screen-prank sub-cluster. These four share one intent ("make this computer
  // look broken") and are the site's strongest fun-category positions in Search
  // Console -- `error popup generator` and `windows error popup generator` both
  // sit at position 9 -- so they interlink tightly rather than pointing out at
  // the chat mockups, which serve a different intent.
  "/fun/hacker-typer": ["/fun/blue-screen", "/fun/fake-windows-update", "/fun/fake-error", "/fun/glitch-text"],
  "/fun/fake-error": ["/fun/blue-screen", "/fun/fake-windows-update", "/fun/hacker-typer", "/fun/fake-tweet"],
  "/fun/blue-screen": ["/fun/fake-windows-update", "/fun/hacker-typer", "/fun/fake-error", "/fun/glitch-text"],
  "/fun/fake-windows-update": ["/fun/blue-screen", "/fun/fake-error", "/fun/hacker-typer", "/fun/glitch-text"],
  // The chat/screenshot mockup tools point at each other first — they serve one
  // intent ("fake chat screenshot") split across platforms, so a visitor landing
  // on any of them is a strong candidate for the others. Each lists the three
  // nearest siblings before falling back outside the group.
  "/fun/fake-tweet": ["/fun/fake-reddit", "/fun/fake-text-message", "/fun/fake-chatgpt", "/fun/fake-whatsapp"],
  "/fun/fake-text-message": ["/fun/fake-whatsapp", "/fun/fake-instagram-dm", "/fun/fake-tweet", "/image/meme-maker"],
  "/fun/fake-whatsapp": ["/fun/fake-instagram-dm", "/fun/fake-text-message", "/fun/fake-discord", "/fun/fake-tweet"],
  "/fun/fake-instagram-dm": ["/fun/fake-whatsapp", "/fun/fake-text-message", "/fun/fake-discord", "/fun/fake-tweet"],
  "/fun/fake-discord": ["/fun/fake-instagram-dm", "/fun/fake-whatsapp", "/fun/fake-reddit", "/fun/fake-tweet"],
  // Public-post mockups, as distinct from private-chat mockups: a thread and an
  // AI transcript are both "screenshot of something posted", so they point at
  // each other and at the tweet generator before the messaging tools.
  "/fun/fake-reddit": ["/fun/fake-tweet", "/fun/fake-chatgpt", "/fun/fake-discord", "/image/meme-maker"],
  "/fun/fake-chatgpt": ["/fun/fake-reddit", "/fun/fake-tweet", "/fun/fake-text-message", "/image/meme-maker"],
  "/fun/morse-code": ["/fun/fancy-text", "/fun/glitch-text", "/fun/upside-down-text", "/text/case-converter"],
  "/fun/spin-wheel": ["/fun/coin-flip", "/fun/reaction-time", "/fun/typing-test", "/fun/fake-tweet"],
  "/fun/typing-test": ["/fun/reaction-time", "/fun/coin-flip", "/fun/spin-wheel", "/text/case-converter"],
  "/fun/reaction-time": ["/fun/typing-test", "/fun/coin-flip", "/fun/spin-wheel", "/fun/hacker-typer"],
  "/fun/coin-flip": ["/fun/spin-wheel", "/fun/reaction-time", "/fun/typing-test", "/fun/fake-tweet"],
  // Video/audio cluster
  "/video/compress": ["/video/to-mp3", "/video/to-gif", "/audio/transcribe", "/image/compress"],
  "/video/to-mp3": ["/video/compress", "/video/to-gif", "/audio/transcribe", "/image/compress"],
  "/video/to-gif": ["/video/compress", "/video/to-mp3", "/image/convert", "/audio/transcribe"],
  "/audio/transcribe": ["/text/to-speech", "/video/to-mp3", "/video/compress", "/image/image-to-text"],

  // Calculator clusters.
  //
  // Until now the calculator section was the only category with no curated map,
  // so every calculator page fell through to `calculatorTools.slice(0, 4)` and
  // linked to the same four pages (EMI / Loan / SIP / Compound Interest). The
  // result was that the section's highest-impression pages — SCSS, NSC and SSY —
  // received no links from their siblings at all, while four pages absorbed the
  // internal link equity of all 43. Search Console showed the damage directly:
  // /calculators/nsc had zero referring URLs, and the only pages ranking in the
  // top ten were the four that were hardcoded here.
  //
  // The groupings below follow how people actually shop these products: someone
  // comparing SCSS is comparing NSC and SSY, not amortising a car loan.

  // India small-savings schemes. Deliberately dense and mutually reciprocal —
  // this is the cluster carrying the most impressions and the least authority.
  "/calculators/ssy": ["/calculators/nsc", "/calculators/scss", "/calculators/ppf", "/calculators/rd"],
  "/calculators/nsc": ["/calculators/scss", "/calculators/ssy", "/calculators/ppf", "/calculators/fd"],
  "/calculators/scss": ["/calculators/nsc", "/calculators/ssy", "/calculators/fd", "/calculators/rd"],
  "/calculators/ppf": ["/calculators/ssy", "/calculators/epf", "/calculators/nsc", "/calculators/fd"],
  "/calculators/fd": ["/calculators/rd", "/calculators/scss", "/calculators/ppf", "/calculators/nsc"],
  "/calculators/rd": ["/calculators/fd", "/calculators/ppf", "/calculators/ssy", "/calculators/nsc"],

  // India salary, retirement and statutory deductions
  "/calculators/salary": ["/calculators/income-tax", "/calculators/hra", "/calculators/epf", "/calculators/gratuity"],
  "/calculators/income-tax": ["/calculators/salary", "/calculators/hra", "/calculators/gratuity", "/calculators/epf"],
  "/calculators/hra": ["/calculators/salary", "/calculators/income-tax", "/calculators/epf", "/calculators/gratuity"],
  "/calculators/gratuity": ["/calculators/epf", "/calculators/salary", "/calculators/income-tax", "/calculators/hra"],
  "/calculators/epf": ["/calculators/ppf", "/calculators/nps", "/calculators/gratuity", "/calculators/salary"],
  "/calculators/nps": ["/calculators/epf", "/calculators/ppf", "/calculators/retirement", "/calculators/gratuity"],
  "/calculators/retirement": ["/calculators/nps", "/calculators/401k", "/calculators/inflation", "/calculators/epf"],

  // Market investing and returns
  "/calculators/sip": ["/calculators/step-up-sip", "/calculators/lumpsum", "/calculators/swp", "/calculators/cagr"],
  "/calculators/step-up-sip": ["/calculators/sip", "/calculators/lumpsum", "/calculators/swp", "/calculators/cagr"],
  "/calculators/lumpsum": ["/calculators/sip", "/calculators/step-up-sip", "/calculators/swp", "/calculators/cagr"],
  "/calculators/swp": ["/calculators/sip", "/calculators/lumpsum", "/calculators/step-up-sip", "/calculators/cagr"],
  "/calculators/cagr": ["/calculators/sip", "/calculators/lumpsum", "/calculators/compound-interest", "/calculators/inflation"],
  "/calculators/compound-interest": ["/calculators/simple-interest", "/calculators/sip", "/calculators/lumpsum", "/calculators/cagr"],
  "/calculators/simple-interest": ["/calculators/compound-interest", "/calculators/loan", "/calculators/fd", "/calculators/emi"],
  "/calculators/inflation": ["/calculators/cagr", "/calculators/retirement", "/calculators/compound-interest", "/calculators/sip"],

  // Loans and debt
  "/calculators/emi": ["/calculators/loan", "/calculators/mortgage", "/calculators/auto-loan", "/calculators/credit-card-payoff"],
  "/calculators/loan": ["/calculators/emi", "/calculators/mortgage", "/calculators/auto-loan", "/calculators/simple-interest"],
  "/calculators/mortgage": ["/calculators/emi", "/calculators/loan", "/calculators/auto-loan", "/calculators/401k"],
  "/calculators/auto-loan": ["/calculators/emi", "/calculators/loan", "/calculators/mortgage", "/calculators/credit-card-payoff"],
  "/calculators/credit-card-payoff": ["/calculators/emi", "/calculators/auto-loan", "/calculators/loan", "/calculators/mortgage"],
  "/calculators/401k": ["/calculators/retirement", "/calculators/mortgage", "/calculators/credit-card-payoff", "/calculators/sales-tax"],

  // Tax and everyday money
  "/calculators/gst": ["/calculators/sales-tax", "/calculators/income-tax", "/calculators/discount", "/calculators/percentage"],
  "/calculators/sales-tax": ["/calculators/gst", "/calculators/tip", "/calculators/discount", "/calculators/percentage"],
  "/calculators/discount": ["/calculators/percentage", "/calculators/tip", "/calculators/sales-tax", "/calculators/gst"],
  "/calculators/tip": ["/calculators/discount", "/calculators/sales-tax", "/calculators/percentage", "/calculators/gst"],
  "/calculators/percentage": ["/calculators/discount", "/calculators/percentage-to-cgpa", "/calculators/cgpa-to-percentage", "/calculators/gst"],

  // Health and body
  "/calculators/bmi": ["/calculators/body-fat", "/calculators/calorie", "/calculators/ovulation", "/calculators/due-date"],
  "/calculators/body-fat": ["/calculators/bmi", "/calculators/calorie", "/calculators/ovulation", "/calculators/due-date"],
  "/calculators/calorie": ["/calculators/bmi", "/calculators/body-fat", "/calculators/ovulation", "/calculators/due-date"],
  "/calculators/due-date": ["/calculators/ovulation", "/calculators/age", "/calculators/bmi", "/calculators/calorie"],
  "/calculators/ovulation": ["/calculators/due-date", "/calculators/bmi", "/calculators/calorie", "/calculators/age"],

  // Academic conversions and everyday utilities
  "/calculators/cgpa-to-percentage": ["/calculators/percentage-to-cgpa", "/calculators/percentage", "/calculators/word-counter", "/calculators/unit-converter"],
  "/calculators/percentage-to-cgpa": ["/calculators/cgpa-to-percentage", "/calculators/percentage", "/calculators/word-counter", "/calculators/unit-converter"],
  "/calculators/age": ["/calculators/date", "/calculators/due-date", "/calculators/ovulation", "/calculators/unit-converter"],
  "/calculators/date": ["/calculators/age", "/calculators/roman-numerals", "/calculators/unit-converter", "/calculators/word-counter"],
  "/calculators/unit-converter": ["/calculators/roman-numerals", "/calculators/word-counter", "/calculators/percentage", "/calculators/date"],
  "/calculators/word-counter": ["/calculators/unit-converter", "/calculators/cgpa-to-percentage", "/calculators/percentage", "/calculators/date"],
};

/**
 * Pages whose curated cluster names `href` — i.e. the inbound side of the link
 * graph, computed once at module load.
 *
 * The fallback chains below walk this before registry order. Without it, a page
 * that no cluster happens to name can only ever be reached by being early in its
 * category array, which is how the calculator section ended up with orphans in
 * the first place. Preferring reciprocals makes curated links mutual and gives
 * every linked-to page a route back, so link equity circulates inside a topic
 * instead of draining into whichever tools were declared first.
 */
const reciprocalLinks: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const [from, targets] of Object.entries(relatedOverrides))
    for (const to of targets) (map[to] ??= []).push(from);
  return map;
})();

/** The registry a href belongs to, for the same-category fallback step. */
function categoryOf(href: string): Tool[] {
  if (href.startsWith("/pdf")) return pdfTools;
  if (href.startsWith("/image")) return imageTools;
  if (href.startsWith("/calculators")) return calculatorTools;
  if (href.startsWith("/audio")) return audioTools;
  if (href.startsWith("/video")) return videoTools;
  if (href.startsWith("/text")) return textTools;
  if (href.startsWith("/fun")) return funTools;
  return allTools;
}

/**
 * Resolve related tools for a page: curated cluster, then reciprocals, then
 * same-category, then anything.
 *
 * Order matters. The curated cluster is editorial intent and always wins. The
 * reciprocal step is what keeps the graph honest — it pulls in pages that named
 * this one, so a curated link tends to be answered rather than one-way. Only
 * after both of those does registry order get a say, which is what stops the
 * first few tools in a category from collecting every link on the site.
 */
function pickRelated(currentHref: string, count: number): Tool[] {
  const byHref = (href: string) => allTools.find((t) => t.href === href && t.ready);

  const result: Tool[] = [];
  const add = (t: Tool | undefined) => {
    if (t && t.ready && t.href !== currentHref && !result.includes(t)) result.push(t);
  };

  for (const href of relatedOverrides[currentHref] ?? []) {
    if (result.length >= count) break;
    add(byHref(href));
  }

  for (const href of reciprocalLinks[currentHref] ?? []) {
    if (result.length >= count) break;
    add(byHref(href));
  }

  for (const t of categoryOf(currentHref)) {
    if (result.length >= count) break;
    add(t);
  }

  for (const t of allTools) {
    if (result.length >= count) break;
    add(t);
  }

  return result.slice(0, count);
}

/** Pick related tools: curated cluster first, then reciprocals, then category. */
export function relatedTools(currentHref: string, count = 4): Tool[] {
  return pickRelated(currentHref, count);
}

/**
 * Pick related calculators for a calculator page, excluding itself.
 *
 * Shares `pickRelated` with the rest of the site rather than slicing the
 * registry, so the curated calculator clusters above actually apply.
 */
export function relatedCalculators(currentHref: string, count = 4): Tool[] {
  return pickRelated(currentHref, count);
}
