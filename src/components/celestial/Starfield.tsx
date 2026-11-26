import type { CSSProperties, ReactNode } from "react";
import {
  AsterismG,
  CASSIOPEIA,
  CompassRoseG,
  CrescentG,
  DottedBurstG,
  EIGHT_STAR_G,
  HangingCrescentG,
  LeafG,
  LYRA,
  MoonFaceG,
  MoonPhaseG,
  OrbitG,
  polar,
  SPARKLE_G,
  SunBurstG,
  SunMoonG,
} from "@/components/celestial/Ornaments";
import ParallaxLoop from "@/components/celestial/ParallaxLoop";
import { cn } from "@/lib/utils";
import ShootingStars from "@/components/celestial/ShootingStars";
import SkyInteraction from "@/components/celestial/SkyInteraction";

/** Small seeded PRNG so the sky is identical on server and client. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1600;
const H = 1000;
const rand = mulberry32(20261124);
const r2 = (n: number) => Math.round(n * 100) / 100;
const between = (a: number, b: number) => r2(a + rand() * (b - a));

const anim = (name: string, dur: number, delay = 0): CSSProperties => ({ animation: `${name} ${dur}s ease-in-out ${delay}s infinite` });

// ─── Layer 1: distant stars ──────────────────────────────────────────────────
// Many pinpricks at different brightness. Most hold still; three scattered
// cohorts breathe, each on its own rhythm. Each cohort is its own SVG whose
// opacity animates as a whole — a GPU job, not a repaint of the drawing.
// Every other star is dropped on phones.
const DISTANT = Array.from({ length: 240 }, (_, i) => ({
  x: r2(rand() * W),
  y: r2(rand() * H),
  r: rand() > 0.94 ? between(0.9, 1.25) : between(0.3, 0.8),
  o: between(0.18, 0.9),
  cohort: i % 7 === 0 ? 1 : i % 7 === 3 ? 2 : i % 7 === 5 ? 3 : 0,
  mobile: i % 2 === 0,
}));
const COHORTS = [null, { dur: 6.5, delay: -2 }, { dur: 9.5, delay: -6 }, { dur: 13, delay: -1 }];

// ─── Layer 2: visible stars ──────────────────────────────────────────────────
// A jittered 8×4 grid keeps them evenly spread (no clumps, no bald patches).
// These are the stars the pointer can wake (see SkyInteraction). Each is a
// small HTML element animating its own transform/opacity on the GPU.
type Shape = "sparkle" | "six" | "eight" | "cross" | "ring";
const SHAPES: Shape[] = ["sparkle", "eight", "six", "cross", "ring", "sparkle", "six", "cross"];
/** Slender six-point star (−50…50 box). */
const SIX_STAR =
  Array.from({ length: 12 }, (_, k) => {
    const [x, y] = polar(0, 0, k % 2 === 0 ? 48 : 12, k * 30);
    return `${k ? "L" : "M"}${x} ${y}`;
  }).join("") + "Z";
const VISIBLE = Array.from({ length: 32 }, (_, i) => {
  const col = i % 8;
  const row = Math.floor(i / 8);
  const shape = SHAPES[Math.floor(rand() * SHAPES.length)];
  return {
    x: r2((col + 0.15 + rand() * 0.7) * (W / 8)),
    y: r2((row + 0.15 + rand() * 0.7) * (H / 4)),
    s: shape === "ring" ? between(0.06, 0.085) : between(0.075, 0.15),
    o: between(0.6, 1),
    shape,
    tone: rand() > 0.7 ? "text-moon" : "text-cream",
    // About a third also turn a little as they dim; the rest only breathe.
    anim: rand() > 0.62 ? "twinkle-turn" : "twinkle-soft",
    dur: between(5, 13),
    delay: between(-13, 0),
    mobile: i % 3 !== 0,
  };
});

function StarShape({ shape }: { shape: Shape }) {
  switch (shape) {
    case "eight":
      return (
        <>
          <path d={EIGHT_STAR_G.solid} />
          <path d={EIGHT_STAR_G.light} opacity={0.45} />
        </>
      );
    case "six":
      return (
        <>
          <path d={SIX_STAR} />
          <circle r={7} />
        </>
      );
    case "cross":
      return (
        <>
          <path d="M0 -50L4.5 0L0 50L-4.5 0ZM-50 0L0 4.5L50 0L0 -4.5Z" />
          <circle r={9} />
        </>
      );
    case "ring":
      return (
        <>
          <circle r={15} />
          <circle r={30} fill="none" stroke="currentColor" strokeWidth={5} opacity={0.6} />
        </>
      );
    default:
      return <path d={SPARKLE_G} />;
  }
}

