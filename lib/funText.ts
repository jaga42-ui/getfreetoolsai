/**
 * Pure text-transform helpers for the Fun Tools cluster: unicode "fancy"
 * fonts, zalgo/glitch, upside-down flipping and Morse code. All astral-safe
 * (uses code points, iterates with Array.from) and dependency-free.
 */

const UP_A = 65, UP_Z = 90, LO_A = 97, LO_Z = 122, D0 = 48, D9 = 57;

/** Build a per-character mapper from base code points for A–Z / a–z / 0–9. */
function offsetStyle(
  upperBase: number,
  lowerBase: number,
  digitBase?: number,
  overrides: Record<string, string> = {}
) {
  return (s: string) =>
    Array.from(s)
      .map((ch) => {
        if (overrides[ch]) return overrides[ch];
        const c = ch.codePointAt(0)!;
        if (c >= UP_A && c <= UP_Z) return String.fromCodePoint(upperBase + (c - UP_A));
        if (c >= LO_A && c <= LO_Z) return String.fromCodePoint(lowerBase + (c - LO_A));
        if (digitBase !== undefined && c >= D0 && c <= D9)
          return String.fromCodePoint(digitBase + (c - D0));
        return ch;
      })
      .join("");
}

const circledDigits: Record<string, string> = {
  "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④",
  "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
};

const SMALL_CAPS: Record<string, string> = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ",
  j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "q", r: "ʀ",
  s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
};

function combining(mark: string) {
  return (s: string) =>
    Array.from(s)
      .map((ch) => (ch === " " ? ch : ch + mark))
      .join("");
}

export type FancyStyle = { name: string; transform: (s: string) => string };

export const FANCY_STYLES: FancyStyle[] = [
  { name: "Bold", transform: offsetStyle(0x1d400, 0x1d41a, 0x1d7ce) },
  { name: "Italic", transform: offsetStyle(0x1d608, 0x1d622) },
  { name: "Bold Italic", transform: offsetStyle(0x1d63c, 0x1d656) },
  { name: "Script", transform: offsetStyle(0x1d4d0, 0x1d4ea) },
  {
    name: "Double-struck",
    transform: offsetStyle(0x1d538, 0x1d552, 0x1d7d8, {
      C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ",
    }),
  },
  { name: "Monospace", transform: offsetStyle(0x1d670, 0x1d68a, 0x1d7f6) },
  { name: "Wide / Vaporwave", transform: offsetStyle(0xff21, 0xff41, 0xff10) },
  { name: "Bubble", transform: offsetStyle(0x24b6, 0x24d0, undefined, circledDigits) },
  {
    name: "Small Caps",
    transform: (s: string) =>
      Array.from(s).map((ch) => SMALL_CAPS[ch] ?? ch).join(""),
  },
  { name: "Strikethrough", transform: combining("̶") },
  { name: "Underline", transform: combining("̲") },
];

// --- Zalgo / glitch ---------------------------------------------------------
const ZALGO_UP = Array.from({ length: 0x315 - 0x300 + 1 }, (_, i) =>
  String.fromCodePoint(0x300 + i)
).concat(
  Array.from({ length: 0x34e - 0x33d + 1 }, (_, i) => String.fromCodePoint(0x33d + i))
);
const ZALGO_DOWN = Array.from({ length: 0x36f - 0x316 + 1 }, (_, i) =>
  String.fromCodePoint(0x316 + i)
);
const ZALGO_MID = ["̴", "̵", "̶", "̷", "̸"];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/** Add `intensity` (1–10) worth of combining marks to each character. */
export function glitch(text: string, intensity = 5): string {
  const n = Math.max(0, Math.min(10, intensity));
  return Array.from(text)
    .map((ch) => {
      if (ch === " " || ch === "\n") return ch;
      let out = ch;
      for (let i = 0; i < n; i++) out += pick(ZALGO_UP);
      for (let i = 0; i < n; i++) out += pick(ZALGO_DOWN);
      if (n > 3) out += pick(ZALGO_MID);
      return out;
    })
    .join("");
}

// --- Upside down ------------------------------------------------------------
const FLIP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ",
  j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
  s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "B", C: "Ɔ", D: "D", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H", I: "I",
  J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ᴚ",
  S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9",
  "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "'": ",", '"': ",,", "?": "¿", "!": "¡", "(": ")",
  ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<",
  "&": "⅋", "_": "‾",
};

export function upsideDown(text: string): string {
  return Array.from(text)
    .map((ch) => FLIP[ch] ?? ch)
    .reverse()
    .join("");
}

// --- Morse code -------------------------------------------------------------
const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", $: "...-..-", "@": ".--.-.",
};
const MORSE_REV: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);

/** Encode text to Morse. Words separated by " / ", letters by spaces. */
export function textToMorse(text: string): string {
  return text
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      Array.from(word)
        .map((ch) => MORSE[ch] ?? "")
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean)
    .join(" / ");
}

/** Decode Morse (words separated by "/" or "  ") back to text. */
export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*|\s{2,}/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => MORSE_REV[code] ?? "")
        .join("")
    )
    .join(" ")
    .trim();
}
