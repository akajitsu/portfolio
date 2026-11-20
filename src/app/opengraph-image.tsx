import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — Developer Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Auto-generated social share image, using the same palette as the site. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f3efe7",
          color: "#1c1915",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "#f3e3bd",
          }}
        />
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#6b6357" }}>
          Portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 1, letterSpacing: -4, display: "flex" }}>
            {profile.name}
            <span style={{ color: "#b8391b" }}>.</span>
          </div>
          <div style={{ fontSize: 40, marginTop: 20, color: "#6b6357" }}>{profile.headline.join(" ")}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#6b6357" }}>{profile.title}</div>
      </div>
    ),
    size,
  );
}
