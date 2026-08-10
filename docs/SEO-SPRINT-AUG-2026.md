# SEO sprint — August 2026

Baseline: GSC export 2026-08-09, window Jun 1 – Aug 7 (68 days).
**2,810 impressions · 40 clicks · 1.42% CTR · 164 pages with impressions.**

---

## 1. Reality check on the targets

The stated goal was **1,000 clicks and 1,000,000 impressions within 10 days**. That is not
reachable, and it is worth writing down why so the sprint is judged against a real number.

| Metric | Now (per day) | Target implies (per day) | Multiple |
|---|---|---|---|
| Impressions | ~115 | ~100,000 | **~870x** |
| Clicks | ~0.6 | ~100 | **~170x** |

Three independent ceilings block it:

1. **Authority, not content.** 66% of pages and 80% of impressions sit below position 40.
   The August export proved this cleanly: the India calculators (`/calculators/nsc`, `ssy`,
   `scss`) match their target queries *exactly* — "nsc calculator" (81 impr), "ssy calculator"
   (62) — and still rank position 73–95. Nothing on-page moves a page from 80 to 10. Only
   links and time do.
2. **Indexing latency.** New pages take roughly 3–14 days to be crawled, indexed and start
   collecting impressions. Pages shipped today mostly land *after* a 10-day window closes.
3. **Impression supply.** 1M impressions/month needs either top-10 positions on high-volume
   head terms (blocked by #1) or a footprint of 10k+ indexed pages. A 2-month-old domain with
   no backlink profile will not get 10k pages indexed — it will get crawl-budget throttled and
   risk a thin-content classification.

**Realistic 10-day outcome from this sprint: ~1,300–1,900 impressions and 8–15 clicks**
(vs ~1,150 impressions / 3 clicks in the preceding 10 days). The honest path to 1,000
clicks/month is Section 4 — a 3 to 6 month track, gated on backlinks.

---

## 2. Shipped in this sprint

### On-page / SERP presentation
- **86 titles and meta descriptions rewritten to fit.** 84 descriptions exceeded 158 chars
  (worst: 231) and were being truncated mid-sentence in the SERP; 2 titles exceeded 60.
  All now fit — descriptions 132–158 chars, titles ≤60.
- **9 more fixed in the preset data files** (`convertPresets.tsx`, `sizePresets.tsx`). These
  drive `generateMetadata` for the dynamic `[pair]` / `[size]` routes, so they were invisible
  to a page-level scan — worth remembering for any future audit.

### Keyword coverage (+13 pages)
Both new sets reuse existing, already-ranking page templates rather than inventing a new one.

- **6 image-conversion pairs** — `gif-to-png`, `gif-to-jpg`, `gif-to-webp`, `bmp-to-jpg`,
  `bmp-to-png`, `png-to-bmp`. GIF and BMP were entirely uncovered as *source* formats despite
  the converter supporting both. Verified against `lib/image.ts` — BMP output uses the
  hand-written 24-bit encoder, so every pair genuinely works.
- **7 compress-to-size pages** — PDF `50kb`/`300kb`/`2mb`, image `10kb`/`30kb`/`300kb`/`500kb`.
  This page type already earns impressions, and the gaps were the sizes Indian exam and
  government portals actually specify.

Each carries unique intro copy, use cases and FAQs — including honest limitations (animated
GIFs convert first-frame only; BMP output is flattened and much larger). That is deliberate:
doorway pages at this volume are a thin-content risk, and the quality gate is what keeps them
indexable.

### Measurement
- **GTM was already correctly installed** (`app/layout.tsx`) with Consent Mode v2 defaulting
  every storage type to `denied`. No change needed.
- **`tool_completed` now also pushes to the GTM dataLayer** (`lib/utils.ts`), alongside the
  existing Vercel Analytics call. Every tool funnels downloads through one helper, so this
  single point covers the whole catalogue. Payload is `{event, tool_path, output_type}` —
  no filename, no file contents.

**To finish the GTM half, in the GTM UI (not code):** create a GA4 Event tag on the custom
event trigger `tool_completed`, mapping `tool_path` and `output_type` to event parameters,
then register both as custom dimensions in GA4. Until that is done the events sit in the
dataLayer unused.

---

## 3. The next 10 days — ranked by actual expected return

1. **Backlinks. Nothing else competes.** This is the same conclusion as the July export and
   the August data strengthened it. Execute `docs/BACKLINK-OUTREACH.md` and
   `docs/directory-listings.md`. Best assets to pitch: the passport-photo-sizes reference
   table, the fun tools (they already pull the only non-India traffic), and the India
   calculators.
2. **Submit the 13 new URLs via IndexNow** (`npm run indexnow`) the moment the deploy is live,
   so the indexing clock starts on day 1 rather than day 5.
3. **Hindi localisation — the largest untapped lever in the codebase.** `next-intl` is wired
   for `en`/`es`/`hi`/`id`/`pt-BR` but only the image-convert pages are translated. India is
   78% of clicks and 37% of impressions; Hindi versions of the calculators and how-to pages
   target a keyword set with materially less competition. This is a genuine multiplier and it
   is mostly plumbing that already exists.
4. **Leave the guides cluster alone.** 31 pages, 737 impressions, **zero clicks**, average
   position 69. It is the worst-performing cluster on the site. Do not add more until the
   existing ones earn something.

## 4. Path to 1,000 clicks/month

1,000 clicks/month needs roughly 35,000–50,000 impressions/month at a 2–3% CTR — about
12–17x current impressions, with a large share of pages moving from position 60+ into the
top 20.

| Phase | Focus | Expected |
|---|---|---|
| Weeks 1–4 | Backlinks + directory listings + IndexNow | Position drift on existing pages; impressions ~2x |
| Weeks 4–8 | Hindi localisation of proven pages; more size/convert presets | Impressions 3–5x |
| Weeks 8–16 | Compounding authority lifts the pos 40–90 mass into pos 10–30 | Clicks scale non-linearly — this is where CTR work finally pays |

CTR optimisation is deliberately last. At position 65 the click curve is flat near zero, so
title rewrites cannot pay off until rankings improve — which is exactly what the July
striking-distance experiment showed (no measurable lift, though the sample was too small to
call it a failure outright).

---

## 5. How we will know this is wrong

- If the 13 new pages are not indexed within 14 days → the constraint is crawl budget, not
  content. Stop adding pages; fix internal linking and prioritise links.
- If impressions rise but clicks stay flat → confirms the position ceiling; shift everything
  to backlinks.
- If the guides cluster is still at 0 clicks in 30 days → prune or consolidate it rather than
  letting it dilute site-wide quality signals.
