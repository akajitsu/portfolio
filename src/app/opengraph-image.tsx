import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — Developer Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Auto-generated social share image in the site's midnight-and-gold palette. */
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
          background: "#10172b",
          color: "#f3efe5",
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
            border: "1px solid rgba(201,155,85,0.55)",
          }}
        />
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#c99b55" }}>
          Portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 1, letterSpacing: -4, display: "flex" }}>
            {profile.name}
            <span style={{ color: "#c99b55" }}>.</span>
          </div>
          <div style={{ fontSize: 40, marginTop: 20, color: "#e4c58b", fontStyle: "italic" }}>{profile.headline.join(" ")}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#b9b9c1" }}>{profile.title || profile.tagline}</div>
      </div>
    ),
    size,
  );
}