// ─── Layer 3: gold dust ──────────────────────────────────────────────────────
const SCATTERED_DUST = Array.from({ length: 14 }, (_, i) => ({
  left: r2(rand() * 100),
  top: r2(rand() * 100),
  size: between(1.5, 3.6),
  dx: Math.round((rand() - 0.5) * 80),
  dy: Math.round(-20 - rand() * 50),
  dur: between(18, 40),
  delay: between(-40, 0),
  mobile: i % 2 === 0,
}));
// A few loose clusters, finer and dimmer, so the dust has pockets of depth.
const CLUSTERS = [
  { cx: 16, cy: 28, mobile: true },
  { cx: 78, cy: 62, mobile: false },
  { cx: 42, cy: 88, mobile: false },
];
const CLUSTER_DUST = CLUSTERS.flatMap((c) =>
  Array.from({ length: 4 }, () => ({
    left: r2(c.cx + (rand() - 0.5) * 7),
    top: r2(c.cy + (rand() - 0.5) * 6),
    size: between(1.1, 2.2),
    dx: Math.round((rand() - 0.5) * 30),
    dy: Math.round(-10 - rand() * 20),
    dur: between(24, 44),
    delay: between(-44, 0),
    mobile: c.mobile,
  })),
);
const DUST = [...SCATTERED_DUST, ...CLUSTER_DUST].map((d) => ({ ...d, glow: between(0.45, 1) }));
const DUST_GROUPS = [
  { dx: 26, dy: -42, dur: 29, delay: -7 },
  { dx: -34, dy: -28, dur: 37, delay: -19 },
  { dx: 18, dy: -55, dur: 44, delay: -31 },
  { dx: -22, dy: -36, dur: 33, delay: -12 },
];

// ─── Ornaments (outer margins only) ──────────────────────────────────────────
// `box` is the glyph's viewBox (default −50…50); `motion` animates the wrapper,
// so the drawing itself is painted once and only moved.
type Orn = {
  x: number;
  y: number;
  s: number;
  rot?: number;
  flip?: boolean;
  tone: "cream" | "bronze" | "moon";
  node: ReactNode;
  box?: [number, number, number, number];
  motion?: CSSProperties;
  /** Sway from the top (hanging things) rather than the centre. */
  hang?: boolean;
};

// Art-directed placement: the pattern lives only in the outer margins
// (outside the 1240px content column on a typical laptop); the centre gets
// nothing but stars, so ornaments never drift behind text. Each motif
// appears once per side at most.
const PHASES = [0.14, 0.25, 0.38, 0.5];
const spin = (dur: number, reverse = false): CSSProperties => ({ animation: `${reverse ? "spin-reverse" : "spin"} ${dur}s linear infinite` });
const ORNAMENTS: Orn[] = [
  // Left margin
  { x: 72, y: 110, s: 0.6, tone: "bronze", node: <SunBurstG />, motion: spin(140) },
  { x: 62, y: 290, s: 0.62, tone: "moon", node: <MoonFaceG />, motion: anim("float-y", 11) },
  { x: 84, y: 455, s: 0.52, tone: "cream", node: <HangingCrescentG />, box: [-50, -50, 100, 140], motion: anim("sway", 7), hang: true },
  {
    x: 70,
    y: 615,
    s: 0.62,
    tone: "cream",
    box: [-20, -80, 40, 160],
    // A column of moon phases, waxing downward.
    node: (
      <g>
        {PHASES.map((p, i) => (
          <g key={p} transform={`translate(0 ${(i - 1.5) * 36})`}>
            <MoonPhaseG phase={p} r={13} />
          </g>
        ))}
      </g>
    ),
  },
  { x: 58, y: 800, s: 0.6, rot: 18, tone: "moon", node: <LeafG />, motion: anim("sway", 9, -3), hang: true },
  { x: 86, y: 945, s: 0.5, tone: "bronze", node: <CompassRoseG letters={false} />, motion: spin(260) },
  // Right margin
  { x: 1538, y: 130, s: 0.6, tone: "bronze", node: <SunMoonG still />, motion: anim("float-y", 12, -4) },
  { x: 1520, y: 285, s: 0.42, tone: "bronze", node: <DottedBurstG />, motion: anim("twinkle", 9) },
  { x: 1534, y: 430, s: 0.58, tone: "moon", node: <OrbitG still />, motion: spin(200, true) },
  { x: 1506, y: 600, s: 0.72, rot: 70, tone: "cream", node: <g transform="translate(-50 -50)"><AsterismG asterism={CASSIOPEIA} lineOpacity={0.6} /></g> },
  { x: 1544, y: 760, s: 0.46, tone: "cream", node: <CrescentG deg={300} />, motion: anim("float-y", 10, -6) },
  { x: 1530, y: 900, s: 0.58, flip: true, rot: -12, tone: "moon", node: <LeafG />, motion: anim("sway", 10, -5), hang: true },
  // Second figure, top-left corner of the second pane.
  { x: 150, y: 40, s: 0.55, rot: -10, tone: "cream", node: <g transform="translate(-50 -50)"><AsterismG asterism={LYRA} lineOpacity={0.5} /></g> },
];

