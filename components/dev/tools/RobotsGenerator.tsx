"use client";

import { useMemo, useState } from "react";
import { fieldClass, inputClass, DevButton, CopyButton, Panel, Labeled } from "@/components/dev/ui";

export default function RobotsGenerator() {
  const [agent, setAgent] = useState("*");
  const [allow, setAllow] = useState("");
  const [disallow, setDisallow] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [sitemap, setSitemap] = useState("");

  const output = useMemo(() => {
    const lines: string[] = [`User-agent: ${agent || "*"}`];
    const dis = disallow.split("\n").map((s) => s.trim()).filter(Boolean);
    const alw = allow.split("\n").map((s) => s.trim()).filter(Boolean);
    if (dis.length === 0 && alw.length === 0) lines.push("Disallow:");
    dis.forEach((p) => lines.push(`Disallow: ${p.startsWith("/") ? p : "/" + p}`));
    alw.forEach((p) => lines.push(`Allow: ${p.startsWith("/") ? p : "/" + p}`));
    if (crawlDelay.trim()) lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
    let out = lines.join("\n");
    if (sitemap.trim()) out += `\n\nSitemap: ${sitemap.trim()}`;
    return out + "\n";
  }, [agent, allow, disallow, crawlDelay, sitemap]);

  const preset = (mode: "allowAll" | "blockAll") => {
    setAgent("*");
    setAllow("");
    setDisallow(mode === "blockAll" ? "/" : "");
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <DevButton size="sm" onClick={() => preset("allowAll")}>Allow all crawlers</DevButton>
          <DevButton size="sm" onClick={() => preset("blockAll")}>Block all crawlers</DevButton>
        </div>
        <Labeled label="User-agent">
          <input value={agent} onChange={(e) => setAgent(e.target.value)} className={inputClass} placeholder="*" />
        </Labeled>
        <Labeled label="Disallow (one path per line)">
          <textarea value={disallow} onChange={(e) => setDisallow(e.target.value)} spellCheck={false} className={`${fieldClass} min-h-[6rem]`} placeholder={"/admin\n/private"} />
        </Labeled>
        <Labeled label="Allow (one path per line)">
          <textarea value={allow} onChange={(e) => setAllow(e.target.value)} spellCheck={false} className={`${fieldClass} min-h-[5rem]`} placeholder={"/public"} />
        </Labeled>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Crawl-delay (optional)">
            <input value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} className={inputClass} placeholder="10" inputMode="numeric" />
          </Labeled>
          <Labeled label="Sitemap URL (optional)">
            <input value={sitemap} onChange={(e) => setSitemap(e.target.value)} className={inputClass} placeholder="https://site.com/sitemap.xml" />
          </Labeled>
        </div>
      </div>
      <Panel label="robots.txt" actions={<CopyButton value={output} />}>
        <pre className={`${fieldClass} min-h-[20rem] overflow-auto whitespace-pre`}>{output}</pre>
      </Panel>
    </div>
  );
}
