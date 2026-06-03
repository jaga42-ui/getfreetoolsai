"use client";

import { useMemo, useState } from "react";
import { FileCode, Trash2 } from "lucide-react";
import { fieldClass, inputClass, DevButton, CopyButton, Panel, Labeled, StatusPill } from "@/components/dev/ui";

const FREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
const SAMPLE = "https://example.com/\nhttps://example.com/about\nhttps://example.com/blog";

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("");
  const [freq, setFreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [lastmod, setLastmod] = useState(true);

  const { xml, count, invalid } = useMemo(() => {
    const list = urls.split("\n").map((s) => s.trim()).filter(Boolean);
    let bad = 0;
    const today = new Date().toISOString().slice(0, 10);
    const entries = list
      .map((u) => {
        try {
          const url = new URL(u);
          return url.href;
        } catch {
          bad++;
          return null;
        }
      })
      .filter((u): u is string => Boolean(u));
    const body = entries
      .map(
        (loc) =>
          `  <url>\n    <loc>${loc.replace(/&/g, "&amp;")}</loc>${lastmod ? `\n    <lastmod>${today}</lastmod>` : ""}\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
      )
      .join("\n");
    const doc = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
    return { xml: entries.length ? doc : "", count: entries.length, invalid: bad };
  }, [urls, freq, priority, lastmod]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <DevButton size="sm" icon={FileCode} onClick={() => setUrls(SAMPLE)}>Sample</DevButton>
          <DevButton size="sm" icon={Trash2} onClick={() => setUrls("")}>Clear</DevButton>
          <div className="ml-auto"><StatusPill state={invalid ? "error" : count ? "ok" : "idle"}>{invalid ? `${invalid} invalid URL${invalid === 1 ? "" : "s"} skipped` : `${count} URL${count === 1 ? "" : "s"}`}</StatusPill></div>
        </div>
        <Labeled label="URLs (one per line)">
          <textarea value={urls} onChange={(e) => setUrls(e.target.value)} spellCheck={false} className={`${fieldClass} min-h-[14rem]`} placeholder={SAMPLE} />
        </Labeled>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Change frequency">
            <select value={freq} onChange={(e) => setFreq(e.target.value)} className={inputClass}>
              {FREQS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Labeled>
          <Labeled label="Priority">
            <input value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass} placeholder="0.8" />
          </Labeled>
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-zinc-400">
          <input type="checkbox" checked={lastmod} onChange={(e) => setLastmod(e.target.checked)} className="accent-emerald-500" /> Include today&apos;s &lt;lastmod&gt;
        </label>
      </div>
      <Panel label="sitemap.xml" actions={<CopyButton value={xml} />}>
        <pre className={`${fieldClass} min-h-[24rem] overflow-auto whitespace-pre`}>{xml || <span className="text-zinc-600">Add URLs to generate your sitemap…</span>}</pre>
      </Panel>
    </div>
  );
}
