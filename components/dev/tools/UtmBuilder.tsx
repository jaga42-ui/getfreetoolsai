"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Download, Plus, Trash2, RotateCcw } from "lucide-react";
import {
  DevButton,
  Labeled,
  inputClass,
  CopyButton,
  Panel,
  StatusPill,
} from "@/components/dev/ui";
import { usePersistentState } from "@/lib/hooks";
import { toCsv } from "@/lib/calc";
import { downloadBlob } from "@/lib/utils";

type Params = {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  id: string;
};

const EMPTY: Params = { source: "", medium: "", campaign: "", term: "", content: "", id: "" };

/**
 * Presets for the channels that account for most tagged traffic. Each sets the
 * two parameters Google Analytics actually reports on by default (source and
 * medium) and leaves the campaign name to the user.
 */
const PRESETS: { label: string; patch: Partial<Params> }[] = [
  { label: "Facebook Ads", patch: { source: "facebook", medium: "cpc" } },
  { label: "Google Ads", patch: { source: "google", medium: "cpc" } },
  { label: "Newsletter", patch: { source: "newsletter", medium: "email" } },
  { label: "X / Twitter", patch: { source: "twitter", medium: "social" } },
  { label: "LinkedIn", patch: { source: "linkedin", medium: "social" } },
  { label: "Affiliate", patch: { source: "partner", medium: "affiliate" } },
];

/**
 * Normalise a UTM value. Analytics tools treat `Spring Sale`, `spring sale`
 * and `Spring-Sale` as three different campaigns, which is the single most
 * common way campaign reports get fragmented — so lowercase, collapse
 * whitespace to hyphens, and drop characters that would need escaping.
 */
function cleanValue(v: string): string {
  return v
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._~\-+|]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/** Trim the URL, add a scheme when the user omitted it, drop a trailing slash. */
function cleanBase(raw: string): string {
  let s = raw.trim();
  if (!s) return "";
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = `https://${s}`;
  return s.replace(/\/+$/, (m, offset: number) =>
    // Keep the slash when it is the one in "https://" — i.e. the root path.
    offset <= s.indexOf("://") + 2 ? m : ""
  );
}

