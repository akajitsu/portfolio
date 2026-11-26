import type { CSSProperties, SVGProps } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
//  The observatory's visual vocabulary, after the reference illustrations:
//  engraved stars, sunbursts, crescents (one with a face), the triple moon,
//  dotted bursts, leaf sprigs and hanging drips.
//
//  Two forms of each motif:
//   • `…G` glyphs  — bare <g> groups in a −50…50 box, for use inside a larger SVG.
//   • components   — the same glyph wrapped in its own <svg>, for use in HTML.
//  All plain SVG (server-safe, no images), drawn in `currentColor`.
// ─────────────────────────────────────────────────────────────────────────────

type Svg = SVGProps<SVGSVGElement> & { size?: number };
type G = { className?: string; style?: CSSProperties };

const f = (n: number) => Math.round(n * 1000) / 1000;
/** Point at `deg` (0° = up, clockwise) and radius `r` around (cx, cy). */
export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [f(cx + r * Math.sin(a)), f(cy - r * Math.cos(a))];
}

/**
 * Crescent: circle (cx, cy, r) minus a circle of radius `r2` whose centre sits
 * `d` away in direction `deg`. The horns point toward `deg`.
 */
export function crescentPath(cx: number, cy: number, r: number, d: number, r2: number, deg: number) {
  const a = (r * r - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(r * r - a * a, 0));
  const [px, py] = polar(cx, cy, a, deg);
  const rad = (deg * Math.PI) / 180;
  const nx = Math.cos(rad);
  const ny = Math.sin(rad);
  const i1 = `${f(px + h * nx)} ${f(py + h * ny)}`;
  const i2 = `${f(px - h * nx)} ${f(py - h * ny)}`;
  return `M${i2}A${r} ${r} 0 1 0 ${i1}A${r2} ${r2} 0 0 1 ${i2}Z`;
}

function svgProps(size: number, className: string | undefined, rest: SVGProps<SVGSVGElement>, box = "-50 -50 100 100") {
  return { width: size, height: size, viewBox: box, "aria-hidden": true, focusable: false, className, ...rest } as const;
}

// ─── Stars ───────────────────────────────────────────────────────────────────

/** Engraved compass star: each point split into a solid and a lighter half. */
function starFacets(cx: number, cy: number, long: number, short: number, inner: number, points = 8) {
  const step = 360 / points;
  const solid: string[] = [];
  const light: string[] = [];
  const outline: string[] = [];
  for (let i = 0; i < points; i++) {
    const deg = i * step;
    const tip = polar(cx, cy, i % 2 === 0 ? long : short, deg);
    const left = polar(cx, cy, inner, deg - step / 2);
    const right = polar(cx, cy, inner, deg + step / 2);
    solid.push(`M${cx} ${cy}L${left.join(" ")}L${tip.join(" ")}Z`);
    light.push(`M${cx} ${cy}L${tip.join(" ")}L${right.join(" ")}Z`);
    outline.push(`${i ? "L" : "M"}${left.join(" ")}L${tip.join(" ")}`);
  }
  return { solid: solid.join(""), light: light.join(""), outline: outline.join("") + "Z" };
}

const STAR = starFacets(12, 12, 11, 6, 2);
const STAR_G = starFacets(0, 0, 46, 24, 8);
/** The eight-point star in the −50…50 glyph box: `solid` and `light` facet paths. */
export const EIGHT_STAR_G = { solid: STAR_G.solid, light: STAR_G.light };

export function EightStar({ size = 16, className, ...rest }: Svg) {
  return (
    <svg {...svgProps(size, className, rest, "0 0 24 24")} fill="currentColor">
      <path d={STAR.solid} />
      <path d={STAR.light} opacity={0.45} />
    </svg>
  );
}

/** Outlined compass star with a centre spine — the small stars of the arch illustration. */
export function CompassG({ className, style }: G) {
  return (
    <g className={className} style={style} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round">
      <path d={STAR_G.outline} />
      <path d="M0 -46V46M-46 0H46" strokeWidth={1.2} opacity={0.7} />
    </g>
  );
}

