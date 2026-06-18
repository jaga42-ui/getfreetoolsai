import type { ReactNode } from "react";

/**
 * Honest, diagrammatic "what this tool does" illustrations (inline SVG — no
 * asset loading, scales crisply, on-brand). These are explanatory graphics,
 * NOT photographic "result" claims. Use <ToolDemo kind="..." /> on a tool page.
 */

const ink = "#211f1a";
const muted = "#6c675c";
const rust = "#b25733";
const forest = "#4b6b4e";
const blue = "#3b6ea5";
const border = "#e4ddcd";
const cream = "#f4efe4";

const svgClass = "mx-auto block h-auto w-full max-w-md";

/* ---------------- shared primitives ---------------- */

function Arrow() {
  return (
    <g>
      <line x1="132" y1="77" x2="178" y2="77" stroke={rust} strokeWidth="4" strokeLinecap="round" />
      <path d="M176 69 L190 77 L176 85 Z" fill={rust} />
    </g>
  );
}

function Chip({ cx, y, text, color = forest }: { cx: number; y: number; text: string; color?: string }) {
  const w = text.length * 7 + 16;
  return (
    <g>
      <rect x={cx - w / 2} y={y} width={w} height="18" rx="9" fill={color} opacity="0.15" />
      <text x={cx} y={y + 13} textAnchor="middle" fontSize="11" fill={color} fontWeight="700">
        {text}
      </text>
    </g>
  );
}

function Obj({ x, type, label }: { x: number; type: "image" | "pdf" | "doc"; label: string }) {
  const cx = x + 37;
  const tagColor = type === "pdf" ? rust : type === "doc" ? blue : forest;
  return (
    <g>
      <Chip cx={cx} y={6} text={label} color={tagColor} />
      <rect x={x} y="34" width="74" height="92" rx="7" fill={type === "image" ? "#cfe0e8" : "#ffffff"} stroke={border} strokeWidth="2" />
      {type === "image" && (
        <>
          <circle cx={x + 22} cy={58} r="8" fill="#e8c87a" />
          <path d={`M${x + 6} ${110} L${x + 28} ${82} L${x + 44} ${98} L${x + 58} ${80} L${x + 68} ${90} L${x + 68} ${118} L${x + 6} ${118} Z`} fill={forest} opacity="0.55" />
        </>
      )}
      {(type === "pdf" || type === "doc") && (
        <>
          <rect x={x + 12} y={48} width={50} height={6} rx="3" fill={muted} opacity="0.45" />
          <rect x={x + 12} y={60} width={50} height={6} rx="3" fill={muted} opacity="0.45" />
          <rect x={x + 12} y={72} width={34} height={6} rx="3" fill={muted} opacity="0.45" />
          <rect x={x + 12} y={98} width={32} height={16} rx="3" fill={tagColor} />
          <text x={x + 28} y={110} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
            {type === "pdf" ? "PDF" : "DOC"}
          </text>
        </>
      )}
    </g>
  );
}

function convertFlow(
  from: { type: "image" | "pdf" | "doc"; label: string },
  to: { type: "image" | "pdf" | "doc"; label: string }
) {
  return (
    <svg viewBox="0 0 320 140" role="img" aria-label={`${from.label} converted to ${to.label}`} className={svgClass}>
      <Obj x={22} type={from.type} label={from.label} />
      <Arrow />
      <Obj x={224} type={to.type} label={to.label} />
    </svg>
  );
}

/* ---------------- bespoke illustrations ---------------- */

const checkerDefs = (
  <defs>
    <pattern id="td-checker" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="#ffffff" />
      <rect width="8" height="8" fill={border} />
      <rect x="8" y="8" width="8" height="8" fill={border} />
    </pattern>
  </defs>
);

const compressSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Large file compressed to a much smaller file" className={svgClass}>
    <Chip cx={59} y={6} text="Large" color={rust} />
    <rect x="22" y="34" width="74" height="92" rx="7" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="34" y="48" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="60" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="84" width="50" height="30" rx="3" fill={rust} opacity="0.25" />
    <Arrow />
    <Chip cx={261} y={6} text="Small" color={forest} />
    <rect x="232" y="58" width="58" height="68" rx="6" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="242" y="70" width="38" height="5" rx="2.5" fill={muted} opacity="0.45" />
    <rect x="242" y="92" width="38" height="22" rx="3" fill={forest} opacity="0.3" />
  </svg>
);

const resizeSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Large image resized to smaller exact dimensions" className={svgClass}>
    <Chip cx={59} y={6} text="4000×3000" color={muted} />
    <rect x="14" y="30" width="90" height="96" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <circle cx="38" cy="56" r="9" fill="#e8c87a" />
    <path d="M14 116 L44 82 L64 100 L86 78 L104 92 L104 124 L14 124 Z" fill={forest} opacity="0.5" />
    <Arrow />
    <Chip cx={261} y={6} text="800×600" color={ink} />
    <rect x="226" y="50" width="70" height="56" rx="5" fill="#cfe0e8" stroke={ink} strokeWidth="2" strokeDasharray="5 4" />
    <circle cx="246" cy="68" r="6" fill="#e8c87a" />
    <path d="M226 96 L250 76 L266 88 L284 74 L296 84 L296 106 L226 106 Z" fill={forest} opacity="0.5" />
  </svg>
);

const upscaleSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Small image enlarged 2 to 4 times" className={svgClass}>
    <Chip cx={55} y={6} text="Small" color={muted} />
    <rect x="30" y="54" width="50" height="50" rx="4" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <circle cx="44" cy="70" r="5" fill="#e8c87a" />
    <path d="M30 98 L46 84 L58 92 L72 82 L80 88 L80 102 L30 102 Z" fill={forest} opacity="0.5" />
    <Arrow />
    <Chip cx={258} y={6} text="2× – 4×" color={forest} />
    <rect x="214" y="30" width="92" height="92" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <circle cx="240" cy="58" r="9" fill="#e8c87a" />
    <path d="M214 112 L246 76 L264 94 L286 72 L306 90 L306 122 L214 122 Z" fill={forest} opacity="0.5" />
  </svg>
);

const cropSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Select an area and crop to it" className={svgClass}>
    <rect x="16" y="28" width="96" height="98" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <circle cx="44" cy="56" r="9" fill="#e8c87a" />
    <path d="M16 116 L46 80 L66 98 L88 76 L112 96 L112 126 L16 126 Z" fill={forest} opacity="0.45" />
    <rect x="40" y="54" width="56" height="50" fill="none" stroke={ink} strokeWidth="2.5" strokeDasharray="5 4" />
    <Arrow />
    <rect x="222" y="44" width="76" height="68" rx="5" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <path d="M222 104 L246 80 L264 96 L286 78 L298 88 L298 112 L222 112 Z" fill={forest} opacity="0.5" />
    <Chip cx={260} y={6} text="Cropped" color={forest} />
  </svg>
);

const rotateSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Page rotated to the correct orientation" className={svgClass}>
    <g transform="rotate(-12 70 78)">
      <rect x="40" y="40" width="60" height="78" rx="6" fill={cream} stroke={border} strokeWidth="2" />
      <rect x="50" y="54" width="40" height="6" rx="3" fill={muted} opacity="0.45" />
      <rect x="50" y="66" width="40" height="6" rx="3" fill={muted} opacity="0.45" />
    </g>
    <Arrow />
    <g>
      <rect x="232" y="34" width="62" height="80" rx="6" fill="#ffffff" stroke={border} strokeWidth="2" />
      <rect x="242" y="48" width="42" height="6" rx="3" fill={muted} opacity="0.45" />
      <rect x="242" y="60" width="42" height="6" rx="3" fill={muted} opacity="0.45" />
    </g>
    <path d="M250 22 a16 16 0 1 1 -10 4" fill="none" stroke={rust} strokeWidth="3" />
    <path d="M236 18 L242 26 L233 30 Z" fill={rust} />
  </svg>
);

const mergeSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Several PDFs combined into one" className={svgClass}>
    <rect x="16" y="44" width="54" height="70" rx="6" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="30" y="34" width="54" height="70" rx="6" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="44" y="24" width="54" height="70" rx="6" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="54" y="38" width="34" height="5" rx="2.5" fill={muted} opacity="0.45" />
    <rect x="54" y="48" width="34" height="5" rx="2.5" fill={muted} opacity="0.45" />
    <Arrow />
    <rect x="226" y="24" width="74" height="96" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="238" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="238" y="52" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="238" y="64" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <Chip cx={263} y={122} text="1 PDF" color={forest} />
  </svg>
);

const splitSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="One PDF split into selected pages" className={svgClass}>
    <rect x="22" y="24" width="74" height="96" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="34" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="52" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="64" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <Arrow />
    <rect x="214" y="30" width="50" height="64" rx="5" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="246" y="56" width="50" height="64" rx="5" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="224" y="44" width="30" height="5" rx="2.5" fill={muted} opacity="0.45" />
    <rect x="256" y="70" width="30" height="5" rx="2.5" fill={muted} opacity="0.45" />
  </svg>
);

const unlockSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Password removed from a PDF" className={svgClass}>
    <rect x="22" y="30" width="74" height="92" rx="7" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="46" y="62" width="26" height="22" rx="3" fill={rust} />
    <path d="M52 62 v-7 a7 7 0 0 1 14 0 v7" fill="none" stroke={rust} strokeWidth="3" />
    <Arrow />
    <rect x="224" y="30" width="74" height="92" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="248" y="62" width="26" height="22" rx="3" fill={forest} />
    <path d="M254 62 v-7 a7 7 0 0 1 14 0" fill="none" stroke={forest} strokeWidth="3" />
    <Chip cx={261} y={6} text="Unlocked" color={forest} />
  </svg>
);

const numberSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Page numbers added to a PDF" className={svgClass}>
    <rect x="22" y="24" width="74" height="96" rx="7" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="34" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="52" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <Arrow />
    <rect x="224" y="24" width="74" height="96" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="236" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="236" y="52" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <text x="261" y="112" textAnchor="middle" fontSize="13" fill={rust} fontWeight="700">— 1 —</text>
  </svg>
);

const watermarkSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Watermark stamped across a PDF" className={svgClass}>
    <rect x="22" y="24" width="74" height="96" rx="7" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="34" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="52" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <Arrow />
    <rect x="224" y="24" width="74" height="96" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="236" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="236" y="52" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <text x="261" y="78" textAnchor="middle" fontSize="15" fill={rust} fontWeight="800" opacity="0.5" transform="rotate(-24 261 78)">DRAFT</text>
  </svg>
);

const protectSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Password added to a PDF" className={svgClass}>
    <rect x="22" y="30" width="74" height="92" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="34" y="46" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="58" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <Arrow />
    <rect x="224" y="30" width="74" height="92" rx="7" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="248" y="70" width="26" height="22" rx="3" fill={forest} />
    <path d="M254 70 v-7 a7 7 0 0 1 14 0 v7" fill="none" stroke={forest} strokeWidth="3" />
    <circle cx="261" cy="80" r="3" fill="#fff" />
    <Chip cx={261} y={6} text="Protected" color={forest} />
  </svg>
);

const signSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Signature added to a PDF" className={svgClass}>
    <rect x="22" y="24" width="74" height="96" rx="7" fill={cream} stroke={border} strokeWidth="2" />
    <rect x="34" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <rect x="34" y="52" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <Arrow />
    <rect x="224" y="24" width="74" height="96" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="236" y="40" width="50" height="6" rx="3" fill={muted} opacity="0.45" />
    <line x1="236" y1="104" x2="286" y2="104" stroke={muted} strokeWidth="1.5" opacity="0.5" />
    <path d="M238 100 q8 -16 14 -2 q4 10 10 -6 q4 -8 12 4" fill="none" stroke={blue} strokeWidth="2.5" strokeLinecap="round" />
    <Chip cx={261} y={6} text="Signed" color={forest} />
  </svg>
);

const fillSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="A PDF form filled in" className={svgClass}>
    <rect x="22" y="24" width="74" height="96" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="34" y="42" width="50" height="9" rx="2" fill="none" stroke={muted} strokeWidth="1.5" opacity="0.5" />
    <rect x="34" y="58" width="50" height="9" rx="2" fill="none" stroke={muted} strokeWidth="1.5" opacity="0.5" />
    <rect x="34" y="80" width="11" height="11" rx="2" fill="none" stroke={muted} strokeWidth="1.5" opacity="0.6" />
    <Arrow />
    <rect x="224" y="24" width="74" height="96" rx="7" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="236" y="42" width="50" height="9" rx="2" fill="none" stroke={border} strokeWidth="1.5" />
    <rect x="240" y="45" width="30" height="3.5" rx="1.75" fill={ink} opacity="0.7" />
    <rect x="236" y="58" width="50" height="9" rx="2" fill="none" stroke={border} strokeWidth="1.5" />
    <rect x="240" y="61" width="38" height="3.5" rx="1.75" fill={ink} opacity="0.7" />
    <rect x="236" y="80" width="11" height="11" rx="2" fill={forest} />
    <path d="M238.5 85.5 l2.5 2.5 l4 -5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Chip cx={261} y={6} text="Filled" color={forest} />
  </svg>
);

const filtersSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Filters and adjustments applied to a photo" className={svgClass}>
    <rect x="18" y="40" width="78" height="74" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <circle cx="40" cy="62" r="8" fill="#e8c87a" />
    <path d="M18 108 L44 80 L62 96 L84 76 L96 86 L96 110 L18 110 Z" fill={forest} opacity="0.5" />
    <Arrow />
    <g>
      <rect x="206" y="34" width="56" height="52" rx="5" fill="#d9c08a" stroke={border} strokeWidth="2" />
      <rect x="226" y="58" width="56" height="52" rx="5" fill="#8aa6c0" stroke={border} strokeWidth="2" />
      <rect x="246" y="82" width="56" height="52" rx="5" fill="#b9b3a6" stroke={border} strokeWidth="2" />
    </g>
  </svg>
);

const roundedSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Sharp corners turned into rounded transparent corners" className={svgClass}>
    {checkerDefs}
    <rect x="26" y="34" width="78" height="78" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <circle cx="50" cy="58" r="8" fill="#e8c87a" />
    <Arrow />
    <rect x="216" y="34" width="78" height="78" rx="4" fill="url(#td-checker)" stroke={border} strokeWidth="2" />
    <rect x="216" y="34" width="78" height="78" rx="22" fill="#cfe0e8" />
    <circle cx="240" cy="58" r="8" fill="#e8c87a" />
    <Chip cx={255} y={6} text="Rounded PNG" color={forest} />
  </svg>
);

const colorpickSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Pick colors and a palette from an image" className={svgClass}>
    <rect x="18" y="34" width="86" height="80" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <circle cx="44" cy="58" r="9" fill="#e8c87a" />
    <path d="M18 108 L46 80 L66 98 L92 76 L104 86 L104 114 L18 114 Z" fill={forest} opacity="0.55" />
    <circle cx="70" cy="86" r="6" fill="none" stroke={ink} strokeWidth="2.5" />
    <line x1="74" y1="90" x2="86" y2="102" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    <Arrow />
    <rect x="214" y="46" width="26" height="26" rx="5" fill="#e8c87a" />
    <rect x="246" y="46" width="26" height="26" rx="5" fill={forest} />
    <rect x="278" y="46" width="26" height="26" rx="5" fill={rust} />
    <text x="259" y="92" textAnchor="middle" fontSize="11" fill={muted} fontWeight="600">HEX · RGB · HSL</text>
  </svg>
);

const exifSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Hidden GPS and metadata stripped from a photo" className={svgClass}>
    <rect x="18" y="34" width="86" height="80" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <path d="M18 108 L46 80 L66 98 L92 76 L104 86 L104 114 L18 114 Z" fill={forest} opacity="0.5" />
    <circle cx="74" cy="52" r="11" fill={rust} />
    <text x="74" y="56" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">GPS</text>
    <Arrow />
    <rect x="214" y="34" width="86" height="80" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <path d="M214 108 L242 80 L262 98 L288 76 L300 86 L300 114 L214 114 Z" fill={forest} opacity="0.5" />
    <Chip cx={257} y={6} text="Metadata removed" color={forest} />
  </svg>
);

const ocrSvg = (
  <svg viewBox="0 0 320 140" role="img" aria-label="Text in an image turned into editable text" className={svgClass}>
    <rect x="22" y="28" width="74" height="92" rx="6" fill="#cfe0e8" stroke={border} strokeWidth="2" />
    <path d="M34 70 q10 -8 20 0 t20 0" fill="none" stroke={muted} strokeWidth="3" opacity="0.6" />
    <path d="M34 84 q10 -8 20 0 t20 0" fill="none" stroke={muted} strokeWidth="3" opacity="0.6" />
    <Arrow />
    <rect x="224" y="28" width="74" height="92" rx="6" fill="#ffffff" stroke={border} strokeWidth="2" />
    <rect x="236" y="46" width="50" height="6" rx="3" fill={ink} opacity="0.7" />
    <rect x="236" y="60" width="50" height="6" rx="3" fill={ink} opacity="0.7" />
    <rect x="236" y="74" width="34" height="6" rx="3" fill={ink} opacity="0.7" />
    <text x="284" y="112" textAnchor="middle" fontSize="14" fill={forest} fontWeight="800">Aa</text>
  </svg>
);

