export type DevExtra = {
  benefits: { title: string; body: string }[];
  useCases: string[];
};

/** Per-dev-tool "Why use it" + "Common use cases", keyed by slug. */
export const devToolContent: Record<string, DevExtra> = {
  "json-formatter": {
    benefits: [
      { title: "Real parser, real validation", body: "Uses the native JSON engine, so the valid badge means genuinely well-formed JSON, with the exact error otherwise." },
      { title: "Format or minify", body: "Pretty-print with two-space indentation or strip to a single compact line." },
      { title: "Private", body: "Runs entirely in your browser — safe for tokens and internal API payloads." },
    ],
    useCases: ["Inspect and tidy an API response", "Validate JSON before pasting it into code", "Minify JSON for storage or transport", "Spot a stray comma breaking a config file"],
  },
  "regex-tester": {
    benefits: [
      { title: "Live matches", body: "See matches and capture groups update as you type, with the engine's error on invalid patterns." },
      { title: "All JS flags", body: "Toggle g, i, m, s, u and y to mirror your code exactly." },
      { title: "Same as your runtime", body: "Uses the JavaScript regex engine, so results match Node and the browser." },
    ],
    useCases: ["Build and debug a regular expression", "Confirm capture groups extract the right parts", "Test a pattern against sample input", "Learn how flags change matching"],
  },
  "base64": {
    benefits: [
      { title: "UTF-8 safe", body: "Encodes and decodes emoji and non-Latin text correctly, not just ASCII." },
      { title: "Live + swap", body: "Convert as you type and flip input/output with one click." },
      { title: "Local only", body: "Nothing you paste is uploaded." },
    ],
    useCases: ["Encode text for a data URI", "Decode a Base64 string to read it", "Embed small assets inline", "Debug an encoded token or header"],
  },
  "jwt-decoder": {
    benefits: [
      { title: "Readable claims", body: "Decodes header and payload into clean JSON and shows the exp claim as a date." },
      { title: "Expiry at a glance", body: "A green or red badge tells you instantly whether a token is still valid." },
      { title: "Never uploaded", body: "Decoding is local — safe for real access tokens." },
    ],
    useCases: ["Inspect a JWT while debugging auth", "Check whether a token has expired", "Read the claims in an access token", "Confirm what a backend encoded"],
  },
  "url-encoder": {
    benefits: [
      { title: "Component-safe encoding", body: "Percent-encodes everything unsafe in a URL value, like encodeURIComponent." },
      { title: "Live both ways", body: "Encode and decode instantly with a swap button." },
      { title: "Private", body: "Runs entirely in your browser." },
    ],
    useCases: ["Fix a link broken by a space or &", "Build a safe query-string value", "Decode an encoded URL to read it", "Prepare a parameter for an API call"],
  },
  "hash-generator": {
    benefits: [
      { title: "SHA-1 to SHA-512", body: "Computes four digests at once with the Web Crypto API." },
      { title: "Deterministic", body: "Identical input always yields the same hash, ideal for verification." },
      { title: "Local", body: "Hashing runs in your browser; nothing is sent anywhere." },
    ],
    useCases: ["Verify text or file integrity", "Compare a checksum", "Generate a deterministic key", "Check a value against a known hash"],
  },
  "uuid": {
    benefits: [
      { title: "Cryptographically random", body: "Uses crypto.randomUUID() so values are safe for real identifiers." },
      { title: "Bulk + formatting", body: "Generate up to 100 at once, with uppercase and no-hyphen options." },
      { title: "Copy fast", body: "Copy any single UUID or the whole list." },
    ],
    useCases: ["Seed database records or test data", "Generate request or correlation IDs", "Create unique file or key names", "Produce a batch of GUIDs"],
  },
  "qr-code": {
    benefits: [
      { title: "More than a URL", body: "Encode a link, plain text, Wi-Fi login, email or phone number — the right format is built for you." },
      { title: "Sharp at any size", body: "Download a high-resolution PNG or an infinitely-scalable SVG for print, with custom colours and quiet zone." },
      { title: "Generated on your device", body: "Nothing is sent to a server, so even Wi-Fi passwords and private links stay local." },
    ],
    useCases: ["Put a link to your site on a poster or business card", "Share Wi-Fi access with guests without typing the password", "Add a scan-to-call or scan-to-email code to a flyer", "Link a product label to a page or menu"],
  },
  "json-to-typescript": {
    benefits: [
      { title: "Nested interfaces", body: "Walks the JSON recursively, naming interfaces for nested objects." },
      { title: "Smart arrays", body: "Merges array-of-object keys and marks inconsistent ones optional." },
      { title: "Private", body: "Type generation runs in your browser." },
    ],
    useCases: ["Type an unfamiliar API response", "Bootstrap interfaces from sample data", "Avoid hand-writing types", "Turn a JSON fixture into TS"],
  },
  "svg-to-react": {
    benefits: [
      { title: "JSX-ready", body: "Renames attributes (class → className, stroke-width → strokeWidth) and converts inline styles." },
      { title: "Typed + spreadable", body: "Outputs a typed component that spreads props onto the root svg." },
      { title: "Preserves structure", body: "Keeps viewBox and gradients intact via XML parsing." },
    ],
    useCases: ["Turn an icon into a React component", "Make an SVG accept className and onClick", "Drop a logo into a component library", "Convert exported SVGs for your app"],
  },
  "robots-txt-generator": {
    benefits: [
      { title: "Valid output", body: "Builds correct syntax from simple allow/disallow inputs." },
      { title: "Presets", body: "Allow-all or block-all in one click, then refine." },
      { title: "Sitemap line", body: "Add your sitemap URL to aid discovery." },
    ],
    useCases: ["Create a robots.txt for a new site", "Block crawlers from private paths", "Add a crawl-delay", "Point search engines at your sitemap"],
  },
  "sitemap-generator": {
    benefits: [
      { title: "Standards-compliant XML", body: "Produces a valid sitemaps.org file from a list of URLs." },
      { title: "Metadata included", body: "Adds lastmod, changefreq and priority." },
      { title: "URL validation", body: "Detects and skips malformed URLs." },
    ],
    useCases: ["Generate a sitemap for a small site", "Convert a URL list to XML", "Prepare a sitemap for Search Console", "Refresh a sitemap after adding pages"],
  },
  "schema-generator": {
    benefits: [
      { title: "JSON-LD output", body: "Generates Google's recommended structured-data format." },
      { title: "Key types", body: "Organization, Article, Product, FAQ and Local Business." },
      { title: "Clean markup", body: "Empty fields are omitted so the output stays valid." },
    ],
    useCases: ["Add Organization markup to a site", "Mark up an article or product", "Create FAQ schema for rich results", "Add Local Business structured data"],
  },
  "open-graph-preview": {
    benefits: [
      { title: "Live share card", body: "See how your page looks when shared before you publish." },
      { title: "OG + Twitter tags", body: "Generates both Open Graph and Twitter Card meta tags." },
      { title: "Private", body: "Preview and generation happen in your browser." },
    ],
    useCases: ["Preview a social share card", "Generate OG meta tags for a page", "Add Twitter Card tags", "Debug why a link preview looks wrong"],
  },
  "color-palette": {
    benefits: [
      { title: "Dominant colours", body: "Extracts the key colours from any image as a palette." },
      { title: "Copy HEX/RGB", body: "Each swatch has copy-ready values." },
      { title: "On-device", body: "Your image is decoded on a canvas and never uploaded." },
    ],
    useCases: ["Build a theme from a photo", "Match brand colours from an image", "Pull accent colours for a design", "Create a palette from a reference"],
  },
  "sql-formatter": {
    benefits: [
      { title: "Multi-dialect", body: "Formats MySQL, PostgreSQL, SQLite, BigQuery, Snowflake and more." },
      { title: "Readable output", body: "Consistent indentation and upper-cased keywords." },
      { title: "Logic untouched", body: "Only whitespace and casing change — your query is unchanged." },
    ],
    useCases: ["Tidy a one-line query for a review", "Format generated SQL", "Make a complex query readable", "Standardise team SQL style"],
  },
  "html-minifier": {
    benefits: [
      { title: "Whitespace-safe", body: "Preserves pre, textarea, script and style where spacing matters." },
      { title: "Size report", body: "Shows exactly how many bytes you saved." },
      { title: "Local", body: "Minification runs in your browser." },
    ],
    useCases: ["Shrink a page's HTML", "Minify an email template", "Reduce a static fragment's size", "Strip comments before publishing"],
  },
  "css-minifier": {
    benefits: [
      { title: "Fast and lightweight", body: "Strips comments and whitespace to a compact line." },
      { title: "Size report", body: "See the byte saving instantly." },
      { title: "Private", body: "Runs entirely in your browser." },
    ],
    useCases: ["Minify a stylesheet for production", "Compress a CSS snippet", "Reduce inline-style weight", "Quickly shrink a component's CSS"],
  },
  "js-minifier": {
    benefits: [
      { title: "Real Terser", body: "Compresses and mangles with the industry-standard minifier." },
      { title: "Safe", body: "Parses an AST rather than using regex, so valid code won't break." },
      { title: "Size report", body: "Reports the bytes saved." },
    ],
    useCases: ["Minify a script or snippet", "Shrink a small library before shipping", "Compress inline JavaScript", "Compare original vs minified size"],
  },
  "svg-optimizer": {
    benefits: [
      { title: "Removes cruft", body: "Strips editor metadata, comments and the XML prolog." },
      { title: "Live preview", body: "Confirm the cleaned graphic looks identical." },
      { title: "Size report", body: "See how much smaller the SVG gets." },
    ],
    useCases: ["Clean an SVG exported from a design tool", "Shrink an icon before embedding", "Remove Inkscape/editor attributes", "Tidy SVG markup for a component"],
  },
};
