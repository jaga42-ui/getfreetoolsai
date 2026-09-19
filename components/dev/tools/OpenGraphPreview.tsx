"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageOff, Globe, Smartphone } from "lucide-react";
import { inputClass, CopyButton, Panel, Labeled, StatusPill } from "@/components/dev/ui";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type CardType = "summary_large_image" | "summary";

/**
 * Google truncates the snippet by rendered pixel width, not character count —
 * "Illuminating" eats far more of the line than "iiiiiiiiiiii". These are the
 * widths Google's own desktop SERP allots, measured against the fonts it uses.
 */
const TITLE_PX_LIMIT = 580;
const DESC_PX_LIMIT = 920;

/** Measure a string in a given CSS font, cached across renders. */
function useTextMeasure() {
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    ctx.current = document.createElement("canvas").getContext("2d");
  }, []);
  return (text: string, font: string) => {
    if (!ctx.current) return 0;
    ctx.current.font = font;
    return Math.round(ctx.current.measureText(text).width);
  };
}

function Meter({
  label,
  used,
  limit,
  unit,
}: {
  label: string;
  used: number;
  limit: number;
  unit: string;
}) {
  const pct = Math.min(100, (used / limit) * 100);
  const over = used > limit;
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-zinc-500">{label}</span>
        <span className={over ? "font-medium text-amber-400" : "text-zinc-500"}>
          {used}
          {unit} / {limit}
          {unit}
          {over ? " — will be truncated" : ""}
        </span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-[width] ${
            over ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Clip a string to a pixel budget the way a browser would, adding an ellipsis. */
function clipToPx(text: string, font: string, limit: number, measure: (t: string, f: string) => number) {
  if (!text || measure(text, font) <= limit) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measure(`${text.slice(0, mid)}…`, font) <= limit) lo = mid;
    else hi = mid - 1;
  }
  return `${text.slice(0, lo).trimEnd()}…`;
}