export default function UtmBuilder() {
  const [rawUrl, setRawUrl] = useState("");
  const [p, setP] = useState<Params>(EMPTY);
  const [autoClean, setAutoClean] = useState(true);
  const [saved, setSaved] = usePersistentState<{ name: string; url: string; at: string }[]>(
    "gft:utm:saved",
    []
  );
  const [qr, setQr] = useState("");

  const set = (k: keyof Params) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setP((prev) => ({ ...prev, [k]: e.target.value }));

  const value = (k: keyof Params) => (autoClean ? cleanValue(p[k]) : p[k].trim());

  const { url, error, missing } = useMemo(() => {
    const base = cleanBase(rawUrl);
    if (!base) return { url: "", error: "", missing: [] as string[] };

    let u: URL;
    try {
      u = new URL(base);
    } catch {
      return { url: "", error: "That doesn't look like a valid URL.", missing: [] as string[] };
    }

    const pairs: [string, string][] = [
      ["utm_source", value("source")],
      ["utm_medium", value("medium")],
      ["utm_campaign", value("campaign")],
      ["utm_id", value("id")],
      ["utm_term", value("term")],
      ["utm_content", value("content")],
    ];

    // Replace any UTM parameters already on the URL rather than duplicating
    // them, but keep every other query parameter the page needs.
    for (const [k] of pairs) u.searchParams.delete(k);
    for (const [k, v] of pairs) if (v) u.searchParams.set(k, v);

    const req = (["source", "medium", "campaign"] as const).filter((k) => !value(k));
    return { url: u.toString(), error: "", missing: req };
  }, [rawUrl, p, autoClean]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render the QR only for a finished link, and debounce it so a fast typist
  // doesn't queue a render per keystroke.
  useEffect(() => {
    if (!url) {
      setQr("");
      return;
    }
    let live = true;
    const t = setTimeout(() => {
      QRCode.toDataURL(url, { margin: 1, width: 320, errorCorrectionLevel: "M" })
        .then((d) => live && setQr(d))
        .catch(() => live && setQr(""));
    }, 250);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [url]);

  const applyPreset = (patch: Partial<Params>) => setP((prev) => ({ ...prev, ...patch }));

  const save = () => {
    if (!url) return;
    const name = value("campaign") || new URL(url).hostname;
    setSaved((prev) => [
      { name, url, at: new Date().toISOString().slice(0, 10) },
      ...prev.filter((s) => s.url !== url),
    ].slice(0, 50));
  };

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Campaign", "URL", "Saved"],
      ...saved.map((s) => [s.name, s.url, s.at]),
    ];
    downloadBlob(
      new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }),
      "utm-campaigns.csv"
    );
  };

  const field = (
    k: keyof Params,
    label: string,
    placeholder: string,
    hint?: string
  ) => (
    <Labeled label={label}>
      <input
        value={p[k]}
        onChange={set(k)}
        className={inputClass}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
      />
      {hint && <span className="mt-1 block font-sans text-[11px] text-zinc-500">{hint}</span>}
    </Labeled>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* ---- Inputs ---- */}
        <div className="space-y-4">
          <Labeled label="Website URL *">
            <input
              value={rawUrl}
              onChange={(e) => setRawUrl(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/landing-page"
              spellCheck={false}
              autoComplete="off"
              inputMode="url"
            />
          </Labeled>

          <div>
            <span className="mb-2 block text-xs font-medium text-zinc-400">Quick presets</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.patch)}
                  className="rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-zinc-100"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {field("source", "Campaign source * (utm_source)", "google", "Where the traffic comes from — the referrer.")}
          {field("medium", "Campaign medium * (utm_medium)", "cpc", "The marketing channel: cpc, email, social, referral.")}
          {field("campaign", "Campaign name * (utm_campaign)", "spring-sale", "The promotion or strategic campaign.")}
          {field("id", "Campaign ID (utm_id)", "2026-q3-brand", "Optional. Ties the click to a row in GA4 cost-data import.")}
          {field("term", "Campaign term (utm_term)", "running-shoes", "Optional. The paid keyword.")}
          {field("content", "Campaign content (utm_content)", "hero-cta", "Optional. Distinguishes two links in the same email or ad.")}

          <label className="flex items-start gap-2.5 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={autoClean}
              onChange={(e) => setAutoClean(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 accent-emerald-500"
            />
            <span>
              <span className="font-medium text-zinc-300">Auto-clean values</span> — lowercase,
              spaces to hyphens, strip characters that need escaping. Keeps one campaign from
              splitting into several rows in your analytics.
            </span>
          </label>

          <DevButton
            icon={RotateCcw}
            onClick={() => {
              setP(EMPTY);
              setRawUrl("");
            }}
          >
            Reset fields
          </DevButton>
        </div>

        {/* ---- Output ---- */}
        <div className="space-y-5">
          <Panel
            label="Generated URL"
            actions={
              <>
                <DevButton size="sm" icon={Plus} onClick={save} disabled={!url}>
                  Save
                </DevButton>
                <CopyButton value={url} />
              </>
            }
          >
            <div className="min-h-[5.5rem] w-full break-all rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-[13px] leading-relaxed text-emerald-300">
              {url || (
                <span className="text-zinc-600">
                  Enter a URL and campaign parameters to build your tracking link.
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {error && <StatusPill state="error">{error}</StatusPill>}
              {!error && url && missing.length === 0 && (
                <StatusPill state="ok">Valid tracking URL</StatusPill>
              )}
              {!error && url && missing.length > 0 && (
                <StatusPill state="error">
                  Missing required: {missing.map((m) => `utm_${m}`).join(", ")}
                </StatusPill>
              )}
            </div>
          </Panel>

          <Panel label="QR code">
            {/* Fixed box so the QR appearing never shifts the panel below it. */}
            <div className="flex h-[184px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70">
              {qr ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qr}
                    alt="QR code for the generated tracking URL"
                    width={144}
                    height={144}
                    className="rounded bg-white p-1.5"
                  />
                  <DevButton
                    size="sm"
                    icon={Download}
                    onClick={() =>
                      fetch(qr)
                        .then((r) => r.blob())
                        .then((b) => downloadBlob(b, "utm-qr-code.png"))
                    }
                  >
                    PNG
                  </DevButton>
                </div>
              ) : (
                <span className="text-xs text-zinc-600">
                  A scannable QR appears once the link is built.
                </span>
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* ---- Campaign tracker ---- */}
      {saved.length > 0 && (
        <Panel
          label={`Saved campaigns (${saved.length})`}
          actions={
            <>
              <DevButton size="sm" icon={Download} onClick={exportCsv}>
                Export CSV
              </DevButton>
              <DevButton size="sm" icon={Trash2} onClick={() => setSaved([])}>
                Clear
              </DevButton>
            </>
          }
        >
          <div className="max-h-72 overflow-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-zinc-900 text-zinc-500">
                <tr>
                  <th className="p-2.5 font-medium">Campaign</th>
                  <th className="p-2.5 font-medium">URL</th>
                  <th className="p-2.5 font-medium">Saved</th>
                  <th className="p-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {saved.map((s) => (
                  <tr key={s.url} className="align-top">
                    <td className="p-2.5 font-medium text-zinc-200">{s.name}</td>
                    <td className="max-w-[22rem] break-all p-2.5 font-mono text-[11.5px] text-zinc-400">
                      {s.url}
                    </td>
                    <td className="whitespace-nowrap p-2.5 text-zinc-500">{s.at}</td>
                    <td className="p-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <CopyButton value={s.url} />
                        <button
                          type="button"
                          onClick={() => setSaved((prev) => prev.filter((x) => x.url !== s.url))}
                          aria-label={`Remove ${s.name}`}
                          className="rounded-md border border-zinc-700 bg-zinc-800/60 p-1.5 text-zinc-400 transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            Saved links stay in this browser only — nothing is sent to a server.
          </p>
        </Panel>
      )}
    </div>
  );
}
