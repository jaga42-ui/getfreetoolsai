/** @type {import('next').NextConfig} */

// Google ad/analytics origins the page legitimately talks to. Kept in one place
// so the CSP directives below stay readable.
const GOOGLE_SCRIPT = [
  "https://*.googlesyndication.com",
  "https://*.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.doubleclick.net",
  "https://*.google.com",
  "https://*.gstatic.com",
  "https://*.googleadservices.com",
];
const GOOGLE_FRAME = [
  "https://*.doubleclick.net",
  "https://*.googlesyndication.com",
  "https://*.google.com",
  "https://www.googletagmanager.com",
];
const GOOGLE_CONNECT = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
];

// Content-Security-Policy shipped in REPORT-ONLY mode first: it never blocks a
// request, it only reports violations to the console. This lets us validate the
// policy against live AdSense/GA traffic before enforcing. Notes on the tricky bits:
//  - 'unsafe-inline' + 'unsafe-eval' on script-src: AdSense injects inline scripts;
//    'wasm-unsafe-eval' + 'unsafe-eval' are needed by the WASM tools (pdf.js,
//    tesseract, imgly background removal).
//  - worker-src blob:: tesseract.js / pdf.js spawn workers from blob URLs.
//  - img-src https: data: blob:: tool outputs are data/blob URLs; ads load images
//    from many Google subdomains.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${GOOGLE_SCRIPT.join(" ")}`,
  "style-src 'self' 'unsafe-inline' https://*.googlesyndication.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${GOOGLE_CONNECT.join(" ")}`,
  `frame-src ${GOOGLE_FRAME.join(" ")}`,
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

// Hardening headers applied to every route. Conservative by design: the CSP is
// Report-Only (cannot break ads/analytics/tools), and the Permissions-Policy only
// disables features the site verifiably never uses (no getUserMedia/geolocation
// anywhere in the codebase) — ad-tech features like browsing-topics are left
// unlisted so they keep their browser default and AdSense is unaffected.
const securityHeaders = [
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking protection. AdSense iframes are children of our pages, so this
  // does not affect ad rendering — it only stops others from framing us.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send origin (not full path) on cross-origin navigations.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Warm up DNS for third-party origins (ads/analytics/fonts).
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Force HTTPS for two years, including subdomains. Safe: the site is HTTPS-only.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disable powerful features the site never uses. Unlisted features (incl.
  // AdSense's browsing-topics/attribution-reporting) keep their browser default.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // CSP in observe-only mode — reports violations, blocks nothing. Promote to
  // "Content-Security-Policy" once the console is clean against live ad traffic.
  {
    key: "Content-Security-Policy-Report-Only",
    value: csp,
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework/version to attackers.
  poweredByHeader: false,
  webpack: (config) => {
    // pdfjs-dist & tesseract.js reference node-only modules in some paths.
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
