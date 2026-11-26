// ─────────────────────────────────────────────────────────────────────────────
//  Geometry for the projects constellation. Pure and deterministic (identical
//  on server and client), so there are no hydration mismatches.
//
//  Each project is a major star. Consecutive stars are joined by a segment
//  that zig-zags through two minor stars, with a short faint branch off the
//  first one so the figure reads as a constellation, not a straight line.
//  Adding a project adds a star and a segment — nothing else changes: stars
//  are spread across the chart for any count (two, three, five or more).
// ─────────────────────────────────────────────────────────────────────────────

export type Pt = { x: number; y: number };
/**
 * Beside the star (`left`/`right`, nudged `dy` × `lift` px away from the
 * lines) or, when stars are close together, centred `above`/`below` it.
 */
export type LabelPlacement = { side: "left" | "right" | "above" | "below"; dy: -1 | 0 | 1; lift: number };
export type MajorStar = Pt & { label: LabelPlacement; ra: string; dec: string };
export type Segment = { a: number; b: number; d: string; minors: Pt[]; branch: { d: string; pts: Pt[] } };
export type Layout = { w: number; h: number; stars: MajorStar[]; segments: Segment[]; path: string };

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Any number of stars, spread left → right so the constellation lines never
 * cross, alternating high and low (with a little deterministic variation)
 * so the figure reads as a constellation rather than a row.
 * `mx` is the side margin, in chart units.
 */
const HEIGHTS = [0.64, 0.32, 0.6, 0.27, 0.68, 0.36, 0.56, 0.3];
function spread(n: number, w: number, h: number, mx: number): Pt[] {
  return Array.from({ length: n }, (_, i) => ({
    x: r1(n === 1 ? w / 2 : mx + ((w - 2 * mx) * (i + 0.5)) / n),
    y: r1(h * (n === 1 ? 0.5 : HEIGHTS[i % HEIGHTS.length])),
  }));
}

/** Bayer-style designation for the i-th star (α, β, γ…). */
export const GREEK = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ"];

function coordinates(p: Pt, w: number, h: number) {
  const hours = (p.x / w) * 24;
  const hh = Math.floor(hours);
  const mm = Math.floor((hours - hh) * 60);
  const dec = Math.round((0.5 - p.y / h) * 120);
  return {
    ra: `${String(hh).padStart(2, "0")}h ${String(mm).padStart(2, "0")}m`,
    dec: `${dec >= 0 ? "+" : "−"}${Math.abs(dec)}°`,
  };
}

/**
 * Put each label on the side away from its connecting lines, flipping
 * inward near the chart's edges so it never runs off the map.
 */
function placeLabel(i: number, pts: Pt[], w: number): LabelPlacement {
  const p = pts[i];
  const nbrs = [pts[i - 1], pts[i + 1]].filter(Boolean) as Pt[];
  const dx = nbrs.reduce((s, n) => s + (n.x - p.x), 0);
  const dy = nbrs.reduce((s, n) => s + (n.y - p.y), 0);
  let side: "left" | "right" = dx > 0 ? "left" : "right";
  if (p.x / w < 0.38) side = "right";
  if (p.x / w > 0.62) side = "left";
  // Near-horizontal lines run right past the label, so give those labels more clearance.
  const flat = Math.abs(dy) < Math.abs(dx) * 0.5;
  return { side, dy: dy > 0 ? -1 : 1, lift: flat ? 40 : 18 };
}

function segment(a: number, b: number, A: Pt, B: Pt, k: number): Segment {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const s = k % 2 === 0 ? 1 : -1;
  const at = (t: number, off: number): Pt => ({ x: r1(A.x + dx * t + px * off), y: r1(A.y + dy * t + py * off) });
  const m1 = at(0.34, 22 * s);
  const m2 = at(0.67, -14 * s);
  const b1 = { x: r1(m1.x + px * 30 * s + ux * 8), y: r1(m1.y + py * 30 * s + uy * 8) };
  const b2 = { x: r1(b1.x + px * 20 * s - ux * 18), y: r1(b1.y + py * 20 * s - uy * 18) };
  return {
    a,
    b,
    d: `M${A.x} ${A.y}L${m1.x} ${m1.y}L${m2.x} ${m2.y}L${B.x} ${B.y}`,
    minors: [m1, m2],
    branch: { d: `M${m1.x} ${m1.y}L${b1.x} ${b1.y}L${b2.x} ${b2.y}`, pts: [b1, b2] },
  };
}

/**
 * Below this spacing between neighbouring stars (chart units), side labels
 * would collide, so labels go above high stars and below low ones instead —
 * clear of the diagonal lines and of each other.
 */
const SIDE_LABEL_SPACING = 250;

function build(w: number, h: number, pts: Pt[], spacing = Infinity): Layout {
  const stacked = spacing < SIDE_LABEL_SPACING;
  const stars = pts.map((p, i) => ({
    ...p,
    label: stacked ? ({ side: p.y < h / 2 ? "above" : "below", dy: 0, lift: 0 } as const) : placeLabel(i, pts, w),
    ...coordinates(p, w, h),
  }));
  const segments = pts.slice(1).map((B, k) => segment(k, k + 1, pts[k], B, k));
  // One continuous path through every segment, for the travelling particle.
  const path = segments.map((s, k) => (k === 0 ? s.d : s.d.replace(/^M[^L]+/, ""))).join("");
  return { w, h, stars, segments, path };
}

/** Spacious chart for tablets. */
export function desktopLayout(n: number): Layout {
  return build(600, 420, spread(n, 600, 420, 40), (600 - 80) / n);
}

/** Panoramic chart for large screens, where the chart spans the section. */
export function wideLayout(n: number): Layout {
  return build(1000, 380, spread(n, 1000, 380, 60), (1000 - 120) / n);
}

/** Tall, narrow chart for phones: stars descend in a gentle zig-zag. */
export function mobileLayout(n: number): Layout {
  const step = 210;
  const h = 100 + Math.max(n - 1, 0) * step + 110;
  return build(
    320,
    h,
    Array.from({ length: n }, (_, i) => ({ x: i % 2 === 0 ? 72 : 248, y: 100 + i * step })),
  );
}
