# Launch Kit — "Transcribe audio without uploading"

Copy-paste outreach to earn links + traffic for the focused SEO target.
**You** post these from your own accounts — they must come from a real person.

**Target URLs**
- Tool: `https://www.getfreetoolsai.com/audio/transcribe`
- Guide: `https://www.getfreetoolsai.com/guides/audio/transcribe-audio-without-uploading`

**The one-line pitch (reuse everywhere):** Transcribe audio and video to text + subtitles entirely in your browser — Whisper runs on-device, your file is never uploaded. Free, no signup, no limits.

**Product facts (keep claims accurate):** OpenAI Whisper via WebAssembly/WebGPU; model weights self-hosted on our own origin (not a third-party CDN); audio/video decoded and transcribed locally; outputs .txt + timestamped .srt; first run downloads the model once, then cached/offline; accuracy best on clear speech; faster on WebGPU (Chrome/Edge desktop).

---

## 1. Show HN

> **Posting tips:** submit Tue–Thu, ~8–10am US Eastern. The URL is the post; put the story in the first comment. Reply to every comment. Don't use marketing language — HN punishes it. Title ≤ 80 chars.

**Title**
```
Show HN: Transcribe audio without uploading it – Whisper in the browser
```

**URL**
```
https://www.getfreetoolsai.com/audio/transcribe
```

**First comment (founder note)**
```
I kept needing to transcribe interviews and voice notes, and almost every
"free" tool wanted me to upload the audio to their servers first. For anything
confidential that's a non-starter, so I built one that doesn't.

It runs OpenAI's Whisper model entirely in the browser via Hugging Face
transformers.js (WASM, with WebGPU when available). The audio is decoded and
transcribed locally — nothing is uploaded. You can confirm it in DevTools:
open the Network tab, run a file, and you'll see your audio never leaves the
tab. The model weights are served from our own origin rather than a third-party
CDN, so there's no external call at runtime either.

You get plain text plus a timestamped .srt. No signup, no per-minute limit, no
watermark — there's no server doing the work, so there's nothing to meter.

Tradeoffs I'd call out honestly:
- First run downloads the model once (~tens of MB), then it's cached and works
  offline. Subsequent runs start instantly.
- WebGPU (recent Chrome/Edge desktop) is dramatically faster; CPU/WASM works
  but is slower on long files.
- Accuracy is great on clear speech, weaker with heavy noise or overlapping
  speakers — it's Whisper, with Whisper's strengths and limits.

It's part of a small collection of free, browser-only tools I've been building
(no uploads anywhere). Would love feedback — especially on accuracy and on long
files on lower-end machines.
```

---

## 2. Reddit

> **Rules first:** check each sub's self-promotion policy; some require a flair or only allow it on certain days. Post as a person sharing something useful, answer questions, link once. One genuine post per sub — don't blast.

### r/privacy
**Title:** `Made a free transcription tool that runs Whisper in your browser — audio is never uploaded`
```
Most free transcription sites upload your recording to their servers. I wanted
one that doesn't, so I built a tool that runs Whisper locally in the browser —
the audio never leaves your device, and you can verify it in DevTools (Network
tab shows zero upload of your file). No account, no limits; the model is even
self-hosted so there's no third-party call at runtime. Outputs text + .srt.
Sharing in case it's useful here: [tool link]. Happy to answer anything about
how the local processing works.
```

### r/podcasting
**Title:** `Free way to caption episodes (.srt) without uploading your audio anywhere`
```
If you need transcripts or subtitles for episodes, this runs Whisper in the
browser and exports a timestamped .srt — no upload, no signup, no per-minute
cap (it all happens on your machine). Handy for show notes and YouTube captions
without paying per minute. Tool: [tool link]. Curious what accuracy you get on
your recordings vs. paid services.
```

### r/journalism (or r/writing)
**Title:** `Transcribe interviews privately — in-browser, nothing uploaded`
```
For confidential interviews, uploading audio to a transcription service is
risky. This does it locally in the browser (Whisper via WASM/WebGPU) so the
recording never leaves your laptop — useful for sources you've promised
discretion. Free, exports text + .srt: [tool link]. Short how-to here:
[guide link].
```

---

## 3. Blogger / newsletter outreach (email or DM)

**Subject:** `Free, no-upload transcription for your "best free transcription tools" list`
```
Hi [name],

I read your piece on [free transcription tools / privacy tools] — really useful
roundup.

I built a free option you might consider adding: it transcribes audio and video
to text + subtitles entirely in the browser using Whisper, so the file is never
uploaded to any server (verifiable in DevTools). No signup, no per-minute limit,
and the model is self-hosted so there's no third-party call. It's a genuinely
different angle from the upload-based tools on most lists.

Tool: https://www.getfreetoolsai.com/audio/transcribe
How it works: https://www.getfreetoolsai.com/guides/audio/transcribe-audio-without-uploading

No worries either way — thought it fit your privacy-conscious readers.

Thanks,
[your name]
```

## 4. Roundup / "add us" + broken-link outreach

```
Hi [name] — your list "[best free transcription tools 2026]" is a great
resource. Would you consider adding a no-upload option? [tool link] runs Whisper
in the browser so audio never leaves the device — a useful contrast to the
upload-based tools currently listed. (If any linked tool there has gone
paid/dead, happy to flag it.)
```

## 5. HARO / Connectively / Qwoted response (privacy or transcription queries)

```
For [transcribing sensitive audio / private speech-to-text], the key is to avoid
tools that upload your file. Browser-based transcription now runs the Whisper
model locally via WebAssembly/WebGPU, so the audio is processed on your own
device and never sent to a server — important for interviews, medical or legal
recordings. A free example that does this (and exports .srt subtitles) is
GetFreeToolsAI's transcriber: https://www.getfreetoolsai.com/audio/transcribe.
— [Your name], founder, GetFreeToolsAI
```

## 6. Social (X / LinkedIn)

**X:**
```
Built a free transcriber that runs Whisper *in your browser* — your audio is
never uploaded. Open DevTools and watch: zero upload requests. Text + .srt, no
signup, no limits. https://www.getfreetoolsai.com/audio/transcribe
```

**LinkedIn:**
```
Most "free" transcription tools upload your audio to their servers first. For
confidential interviews that's a dealbreaker — so I built one that runs OpenAI's
Whisper model entirely in the browser. The recording never leaves your device
(you can verify it in DevTools), it exports text and .srt subtitles, and there's
no signup or per-minute limit because there's no server doing the work.

Free here: https://www.getfreetoolsai.com/audio/transcribe
```

## 7. Directories (AlternativeTo etc.)

- **AlternativeTo / SaaSHub:** list as a free, private alternative to **Otter.ai, Rev, Descript, Sonix**. Tagline: *"Free in-browser transcription — Whisper runs on-device, nothing uploaded."* Deep-link to the tool URL.

---

## Track it

Weekly: GSC → Performance → filter query `transcribe audio without uploading` (and `audio to text without upload`). Log impressions / clicks / avg position. A position of 5–15 = improve the page; rising impressions = the links are working.
