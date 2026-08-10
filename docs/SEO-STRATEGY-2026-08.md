# GetFreeToolsAI — SEO Architecture Audit & Keyword Strategy
**Date:** 2026-08-10 · **Status:** Strategy only. No page changes made. Implementation gated on your approval.

---

## 0. Data provenance — read this first

| Source | Status |
|---|---|
| Codebase / route / build analysis | **First-party, complete.** 349 built HTML pages analysed directly. |
| Google Search Console (Jun 1 – Aug 7) | **First-party, authoritative.** 2,810 impressions, 40 clicks, 164 pages with impressions. |
| Live SERP checks | **Sampled, 4 head terms** (`pdf compressor`, `image compressor online`, `json formatter`, `emi calculator`). |
| Keyword search volumes | **ESTIMATED.** No DataForSEO / Ahrefs / Moz credentials are configured. |

Volumes below are given as **bands** (VH / H / M / L), not invented numbers. A precise-looking "8,100/mo"
would be fabrication. Before committing budget to Tier 1, buy one month of DataForSEO or Ahrefs and
replace the bands with real figures — the *rank ordering* here is reliable, the absolute demand is not.

---

## 1. PHASE 1 — SITE ARCHITECTURE AUDIT

### 1.1 What is actually built

| Layer | Count | Notes |
|---|---|---|
| Built HTML pages | **349** | vs ~294 indexed / 42 not indexed in GSC |
| Route files (`page.tsx`) | 164 | rest are programmatic `[slug]` expansions |
| Tools in registry | **135 ready** | PDF 18 · Image 20 · Calculators 43 · Dev 27 · Text 10 · Fun 13 · Video 3 · Audio 1 |
| Category hubs | 8 | `/pdf-tools` `/image-tools` `/calculators` `/dev-tools` `/text-tools` `/audio-tools` `/video-tools` `/fun-tools` |
| `/how-to/*` | 71 | exam-photo + PDF-size long-tail |
| `/guides/*` | 31 | **0 clicks in 68 days** |
| `/compare/*` | 12 | competitor-alternative pages |
| Programmatic presets | 27 | 12 convert pairs + 15 compress sizes |

### 1.2 Technical SEO — what is already correct

Genuinely clean. Do not "fix" these:

- **Canonicals** — every page self-canonicals via `toolMeta()` (`lib/seo.ts:49`).
- **robots.txt** — allows all, disallows `/api/`, points to `sitemap-index.xml`. Correct.
- **noindex** — correctly applied to `/offline`, `/search`, and the 404. Nothing valuable is blocked.
- **Sitemap** — built from the tool registries, so new tools auto-appear. Split into `sitemap-tools` / `sitemap-guides` under an index. Consistent with reality.
- **H1s** — 349/349 pages have exactly one, 9–66 chars. No missing, no over-length.
- **Titles/meta** — as of PR #54, 0 titles >60 and 0 descriptions >158.
- **Structured data** — SoftwareApplication, BreadcrumbList, ItemList, FAQPage, BlogPosting all present and valid.
- **Rendering** — Next.js App Router, statically prerendered. Tools are `dynamic(ssr:false)` but all SEO content is in the server HTML. **No JS-rendering indexability risk.** Verified in build output.
- **OG/Twitter** — set globally with a generated OG image.

### 1.3 Technical SEO — the real problems

**P1 — Sitewide link mass destroys internal link signal.** *(FIXED — see §16)*
Every page rendered **~130 links** before any contextual link.

**Correction to an earlier draft of this report:** the Navbar was *not* the cause. Its dropdowns and mobile
menu are gated behind client state (`openMenu`, `mobileOpen`), so those 81 tool links never reach the
server HTML — the header emits only 10 links. The actual source was the **Footer, at 106 links**, which
rendered all 18 PDF + 20 image + 43 calculator tools on all 349 pages. Measured on `/pdf/ocr`: header 10,
main 18, **footer 106**.

This is precisely the "every tool links to every tool" structure to avoid. Consequences:
- Internal PageRank is spread almost uniformly — the site cannot signal which pages matter.
- Anchor-text relevance is diluted to near zero; nav anchors are generic tool names repeated site-wide.
- Contextual links (the ~5–12 that carry real topical meaning) are drowned at a ~1:12 ratio.

**P2 — Category hubs are link lists, not authority pages.**
`/pdf-tools` 774 words but only **2 H2s** and 18 H3s — the H3s are just tool names. Same shape across all 8
hubs (`/calculators`: 877 words, 2 H2s, 43 H3s). These cannot hold a head term like "PDF tools" because
there is no substantive content, only an index. Compare the tool pages, which are genuinely good:
`/pdf/ocr` 1,258 words / 10 H2s, `/image/background-remover` 1,282 / 10, `/calculators/emi` 1,231 / 6.

**The site has the inverse of the usual problem: strong leaf pages, hollow hubs.**

**P3 — The guides cluster cannibalises the tools and earns nothing.**
31 pages, 737 impressions, **0 clicks**, avg position 69. And they duplicate tool intent head-on:

| Guide | Competing tool |
|---|---|
| `/guides/pdf/convert-word-to-pdf` | `/pdf/word-to-pdf` |
| `/guides/pdf/convert-pdf-to-word` | `/pdf/pdf-to-word` |
| `/guides/pdf/how-to-convert-pdf-to-jpg` | `/pdf/pdf-to-jpg` |
| `/guides/image/convert-png-to-jpg` | `/image/convert/png-to-jpg` |
| `/guides/image/convert-heic-to-jpg` | `/image/heic-to-jpg` |
| `/guides/calculator/how-to-calculate-emi` | `/calculators/emi` |
| `/guides/calculator/how-to-calculate-gst` | `/calculators/gst` |

For a query like "convert word to pdf" the intent is **transactional** — the user wants the tool. Two of our
URLs compete, the weaker one often wins the slot, and neither ranks well.

