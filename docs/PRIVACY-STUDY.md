# Flagship content asset — the Privacy Study

**Working title:** *"We tested 20 popular free PDF & image tools — which ones secretly upload your files?"*

This is the single highest-leverage item in `docs/GROWTH-PLAN-90-DAYS.md`. It is
**original data**, which is the kind of content that earns *editorial* backlinks
(journalists, bloggers, newsletters) — the hard, durable links a new domain can't
buy or directory its way to. And it's defensible: the incumbents we test will
mostly **fail** the test (they upload your files), so they can't credibly
republish or copy it. It also lands exactly on our wedge: GetFreeToolsAI does
everything locally.

> **Golden rule: be rigorous, factual, and fair.** This only works as a PR asset
> if it's accurate and reproducible. Test public tools with your own files,
> report what you observe, date everything, and never accuse maliciously.

---

## The angle

Most people assume "free online tool" = harmless. In reality, the typical free
PDF/image tool **uploads your document to a server** to process it — your bank
statement, contract, medical form, ID. This study measures *which ones actually
do that* and which process locally, and gives readers a way to check for
themselves. Hook for headlines: **"Your 'free' PDF tool probably uploaded your
file. We checked 20 of them."**

---

## Methodology (must be reproducible)

For each tool, perform one standard task and watch the network.

1. **Canary file:** create a uniquely-identifiable test file (e.g., a PDF/image embedding a random UUID string + a distinctive byte pattern) so you can prove *that file's bytes* left the browser.
2. **Task per category:** PDF → "compress PDF"; Image → "remove background" or "compress image". Use the same task across tools for fairness.
3. **Capture traffic:** open DevTools → Network (or use mitmproxy / a proxy) and record all requests during the task. Look for the canary bytes / a multipart file upload to a server. Note the destination domain + region if resolvable.
4. **Classify each tool:**
   - 🔴 **Uploads your file** (file bytes sent to a server)
   - 🟢 **Processes locally** (no file upload; work done in-browser)
   - 🟡 **Unclear / mixed** (e.g., uploads only for some features)
5. **Cross-check the claim vs reality:** quote the tool's own "secure/private" marketing and compare to observed behavior. Note any stated retention ("files deleted after 1 hour").
6. **Record metadata leakage** (ties in our Metadata X-ray tool): does the output still carry EXIF/GPS/author data?
7. **Document everything:** exact steps, tool version/URL, and **date tested** (behavior changes — this protects you).

**Reproducibility appendix:** publish the methodology + raw observations (screenshots of the network capture showing the upload) so it's verifiable. Credibility = links.

---

## Tools to test (~20)

Popular free tools across PDF + image. Include **GetFreeToolsAI as the local-only contrast** (honestly labeled).

- **PDF:** Smallpdf, iLovePDF, PDF24, Sejda, Soda PDF, FreeConvert, Adobe Acrobat online, PDF2Go, Ilovepdf compress, (others as found in roundups).
- **Image:** TinyPNG, remove.bg, iLoveIMG, Photopea (note: local), Squoosh (note: local — good honest comparison point), Compressor.io, FreeConvert image.
- **Us:** GetFreeToolsAI (compress / background remover / transcribe) → 🟢 local.

> Squoosh (Google) and Photopea also run locally — *include and credit them.*
> Honesty about who else does it right makes the piece trustworthy, not a
> thinly-veiled ad.

---

## Results table (the centerpiece / "TL;DR")

| Tool | Task | Uploads file? | Destination | Claims "private/secure"? | Metadata stripped? | Tested |
|------|------|---------------|-------------|--------------------------|--------------------|--------|
| Example A | Compress PDF | 🔴 Yes | server (US) | "100% secure" | No | 2026-07-01 |
| Squoosh | Compress image | 🟢 No (local) | — | — | n/a | 2026-07-01 |
| GetFreeToolsAI | Compress / Remove bg | 🟢 No (local) | — | yes (true) | — | 2026-07-01 |

A single scannable table like this is what gets screenshotted and shared.

---

## Article structure

1. **Headline + TL;DR table** (above the fold — the shareable bit).
2. **Why it matters** — what "uploading" means for sensitive docs; retention; breaches; subpoenas.
3. **How we tested** (methodology summary + link to full appendix).
4. **Findings** — the count (e.g., "14 of 20 uploaded your file"), notable offenders, who does it right.
5. **"Claims vs reality"** — tools that market "secure" while uploading.
6. **How to check any tool yourself** — a short DevTools how-to (this is genuinely useful → more shares/links).
7. **What to do instead** — local-first options (Squoosh, Photopea, *and* GetFreeToolsAI). Soft, honest mention — the data already makes our case.
8. **Appendix** — raw evidence, dates, methodology.

---

## Distribution (do this when it publishes — Phase 2 of the 90-day plan)

- **HARO / Connectively + Qwoted:** respond to privacy/security/productivity queries with the data.
- **Direct pitches:** privacy & productivity bloggers/newsletters; tech journalists on the privacy beat. Short pitch: "Original data — we tested 20 free tools, 14 upload your files. Table + methodology attached."
- **Communities:** r/privacy, r/datahoarder, r/productivity; **Show HN** ("We tested which free tools upload your files — methodology + results").
- **Link reclamation:** anyone who cites "free tool" roundups → suggest adding the safety angle.
- **Refresh annually** → "2026 edition" / "2027 edition" keeps it ranking and re-linkable.

---

## Ethics & safety

- Only test publicly available tools with **your own** canary files.
- Report **observed behavior on a specific date**; state that tools can change.
- Don't allege malice — "uploads the file to process it" is a neutral, factual finding.
- Keep the appendix factual so the piece survives scrutiny (that scrutiny is what earns the links).

---

## Success metric

Not traffic on day one — **earned editorial links**. Even 2–3 real journalist/blogger
links from this beat months of directory submissions, and they lift the whole
domain's authority. This is the asset most likely to break the site out of the
new-domain sandbox.
