"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_KEY as KEY,
  getConsent,
  setConsent,
  type ConsentValue,
} from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-M180ZJC75T";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-KCV7M4GJ";
const ADS_CLIENT = "ca-pub-8900650860007222";
// Microsoft Clarity (heatmaps/session replay) — dormant until a project ID is
// provided via env, and only ever loaded after consent below.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

type Consent = ConsentValue | null;

/**
 * Privacy-first consent gate. Google Analytics and AdSense scripts are NOT
 * loaded until the visitor explicitly accepts. Consent Mode v2 signals are set
 * (default = denied) so even after loading, ads/analytics respect the choice.
 * Declining — or ignoring the banner — loads nothing non-essential.
 */
export function ConsentManager() {
  const [consent, setConsentState] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const v = getConsent();
    if (v) setConsentState(v);
  }, []);

  const choose = (v: ConsentValue) => {
    // Persists + notifies same-tab listeners (AdSlot) via the shared module.
    setConsent(v);
    setConsentState(v);
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="consent-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <Script
            id="adsbygoogle-init"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
          {CLARITY_ID && (
            <Script id="ms-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
            </Script>
          )}
        </>
      )}

      {mounted && consent === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-surface/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm leading-relaxed text-text-muted">
              We use optional cookies for analytics and ads to keep these tools free. Your files
              are always processed privately in your browser and are never uploaded.{" "}
              <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
