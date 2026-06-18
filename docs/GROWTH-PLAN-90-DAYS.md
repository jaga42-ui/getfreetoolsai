# GetFreeToolsAI — 90-Day "Make It Actually Rank" Plan

The honest premise: you will **not** out-rank Smallpdf/TinyPNG on head terms like
"compress pdf" with a new domain. So we don't try. This plan wins on the three
things you actually have an edge in:

1. **Privacy wedge** — "nothing ever leaves your browser" (most competitors upload).
2. **Differentiated in-browser AI** — private Whisper transcription, background removal, metadata X-ray.
3. **Long-tail + earned links** — niche queries no incumbent bothers with, plus original-data PR.

**The binding constraint is distribution + indexing + time — not more tools.**
Do not build tool #95 this quarter. Build links, content, and launches.

> Success at day 90 is a *foundation*, not a payday. Organic traffic compounds
> over months 6–12. The goal now is: indexed, linked, and showing the first
> upward trend.

---

## Phase 0 — Unblock (Week 0, do before anything else)

Nothing else matters if these aren't true.

- [ ] **AdSense approved.** Confirm status. *Until approved, the site earns $0 regardless of traffic.* This is gate #1.
- [ ] **Google Search Console** verified (Domain property via DNS) + `sitemap-index.xml` submitted. Use **URL Inspection → Request Indexing** on the homepage, the 4 hub pages, and the flagship tools (`/audio/transcribe`, `/image/metadata-viewer`, `/image/background-remover`).
- [ ] **Bing Webmaster Tools** added (import from GSC) + sitemap submitted.
- [ ] **Privacy-friendly analytics** (Plausible or Cloudflare Web Analytics) so you can actually measure clicks, not just guess.
- [ ] Pick **10 target long-tail keywords** to track monthly (examples below). Write them into `docs/SEO-TRACKING.md`.

Suggested starter keywords (low competition, on-brand): `transcribe audio without uploading`, `wifi qr code generator`, `compress pdf to 100kb`, `remove exif data online`, `check if photo has gps`, `blur photo background free`, `sign pdf without uploading`, `private background remover`, `heic to jpg`, `free pdf form filler`.

---

## Phase 1 — Foundation: links + the wedge (Weeks 1–4)

**Goal: 10–15 referring domains, all pages indexed, privacy positioning sharp.**

- [ ] Work **Tier-1** of `docs/BACKLINK-OUTREACH.md` top-down (use the ready-made copy in `docs/directory-listings.md`): Crunchbase → SaaSHub → alternative.me → AlternativeTo (create account now, submit after 7 days) → Toolfinder → Uneed → SourceForge. Quality only; **no bulk "500 directories" services.**
- [ ] Sharpen the **privacy angle** on the highest-intent pages — make "your file never leaves your browser" the first thing visitors and crawlers see on the AI/privacy tools.
- [ ] **Start the flagship study** (this is the single highest-leverage asset): *"We tested 20 free PDF & image tools — which ones upload your files?"* Outline it, build the test methodology (network capture proving upload vs local), start collecting data. Your own Metadata X-ray + a packet-capture screenshot are the proof.
- [ ] Internal-linking pass: every guide links to its tools; every tool links to related tools + a guide (most of this is already wired via `relatedTools`/guides — verify coverage).
- [ ] Run `npm run indexnow` after each deploy.

---

## Phase 2 — Distribution: launches + the PR play (Weeks 5–8)

**Goal: 25–40 referring domains cumulative, first earned editorial link, first traffic spikes.**

- [ ] **Publish the privacy study** as a flagship page. Pitch it to:
  - Journalists via **HARO / Connectively + Qwoted** (privacy/security/productivity beats).
  - Privacy & productivity bloggers/newsletters directly (short, specific pitch).
  - This is what earns *editorial* backlinks — the hard, valuable kind incumbents can't easily replicate because their tools fail the test.
- [ ] **Launch the standout AI tools** (they're shareable in a way "compress pdf" isn't):
  - **Product Hunt** (launch Tue–Thu; copy is in `docs/BACKLINK-OUTREACH.md`). Lead with private/in-browser AI transcription.
  - **Show HN** — angle: "I built free in-browser Whisper transcription — your audio never leaves the tab." Technical, honest, no sales pitch.
  - **Reddit** (r/privacy, r/productivity, r/software, r/podcasting, r/datahoarder) — be genuinely helpful in existing threads, link once. One good answer beats 20 dropped links.
- [ ] **Roundup + broken-link outreach**: get added to existing "best free PDF/image/transcription tools" lists; use the pitch template in the backlink doc.

---

## Phase 3 — Double down on what works (Weeks 9–12)

**Goal: convert early signal into momentum; stop guessing, follow the data.**

- [ ] In **GSC → Performance → Queries**, find every query at **position 5–15**. Those are your quick wins — improve that page's title, H1, and content to push it onto page 1. This is the highest-ROI SEO activity once you have impressions.
- [ ] Find pages with **impressions but 0 clicks** → rewrite titles/meta to be more clickable.
- [ ] **Content velocity on the long tail**: publish 4–6 new guides targeting the niches that showed traction (e.g., "how to transcribe an interview privately", "how to check a photo for GPS before posting"). Long-tail guides rank faster than tool keywords and funnel internal links to the tools.
- [ ] If a launch or the study worked, **do a second shareable asset** (another data study, or launch the next AI tool).
- [ ] **Review & decide**: which channel drove links/traffic? Scale that; drop what didn't move.

---

## Weekly cadence (repeat all 90 days)

| Cadence | Action |
|---|---|
| Daily-ish | 1 genuine community interaction (Reddit/Quora/forum) where the tool is the answer |
| Weekly | GSC check (impressions, clicks, avg position, indexed count) → log in `docs/SEO-TRACKING.md`; submit 2–3 quality directory/outreach links |
| Per deploy | `npm run indexnow` |
| Monthly | Referring-domains + keyword-position review; pick the next month's focus |

---

## Targets at Day 90 (realistic, not hype)

- ✅ All ~110 pages indexed in Google + Bing.
- ✅ **25–40 referring domains** (per `docs/BACKLINK-OUTREACH.md`'s own target).
- ✅ At least **1 earned editorial link** from the privacy study.
- ✅ A handful of **long-tail keywords on page 1–2**, impressions trending up week over week.
- ✅ AdSense earning **something** (likely small — single/low-double digits/month). That's normal and fine this early.
- ✅ One successful launch (PH/HN/Reddit) with a measurable traffic spike + links.

**If those are true at day 90, the site is on the compounding curve** — months 6–12 are where it can reach low-to-mid hundreds/month, with real upside if a tool or the study catches fire.

## Do NOT do

- ❌ Build more tools (you have enough ammo; this quarter is about aim).
- ❌ Chase head terms ("compress pdf", "pdf to word") — you'll lose to incumbents.
- ❌ Buy bulk backlinks or use auto-submit "500 directories" services.
- ❌ Spam communities — one helpful, linked answer, never drive-by drops.
- ❌ Mistake a green build / more features for progress. Progress = links, indexed pages, and rankings.
