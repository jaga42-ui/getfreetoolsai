/**
 * Pages withdrawn from the search index.
 *
 * RULE (re-derived against the GSC export for the six months to 2026-09-13):
 * a `/guides/*` or `/how-to/*` **leaf article** is listed here when it has
 * earned zero clicks AND sits below average position 40. That is a
 * demonstrated failure, not an untested page — Google has crawled it, indexed
 * it, shown it, and no one has ever clicked it. Together these 78 pages
 * absorbed 1,679 impressions and returned **zero** clicks.
 *
 * The window is rolling, so a page can legitimately leave this list: the
 * 2026-09-13 re-derivation restored /guides/image/how-to-upscale-an-image and
 * /guides/audio/transcribe-audio-without-uploading, which each took their
 * first click. One click is small, but a ~5% CTR cannot happen at their stated
 * average position -- that average is dragged down by a long tail, and the
 * page evidently ranks well for something. Restoring costs nothing; wrongly
 * suppressing a page that had started to work costs an asset this site has
 * only 49 of.
 *
 * What this is for: 169 of the 237 pages appearing in search earn nothing, and
 * they dilute the contextual link equity and crawl attention that the 49 pages
 * which do earn are competing for. The 2026-08-17 internal-link fix is the
 * precedent — concentrating link share produced the only ranking inflection
 * this site has had (see the Sep 2026 GSC notes).
 *
 * DELIBERATE EXCLUSIONS:
 * - `noindex, follow`, not `nofollow`. The pages stay live and useful to
 *   visitors, and keep passing equity through to the tools they link to.
 * - Tool pages are never listed, even when currently dead. A calculator stuck
 *   at position 80 behind India Post is waiting on authority, not on being
 *   removed; those are exactly the pages meant to wake up later.
 * - Category hubs (`/guides`, `/guides/pdf`) stay indexed. They are navigation
 *   and the head of their cluster.
 * - Pages Google has never shown are NOT listed. An unjudged page is not a
 *   failed one, and there is no way to tell "ignored" from "not yet reached".
 *
 * REVIEW: re-derive this list from the next GSC export rather than appending by
 * hand. A page that earns a click or climbs above position 40 should come off.
 */
export const NOINDEX_PATHS: readonly string[] = [
  "/guides/calculator/how-a-401k-match-works",
  "/guides/calculator/how-to-calculate-a-car-payment",
  "/guides/calculator/how-to-calculate-a-discount",
  "/guides/calculator/how-to-calculate-a-mortgage-payment",
  "/guides/calculator/how-to-calculate-a-tip",
  "/guides/calculator/how-to-calculate-bmi",
  "/guides/calculator/how-to-calculate-compound-interest",
  "/guides/calculator/how-to-calculate-days-between-two-dates",
  "/guides/calculator/how-to-calculate-emi",
  "/guides/calculator/how-to-calculate-gst",
  "/guides/calculator/how-to-calculate-in-hand-salary-from-ctc",
  "/guides/calculator/how-to-calculate-percentage",
  "/guides/calculator/how-to-calculate-sales-tax",
  "/guides/calculator/how-to-calculate-sip-returns",
  "/guides/calculator/how-to-count-words-and-characters",
  "/guides/calculator/how-to-read-a-loan-amortization-schedule",
  "/guides/image/convert-png-to-jpg",
  "/guides/image/how-to-add-a-watermark-to-a-photo",
  "/guides/image/how-to-adjust-brightness-and-contrast",
  "/guides/image/how-to-crop-an-image",
  "/guides/image/how-to-flip-or-rotate-an-image",
  "/guides/image/how-to-get-the-color-code-from-an-image",
  "/guides/image/how-to-make-a-meme",
  "/guides/image/how-to-resize-an-image",
  "/guides/image/how-to-round-the-corners-of-an-image",
  "/guides/image/how-to-view-photo-metadata",
  "/guides/image/remove-exif-metadata-from-photos",
  "/guides/image/resize-image-for-passport-photo",
  "/guides/ocr/what-is-ocr-and-how-does-it-work",
  "/guides/pdf/compress-pdf-to-a-specific-size",
  "/guides/pdf/convert-word-to-pdf",
  "/guides/pdf/how-to-convert-pdf-to-jpg",
  "/guides/pdf/how-to-convert-png-to-pdf",
  "/guides/pdf/how-to-fill-out-a-pdf-form",
  "/guides/pdf/how-to-rotate-a-pdf",
  "/guides/pdf/how-to-sign-a-pdf-online-free",
  "/how-to/australia-visa-photo-size",
  "/how-to/canada-visa-photo-size",
  "/how-to/china-visa-photo-size",
  "/how-to/compress-pdf-for-a-job-application",
  "/how-to/compress-pdf-for-email",
  "/how-to/compress-pdf-for-passport-application",
  "/how-to/india-passport-photo-size",
  "/how-to/new-zealand-visa-photo-size",
  "/how-to/oci-card-photo-size",
  "/how-to/pan-card-photo-and-signature-size",
  "/how-to/resize-image-for-a-business-card",
  "/how-to/resize-image-for-discord-banner",
  "/how-to/resize-image-for-email-signature",
  "/how-to/resize-image-for-facebook-cover",
  "/how-to/resize-image-for-linkedin-banner",
  "/how-to/resize-image-for-pinterest-pin",
  "/how-to/resize-image-for-reddit-banner",
  "/how-to/resize-image-for-spotify-playlist-cover",
  "/how-to/resize-image-for-tiktok-video",
  "/how-to/resize-image-for-twitch-banner",
  "/how-to/resize-image-for-twitter-header",
  "/how-to/resize-image-for-whatsapp-dp",
  "/how-to/resize-image-for-youtube-channel-banner",
  "/how-to/resize-image-for-youtube-thumbnail",
  "/how-to/resize-photo-and-signature-for-afcat",
  "/how-to/resize-photo-and-signature-for-cat",
  "/how-to/resize-photo-and-signature-for-cds",
  "/how-to/resize-photo-and-signature-for-ctet",
  "/how-to/resize-photo-and-signature-for-gate",
  "/how-to/resize-photo-and-signature-for-jee-main",
  "/how-to/resize-photo-and-signature-for-neet",
  "/how-to/resize-photo-and-signature-for-rbi-grade-b",
  "/how-to/resize-photo-and-signature-for-rrb",
  "/how-to/resize-photo-and-signature-for-sbi",
  "/how-to/resize-photo-and-signature-for-ssc",
  "/how-to/resize-photo-and-signature-for-ssc-gd",
  "/how-to/resize-photo-and-signature-for-upsc",
  "/how-to/saudi-arabia-visa-photo-size",
  "/how-to/south-korea-visa-photo-size",
  "/how-to/uae-visa-photo-size",
  "/how-to/uk-passport-photo-size",
  "/how-to/us-visa-photo-size",];

const NOINDEX_SET = new Set<string>(NOINDEX_PATHS);

/** True when `path` is withdrawn from the index. Pass a pathname, no origin. */
export function isNoindexed(path: string): boolean {
  return NOINDEX_SET.has(path);
}
