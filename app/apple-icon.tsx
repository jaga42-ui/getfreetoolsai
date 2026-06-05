import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fbf8f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-6px",
          }}
        >
          <span style={{ color: "#211f1a" }}>GF</span>
          <span style={{ color: "#b25733" }}>T</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
