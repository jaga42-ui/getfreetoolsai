import {
  Braces,
  Regex,
  Binary,
  KeyRound,
  Link2,
  Fingerprint,
  FileCode2,
  Hash,
  FileJson,
  Bot,
  Map as MapIcon,
  Code2,
  Image as ImageIcon,
  Database,
  Minimize2,
  Palette,
  Share2,
  QrCode,
  type LucideIcon,
} from "lucide-react";

export type DevCategory =
  | "JSON & Data"
  | "Encoding & Security"
  | "Generators"
  | "Converters"
  | "Web & SEO"
  | "Formatters & Minifiers";

export type DevTool = {
  name: string;
  slug: string;
  href: string;
  description: string;
  category: DevCategory;
  icon: LucideIcon;
  ready: boolean;
  /** short keyword-y tagline shown on cards */
  tag?: string;
};

export const DEV_CATEGORIES: DevCategory[] = [
  "JSON & Data",
  "Encoding & Security",
  "Generators",
  "Converters",
  "Web & SEO",
  "Formatters & Minifiers",
];

export const devTools: DevTool[] = [
  // JSON & Data
  { name: "JSON Formatter & Validator", slug: "json-formatter", href: "/dev-tools/json-formatter", description: "Format, beautify, minify and validate JSON with instant error reporting.", category: "JSON & Data", icon: Braces, ready: true, tag: "format · validate · minify" },
  { name: "Regex Tester", slug: "regex-tester", href: "/dev-tools/regex-tester", description: "Test regular expressions live with match highlighting and capture groups.", category: "JSON & Data", icon: Regex, ready: true, tag: "live matches · groups" },

  // Encoding & Security
  { name: "Base64 Encoder & Decoder", slug: "base64", href: "/dev-tools/base64", description: "Encode and decode Base64 text instantly, with full UTF-8 support.", category: "Encoding & Security", icon: Binary, ready: true, tag: "encode · decode · UTF-8" },
  { name: "JWT Decoder & Inspector", slug: "jwt-decoder", href: "/dev-tools/jwt-decoder", description: "Decode and inspect JWT header, payload and claims — locally, never sent anywhere.", category: "Encoding & Security", icon: KeyRound, ready: true, tag: "header · payload · exp" },
  { name: "URL Encoder & Decoder", slug: "url-encoder", href: "/dev-tools/url-encoder", description: "Percent-encode and decode URLs and query components safely.", category: "Encoding & Security", icon: Link2, ready: true, tag: "percent-encode" },
  { name: "Hash Generator", slug: "hash-generator", href: "/dev-tools/hash-generator", description: "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes in your browser.", category: "Encoding & Security", icon: Hash, ready: true, tag: "SHA-1/256/384/512" },

  // Generators
  { name: "UUID Generator", slug: "uuid", href: "/dev-tools/uuid", description: "Generate cryptographically-random UUID v4s in bulk, with one-click copy.", category: "Generators", icon: Fingerprint, ready: true, tag: "v4 · bulk · crypto" },
  { name: "QR Code Generator", slug: "qr-code", href: "/dev-tools/qr-code", description: "Create QR codes for a URL, text, Wi-Fi, email or phone and download as PNG or SVG.", category: "Generators", icon: QrCode, ready: true, tag: "url · wifi · png/svg" },

  // Converters
  { name: "JSON to TypeScript", slug: "json-to-typescript", href: "/dev-tools/json-to-typescript", description: "Turn any JSON into clean, nested TypeScript interfaces instantly.", category: "Converters", icon: FileCode2, ready: true, tag: "interfaces · nested" },
  { name: "SVG to React Component", slug: "svg-to-react", href: "/dev-tools/svg-to-react", description: "Convert raw SVG markup into a typed React component.", category: "Converters", icon: Code2, ready: true, tag: "jsx · typed · props" },

  // Web & SEO
  { name: "Robots.txt Generator", slug: "robots-txt-generator", href: "/dev-tools/robots-txt-generator", description: "Build a valid robots.txt with allow/disallow rules and a sitemap line.", category: "Web & SEO", icon: Bot, ready: true, tag: "allow · disallow · sitemap" },
  { name: "Sitemap Generator", slug: "sitemap-generator", href: "/dev-tools/sitemap-generator", description: "Generate an XML sitemap from a list of URLs.", category: "Web & SEO", icon: MapIcon, ready: true, tag: "urls → xml" },
  { name: "Schema Markup Generator", slug: "schema-generator", href: "/dev-tools/schema-generator", description: "Generate JSON-LD structured data for common schema.org types.", category: "Web & SEO", icon: FileJson, ready: true, tag: "json-ld · rich results" },
  { name: "Open Graph Preview", slug: "open-graph-preview", href: "/dev-tools/open-graph-preview", description: "Preview how a page looks when shared on social platforms and generate OG meta tags.", category: "Web & SEO", icon: Share2, ready: true, tag: "share card · meta tags" },
  { name: "Color Palette Extractor", slug: "color-palette", href: "/dev-tools/color-palette", description: "Extract a dominant colour palette from any image and copy HEX/RGB values.", category: "Web & SEO", icon: Palette, ready: true, tag: "image → hex · rgb" },

  // Formatters & Minifiers
  { name: "SQL Formatter", slug: "sql-formatter", href: "/dev-tools/sql-formatter", description: "Format and beautify SQL queries with consistent indentation.", category: "Formatters & Minifiers", icon: Database, ready: true, tag: "mysql · postgres · more" },
  { name: "HTML Minifier", slug: "html-minifier", href: "/dev-tools/html-minifier", description: "Minify HTML to shrink page weight.", category: "Formatters & Minifiers", icon: Minimize2, ready: true, tag: "strip · collapse" },
  { name: "CSS Minifier", slug: "css-minifier", href: "/dev-tools/css-minifier", description: "Minify CSS for faster loads.", category: "Formatters & Minifiers", icon: Minimize2, ready: true, tag: "compress · size report" },
  { name: "JavaScript Minifier", slug: "js-minifier", href: "/dev-tools/js-minifier", description: "Minify JavaScript with Terser to reduce file size.", category: "Formatters & Minifiers", icon: Minimize2, ready: true, tag: "terser · mangle" },
  { name: "SVG Optimizer", slug: "svg-optimizer", href: "/dev-tools/svg-optimizer", description: "Clean and shrink SVG files without losing quality.", category: "Formatters & Minifiers", icon: ImageIcon, ready: true, tag: "clean · preview" },
];

export const readyDevTools = devTools.filter((t) => t.ready);

export function devToolsByCategory(category: DevCategory): DevTool[] {
  return devTools.filter((t) => t.category === category);
}

export function getDevTool(slug: string): DevTool | undefined {
  return devTools.find((t) => t.slug === slug);
}

/** Related dev tools: same category first, then other ready tools. */
export function relatedDevTools(slug: string, count = 4): DevTool[] {
  const tool = getDevTool(slug);
  const result: DevTool[] = [];
  if (tool) {
    for (const t of devTools) {
      if (t.slug !== slug && t.ready && t.category === tool.category) result.push(t);
    }
  }
  for (const t of readyDevTools) {
    if (t.slug !== slug && !result.includes(t)) result.push(t);
    if (result.length >= count) break;
  }
  return result.slice(0, count);
}
