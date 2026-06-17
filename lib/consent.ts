// Single source of truth for the cookie/ads consent choice. Both the consent
// banner (ConsentManager) and any consent-gated embed (AdSlot, analytics) read
// and write through here so the key and the change-notification never drift.

export const CONSENT_KEY = "gft-consent";
/** Fired on the window when consent changes within the same tab. */
export const CONSENT_EVENT = "gft-consent-change";

export type ConsentValue = "granted" | "denied";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: ConsentValue): void {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* localStorage unavailable */
  }
  // localStorage doesn't fire a `storage` event in the same tab, so notify
  // listeners (e.g. AdSlot) explicitly. Other tabs still get the `storage` event.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: v }));
  }
}