/* ---------------- registry ---------------- */

type Demo = { title: string; caption: string; svg: ReactNode; wide?: boolean };

const REGISTRY: Record<string, Demo> = {
  "compress-image": {
    title: "What compression does",
    caption: "Your photo keeps its look while the file gets much lighter. The exact saving depends on the image and the target size you choose.",
    svg: compressSvg,
  },
  "compress-pdf": {
    title: "What compression does",
    caption: "A large PDF becomes a much smaller file that is easy to email and upload. The exact saving depends on the document and the level you pick.",
    svg: compressSvg,
  },
  resize: {
    title: "What resizing does",
    caption: "Scale an image down to the exact pixel dimensions you need, with the aspect ratio kept by default so nothing looks stretched.",
    svg: resizeSvg,
  },
  upscale: {
    title: "What upscaling does",
    caption: "Enlarges an image to 2×–4× with smooth resampling for bigger prints and displays. It can’t invent detail that wasn’t captured.",
    svg: upscaleSvg,
  },
  crop: {
    title: "What cropping does",
    caption: "Keep exactly the area you select, at full quality — with optional fixed aspect ratios for avatars, thumbnails and more.",
    svg: cropSvg,
  },
  "rotate-image": {
    title: "What rotate & flip does",
    caption: "Turn an image to the right orientation by 90°, 180° or any custom angle, and mirror it horizontally or vertically.",
    svg: rotateSvg,
  },
  "rotate-pdf": {
    title: "What rotating does",
    caption: "Fix sideways or upside-down pages by rotating all pages or just the ones you choose — with no quality loss.",
    svg: rotateSvg,
  },
  filters: {
    title: "What filters do",
    caption: "Apply one-click presets and fine-tune brightness, contrast and saturation, with a live preview before you download.",
    svg: filtersSvg,
  },
  rounded: {
    title: "What rounding does",
    caption: "Add smooth rounded corners — or a perfect circle — and export a transparent PNG that drops onto any background.",
    svg: roundedSvg,
  },
  colorpick: {
    title: "What the color picker does",
    caption: "Click any pixel to read its exact HEX, RGB and HSL value, and pull the dominant palette from the whole image.",
    svg: colorpickSvg,
  },
  exif: {
    title: "What removing EXIF does",
    caption: "Strips hidden metadata — including GPS location — before you share, while the photo itself looks unchanged.",
    svg: exifSvg,
  },
  "ocr-image": {
    title: "What image-to-text does",
    caption: "Reads the text inside a screenshot or photo and turns it into editable, copyable text you can download.",
    svg: ocrSvg,
  },
  "ocr-pdf": {
    title: "What OCR does",
    caption: "Recognises the text in a scanned, image-based PDF and turns it into real, selectable, copyable text.",
    svg: ocrSvg,
  },
  merge: {
    title: "What merging does",
    caption: "Combine several PDFs into a single document, in exactly the order you arrange them.",
    svg: mergeSvg,
  },
  split: {
    title: "What splitting does",
    caption: "Pull out the pages you choose, or split a PDF into separate one-page files.",
    svg: splitSvg,
  },
  unlock: {
    title: "What unlocking does",
    caption: "Removes the password and printing/copying restrictions from a PDF you’re authorised to open.",
    svg: unlockSvg,
  },
  number: {
    title: "What adding page numbers does",
    caption: "Stamps clean page numbers in the position, format and starting number you choose.",
    svg: numberSvg,
  },
  watermark: {
    title: "What adding a watermark does",
    caption: "Overlays your own text or logo across every page — with no third-party branding added.",
    svg: watermarkSvg,
  },
  protect: {
    title: "What protecting does",
    caption: "Encrypts the PDF with a password so it can't be opened without it — and can also block printing or copying.",
    svg: protectSvg,
  },
  sign: {
    title: "What signing does",
    caption: "Drops your drawn or typed signature onto the page exactly where you place it, then exports a signed PDF.",
    svg: signSvg,
  },
  fill: {
    title: "What filling does",
    caption: "Detects the interactive fields in a PDF form so you can type answers and tick boxes, then optionally flatten them.",
    svg: fillSvg,
  },
  heic: {
    title: "What converting does",
    caption: "Turns iPhone HEIC/HEIF photos into universal JPG that opens and uploads anywhere.",
    svg: convertFlow({ type: "image", label: "HEIC" }, { type: "image", label: "JPG" }),
  },
  "convert-image": {
    title: "What converting does",
    caption: "Switch an image between JPG, PNG and WebP in seconds, with optional quality control.",
    svg: convertFlow({ type: "image", label: "PNG" }, { type: "image", label: "JPG" }),
  },
  "jpg-to-pdf": {
    title: "What this converter does",
    caption: "Turns one or more images into a single, shareable PDF — in the order you arrange them.",
    svg: convertFlow({ type: "image", label: "JPG" }, { type: "pdf", label: "PDF" }),
  },
  "png-to-pdf": {
    title: "What this converter does",
    caption: "Turns PNG images into a clean PDF — merged into one document or one PDF per image.",
    svg: convertFlow({ type: "image", label: "PNG" }, { type: "pdf", label: "PDF" }),
  },
  "pdf-to-jpg": {
    title: "What this converter does",
    caption: "Renders each PDF page into a high-quality JPG image you can download individually or as a ZIP.",
    svg: convertFlow({ type: "pdf", label: "PDF" }, { type: "image", label: "JPG" }),
  },
  "pdf-to-word": {
    title: "What this converter does",
    caption: "Extracts the editable text from a PDF and delivers it as a Word (.docx) document.",
    svg: convertFlow({ type: "pdf", label: "PDF" }, { type: "doc", label: "DOCX" }),
  },
  "word-to-pdf": {
    title: "What this converter does",
    caption: "Turns Word (.docx) documents into clean PDFs with the formatting preserved.",
    svg: convertFlow({ type: "doc", label: "DOCX" }, { type: "pdf", label: "PDF" }),
  },
};