export default function OpenGraphPreview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [canonical, setCanonical] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");
  const [cardType, setCardType] = useState<CardType>("summary_large_image");
  const measure = useTextMeasure();
  const [, force] = useState(0);

  // The canvas context is only available after mount, so re-render once it is
  // ready or the first paint would report every width as zero.
  useEffect(() => {
    force((n) => n + 1);
  }, []);

  const { host, path } = useMemo(() => {
    const raw = url.trim() || canonical.trim();
    if (!raw) return { host: "", path: "" };
    try {
      const u = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
      return {
        host: u.hostname.replace(/^www\./, ""),
        path: u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "").split("/").filter(Boolean).join(" › "),
      };
    } catch {
      return { host: raw.replace(/^https?:\/\//, "").split("/")[0], path: "" };
    }
  }, [url, canonical]);

  const titlePx = measure(title, "400 20px Arial, sans-serif");
  const descPx = measure(description, "400 14px Arial, sans-serif");

  const tags = useMemo(() => {
    const t: string[] = [];
    const meta = (name: string, v: string, attr: "name" | "property" = "name") => {
      if (v.trim()) t.push(`<meta ${attr}="${name}" content="${esc(v.trim())}">`);
    };

    if (title.trim()) t.push(`<title>${esc(title.trim())}</title>`);
    meta("description", description);
    if (canonical.trim()) t.push(`<link rel="canonical" href="${esc(canonical.trim())}">`);

    t.push("");
    t.push("<!-- Open Graph -->");
    t.push('<meta property="og:type" content="website">');
    meta("og:title", title, "property");
    meta("og:description", description, "property");
    meta("og:url", canonical.trim() || url, "property");
    meta("og:image", image, "property");
    meta("og:site_name", siteName, "property");
    if (image.trim()) {
      t.push('<meta property="og:image:width" content="1200">');
      t.push('<meta property="og:image:height" content="630">');
      meta("og:image:alt", title, "property");
    }

    t.push("");
    t.push("<!-- X / Twitter -->");
    t.push(`<meta name="twitter:card" content="${cardType}">`);
    meta("twitter:title", title);
    meta("twitter:description", description);
    meta("twitter:image", image);

    return t.join("\n");
  }, [title, description, url, canonical, image, siteName, cardType]);

  const displayHost = host || "example.com";
  const googleTitle = clipToPx(
    title || "Your page title appears here",
    "400 20px Arial, sans-serif",
    TITLE_PX_LIMIT,
    measure
  );
  const googleDesc = clipToPx(
    description || "Your meta description appears here, the way Google renders it in a search result.",
    "400 14px Arial, sans-serif",
    DESC_PX_LIMIT,
    measure
  );

  const ImageBox = ({ className, ratio }: { className?: string; ratio: string }) => (
    <div className={`flex items-center justify-center bg-zinc-800/70 ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt="Social preview"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-zinc-600">
          <ImageOff className="h-6 w-6" />
          <span className="text-[11px]">og:image</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* ---- Form ---- */}
        <div className="space-y-4">
          <Labeled label="Page title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Free UTM Builder — Campaign URL Generator"
            />
          </Labeled>
          <Meter label="Google desktop title width" used={titlePx} limit={TITLE_PX_LIMIT} unit="px" />

          <Labeled label="Meta description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} min-h-[5rem] resize-y`}
              placeholder="A short, compelling summary that earns the click."
            />
          </Labeled>
          <Meter label="Snippet width" used={descPx} limit={DESC_PX_LIMIT} unit="px" />
          <p className="text-[11px] text-zinc-500">
            {description.trim().length} characters. Google truncates by pixel width, not
            character count, so a line of capitals runs out of room sooner.
          </p>

          <Labeled label="Page URL">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/blog/post"
              inputMode="url"
            />
          </Labeled>

          <Labeled label="Canonical URL">
            <input
              value={canonical}
              onChange={(e) => setCanonical(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/blog/post"
              inputMode="url"
            />
          </Labeled>

          <Labeled label="OG image URL (1200×630 recommended)">
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/og.png"
              inputMode="url"
            />
          </Labeled>

          <Labeled label="Site name">
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className={inputClass}
              placeholder="Example"
            />
          </Labeled>

          <Labeled label="Twitter card type">
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value as CardType)}
              className={inputClass}
            >
              <option value="summary_large_image">summary_large_image — full-width image</option>
              <option value="summary">summary — small square thumbnail</option>
            </select>
          </Labeled>

          <div className="flex flex-wrap gap-2">
            {canonical.trim() && url.trim() && canonical.trim() !== url.trim() && (
              <StatusPill state="error">Canonical differs from the page URL</StatusPill>
            )}
            {image.trim() && !/^https?:\/\//i.test(image.trim()) && (
              <StatusPill state="error">og:image must be an absolute URL</StatusPill>
            )}
          </div>
        </div>

        {/* ---- Previews ---- */}
        <div className="space-y-5">
          <Panel label="Google — desktop">
            <div className="rounded-lg border border-zinc-800 bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-zinc-100">
                  <Globe className="h-3.5 w-3.5 text-zinc-500" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-[13px] text-zinc-900">{siteName || displayHost}</p>
                  <p className="truncate text-[12px] text-zinc-600">
                    https://{displayHost}
                    {path ? ` › ${path}` : ""}
                  </p>
                </div>
              </div>
              <p className="mt-1.5 font-sans text-[20px] leading-snug text-[#1a0dab]">{googleTitle}</p>
              <p className="mt-1 font-sans text-[14px] leading-[1.58] text-[#4d5156]">{googleDesc}</p>
            </div>
          </Panel>

          <Panel label="Google — mobile">
            <div className="mx-auto w-full max-w-[22rem] rounded-xl border border-zinc-800 bg-white p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-zinc-100">
                  <Smartphone className="h-3 w-3 text-zinc-500" />
                </span>
                <p className="truncate text-[12px] text-zinc-700">
                  {siteName || displayHost}
                  <span className="text-zinc-500"> · {displayHost}</span>
                </p>
              </div>
              <p className="mt-1.5 line-clamp-2 font-sans text-[17px] leading-snug text-[#1a0dab]">
                {title || "Your page title appears here"}
              </p>
              <p className="mt-1 line-clamp-3 font-sans text-[13px] leading-[1.5] text-[#4d5156]">
                {description || "Your meta description appears here, the way Google renders it on a phone."}
              </p>
            </div>
          </Panel>

          <Panel label="Facebook">
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#242526]">
              <ImageBox ratio="1.91 / 1" />
              <div className="border-t border-zinc-700 px-3 py-2.5">
                <p className="truncate text-[11px] uppercase tracking-wide text-zinc-400">
                  {displayHost}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-zinc-100">
                  {title || "Your page title appears here"}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[13px] text-zinc-400">
                  {description || "Your description preview appears here."}
                </p>
              </div>
            </div>
          </Panel>

          <Panel label={`X / Twitter — ${cardType}`}>
            {cardType === "summary_large_image" ? (
              <div className="overflow-hidden rounded-2xl border border-zinc-700">
                <ImageBox ratio="1.91 / 1" />
                <div className="bg-black/40 px-3 py-2">
                  <p className="line-clamp-1 text-[15px] text-zinc-100">
                    {title || "Your page title appears here"}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[13px] text-zinc-400">
                    {description || "Your description preview appears here."}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-zinc-500">From {displayHost}</p>
                </div>
              </div>
            ) : (
              <div className="flex overflow-hidden rounded-2xl border border-zinc-700">
                <ImageBox ratio="1 / 1" className="w-[7.5rem] shrink-0" />
                <div className="min-w-0 flex-1 px-3 py-2.5">
                  <p className="truncate text-[13px] text-zinc-500">{displayHost}</p>
                  <p className="mt-0.5 line-clamp-1 text-[15px] text-zinc-100">
                    {title || "Your page title appears here"}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[13px] text-zinc-400">
                    {description || "Your description preview appears here."}
                  </p>
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>

      <Panel label="Meta tags" actions={<CopyButton value={tags} />}>
        <pre className="min-h-[12rem] w-full overflow-auto whitespace-pre rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-[12.5px] leading-relaxed text-zinc-200">
          {tags || "Fill in the form to generate your meta tags."}
        </pre>
      </Panel>
    </div>
  );
}
