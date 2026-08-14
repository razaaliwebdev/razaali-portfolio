import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

export function createOgImage(input: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0e14",
          padding: "56px 64px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#3fb950",
            fontSize: 28,
          }}
        >
          <span>~/</span>
          <span style={{ color: "#8b949e" }}>{input.eyebrow}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#e6edf3",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            {input.title}
          </div>
          <div
            style={{
              color: "#8b949e",
              fontSize: 28,
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {input.subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#8b949e",
            fontSize: 22,
          }}
        >
          <span style={{ color: "#3fb950" }}>razaali.dev</span>
          <span>Full Stack · MERN / PERN</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