/* ---------------- public component ---------------- */

export function ToolDemo({
  kind,
  title,
  caption,
  children,
}: {
  kind?: keyof typeof REGISTRY;
  title?: string;
  caption?: string;
  children?: ReactNode;
}) {
  // Backward-compatible custom form (used by the before/after slider demo).
  if (children) {
    return (
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          {title ?? "What you’ll get"}
        </h2>
        {caption && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">{caption}</p>
        )}
        <div className="mt-5 rounded-xl border border-border bg-surface/50 p-4 sm:p-6">
          {children}
        </div>
      </section>
    );
  }

  const d = kind ? REGISTRY[kind] : undefined;
  if (!d) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-medium text-text-primary">{d.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">{d.caption}</p>
      <div className="mt-5 rounded-xl border border-border bg-surface/50 p-4 sm:p-6">
        {d.svg}
      </div>
    </section>
  );
}

/* ---- thin wrappers kept for pages that pass them as children ---- */

export function CompressDemo(_props: { kind?: "image" | "pdf" }) {
  return compressSvg;
}

export function ResizeDemo() {
  return resizeSvg;
}

/* ---- before/after panels still used by the Background Remover page ---- */

function Subject() {
  return (
    <>
      <circle cx="100" cy="58" r="24" fill={forest} />
      <path d="M58 132 a42 42 0 0 1 84 0 Z" fill={forest} />
    </>
  );
}

export function BackgroundRemoverDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">Before</p>
        <svg viewBox="0 0 200 150" role="img" aria-label="Original photo with a cluttered background" className="h-auto w-full rounded-lg border border-border">
          <defs>
            <linearGradient id="bgClutter" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d9c9a6" />
              <stop offset="1" stopColor="#c2a98a" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bgClutter)" />
          <circle cx="40" cy="30" r="18" fill="#ffffff" opacity="0.35" />
          <rect x="150" y="90" width="40" height="40" rx="6" fill="#ffffff" opacity="0.3" />
          <Subject />
        </svg>
      </div>
      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">After — transparent PNG</p>
        <svg viewBox="0 0 200 150" role="img" aria-label="Same subject on a transparent background" className="h-auto w-full rounded-lg border border-border">
          <defs>
            <pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#ffffff" />
              <rect width="10" height="10" fill={border} />
              <rect x="10" y="10" width="10" height="10" fill={border} />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#checker)" />
          <Subject />
        </svg>
      </div>
    </div>
  );
}
