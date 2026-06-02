import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GetFreeToolsAI — Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
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
            fontSize: 64,
            fontWeight: 900,
            color: "#6366f1",
            marginBottom: 20,
          }}
        >
          GetFreeToolsAI
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#333",
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          50+ Free Online Tools
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#666",
            textAlign: "center",
          }}
        >
          PDF · Image · AI Writing · Generators · Video
        </div>
        <div
          style={{
            marginTop: 40,
            background: "#6366f1",
            color: "white",
            padding: "12px 32px",
            borderRadius: 8,
            fontSize: 20,
          }}
        >
          No Signup · No Watermark · 100% Free
        </div>
      </div>
    ),
    { ...size }
  );
}
