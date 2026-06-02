import Script from "next/script";

/** GA4 Measurement ID. Override per-environment with NEXT_PUBLIC_GA_ID. */
const DEFAULT_GA_ID = "G-M180ZJC75T";

/**
 * Google Analytics 4. Uses NEXT_PUBLIC_GA_ID if set, otherwise the default
 * Measurement ID. Loaded afterInteractive so it never blocks rendering.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
