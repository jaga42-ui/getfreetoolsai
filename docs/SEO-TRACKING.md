# GetFreeToolsAI — Indexing & Ranking Tracker

A lightweight, repeatable process to watch the only thing that gates earnings:
**organic traffic**. No paid tools required.

---

## 0. One-time setup (do these once)

- [ ] **Google Search Console** — verify `https://www.getfreetoolsai.com` (Domain property via DNS is best). Submit both sitemaps:
  - `https://www.getfreetoolsai.com/sitemap-index.xml`
- [ ] **Bing Webmaster Tools** — add the site (you can import from GSC) and submit the same sitemap. Bing also powers IndexNow.
- [ ] **Google AdSense** — confirm approval status. **Nothing earns until this is approved.** The `google-adsense-account` meta tag is already in place for review.
- [ ] **(Optional) Plausible / Cloudflare Web Analytics** — privacy-friendly traffic numbers without GA bloat.

---

## 1. After every production deploy

Ping IndexNow so Bing/Yandex/Seznam crawl new and changed pages within hours:

```bash
npm run indexnow
```

This reads the live sitemaps and submits every URL (currently ~90 tools + ~17 guides). Google ignores IndexNow, but picks pages up from the sitemap — so also hit **GSC → URL Inspection → Request Indexing** for any brand-new flagship page (e.g. a new tool) to nudge it.

---

## 2. Weekly check (5 minutes) — GSC → Performance

Log the rolling 28-day totals. Trend matters far more than absolute numbers early on.

| Week ending | Impressions | Clicks | Avg CTR | Avg position | Indexed pages* |
|-------------|-------------|--------|---------|--------------|----------------|
|             |             |        |         |              |                |

\* GSC → Pages → "Indexed". Watch for pages stuck in "Crawled – currently not indexed" (usually thin content or low authority — fix with more on-page content or internal links).

**What to act on:**
- A query at **position 5–15** = a quick win. Improve that page's title/H1/content to push it onto page 1.
- A page with impressions but **0 clicks** = rewrite the title/meta description to be more clickable.
- Indexed count not growing = request indexing + build internal links to the orphan pages.

---

## 3. Monthly check (15 minutes)

| Month | Referring domains† | Top 3 landing pages | Best-ranking query (pos) | AdSense $ |
|-------|--------------------|--------------------|--------------------------|-----------|
|       |                    |                    |                          |           |

† GSC → **Links → External links → top linking sites** (free), or Bing Webmaster → Backlinks, or a free Ahrefs Webmaster Tools account for a fuller picture.

**Target (from `docs/BACKLINK-OUTREACH.md`): 25–40 referring domains in 90 days.** Work that list top-down — it's the single highest-leverage activity for traffic.

---

## 4. Free rank-tracking options

- **GSC Performance → Queries** — your real positions, free, no setup. Filter by a specific query/page.
- **Bing Webmaster → Keyword Research** — volume ideas.
- Manual spot-check: search your target keyword in an incognito window (logged out) and count the position. Do it for the same 5–10 keywords each month so the trend is comparable.

Keywords worth tracking (examples — pick your real targets):
`compress pdf to 100kb`, `heic to jpg`, `remove background free`, `sign pdf free`,
`protect pdf`, `qr code generator`, `blur background photo`, `image to text`.

---

## 5. Reality check on timeline

- **Months 0–3:** indexing + foundation. Near-zero earnings. Get AdSense approved, get indexed, keep shipping content + backlinks.
- **Months 3–6:** long-tail pages start ranking; first few dollars/month.
- **Months 6–12:** compounding; low-to-mid 3 figures/month is realistic with consistent backlink + content work.
- **12+ months:** where it can reach 4 figures/month on competitive terms.

Building more tools widens the funnel (more landing pages = more long-tail shots). It does **not** shortcut the clock — that's backlinks + time. Keep both moving.
