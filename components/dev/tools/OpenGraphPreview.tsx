"use client";

import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import { inputClass, CopyButton, Panel, Labeled } from "@/components/dev/ui";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function OpenGraphPreview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");

  const domain = useMemo(() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^https?:\/\//, "").split("/")[0];
    }
  }, [url]);

  const tags = useMemo(() => {
    const t: string[] = [];
    const add = (k: string, v: string, twitter = false) => { if (v.trim()) t.push(`<meta ${twitter ? "name" : "property"}="${k}" content="${esc(v)}">`); };
    t.push('<meta property="og:type" content="website">');
    add("og:title", title);
    add("og:description", description);
    add("og:url", url);
    add("og:image", image);
    add("og:site_name", siteName);
    t.push('<meta name="twitter:card" content="summary_large_image">');
    add("twitter:title", title, true);
    add("twitter:description", description, true);
    add("twitter:image", image, true);
    return t.join("\n");
  }, [title, description, url, image, siteName]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <Labeled label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Your page title" /></Labeled>
        <Labeled label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} min-h-[4.5rem] resize-y`} placeholder="A short, compelling summary." /></Labeled>
        <Labeled label="Page URL"><input value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="https://example.com/post" /></Labeled>
        <Labeled label="Image URL (1200×630 recommended)"><input value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} placeholder="https://example.com/og.png" /></Labeled>
        <Labeled label="Site name"><input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputClass} placeholder="Example" /></Labeled>
      </div>

      <div className="space-y-5">
        <Panel label="Social card preview">
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="flex aspect-[1.91/1] items-center justify-center bg-zinc-800/70">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="Open Graph preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600">
                  <ImageOff className="h-7 w-7" />
                  <span className="text-xs">Image preview</span>
                </div>
              )}
            </div>
            <div className="border-t border-zinc-800 px-4 py-3">
              <p className="truncate text-[11px] uppercase tracking-wide text-zinc-500">{domain || "example.com"}</p>
              <p className="mt-0.5 line-clamp-1 font-semibold text-zinc-100">{title || "Your page title appears here"}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-zinc-400">{description || "Your description preview appears here, the way it looks when shared on social platforms."}</p>
            </div>
          </div>
        </Panel>

        <Panel label="Meta tags" actions={<CopyButton value={tags} />}>
          <pre className="min-h-[10rem] w-full overflow-auto whitespace-pre rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-[12.5px] leading-relaxed text-zinc-200">{tags}</pre>
        </Panel>
      </div>
    </div>
  );
}
