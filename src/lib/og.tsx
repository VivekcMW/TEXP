import { ImageResponse } from "next/og";
import { siteConfig } from "@site-config";
export const OG_SIZE = { width: 1200, height: 630 };
export function ogImage({ title, kicker }: { title: string; kicker: string }) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f7f4ee", color: "#141414", fontFamily: "serif" }}>
      <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#5c5a55" }}>{siteConfig.name}</div>
      <div style={{ fontSize: title.length > 48 ? 56 : 72, lineHeight: 1.05, letterSpacing: -1.5 }}>{title}</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 28, color: "#0f5c4a" }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#0f5c4a" }} />{kicker}
      </div>
    </div>,
    OG_SIZE,
  );
}
