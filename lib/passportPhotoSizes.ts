/**
 * Passport & visa photo size reference data.
 *
 * Dimensions are the widely-published, long-standing specifications for each
 * country's standard passport photo (visa sizes noted where they differ).
 * `wMm`/`hMm` are the canonical millimetre dimensions; inches and 300-DPI pixel
 * sizes are derived in code so the three columns can never disagree.
 *
 * Photo rules change and some countries publish several sizes for different
 * documents — always confirm against the issuing authority before printing.
 * Last reviewed on the date below.
 */

export const PHOTO_LAST_REVIEWED = "2026-07-22";

export type PhotoSpec = {
  country: string;
  flag: string;
  /** Canonical width in millimetres. */
  wMm: number;
  /** Canonical height in millimetres. */
  hMm: number;
  /** Optional headline size label (e.g. an inch-native spec like "2 × 2 in"). */
  sizeLabel?: string;
  background: string;
  /** Head height guidance where well documented. */
  headMm?: string;
  note?: string;
};

/** 300-DPI pixel size for a millimetre dimension. */
export const pxAt300 = (mm: number) => Math.round((mm / 25.4) * 300);
/** Inches (2dp) for a millimetre dimension. */
export const toInches = (mm: number) => (mm / 25.4).toFixed(2);
/** Rounded millimetre label. */
export const mmLabel = (mm: number) => Math.round(mm);

const SCHENGEN = "Schengen uniform format";

/** Alphabetical by country. */
export const photoSpecs: PhotoSpec[] = [
  { country: "Australia", flag: "🇦🇺", wMm: 35, hMm: 45, background: "Plain white / light grey", headMm: "32–36 mm" },
  { country: "Brazil", flag: "🇧🇷", wMm: 50, hMm: 70, background: "White", note: "5 × 7 cm" },
  { country: "Canada", flag: "🇨🇦", wMm: 50, hMm: 70, background: "Plain white", headMm: "31–36 mm", note: "Overall 50 × 70 mm; strict head-height range" },
  { country: "China", flag: "🇨🇳", wMm: 33, hMm: 48, background: "White", headMm: "28–33 mm", note: "Passport & visa" },
  { country: "Denmark", flag: "🇩🇰", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Finland", flag: "🇫🇮", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "France", flag: "🇫🇷", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Germany", flag: "🇩🇪", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Ghana", flag: "🇬🇭", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "India", flag: "🇮🇳", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm", note: "Passport form: 4.5 × 3.5 cm. Some US-style visas & OCI use 2 × 2 in." },
  { country: "Ireland", flag: "🇮🇪", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm" },
  { country: "Italy", flag: "🇮🇹", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Japan", flag: "🇯🇵", wMm: 35, hMm: 45, background: "Plain white", headMm: "32–36 mm" },
  { country: "Kenya", flag: "🇰🇪", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "Malaysia", flag: "🇲🇾", wMm: 35, hMm: 50, background: "White", note: "35 × 50 mm — larger than the usual 45 mm height" },
  { country: "Netherlands", flag: "🇳🇱", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "New Zealand", flag: "🇳🇿", wMm: 35, hMm: 45, background: "Plain white / light grey", headMm: "32–36 mm" },
  { country: "Nigeria", flag: "🇳🇬", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "Norway", flag: "🇳🇴", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Pakistan", flag: "🇵🇰", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "Philippines", flag: "🇵🇭", wMm: 50.8, hMm: 50.8, sizeLabel: "2 × 2 in", background: "White", note: "2 × 2 in (51 × 51 mm)" },
  { country: "Poland", flag: "🇵🇱", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Portugal", flag: "🇵🇹", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Russia", flag: "🇷🇺", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "Schengen Area (visa)", flag: "🇪🇺", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: "Uniform short-stay visa photo, 26 countries" },
  { country: "Singapore", flag: "🇸🇬", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "South Africa", flag: "🇿🇦", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "South Korea", flag: "🇰🇷", wMm: 35, hMm: 45, background: "White", headMm: "32–36 mm" },
  { country: "Spain", flag: "🇪🇸", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Sweden", flag: "🇸🇪", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Switzerland", flag: "🇨🇭", wMm: 35, hMm: 45, background: "Light grey", headMm: "32–36 mm", note: SCHENGEN },
  { country: "Thailand", flag: "🇹🇭", wMm: 35, hMm: 45, background: "White / light blue" },
  { country: "Turkey", flag: "🇹🇷", wMm: 50, hMm: 60, background: "White", note: "5 × 6 cm (biometric)" },
  { country: "United Arab Emirates", flag: "🇦🇪", wMm: 43, hMm: 55, background: "White", note: "Common ID & visa size (4.3 × 5.5 cm)" },
  { country: "United Kingdom", flag: "🇬🇧", wMm: 35, hMm: 45, background: "Plain cream / light grey", headMm: "29–34 mm", note: "No smiling; plain expression" },
  { country: "United States", flag: "🇺🇸", wMm: 50.8, hMm: 50.8, sizeLabel: "2 × 2 in", background: "Plain white / off-white", headMm: "25–35 mm", note: "Head 1–1⅜ in. Same size for US visas." },
];