/** Four-pointed concave sparkle (24×24 box). */
export const SPARKLE_PATH = "M12 1.5C12.7 8.2 15.8 11.3 22.5 12 15.8 12.7 12.7 15.8 12 22.5 11.3 15.8 8.2 12.7 1.5 12 8.2 11.3 11.3 8.2 12 1.5Z";
/** The same sparkle in the −50…50 glyph box. */
export const SPARKLE_G = "M0 -48C2.9 -20 13 -9.6 48 0 13 9.6 2.9 20 0 48 -2.9 20 -13 9.6 -48 0 -13 -9.6 -2.9 -20 0 -48Z";

export function Sparkle({ size = 12, className, ...rest }: Svg) {
  return (
    <svg {...svgProps(size, className, rest, "0 0 24 24")} fill="currentColor">
      <path d={SPARKLE_PATH} />
    </svg>
  );
}

// ─── Moons ───────────────────────────────────────────────────────────────────

export const CRESCENT_PATH = "M11.3 3.028A9 9 0 1 0 20.418 15.184A7.6 7.6 0 0 1 11.3 3.028Z";

export function Crescent({ size = 16, className, ...rest }: Svg) {
  return (
    <svg {...svgProps(size, className, rest, "0 0 24 24")} fill="currentColor">
      <path d={CRESCENT_PATH} />
    </svg>
  );
}

/** Solid crescent glyph; horns point toward `deg`. */
export function CrescentG({ deg = 45, className, style }: G & { deg?: number }) {
  return <path className={className} style={style} d={crescentPath(0, 0, 44, 20, 38, deg)} fill="currentColor" />;
}

/** Engraved double crescent: a solid moon inside a hairline outline. */
export function DoubleCrescentG({ deg = 0, className, style }: G & { deg?: number }) {
  return (
    <g className={className} style={style}>
      <path d={crescentPath(0, 0, 46, 21, 40, deg)} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d={crescentPath(0, 0, 36, 17, 31, deg)} fill="currentColor" />
    </g>
  );
}

/** Waxing crescent · full moon · waning crescent, backs to the centre. 120×40 box centred on 0. */
export function TripleMoonG({ className, style }: G) {
  return (
    <g className={className} style={style} fill="currentColor">
      <path d={crescentPath(-42, 0, 15, 7.5, 12.5, 270)} />
      <circle r={13} />
      <circle r={17.5} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.6} />
      <path d={crescentPath(42, 0, 15, 7.5, 12.5, 90)} />
    </g>
  );
}

export function TripleMoon({ width = 60, className, ...rest }: SVGProps<SVGSVGElement> & { width?: number }) {
  return (
    <svg width={width} height={width / 3} viewBox="-60 -20 120 40" aria-hidden focusable={false} className={className} {...rest}>
      <TripleMoonG />
    </svg>
  );
}

/**
 * Crescent with an engraved face in profile (looking into the crescent's
 * opening), drawn as line art. 100×100 box centred on 0.
 */
const FACE_PROFILE =
  "M8 43.3C-4 36 -10 30 -9 22L-5 15L-8 12.5L-5 10L-7 6L-1 2L-8.5 -5C-8 -10 -10 -16 -10 -20C-10 -30 -2 -38 8 -43.3";
