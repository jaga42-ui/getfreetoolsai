import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GetFreeTools — Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f4efe4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 26,
            background: "#fbf8f1",
            border: "3px solid #d8cfba",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 62, fontWeight: 800, letterSpacing: "-4px" }}>
            <span style={{ color: "#211f1a" }}>GF</span>
            <span style={{ color: "#b25733" }}>T</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, marginTop: 28, letterSpacing: "-2px" }}>
          <span style={{ color: "#211f1a" }}>GetFree</span>
          <span style={{ color: "#b25733" }}>Tools</span>
        </div>
        <div style={{ fontSize: 32, color: "#6c675c", marginTop: 14 }}>50+ Free Online Tools</div>
        <div style={{ fontSize: 22, color: "#8a8478", marginTop: 8 }}>
          PDF · Image · Calculators · Developer · OCR
        </div>
        <div
          style={{
            marginTop: 40,
            background: "#211f1a",
            color: "#fbf8f1",
            padding: "12px 32px",
            borderRadius: 9999,
            fontSize: 20,
          }}
        >
          No signup · No watermark · 100% private
        </div>
      </div>
    ),
    { ...size }
  );
}