const TONE = { cream: "text-cream", bronze: "text-bronze", moon: "text-moon" } as const;

/** Place a w×h (design units) box centred on (x, y) in the 1600×1000 design box. */
const at = (x: number, y: number, w: number, h = w): CSSProperties => ({
  left: `${((x - w / 2) / W) * 100}%`,
  top: `${((y - h / 2) / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  height: `${(h / H) * 100}%`,
});

/**
 * The 1600×1000 design box laid over its pane the way an SVG with
 * preserveAspectRatio="xMidYMid slice" would be: covering it, centred, with
 * the overflow clipped. The pane is a size container, so cqw/cqh work.
 */
function Slice({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden [container-type:size]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "max(100cqw, 160cqh)", height: "max(100cqh, 62.5cqw)" }}>
        {children}
      </div>
    </div>
  );
}

// Faint mottled parchment (light theme only — its opacity token is 0 at night).
// The filter region is pinned to the tile and the noise frequencies × 640px are whole
// numbers, so the tiles stitch seamlessly.
const PARCHMENT =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='640'%3E%3Cfilter id='p' x='0' y='0' width='1' height='1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.00625 .0125' numOctaves='4' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .52 0 0 0 0 .4 0 0 0 0 .22 .8 0 0 0 -.34'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E\")";

/**
 * The fixed sky behind every page, in depth order:
 *   nebulae → parchment (day only) → distant stars → visible gold stars →
 *   margin ornaments → pointer constellations → gold dust → shooting stars.
 * Each layer drifts at its own parallax speed. Decorative only — never
 * intercepts input, and always sits behind content.
 */
export default function Starfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 4 — atmospheric nebulae (indigo by night, warm beige by day).
          Soft radial gradients with no blur filter, drifting on the GPU. */}
      <div
        className="absolute -left-[22%] -top-[28%] h-[85vh] w-[80vw] will-change-transform"
        style={{
          ...anim("nebula", 95),
          background: "radial-gradient(closest-side at 42% 46%, var(--nebula-a), transparent), radial-gradient(closest-side at 66% 62%, var(--nebula-c), transparent 80%)",
        }}
      />
      <div
        className="absolute -bottom-[32%] -right-[18%] h-[90vh] w-[75vw] will-change-transform"
        style={{ ...anim("nebula", 120, -45), background: "radial-gradient(closest-side at 50% 50%, var(--nebula-b), transparent), radial-gradient(closest-side at 30% 38%, var(--nebula-a), transparent 85%)" }}
      />
      {/* A faint warm-gold glow, like starlight caught in dust */}
      <div
        className="absolute left-[6%] top-[42%] hidden h-[40vh] w-[36vw] will-change-transform sm:block"
        style={{ ...anim("nebula", 105, -60), background: "radial-gradient(ellipse closest-side, var(--nebula-d), transparent)" }}
      />
      <div
        className="absolute right-[-12%] top-[26%] hidden h-[55vh] w-[48vw] will-change-transform sm:block"
        style={{ ...anim("nebula", 80, -20), background: "radial-gradient(ellipse closest-side, var(--nebula-c), transparent)" }}
      />

      {/* Parchment mottling and aged edges (day only) */}
      <div className="absolute inset-0" style={{ backgroundImage: PARCHMENT, backgroundSize: "640px 640px", opacity: "var(--parchment-opacity)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 55%, var(--vignette))" }} />

      {/* Layer 1 — distant stars, barely moving: a still majority and three breathing cohorts */}
      <ParallaxLoop speed={0.02}>
        <Slice>
          {COHORTS.map((c, k) => (
            <svg
              key={k}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={c ? { ...anim("twinkle-soft", c.dur, c.delay), opacity: "var(--star-opacity)" } : { opacity: "var(--star-opacity)" }}
            >
              <g fill="var(--star-color)">
                {DISTANT.filter((d) => d.cohort === k).map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={d.r} fillOpacity={d.o} className={d.mobile ? undefined : "max-sm:hidden"} />
                ))}
              </g>
            </svg>
          ))}
        </Slice>
      </ParallaxLoop>

      {/* Layer 2 — visible gold stars, each on its own rhythm */}
      <ParallaxLoop speed={0.06}>
        <Slice>
          <div className="absolute inset-0" style={{ opacity: "calc(0.4 + var(--star-opacity) * 0.6)" }}>
            {VISIBLE.map((v, i) => (
              <span key={i} data-sky-star="" className={cn("absolute", !v.mobile && "max-sm:hidden")} style={at(v.x, v.y, v.s * 100)}>
                <span className={cn("sky-core block h-full w-full", v.tone)}>
                  <span className="block h-full w-full" style={anim(v.anim, v.dur, v.delay)}>
                    <svg viewBox="-50 -50 100 100" className="block h-full w-full overflow-visible" fill="currentColor" fillOpacity={v.o}>
                      <StarShape shape={v.shape} />
                    </svg>
                  </span>
                </span>
              </span>
            ))}
          </div>
        </Slice>
      </ParallaxLoop>

      {/* Margin ornaments, drifting a little faster */}
      <ParallaxLoop speed={0.1}>
        <Slice>
          <div className="absolute inset-0" style={{ opacity: "var(--ornament-opacity)" }}>
            {ORNAMENTS.map((o, i) => {
              const [bx, by, bw, bh] = o.box ?? [-50, -50, 100, 100];
              return (
                <div key={i} className={cn("absolute", TONE[o.tone])} style={at(o.x, o.y, bw * o.s, bh * o.s)}>
                  <div className="h-full w-full" style={{ ...o.motion, transformOrigin: o.hang ? "50% 0%" : "50% 50%" }}>
                    <svg
                      viewBox={`${bx} ${by} ${bw} ${bh}`}
                      className="block h-full w-full overflow-visible"
                      style={o.rot || o.flip ? { transform: `rotate(${o.rot ?? 0}deg) scaleX(${o.flip ? -1 : 1})` } : undefined}
                    >
                      {o.node}
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </Slice>
      </ParallaxLoop>

      {/* Constellation lines drawn between stars near the pointer */}
      <SkyInteraction />

      {/* Layer 3 — gold dust in the foreground, fastest of all */}
      <ParallaxLoop speed={0.16}>
        <div className="absolute inset-0" style={{ opacity: "var(--dust-opacity)" }}>
          {/* Four drifting groups (one animation each, not one per mote), each
              with its own direction and pace; the motes inside are still. */}
          {DUST_GROUPS.map((g, k) => (
            <div
              key={k}
              className="absolute inset-0"
              style={{ ["--dx" as string]: `${g.dx}px`, ["--dy" as string]: `${g.dy}px`, ...anim("dust", g.dur, g.delay) }}
            >
              {DUST.filter((_, i) => i % DUST_GROUPS.length === k).map((d, i) => (
                <span
                  key={i}
                  data-sky-dust=""
                  className={`sky-dust absolute block rounded-full ${d.mobile ? "" : "max-sm:hidden"}`}
                  style={{
                    left: `${d.left}%`,
                    top: `${d.top}%`,
                    width: d.size,
                    height: d.size,
                    opacity: d.glow,
                    background: "radial-gradient(circle, var(--dust) 0%, transparent 72%)",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </ParallaxLoop>

      <ShootingStars />
    </div>
  );
}
