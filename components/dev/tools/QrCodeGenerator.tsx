"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { DevButton, Labeled, inputClass, Panel } from "@/components/dev/ui";
import { downloadBlob } from "@/lib/utils";

type Kind = "text" | "url" | "wifi" | "email" | "phone";
type Ecc = "L" | "M" | "Q" | "H";

const KINDS: { value: Kind; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "url", label: "URL" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

function escapeWifi(s: string) {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

export default function QrCodeGenerator() {
  const [kind, setKind] = useState<Kind>("url");
  const [text, setText] = useState("https://www.getfreetoolsai.com");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [ecc, setEcc] = useState<Ecc>("M");
  const [dark, setDark] = useState("#211f1a");
  const [light, setLight] = useState("#ffffff");

  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<string>("");

  const value = (() => {
    switch (kind) {
      case "url":
        return text.trim();
      case "wifi":
        if (!ssid) return "";
        return `WIFI:T:${wifiEnc};S:${escapeWifi(ssid)};${
          wifiEnc === "nopass" ? "" : `P:${escapeWifi(wifiPass)};`
        }${wifiHidden ? "H:true;" : ""};`;
      case "email":
        return email ? `mailto:${email.trim()}` : "";
      case "phone":
        return phone ? `tel:${phone.trim()}` : "";
      default:
        return text;
    }
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!value) {
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;
      ctx?.clearRect(0, 0, size, size);
      svgRef.current = "";
      setError("");
      return;
    }
    const opts = {
      width: size,
      margin,
      errorCorrectionLevel: ecc,
      color: { dark, light },
    } as const;
    QRCode.toCanvas(canvas, value, opts)
      .then(() => QRCode.toString(value, { ...opts, type: "svg" }))
      .then((svg) => {
        svgRef.current = svg;
        setError("");
      })
      .catch((e: unknown) => {
        svgRef.current = "";
        setError(
          e instanceof Error && /too big|code length|data/i.test(e.message)
            ? "Too much data for a QR code — shorten the text or lower the error-correction level."
            : "Could not generate a QR code from this input."
        );
      });
  }, [value, size, margin, ecc, dark, light]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    canvas.toBlob((b) => b && downloadBlob(b, "qr-code.png"), "image/png");
  };
  const downloadSvg = () => {
    if (!svgRef.current) return;
    downloadBlob(
      new Blob([svgRef.current], { type: "image/svg+xml" }),
      "qr-code.svg"
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Controls */}
      <div className="space-y-4">
        <Panel label="Content">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                aria-pressed={kind === k.value}
                onClick={() => setKind(k.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  kind === k.value
                    ? "bg-emerald-500 text-zinc-950"
                    : "border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {kind === "wifi" ? (
            <div className="space-y-3">
              <Labeled label="Network name (SSID)">
                <input className={inputClass} value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="MyWiFi" />
              </Labeled>
              <div className="flex flex-wrap gap-3">
                <Labeled label="Security">
                  <select
                    className={inputClass}
                    value={wifiEnc}
                    onChange={(e) => setWifiEnc(e.target.value as typeof wifiEnc)}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </Labeled>
                {wifiEnc !== "nopass" && (
                  <Labeled label="Password">
                    <input className={inputClass} value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder="••••••••" />
                  </Labeled>
                )}
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
                Hidden network
              </label>
            </div>
          ) : kind === "email" ? (
            <Labeled label="Email address">
              <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Labeled>
          ) : kind === "phone" ? (
            <Labeled label="Phone number">
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
            </Labeled>
          ) : (
            <Labeled label={kind === "url" ? "URL" : "Text"}>
              <textarea
                className={`${inputClass} min-h-[88px] resize-y`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={kind === "url" ? "https://example.com" : "Any text to encode"}
              />
            </Labeled>
          )}
        </Panel>

        <Panel label="Style">
          <div className="space-y-3">
            <label className="block text-xs text-zinc-400">
              <span className="mb-1.5 flex justify-between font-medium">
                <span>Size</span>
                <span className="font-mono text-zinc-300">{size}px</span>
              </span>
              <input type="range" min={128} max={1024} step={16} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-emerald-500" />
            </label>
            <label className="block text-xs text-zinc-400">
              <span className="mb-1.5 flex justify-between font-medium">
                <span>Quiet zone (margin)</span>
                <span className="font-mono text-zinc-300">{margin}</span>
              </span>
              <input type="range" min={0} max={8} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full accent-emerald-500" />
            </label>
            <div className="flex flex-wrap items-end gap-4">
              <Labeled label="Error correction">
                <select className={inputClass} value={ecc} onChange={(e) => setEcc(e.target.value as Ecc)}>
                  <option value="L">L — Low (7%)</option>
                  <option value="M">M — Medium (15%)</option>
                  <option value="Q">Q — Quartile (25%)</option>
                  <option value="H">H — High (30%)</option>
                </select>
              </Labeled>
              <label className="text-xs text-zinc-400">
                <span className="mb-1.5 block font-medium">Foreground</span>
                <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-zinc-700 bg-transparent" />
              </label>
              <label className="text-xs text-zinc-400">
                <span className="mb-1.5 block font-medium">Background</span>
                <input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-zinc-700 bg-transparent" />
              </label>
            </div>
          </div>
        </Panel>
      </div>

      {/* Preview */}
      <Panel label="Preview">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex aspect-square w-full max-w-[256px] items-center justify-center overflow-hidden rounded-lg bg-white p-2">
            {/* canvas is sized internally; constrain display */}
            <canvas ref={canvasRef} className="h-full w-full object-contain" />
          </div>
          {error ? (
            <p className="text-center text-xs text-red-400">{error}</p>
          ) : !value ? (
            <p className="text-center text-xs text-zinc-500">Enter content to generate a QR code</p>
          ) : (
            <div className="flex w-full flex-wrap justify-center gap-2">
              <DevButton variant="primary" icon={Download} onClick={downloadPng}>
                PNG
              </DevButton>
              <DevButton icon={Download} onClick={downloadSvg}>
                SVG
              </DevButton>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