**P4 — Deprecated HowTo schema.** `howToSchema()` is used in `lib/seo.ts`, `components/ToolScaffold.tsx`,
`app/how-to/[slug]/page.tsx`. Google deprecated HowTo rich results in Sept 2023 — it is dead weight.
(FAQPage is a different case: Google retired FAQ rich results in May 2026, but keep it — it still feeds
AI/LLM citation. Do **not** strip FAQPage.)

**P5 — Backlink profile is a liability, not an asset.** Ahrefs shows many referring domains but a
significant share look spammy, while Google reports almost no link data. That gap usually means Google is
**discounting** the profile rather than penalising it. See §13.

**P6 — i18n is built but unused.** `next-intl` is wired for `en/es/hi/id/pt-BR`, but `middleware.ts` is
deliberately scoped to only the 4 locale prefixes and only the image-convert pages are translated. India is
**78% of clicks**. This is the largest untapped asset in the codebase.

**P7 — 42 pages not indexed.** Expected causes given the architecture: thin `/guides` duplicates (P3),
low-value `/fun` variants, and crawl-budget dilution from P1. Pull the exact list from GSC → Pages →
"Why pages aren't indexed" before acting.

### 1.4 Orphans, duplicates, pagination, redirects

- **Orphan pages:** effectively none — the mega-nav links everything. (This is P1's only upside.)
- **Pagination:** none exists. Not needed at this scale.
- **Redirects:** none configured. Nothing currently needs one — see §14, avoid creating the need.
- **Duplicate content:** the real duplication is *intent* duplication (P3), not text duplication.

---

## 2. PHASE 12 — SERP REALITY CHECK (sampled)

This is the single most important input to prioritisation, and it overturns the intuitive plan.

| Head term | Who actually ranks | Verdict |
|---|---|---|
| **pdf compressor** | Smallpdf, Adobe Acrobat, Canva, PDFgear | **Not winnable in 12 months.** Billion-dollar brands with enormous authority. |
| **image compressor online** | TinyPNG, iLoveIMG, Adobe Express, ShortPixel, FreeConvert, imagecompressor.com, compressnow | **Hard but fragmented.** Several mid-size single-purpose sites hold slots. 12–18 months. |
| **emi calculator** | ICICI Direct, Groww, ICICI Pru, CalculatorSoup — **but also** emicalculator.site, toolxi.com | **Mixed SERP — small sites DO rank.** Winnable with authority. |
| **json formatter** | jsonformatter.org, curiousconcept.com, jam.dev, json-indent.com, openreplay, jstoolset | **Most winnable head term found.** No mega-brand owns it. |

### The strategic conclusion

> **Developer tools and India-finance calculators are your winnable head-term categories. PDF and
> image are not — those SERPs are owned by companies with 1000x your authority.**

This contradicts the obvious plan (attack "PDF tools" because you have 18 PDF tools). Attacking Smallpdf
head-on for "pdf compressor" is a guaranteed 12-month zero. Meanwhile you have **27 developer tools**
sitting in a category where the incumbents are hobby sites — and GSC already shows `/dev-tools/jwt-decoder`
at **position 7.9** and the `/dev-tools` hub at **position 10.2**, your best positions on the entire site.

**You are already winning the winnable category and ignoring it.**

---

## 3. PHASE 8 — PRIORITISATION MODEL

Score each keyword 1–5 on six axes, weighted:

| Factor | Weight | Why |
|---|---|---|
| Intent match (can a free browser tool satisfy it?) | 25% | Highest-value filter. A tool page cannot win an informational SERP. |
| Winnability (SERP competitor authority) | 25% | The binding constraint at DR ~0–10. |
| Existing traction (GSC position/impressions) | 20% | Pages already at pos <20 are the cheapest wins. |
| Search demand band | 15% | Deliberately *not* dominant — volume you cannot rank for is worth 0. |
| Topical-cluster contribution | 10% | Does it reinforce a hub? |
| Backlink potential | 5% | Few tool pages earn links; reference pages do. |

**Tiering:**
- **TIER 1** — winnable head/mid terms where we already have traction or the SERP is weak. Attack now.
- **TIER 2** — high-value mid-tail; achievable in 3–6 months.
- **TIER 3** — long-tail that *supports* Tier 1/2 pages. Mostly already built. Do not expand blindly.
- **TIER 4** — ignore. High volume, unwinnable or intent-mismatched.

---

## 4. FINAL OUTPUT 1 — TOP 50 HEAD KEYWORDS

Ordered by priority score, not volume. `Vol` = estimated band (VH/H/M/L). `Win` = winnability 1–5.

### Tier 1 — attack now (1–12)

| # | Head keyword | Target URL | Vol | Win | Why |
|---|---|---|---|---|---|
| 1 | json formatter | `/dev-tools/json-formatter` | H | 4 | SERP is small sites. Already pos ~15. |
| 2 | jwt decoder | `/dev-tools/jwt-decoder` | M | 5 | **Already pos 7.9.** Push to top 3. |
| 3 | developer tools online | `/dev-tools` | M | 4 | Hub already pos 10.2. |
| 4 | emi calculator | `/calculators/emi` | VH | 3 | **Already pos 3.8.** India. Mixed SERP. |
| 5 | qr code generator | `/dev-tools/qr-code` | VH | 3 | Fragmented SERP, strong tool. |
| 6 | typing test | `/fun/typing-test` | VH | 3 | Fun cluster already converts. |
| 7 | base64 decode | `/dev-tools/base64` | H | 4 | Dev SERP weakness. |
| 8 | regex tester | `/dev-tools/regex-tester` | M | 4 | Small incumbents. |
| 9 | uuid generator | `/dev-tools/uuid` | M | 5 | Very weak SERP. |
| 10 | hash generator | `/dev-tools/hash-generator` | M | 4 | Weak SERP. |
| 11 | sip calculator | `/calculators/sip` | VH | 3 | India. Already pos 8.2. |
| 12 | password generator | `/dev-tools/password-generator` | VH | 3 | Fragmented. |

### Tier 2 — 3–6 months (13–30)

| # | Head keyword | Target URL | Vol | Win |
|---|---|---|---|---|
| 13 | gst calculator | `/calculators/gst` | H | 3 |
| 14 | percentage calculator | `/calculators/percentage` | VH | 3 |
| 15 | sql formatter | `/dev-tools/sql-formatter` | M | 4 |
| 16 | color converter / hex to rgb | `/dev-tools/color-converter` | H | 3 |
| 17 | unix timestamp converter | `/dev-tools/timestamp` | M | 4 |
| 18 | json to csv | `/dev-tools/json-csv` | M | 4 |
| 19 | cgpa to percentage | `/calculators/cgpa-to-percentage` | H | 4 |
| 20 | ppf calculator | `/calculators/ppf` | H | 3 |
| 21 | nps calculator | `/calculators/nps` | M | 3 |
| 22 | income tax calculator | `/calculators/income-tax` | VH | 2 |
| 23 | salary calculator / ctc to in-hand | `/calculators/salary` | H | 3 |
| 24 | image to text / ocr online | `/image/image-to-text` | H | 3 |
| 25 | pdf ocr | `/pdf/ocr` | M | 3 |
| 26 | heic to jpg | `/image/heic-to-jpg` | H | 3 |
| 27 | remove exif / metadata viewer | `/image/remove-exif` | M | 4 |
| 28 | background remover | `/image/background-remover` | VH | 2 |
| 29 | word counter | `/calculators/word-counter` | VH | 3 |
| 30 | number base converter | `/dev-tools/number-base` | L | 5 |

### Tier 3 — long-horizon, keep building toward (31–43)

| # | Head keyword | Target URL | Vol | Win |
|---|---|---|---|---|
| 31 | image compressor | `/image/compress` | VH | 2 |
| 32 | image resizer | `/image/resize` | VH | 2 |
| 33 | pdf compressor | `/pdf/compress` | VH | 1 |
| 34 | merge pdf | `/pdf/merge` | VH | 1 |
| 35 | split pdf | `/pdf/split` | H | 2 |
| 36 | pdf to word | `/pdf/pdf-to-word` | VH | 1 |
| 37 | word to pdf | `/pdf/word-to-pdf` | VH | 1 |
| 38 | jpg to pdf | `/pdf/jpg-to-pdf` | VH | 2 |
| 39 | pdf to jpg | `/pdf/pdf-to-jpg` | H | 2 |
| 40 | sign pdf | `/pdf/sign` | H | 2 |
| 41 | unlock pdf | `/pdf/unlock` | M | 3 |
| 42 | protect pdf | `/pdf/protect` | M | 3 |
| 43 | video compressor | `/video/compress` | H | 2 |

### Tier 1 category/hub head terms (44–50)

| # | Head keyword | Target URL | Vol | Win | Note |
|---|---|---|---|---|---|
| 44 | online calculator | `/calculators` | VH | 2 | Needs hub rebuild (§7) |
| 45 | free online tools | `/` | VH | 2 | Homepage already pos 24.8 |
| 46 | pdf tools | `/pdf-tools` | H | 2 | Needs hub rebuild |
| 47 | image tools | `/image-tools` | M | 3 | Already pos 5.3 — **protect this** |
| 48 | text tools | `/text-tools` | M | 4 | Weak SERP |
| 49 | financial calculators | `/calculators` | M | 3 | Secondary for hub |
| 50 | passport photo size | `/passport-photo-sizes` | H | 4 | Best link asset (§11) |

### TIER 4 — explicitly do NOT target

`pdf editor` (we don't have one — intent mismatch) · `chatgpt` / `ai tools` (no intent match) ·
`photoshop online` (can't satisfy) · `convert pdf to excel` (not built) · `mortgage calculator`,
`401k calculator` (US-only; US is 896 impressions / **0 clicks** — the weakest geo) ·
any `[bank name] emi calculator` (brand SERPs we cannot win).

---

## 5. FINAL OUTPUT 2 — TOP 100 MID-TAIL KEYWORDS

Grouped by owning page. These are **modifiers of the head term** and belong *on the head page* as H2s and
body copy — not as new URLs.

**Developer (→ Tier 1 focus) — 22**
`free json formatter` · `json formatter online` · `json beautifier` · `json validator` · `format json online`
· `json pretty print` · `online jwt decoder` · `decode jwt token` · `jwt token decoder online` ·
`base64 encoder online` · `base64 decode online` · `online regex tester` · `regex tester javascript` ·
`test regular expression online` · `uuid v4 generator` · `generate guid online` · `md5 hash generator` ·
`sha256 generator online` · `online sql formatter` · `format sql query online` · `hex to rgb converter` ·
`rgb to hex online`

**Calculators / India finance — 24**
`emi calculator online` · `home loan emi calculator` · `car loan emi calculator` · `personal loan emi calculator`
· `loan emi calculator with interest` · `sip calculator online` · `mutual fund sip calculator` ·
`lumpsum calculator online` · `gst calculator online` · `gst inclusive calculator` · `reverse gst calculator` ·
`ppf calculator online` · `nps calculator online` · `nsc calculator online` · `ssy calculator online` ·
`scss calculator online` · `fd calculator online` · `rd calculator online` · `income tax calculator india` ·
`new vs old tax regime calculator` · `in hand salary calculator` · `ctc to in hand salary calculator` ·
`gratuity calculator online` · `hra calculator online`

**Calculators / general — 12**
`percentage calculator online` · `percentage increase calculator` · `cgpa to percentage calculator` ·
`percentage to cgpa calculator` · `age calculator online` · `date difference calculator` ·
`bmi calculator online` · `calorie calculator online` · `body fat calculator online` ·
`compound interest calculator online` · `simple interest calculator` · `discount calculator online`

**Image — 16**
`free image compressor` · `compress image online free` · `image compressor to kb` ·
`resize image online free` · `image resizer in kb` · `free background remover` ·
`remove background from image free` · `heic to jpg converter free` · `convert heic to jpg online` ·
`image to text converter` · `free ocr online` · `extract text from image online` ·
`remove exif data online` · `image metadata viewer online` · `image upscaler free` · `add watermark to image online`

**PDF — 16**
`compress pdf online free` · `reduce pdf file size online` · `pdf compressor to kb` ·
`merge pdf online free` · `combine pdf files free` · `split pdf online free` ·
`pdf to word converter free` · `word to pdf converter free` · `jpg to pdf converter free` ·
`pdf to jpg converter free` · `free pdf ocr` · `scanned pdf to text` · `sign pdf online free` ·
`password protect pdf online` · `remove pdf password online` · `pdf to text converter`

**Text / Fun / Other — 10**
`word counter online` · `character counter online` · `case converter online` · `slug generator online` ·
`find and replace online` · `typing speed test online` · `wpm test` · `free qr code generator` ·
`qr code generator with logo` · `random number generator online`

---

## 6. FINAL OUTPUT 3 — TOP 200 SUPPORTING LONG-TAIL

**Rule: almost none of these get a new URL.** They are H2/FAQ/body content on the owning head page, or
they already exist as `/how-to/*`. This is how long-tail *feeds* the head term rather than competing with it.

**Already built — keep, do not expand (108 URLs)**
- 71 × `/how-to/*` — exam photo/signature (NEET, UPSC, SSC, IBPS, GATE, CAT, CLAT, RRB, SBI, RBI, CTET, NDA, CDS, AFCAT, JEE, UPPSC, PAN, Voter ID) + social image sizes (Instagram, YouTube, LinkedIn, Facebook, Pinterest, Twitch, Discord, TikTok, Reddit, Spotify, Kindle, Etsy, Behance, GitHub, Zoom, WhatsApp) + PDF-purpose compression (visa, KYC, court e-filing, GST, income-tax, scholarship, insurance, passport, university).
  **These have genuinely distinct intent and are among your best performers. Not cannibalisation. Leave them.**
- 15 × compress-to-size · 12 × convert-pair · 12 × `/compare/*` alternative pages.

**To be absorbed into head pages as on-page content (~92 queries).** Examples per cluster:

*JSON formatter page:* `format json online free` · `json syntax checker` · `fix broken json` ·
`minify json online` · `json to yaml` · `why is my json invalid` · `json formatter no ads` ·
`json viewer tree` · `validate json schema online`

*JWT decoder page:* `decode jwt without secret` · `is jwt encrypted` · `jwt expiry check` ·
`read jwt payload online` · `jwt decoder offline` · `verify jwt signature online`

*EMI calculator page:* `how to calculate emi manually` · `emi formula` · `emi with prepayment` ·
`emi amortization schedule` · `reduce emi or tenure` · `emi vs interest breakdown` ·
`home loan emi for 30 lakh` · `emi calculator with part payment`

*PDF compress page:* `compress pdf without losing quality` · `why is my pdf so large` ·
`reduce scanned pdf size` · `compress pdf offline` · `compress pdf without watermark` ·
`compress pdf no signup` · `compress pdf on mobile`

*Image compress page:* `compress image without losing quality` · `compress jpeg to exact size` ·
`reduce photo size in kb` · `compress image for website speed` · `bulk compress images`

*Background remover:* `remove background without watermark` · `free alternative to remove.bg` ·
`transparent png maker` · `remove background from signature` · `remove background hd free`

*OCR:* `convert scanned pdf to editable text` · `ocr hindi pdf` · `extract text from screenshot` ·
`handwriting ocr online` · `ocr without upload` · `searchable pdf free`

*QR generator:* `qr code for wifi` · `qr code for url free` · `qr code svg download` ·
`qr code no expiry` · `dynamic vs static qr code`

*Typing test:* `1 minute typing test` · `average wpm by age` · `how to improve typing speed` ·
`typing test for job` · `accuracy vs speed typing`

*Privacy angle (site-wide differentiator):* `pdf tool that doesn't upload` · `offline image compressor` ·
`browser based pdf tools` · `tools that don't store files` · `gdpr safe file converter`

> Full 200-row enumeration lives in the keyword→URL map spreadsheet (§7) rather than being padded out
> here — a flat list of 200 strings is less actionable than 200 mapped rows.

---

## 7. FINAL OUTPUT 4 — KEYWORD → URL MAP

Full schema applied to the Tier 1 pages. Same template extends to Tier 2/3.

### `/dev-tools/json-formatter` — **highest-priority page on the site**
- **Primary:** json formatter · **Intent:** transactional (tool-use)
- **Head:** json formatter, json beautifier
- **Mid-tail:** free json formatter, json formatter online, json validator, format json online, json pretty print
- **Long-tail:** fix broken json, minify json online, json syntax checker, why is my json invalid
- **Entities:** JSON, RFC 8259, JavaScript, API, YAML, minification, validation
- **Title:** `JSON Formatter & Validator — Free, No Upload` (44)
- **H1:** JSON Formatter & Validator
- **Meta:** Format, validate and minify JSON free. Runs entirely in your browser — no signup, nothing uploaded.
- **H2s:** Format JSON · Validate & find errors · Minify · Why JSON breaks (common errors) · JSON vs YAML · Privacy: nothing leaves your browser · FAQ
- **Internal links:** ← `/dev-tools` hub · ↔ `/dev-tools/json-csv`, `/dev-tools/schema-generator`, `/dev-tools/base64`
- **Backlink target:** YES — dev communities, "no-ads JSON formatter" angle
- **Category:** Developer

### `/dev-tools/jwt-decoder` — already pos 7.9
- **Primary:** jwt decoder · **Intent:** transactional
- **Mid:** online jwt decoder, decode jwt token, jwt token decoder online
- **Long:** decode jwt without secret, is jwt encrypted, jwt expiry check, verify jwt signature online
- **Entities:** JWT, JWS, OAuth, OIDC, HS256, RS256, bearer token, claims
- **Title:** `JWT Decoder — Decode Tokens Locally, No Upload` (46)
- **H2s:** Decode a token · Header / payload / signature explained · Is it safe to paste a JWT? · Common claims · FAQ
- **Backlink target:** YES — the "decodes locally, token never sent" angle is genuinely linkable in security circles

### `/calculators/emi` — already pos 3.8, 70 impressions, 1 click
- **Primary:** emi calculator · **Intent:** transactional · **Geo:** India
- **Mid:** emi calculator online, home/car/personal loan emi calculator
- **Long:** emi formula, emi with prepayment, amortization schedule, reduce emi or tenure
- **Entities:** EMI, principal, interest rate, tenure, amortisation, RBI, home loan
- **H2s:** Calculate your EMI · The EMI formula · Full amortisation schedule · Prepayment: reduce EMI or tenure? · FAQ
- **Note:** ranks 3.8 with ~0 clicks — the likely cause is Google's own calculator widget absorbing the click, **not** a title problem. Verify in a live SERP before spending more on CTR here.

### `/dev-tools` — hub, pos 10.2, best hub on the site
- **Primary:** developer tools online · **Intent:** commercial investigation
- **Needs:** rebuild per §8 (it already has 7 H2s — the best hub structure you have; extend it)
- **Backlink target:** YES — "free dev tools that run offline" is a linkable roundup asset

### `/passport-photo-sizes` — best pure link asset
- **Primary:** passport photo size · **Intent:** informational
- **Mid:** passport photo size in mm, visa photo size by country
- **Entities:** ICAO, 35×45mm, 2×2 inch, DPI, head height
- **Backlink target:** **HIGHEST.** Reference data tables earn editorial links; tools do not.

---

## 8. FINAL OUTPUT 5 — TOPICAL CLUSTER ARCHITECTURE

```
DEVELOPER  ← PRIORITY 1 (winnable)
└── /dev-tools  (pillar: "Free Developer Tools That Run In Your Browser")
    ├── json-formatter ★  ├── jwt-decoder ★   ├── base64
    ├── regex-tester      ├── uuid            ├── hash-generator
    ├── sql-formatter     ├── json-csv        ├── timestamp
    ├── color-converter   ├── number-base     └── schema-generator

INDIA FINANCE  ← PRIORITY 2 (proven market: 78% of clicks)
└── /calculators  (pillar: "Online Calculators")
    ├── emi ★   ├── sip ★   ├── gst ★   ├── income-tax
    ├── ppf · nps · nsc · ssy · scss · fd · rd
    ├── salary · gratuity · hra
    └── cgpa-to-percentage · percentage-to-cgpa

IMAGE  ← PRIORITY 3
└── /image-tools (pos 5.3 — protect)
    ├── compress → 8 size pages
    ├── convert  → 12 pair pages
    ├── background-remover · resize · heic-to-jpg
    ├── remove-exif · metadata-viewer
    └── 20 × /how-to social-size pages

PDF  ← PRIORITY 4 (defend long-tail, do not attack head)
└── /pdf-tools
    ├── compress → 7 size pages + 14 /how-to purpose pages
    ├── ocr ★ · merge · split · sign · protect · unlock
    └── word-to-pdf · pdf-to-word · jpg-to-pdf · pdf-to-jpg

EXAM / DOCUMENT (India)  ← the hidden cluster you already own
└── /how-to  ← should be a real pillar, currently just an index
    └── 71 exam-photo + PDF-purpose pages

FUN  ← keep; it is your only non-India traffic source
└── /fun-tools → typing-test ★ · fake-text-message · fake-error · hacker-typer · spin-wheel
```

★ = designated head-term owner.

---

## 9. FINAL OUTPUT 6 — CANNIBALIZATION REPORT

Measured across all 349 built pages by leading-keyword-pair collision: **30 groups, 145 pages involved.**
Most are *false positives* (legitimately distinct long-tail). The genuine conflicts:

| # | Conflict | Primary (owns the term) | Action |
|---|---|---|---|
| C1 | `/guides/pdf/convert-word-to-pdf` vs `/pdf/word-to-pdf` | **Tool page** | Consolidate guide → tool; 301 |
| C2 | `/guides/pdf/convert-pdf-to-word` vs `/pdf/pdf-to-word` | **Tool page** | Consolidate; 301 |
| C3 | `/guides/pdf/how-to-convert-pdf-to-jpg` vs `/pdf/pdf-to-jpg` | **Tool page** | Consolidate; 301 |
| C4 | `/guides/pdf/convert-jpg-to-pdf` vs `/pdf/jpg-to-pdf` | **Tool page** | Consolidate; 301 |
| C5 | `/guides/image/convert-png-to-jpg` vs `/image/convert/png-to-jpg` | **Preset page** | Consolidate; 301 |
| C6 | `/guides/image/convert-heic-to-jpg` vs `/image/heic-to-jpg` | **Tool page** | Consolidate; 301 |
| C7 | `/guides/calculator/how-to-calculate-emi` vs `/calculators/emi` | **Tool page** | Merge formula content INTO tool page as an H2, then 301 |
| C8 | `/guides/calculator/how-to-calculate-gst` vs `/calculators/gst` | **Tool page** | Merge, then 301 |
| C9 | `/guides/calculator/how-to-calculate-sip-returns` vs `/calculators/sip` | **Tool page** | Merge, then 301 |
| C10 | `/guides/pdf/compress-pdf-to-a-specific-size` vs `/pdf/compress` + 7 size pages | **`/pdf/compress`** | Consolidate guide; keep size pages |
| C11 | `/image/compress` vs 8 size pages | **`/image/compress` owns "image compressor"** | Keep both — size pages must target `compress image to NKB` only, never the bare head term |
| C12 | `/pdf/compress` vs 7 size pages vs 14 how-to | **`/pdf/compress`** | Keep; enforce title discipline |

**False positives — do NOT consolidate:** the 20 exam photo/signature pages, the 20 social-image-size
pages, the 14 PDF-purpose pages. Each targets a distinct query with distinct requirements
(NEET's photo spec ≠ UPSC's). These are the site's proven earners.

**Canonical strategy:** no cross-canonicals. Consolidation means *merge content + 301*, not
`rel=canonical` between two live pages — a canonical that points away from a page that still gets traffic
just wastes it.

---

## 10. FINAL OUTPUT 7 — INTERNAL LINKING PLAN

**The single highest-leverage technical change on this site.**

**Step 1 — cut the mega-nav.** Navbar must stop rendering all 81 tools. Replace with 8 category links +
a "most popular" shortlist of ~10. Target: **≤35 boilerplate links per page, down from ~130.**

**Step 2 — hub → spoke, with real anchors.** Each hub links its tools with descriptive anchors
("JSON formatter and validator"), not bare names.

**Step 3 — spoke → hub.** Every tool links back to its hub in breadcrumb *and* in body copy.

**Step 4 — sibling links, contextual only, max 4–6.** `/pdf/compress` → merge/split/ocr. Not to
`/calculators/bmi`. Current `RelatedTools` should be scoped to same-category siblings.

**Step 5 — long-tail → head, deliberately.** All 14 PDF-purpose how-tos link up to `/pdf/compress` with
varied anchors. All 20 exam pages link to `/image/resize` + `/image/compress`. **This is the mechanism by
which existing long-tail traffic lifts the head terms** — and it is currently missing.

```
BEFORE: every page → ~130 links → uniform, meaningless
AFTER:  hub ⇄ 12 spokes ⇄ 4-6 siblings ← 20 long-tail feeders
        ≤35 boilerplate + 5-12 contextual = signal
```

---

## 11. OUTPUTS 8–11

### Output 8 — Top 20 pages to optimise first
1. `/dev-tools/json-formatter` 2. `/dev-tools/jwt-decoder` 3. `/dev-tools` hub 4. `/calculators/emi`
5. `/calculators` hub 6. `/dev-tools/qr-code` 7. `/fun/typing-test` 8. `/calculators/sip`
9. `/dev-tools/base64` 10. `/dev-tools/regex-tester` 11. `/image-tools` hub (pos 5.3 — protect)
12. `/calculators/gst` 13. `/dev-tools/uuid` 14. `/dev-tools/hash-generator` 15. `/pdf/ocr`
16. `/image/background-remover` 17. `/calculators/percentage` 18. `/pdf-tools` hub
19. `/how-to` hub → make it a real pillar 20. `/passport-photo-sizes`

### Output 9 — Top 20 pages with backlink potential
Reference/data assets first — **tools rarely earn editorial links, reference tables do**:
1. `/passport-photo-sizes` (35+ countries — strongest) 2. `/how-to` exam-spec hub 3. `/dev-tools` hub
4. `/dev-tools/jwt-decoder` ("never leaves your browser" security angle) 5. `/dev-tools/json-formatter`
("no ads, no upload") 6. `/image/remove-exif` (privacy/journalism angle) 7. `/image/metadata-viewer`
8. `/pdf/ocr` (Hindi/Arabic OCR in-browser) 9. `/compare/tinypng-alternative`
10. `/compare/remove-bg-alternative` 11. `/compare/smallpdf-alternative` 12. `/fun/typing-test` (teachers)
13. `/fun/spin-wheel` (classrooms) 14. `/calculators/emi` (India finance blogs)
15. `/calculators/cgpa-to-percentage` (student sites) 16. `/audio/transcribe` (on-device Whisper — genuinely novel)
17. `/image/background-remover` 18. `/calculators/income-tax` 19. `/text-tools` 20. homepage

### Output 10 — Pages that should NOT be indexed
Already correct: `/offline`, `/search`, 404. **Additionally consider noindex:**
- `/pt-BR/*`, `/es/*`, `/id/*` convert pages **if** they are machine-translated and thin — partial i18n with
  low-quality translations is a quality-signal risk. Audit translation quality first.
- Any `/fun/*` variant with no unique content (audit individually).
- Legal pages (`/terms`, `/disclaimer`, `/privacy-policy`) — harmless indexed, but `noindex,follow` is
  cleaner and reduces crawl waste. **Low priority.**
- **Do not noindex the guides** — consolidate/301 them instead (§9). Noindex wastes the equity.

### Output 11 — Pages needing consolidation
The 10 guides in C1–C10. Net: **31 guides → ~21**, with the removed content *merged into* the tool pages
so nothing of value is lost.

---

## 12. OUTPUT 12 — TECHNICAL SEO PROBLEMS (prioritised)

| # | Problem | Impact | Difficulty | Fix |
|---|---|---|---|---|
| T1 | ~130 sitewide links/page | **Critical** | Medium | Cut mega-nav to ≤35 |
| T2 | Hubs are link lists (2 H2s) | **Critical** | Medium | Rebuild 8 hubs |
| T3 | Guides cannibalise tools, 0 clicks | High | Medium | Merge + 301 (C1–C10) |
| T4 | Long-tail doesn't link up to head | High | Low | Add upward contextual links |
| T5 | Deprecated HowTo schema | Low | Low | Remove `howToSchema` |
| T6 | 42 pages not indexed | Medium | Low | Pull GSC reasons; likely resolved by T1/T3 |
| T7 | i18n built but unused | High (opportunity) | High | Hindi rollout |
| T8 | Spammy backlink profile | Medium | Low | Audit, disavow only if clearly toxic |
| T9 | GA4 not wired through GTM | Low (measurement) | Low | See PR #54 notes |

---

## 13. OUTPUTS 13–14 — CONTENT & COMPETITOR GAPS

**Content gaps (real demand, nothing built):**
- No **pillar content** anywhere — 8 hubs, 0 true pillars.
- `/how-to` is your strongest cluster and has **no pillar page** explaining Indian exam photo/signature specs as a single authoritative resource.
- No **comparison content for dev tools** (`/compare` covers only PDF/image incumbents).
- No Hindi content despite 78% India traffic.
- Missing dev tools with real demand: cron expression parser, JSON diff, URL parser, JWT *generator*, markdown preview, .env parser, case/slug batch tools.

**Competitor gaps (from sampled SERPs):**
- **jsonformatter.org / curiousconcept** — ad-heavy, dated UI, upload-based. **Your privacy + no-ads angle is a genuine differentiator here, and this SERP is winnable.**
- **TinyPNG / Smallpdf** — upload your file to a server. Your in-browser processing is a real, defensible claim they cannot match. Lead with it.
- **emicalculator.site / toolxi.com** — thin, ad-saturated. Beatable on depth (amortisation schedule + prepayment modelling, which you already have).
- **Nobody** in the free-tools space markets "your file never leaves your device" as the primary hook. That is your entire brand position and it is currently buried in body copy rather than in titles, H1s and outreach.

---

## 14. OUTPUT 15 — 90-DAY ROADMAP

### QUICK WINS — days 1–7
| Task | Files | Impact | Difficulty |
|---|---|---|---|
| Merge PR #54 (metadata + 13 pages), deploy, `npm run indexnow` | — | Med | Trivial |
| Cut mega-nav to ≤35 links | `components/Navbar.tsx`, `Footer.tsx` | **High** | Medium |
| Add upward long-tail→head links | `lib/howto.tsx`, `sizePresets.tsx` | High | Low |
| Remove deprecated `howToSchema` | `lib/seo.ts` +2 | Low | Trivial |
| Pull GSC "not indexed" reasons for the 42 | — | Med | Trivial |
| Directory listings: Crunchbase, SaaSHub, alternative.me | `docs/directory-listings.md` | Med | Low |

### HIGH IMPACT — weeks 1–4
| Task | Impact | Difficulty |
|---|---|---|
| Rebuild `/dev-tools` hub as a true pillar (**start here — most winnable**) | **High** | Medium |
| Rebuild `/calculators` + `/image-tools` hubs | High | Medium |
| Optimise the 12 Tier-1 pages per §7 template | **High** | Medium |
| Consolidate guides C1–C10, merge content, 301 | High | Medium |
| Make `/how-to` a real pillar for the exam cluster | High | Medium |
| Outreach: passport-photo table + JWT/JSON privacy angle | **High** | High |

### AUTHORITY BUILDING — months 1–3
Hindi rollout for the top ~20 India pages · rebuild remaining hubs · 6–10 new dev tools in the winnable
category · sustained editorial outreach (10 personalised pitches/week) · Product Hunt launch ·
add real usage data to `/passport-photo-sizes` to make it more citable.

### LONG TERM — months 3–12
Only after DR rises: attack `image compressor` / `image resizer`. `pdf compressor` stays parked until the
profile can plausibly compete with Adobe. Expand programmatic **only** where §11 rules are met.

### Success metrics (leading indicators, checkable without a re-audit)
- Week 2: boilerplate links/page ≤35 · 13 new pages indexed
- Week 4: `/dev-tools` cluster average position <20 · guides consolidated with 301s returning 301
- Week 8: impressions ≥2x · ≥1 Tier-1 dev term in top 10
- Week 12: ≥5 genuine editorial referring domains · clicks ≥150/mo

**How we will know this is wrong:** if the dev cluster does *not* improve after hub rebuild + internal
linking, the constraint is purely domain authority and everything should shift to links. If impressions
rise but clicks stay flat, the position ceiling is confirmed — same conclusion.

---

## 15. PHASE 14 — IMPLEMENTATION SAFETY

Nothing above has been implemented. When we do, in controlled batches:

**Never break:** existing tool URLs · canonical structure · sitemap generation from registries ·
`robots.txt` · GSC verification · GTM/analytics · structured data · tool functionality.

**Per-batch verification gate** (all must pass before the next batch):
`npx tsc --noEmit` → `npm run lint` → `npm run test:run` → `npm run build` → confirm page count ≥ previous
→ spot-check rendered `<title>`/`<meta>`/canonical → confirm no unintended `noindex` → validate sitemap
URL count → verify 301s resolve.

**Batch order:** (1) nav/link surgery — highest impact, lowest risk · (2) `/dev-tools` hub ·
(3) Tier-1 page optimisation · (4) guide consolidation + redirects — *highest risk, do last, one at a time*.

---

## 16. BATCH 1 — IMPLEMENTED 2026-08-10

**Footer rebuilt** (`components/Footer.tsx`). The three columns that dumped all 81 PDF/image/calculator
tools are replaced by a curated 12-link **Popular Tools** column, a 10-link **Browse** column of category
hubs, and Company. The duplicated legal links in the bottom bar are gone.

The 12 promoted slots are an **editorial decision, not a convenience menu** — they are the Tier 1 pages
from §4, so site-wide internal equity now concentrates on what we are trying to rank: JSON Formatter,
JWT Decoder, QR Code Generator, EMI, SIP, GST, PDF OCR, Compress PDF, Compress Image, Background Remover,
Typing Speed Test, Passport Photo Sizes.

**Upward cluster links added** (`app/how-to/[slug]/page.tsx`). All 71 how-to pages now close the loop to
their head term and category hub with descriptive, niche-specific anchors ("free image resizer", "free PDF
compressor", "passport photo sizes by country") instead of only linking sideways to siblings and down to a
preset page. This is the mechanism that converts existing long-tail traffic into head-term support.

### Measured result

| Metric | Before | After |
|---|---|---|
| Footer links | 106 | **33** |
| Boilerplate links/page (header+footer) | 116 | **43** |
| Total links, `/pdf/ocr` | 135 | **62** |
| Boilerplate : contextual ratio | ~6.4 : 1 | **~2.4 : 1** |
| How-to in-content links | 7 | 10 |

**Target was ≤35 boilerplate; actual is 43.** The remaining 43 is 10 header hub links (load-bearing — they
are the crawl path to every tool) + 33 footer. Cutting further would mean dropping either category hubs or
the 5 social profiles, and both earn their place. 43 is the right stopping point, not a shortfall to chase.

**Orphan check:** a full inbound-link graph over all 349 built pages confirms **no tool page was orphaned**.
Every tool remains reachable via its category hub, which is linked from both header and footer. The 31
pages with zero inbound links are all pre-existing and unrelated: 28 i18n locale pages (nothing ever linked
them — hreflang lives in `<link>`, not `<a>`), plus `/offline` and `/_not-found`, which are deliberately
noindex.

**New finding from that check:** `/tags` is orphaned, yet indexable and present in the sitemap. Either link
it from somewhere real or drop it from the sitemap and noindex it. Also `/dev-tools/json-csv` — a Tier 2
page — has only one inbound link.

Verified: `tsc` 0 · ESLint clean · 23/23 tests · build OK · 349 pages (unchanged).

---

## 17. BATCH 2 — `/dev-tools` PILLAR, IMPLEMENTED 2026-08-10

Rebuilt `app/dev-tools/page.tsx` from a link list into a pillar page. Chosen first because it is the most
winnable head-term category (§2) and already ranks at position 10.2.

| Metric | Before | After |
|---|---|---|
| In-content words (`<main>`) | ~500 | **1,202** |
| H2 sections | 2 substantive | **10** |
| Contextual in-content links | ~27 (tool cards only) | **50** (cards + 15 prose links) |
| Schema | ItemList, Breadcrumb | + **FAQPage** |

**Title:** `Free Developer Tools Online — JSON, JWT, Regex & More` (53) — leads with the head term.
**H1:** `Free Developer Tools`.

Three sections added, all **below the tool grid** so the tools remain the primary experience:

1. *Why run developer tools in the browser?* — the real differentiator, argued concretely: pasting a
   staging JWT or an API response into a server-backed tool means production data lands in someone else's
   logs. Includes a falsifiable claim ("open DevTools, watch the Network tab") rather than a trust-me
   assertion.
2. *Finding the right tool* — prose routing by task, carrying 15 descriptive-anchor links to the Tier 1
   dev tools plus two cross-category links to `/text-tools` and `/pdf-tools`.
3. *FAQ* — 6 genuine pre-use questions. FAQPage schema retained deliberately: no longer a Google rich
   result (retired May 2026) but still a strong AI/LLM citation signal.

**Factual claims were verified against the code before publishing**, not asserted: `crypto.getRandomValues`
in `PasswordGenerator.tsx:33`, `crypto.randomUUID()` in `UuidGenerator.tsx:16`, and `/sw.js` exists and is
registered by `ServiceWorkerRegistrar`. A pillar page that overstates its own product is an E-E-A-T
liability, not an asset.

Verified: `tsc` 0 · ESLint clean · 23/23 tests · build OK · 349 pages (unchanged).

## 18. BATCH 3 — `/calculators` PILLAR, IMPLEMENTED 2026-08-10

| Metric | Before | After |
|---|---|---|
| In-content words | ~430 | **1,123** |
| H2 sections | 0 (flat grid) | **10** |
| In-content links | ~46 | **70** |
| Calculators grouped | 0 of 43 | **43 of 43** |

**Fixed a factual error, not just thinness.** The title and meta both advertised *"15+ free online
calculators"* when the registry holds **43**. The page was under-selling its own catalogue by two thirds on
the single most important category for our proven market. The count is now derived from
`readyCalculators.length`, so it cannot go stale again.

**Structure.** 43 cards in one flat grid became six grouped sections with H2s and short orienting copy:
Loan & EMI · Investment & savings · Tax, salary & retirement · Health & pregnancy · Student · Everyday.

The grouping config is **fail-safe by design**: any calculator not listed in a group falls through to a
"More calculators" bucket automatically. Since Batch 1 removed the footer's full tool listing, this hub is
now the crawl path to every calculator — so a tool must not be able to drop off it by being forgotten in a
config. Verified in the build: **43 of 43 registry hrefs present, 0 missing.**

**Content added below the grid:** *"Built for Indian finance, not adapted to it"* (the honest
differentiator — PPF/EPF/NPS/NSC/SSY/SCSS/HRA/gratuity with correct compounding, where international
calculator sites stop at loans and BMI) and *"Where to start"* (task-based routing with descriptive-anchor
links to the Tier 1 calculators). FAQ expanded 4 → 6.

**Claims verified against the code before publishing:** the assertion that scheme calculators take the
rate as an editable input rather than hard-coding a figure that goes stale is true — `NscCalculator.tsx:38`,
`PpfCalculator.tsx:58` (which even hints "Current: 7.1%"), `ScssCalculator.tsx:42`, `SsyCalculator.tsx:44`,
`EpfCalculator.tsx:62`.

Verified: `tsc` 0 · ESLint clean · 23/23 tests · build OK · 349 pages · orphan count unchanged at 31
(all pre-existing i18n/noindex).

---

**Remaining hubs, in priority order:** `/image-tools` (protect pos 5.3) → `/pdf-tools` (480 in-content
words, 2 H2s) → `/text-tools` → `/fun-tools` → `/audio-tools` + `/video-tools`.

---

## The one-line version

> Stop attacking PDF. You cannot beat Adobe and Smallpdf this year. You are already at **position 7.9 on
> `jwt decoder` and 10.2 on the dev-tools hub** — in the one category where the incumbents are hobby sites.
> Rebuild the hubs, cut the 130-link mega-nav so internal signal exists at all, point your 71 long-tail
> pages upward at the head terms, and win **developer tools + India finance** first. PDF and image become
> winnable later, on the authority those wins buy.