export function MoonFaceG({ className, style }: G) {
  return (
    <g className={className} style={style} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M8 -43.3A44 44 0 1 0 8 43.3`} strokeWidth={2.2} />
      <path d="M3 -36.5A36.62 36.62 0 1 0 3 36.5" strokeWidth={1} opacity={0.6} />
      <path d={FACE_PROFILE} strokeWidth={2} />
      {/* Closed eye with lashes */}
      <path d="M-22 -8Q-18 -4 -13 -8" strokeWidth={1.6} />
      <path d="M-20.5 -5.6l-1.4 2.6M-17.6 -4.6l-.6 2.8M-14.8 -5.6l.6 2.6" strokeWidth={1} />
      {/* Brow and cheek */}
      <path d="M-24 -14Q-18 -18 -12 -14" strokeWidth={1} opacity={0.7} />
      <path d="M-20 8Q-16 11 -12 9" strokeWidth={1} opacity={0.6} />
    </g>
  );
}

/** Crescent cupping upward with three drips hanging beneath. 100×140 box, top at −50. */
export function HangingCrescentG({ className, style }: G) {
  return (
    <g className={className} style={style}>
      <path d={crescentPath(0, -14, 30, 14, 26, 0)} fill="currentColor" />
      <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
        <path d="M-12 14V52" />
        <path d="M0 17V72" />
        <path d="M12 14V44" />
      </g>
      <g fill="currentColor">
        <path d="M-12 52q-3.4 4.6 0 8 3.4-3.4 0-8Z" />
        <path d="M0 72q-4 5.4 0 9.4 4-4 0-9.4Z" />
        <path d="M12 44q-3.4 4.6 0 8 3.4-3.4 0-8Z" />
      </g>
    </g>
  );
}

// ─── Suns & bursts ───────────────────────────────────────────────────────────

/** Tapered rays for a sun: thin triangles between two radii. */
function rays(cx: number, cy: number, from: number, long: number, short: number, half: number, count = 8, offset = 0) {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const deg = (i * 360) / count + offset;
    const tip = polar(cx, cy, i % 2 === 0 ? long : short, deg);
    const a = polar(cx, cy, from, deg - half);
    const b = polar(cx, cy, from, deg + half);
    out.push(`M${a.join(" ")}L${tip.join(" ")}L${b.join(" ")}Z`);
  }
  return out.join("");
}

const SUN_RAYS = rays(12, 12, 6.2, 11.4, 9.4, 9);
const SUN_RAYS_FINE = rays(12, 12, 6.4, 8.2, 8.2, 3, 8);

/** Celestial sun icon: a ringed disc with alternating long and short engraved rays. */
export function SunGlyph({ size = 16, className, ...rest }: Svg) {
  return (
    <svg {...svgProps(size, className, rest, "0 0 24 24")}>
      <g className="sun-rays" style={{ transformOrigin: "12px 12px" }}>
        <path d={SUN_RAYS} fill="currentColor" />
        <path d={SUN_RAYS_FINE} fill="currentColor" opacity={0.5} transform="rotate(22.5 12 12)" />
      </g>
      <circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="1.9" fill="currentColor" />
    </svg>
  );
}

const BURST_RAYS = rays(0, 0, 21, 49, 36, 5.5, 16);
const BURST_FINE = Array.from({ length: 16 }, (_, i) => {
  const [x1, y1] = polar(0, 0, 22, i * 22.5 + 11.25);
  const [x2, y2] = polar(0, 0, 31, i * 22.5 + 11.25);
  return `M${x1} ${y1}L${x2} ${y2}`;
}).join("");
const BURST_DOTS = Array.from({ length: 12 }, (_, i) => polar(0, 0, 9, i * 30));

/** Bronze sunburst from the pattern illustration: rayed disc with a dotted heart. */
export function SunBurstG({ className, style, spin = false }: G & { spin?: boolean }) {
  return (
    <g className={className} style={style}>
      <g className={spin ? "origin-self animate-spin-slow" : undefined}>
        <path d={BURST_RAYS} fill="currentColor" />
        <path d={BURST_FINE} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
      </g>
      <circle r={17} fill="none" stroke="currentColor" strokeWidth={2} />
      <circle r={13} fill="currentColor" opacity={0.25} />
      {BURST_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill="currentColor" />
      ))}
      <circle r={3.2} fill="currentColor" />
    </g>
  );
}

/** `spin` turns the whole icon — a GPU layer — rather than repainting the rays inside it. */
export function SunBurst({ size = 40, className, spin, ...rest }: Svg & { spin?: boolean }) {
  return (
    <svg {...svgProps(size, cn(className, spin && "animate-spin-slow"), rest)}>
      <SunBurstG />
    </svg>
  );
}

const DOTTED = Array.from({ length: 22 }, (_, i) => {
  const long = i % 2 === 0;
  const deg = i * (360 / 22);
  const [x1, y1] = polar(0, 0, 9, deg);
  const [x2, y2] = polar(0, 0, long ? 40 : 29, deg);
  const [dx, dy] = polar(0, 0, long ? 45 : 33, deg);
  return { line: `M${x1} ${y1}L${x2} ${y2}`, dot: [dx, dy] as const };
});

/** Dandelion-like burst of fine lines tipped with dots. */
export function DottedBurstG({ className, style }: G) {
  return (
    <g className={className} style={style}>
      <path d={DOTTED.map((d) => d.line).join("")} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      {DOTTED.map((d, i) => (
        <circle key={i} cx={d.dot[0]} cy={d.dot[1]} r={i % 2 === 0 ? 2.2 : 1.5} fill="currentColor" />
      ))}
      <circle r={4.5} fill="currentColor" />
    </g>
  );
}

// ─── Leaves ──────────────────────────────────────────────────────────────────

/** Point and tangent angle on a cubic Bézier at t. */
function bez(p: number[][], t: number) {
  const u = 1 - t;
  const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
  const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
  const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
  const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
  return { x: f(x), y: f(y), deg: (Math.atan2(dy, dx) * 180) / Math.PI };
}
const STEM = [[-6, 48], [-14, 18], [10, -16], [4, -48]];
const LEAVES = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86].map((t, i) => {
  const p = bez(STEM, t);
  return { ...p, side: i % 2 === 0 ? -1 : 1 };
});

/** Line-art leafy sprig. */
export function LeafG({ className, style }: G) {
  return (
    <g className={className} style={style} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${STEM[0].join(" ")}C${STEM[1].join(" ")} ${STEM[2].join(" ")} ${STEM[3].join(" ")}`} />
      {LEAVES.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${f(l.deg + l.side * 50)})`}>
          <path d="M0 0Q8 -6 18 0Q8 6 0 0Z" />
          <path d="M2 0H14" strokeWidth={0.8} opacity={0.7} />
        </g>
      ))}
      <path d="M4 -48q4 -6 1 -10q-5 3 -1 10Z" fill="currentColor" stroke="none" />
    </g>
  );
}

// ─── Moon phases ─────────────────────────────────────────────────────────────

/**
 * The lit part of a moon of radius `r` at `phase` (0 = new, 0.25 = first
 * quarter, 0.5 = full, 0.75 = last quarter). Northern-hemisphere view: the
 * waxing moon is lit on the right. The terminator is a half-ellipse.
 */
export function moonPhasePath(cx: number, cy: number, r: number, phase: number) {
  const p = ((phase % 1) + 1) % 1;
  const rx = f(Math.abs(Math.cos(2 * Math.PI * p)) * r);
  const top = `${cx} ${f(cy - r)}`;
  const bottom = `${cx} ${f(cy + r)}`;
  if (p <= 0.5) {
    // Lit limb on the right (top → bottom, clockwise), terminator back up.
    return `M${top}A${r} ${r} 0 0 1 ${bottom}A${rx} ${r} 0 0 ${p < 0.25 ? 0 : 1} ${top}Z`;
  }
  // Lit limb on the left (top → bottom, anticlockwise), terminator back up.
  return `M${top}A${r} ${r} 0 0 0 ${bottom}A${rx} ${r} 0 0 ${p < 0.75 ? 0 : 1} ${top}Z`;
}

/** One moon phase: a hairline disc with its lit part filled. */
export function MoonPhaseG({ phase, r = 40, className, style }: G & { phase: number; r?: number }) {
  return (
    <g className={className} style={style}>
      <circle r={r} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeWidth={1.4} strokeOpacity={0.55} />
      {phase % 1 !== 0 && <path d={moonPhasePath(0, 0, r, phase)} fill="currentColor" />}
    </g>
  );
}

export function MoonPhase({ phase, size = 16, className, ...rest }: Svg & { phase: number }) {
  return (
    <svg {...svgProps(size, className, rest, "-44 -44 88 88")}>
      <MoonPhaseG phase={phase} />
    </svg>
  );
}

// ─── Instruments ─────────────────────────────────────────────────────────────

const ROSE_TICKS = Array.from({ length: 72 }, (_, i) => {
  const deg = i * 5;
  const long = deg % 30 === 0;
  const [x1, y1] = polar(0, 0, 46, deg);
  const [x2, y2] = polar(0, 0, long ? 40.5 : 43, deg);
  return `M${x1} ${y1}L${x2} ${y2}`;
}).join("");
const ROSE_MAIN = starFacets(0, 0, 38, 24, 5.5, 8);
const ROSE_MINOR = Array.from({ length: 8 }, (_, i) => {
  const deg = i * 45 + 22.5;
  const [tx, ty] = polar(0, 0, 21, deg);
  const [ax, ay] = polar(0, 0, 4.5, deg - 12);
  const [bx, by] = polar(0, 0, 4.5, deg + 12);
  return `M${ax} ${ay}L${tx} ${ty}L${bx} ${by}`;
}).join("");

/**
 * Engraved compass rose: a degree ring with 5° ticks, an eight-point star
 * (cardinals long, intercardinals short) over eight hairline minor points,
 * and the cardinal letters. 100×100 box centred on 0.
 */
export function CompassRoseG({ className, style, letters = true }: G & { letters?: boolean }) {
  return (
    <g className={className} style={style}>
      <g fill="none" stroke="currentColor">
        <circle r={47} strokeWidth={1.2} />
        <circle r={40} strokeWidth={0.7} strokeOpacity={0.7} />
        <path d={ROSE_TICKS} strokeWidth={0.6} strokeOpacity={0.75} />
        <circle r={30} strokeWidth={0.5} strokeOpacity={0.5} strokeDasharray="1.5 2.5" />
        <path d={ROSE_MINOR} strokeWidth={0.8} strokeOpacity={0.8} strokeLinejoin="round" />
      </g>
      <path d={ROSE_MAIN.solid} fill="currentColor" />
      <path d={ROSE_MAIN.light} fill="currentColor" opacity={0.35} />
      <circle r={3.2} style={{ fill: "var(--color-paper)" }} stroke="currentColor" strokeWidth={1} />
      {letters && (
        <g fill="currentColor" style={{ fontFamily: "var(--font-caps)" }} fontSize={6.5} textAnchor="middle" dominantBaseline="central">
          <text y={-52}>N</text>
          <text x={53}>E</text>
          <text y={53}>S</text>
          <text x={-53}>W</text>
        </g>
      )}
    </g>
  );
}

export function CompassRose({ size = 120, className, letters, ...rest }: Svg & { letters?: boolean }) {
  return (
    <svg {...svgProps(size, className, rest, "-60 -60 120 120")}>
      <CompassRoseG letters={letters} />
    </svg>
  );
}

const ECLIPSE_RAYS = rays(0, 0, 25, 47, 36, 4, 24);

/**
 * Sun and moon together: a rayed sun with the moon's crescent crossing its face.
 * `still` drops the internal ray rotation (animate the wrapper instead — cheaper).
 */
export function SunMoonG({ className, style, still = false }: G & { still?: boolean }) {
  return (
    <g className={className} style={style}>
      <g className={still ? undefined : "origin-self animate-spin-slower"}>
        <path d={ECLIPSE_RAYS} fill="currentColor" opacity={0.85} />
      </g>
      <circle r={22} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <circle r={18} fill="currentColor" opacity={0.18} />
      <path d={crescentPath(0, 0, 18, 8, 15, 300)} fill="currentColor" />
    </g>
  );
}

/**
 * Orbital diagram: two tilted elliptical orbits around a small sun.
 * `still` drops the internal counter-rotation (animate the wrapper instead — cheaper).
 */
export function OrbitG({ className, style, still = false }: G & { still?: boolean }) {
  return (
    <g className={className} style={style} fill="none" stroke="currentColor">
      <circle r={46} strokeWidth={0.6} strokeOpacity={0.5} strokeDasharray="1 3.5" />
      <g className={still ? undefined : "origin-self animate-spin-slow"}>
        <ellipse rx={44} ry={15} strokeWidth={1} transform="rotate(-28)" />
        <circle cx={38.4} cy={-7.6} r={3.2} fill="currentColor" stroke="none" transform="rotate(-28)" />
      </g>
      <g className={still ? undefined : "origin-self animate-spin-reverse"}>
        <ellipse rx={30} ry={11} strokeWidth={0.9} strokeOpacity={0.8} transform="rotate(34)" />
        <circle cx={-29} cy={2.6} r={2.2} fill="currentColor" stroke="none" transform="rotate(34)" />
      </g>
      <circle r={6} fill="currentColor" stroke="none" />
      <circle r={9.5} strokeWidth={0.7} strokeOpacity={0.7} />
    </g>
  );
}

// ─── Constellations ──────────────────────────────────────────────────────────

/**
 * Real asterisms, simplified, in a 100×100 box (north up). `mag` sets the
 * relative brightness of each star (1 = brightest).
 */
export type Asterism = { name: string; stars: { x: number; y: number; mag: number; name?: string }[]; lines: [number, number][] };

export const URSA_MINOR: Asterism = {
  name: "Ursa Minor",
  // Polaris at the tip of the handle, then Yildun, ε, ζ, η, Pherkad (γ) and Kochab (β).
  stars: [
    { x: 14, y: 12, mag: 1, name: "Polaris" },
    { x: 26, y: 26, mag: 3 },
    { x: 36, y: 40, mag: 3 },
    { x: 50, y: 52, mag: 2.6 },
    { x: 54, y: 72, mag: 3 },
    { x: 80, y: 80, mag: 2.2 },
    { x: 78, y: 58, mag: 1.6 },
  ],
  lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
};

export const CASSIOPEIA: Asterism = {
  name: "Cassiopeia",
  // The "W": Caph, Schedar, Navi (γ), Ruchbah, Segin.
  stars: [
    { x: 8, y: 30, mag: 1.8 },
    { x: 28, y: 62, mag: 1.4 },
    { x: 50, y: 40, mag: 1.6 },
    { x: 70, y: 62, mag: 2.2 },
    { x: 92, y: 42, mag: 2.6 },
  ],
  lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
};

export const LYRA: Asterism = {
  name: "Lyra",
  // Vega, then ε/ζ and the parallelogram (δ, γ, β).
  stars: [
    { x: 40, y: 10, mag: 0.8, name: "Vega" },
    { x: 58, y: 18, mag: 3 },
    { x: 48, y: 34, mag: 2.6 },
    { x: 62, y: 46, mag: 2.8 },
    { x: 52, y: 84, mag: 2 },
    { x: 34, y: 74, mag: 2.2 },
  ],
  lines: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]],
};

/** Star radius from magnitude: brighter stars are drawn larger. */
const magR = (mag: number) => f(Math.max(0.9, 3.4 - mag * 0.85));

/** A constellation figure as a bare <g> (100×100 box): hairline lines, sized stars. */
export function AsterismG({
  asterism,
  className,
  style,
  lineOpacity = 0.55,
  linesClassName,
}: G & { asterism: Asterism; lineOpacity?: number; linesClassName?: string }) {
  const s = asterism.stars;
  return (
    <g className={className} style={style}>
      <g stroke="currentColor" strokeWidth={0.6} strokeOpacity={lineOpacity} fill="none" className={linesClassName}>
        {asterism.lines.map(([a, b], i) => (
          <path key={i} d={`M${s[a].x} ${s[a].y}L${s[b].x} ${s[b].y}`} />
        ))}
      </g>
      <g fill="currentColor">
        {s.map((st, i) => (
          <circle key={i} cx={st.x} cy={st.y} r={magR(st.mag)} />
        ))}
      </g>
    </g>
  );
}

// ─── Rules & frames ──────────────────────────────────────────────────────────

/** Horizontal rule with the triple moon at its centre (or start). */
export function OrnamentRule({ className, align = "center" }: { className?: string; align?: "center" | "start" }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3 text-moon", className)}>
      {align === "center" && <span className="rule-fade h-px flex-1" />}
      <TripleMoon width={54} className="text-cream" />
      <span className="rule-fade h-px flex-1" />
    </div>
  );
}

/** Four engraved corner marks for framed cards. Parent must be `relative`. */
export function Corners({ className, inset = "0.5rem" }: { className?: string; inset?: string }) {
  const base = "absolute h-3 w-3 border-moon/60";
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute", className)} style={{ inset }}>
      <span className={cn(base, "left-0 top-0 border-l border-t")} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export const roman = (n: number) => ROMAN[n - 1] ?? String(n);
