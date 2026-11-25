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
  SPARKLE_G,
  SunBurstG,
  SunMoonG,
} from "@/components/celestial/Ornaments";
import ParallaxLoop from "@/components/celestial/ParallaxLoop";
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
// Many pinpricks at different brightness; a few breathe very slightly.
// Every other one is dropped on phones.
const DISTANT = Array.from({ length: 240 }, (_, i) => ({
  x: r2(rand() * W),
  y: r2(rand() * H),
  r: rand() > 0.94 ? between(0.9, 1.25) : between(0.3, 0.8),
  o: between(0.18, 0.9),
  twinkle: i % 7 === 0 ? { dur: between(6, 14), delay: between(-14, 0) } : null,
  mobile: i % 2 === 0,
}));

// ─── Layer 2: visible stars ──────────────────────────────────────────────────
// A jittered 8×5 grid keeps them evenly spread (no clumps, no bald patches).
// These are the stars the pointer can wake (see SkyInteraction).
type Shape = "sparkle" | "eight" | "cross" | "ring";
const SHAPES: Shape[] = ["sparkle", "eight", "sparkle", "cross", "ring", "sparkle", "eight", "cross"];
const VISIBLE = Array.from({ length: 40 }, (_, i) => {
  const col = i % 8;
  const row = Math.floor(i / 8);
  const shape = SHAPES[Math.floor(rand() * SHAPES.length)];
  return {
    x: r2((col + 0.15 + rand() * 0.7) * (W / 8)),
    y: r2((row + 0.15 + rand() * 0.7) * (H / 5)),
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
const DUST = Array.from({ length: 26 }, (_, i) => ({
  left: r2(rand() * 100),
  top: r2(rand() * 100),
  size: between(1.5, 3.6),
  dx: Math.round((rand() - 0.5) * 80),
  dy: Math.round(-20 - rand() * 50),
  dur: between(18, 40),
  delay: between(-40, 0),
  mobile: i % 2 === 0,
}));

// ─── Ornaments (outer margins only) ──────────────────────────────────────────
type Orn = { x: number; y: number; s: number; rot?: number; flip?: boolean; tone: "cream" | "bronze" | "moon"; node: ReactNode };

// Art-directed placement: the pattern lives only in the outer margins
// (outside the 1240px content column on a typical laptop); the centre gets
// nothing but stars, so ornaments never drift behind text. Each motif
// appears once per side at most.
const PHASES = [0.14, 0.25, 0.38, 0.5];
const ORNAMENTS: Orn[] = [
  // Left margin
  { x: 72, y: 110, s: 0.6, tone: "bronze", node: <SunBurstG spin /> },
  { x: 62, y: 290, s: 0.62, tone: "moon", node: <g className="origin-self" style={anim("float-y", 11)}><MoonFaceG /></g> },
  { x: 84, y: 455, s: 0.52, tone: "cream", node: <g className="origin-top-self" style={anim("sway", 7)}><HangingCrescentG /></g> },
  {
    x: 70,
    y: 615,
    s: 0.62,
    tone: "cream",
    node: (
      // A column of moon phases, waxing downward.
      <g>
        {PHASES.map((p, i) => (
          <MoonPhaseG key={p} phase={p} r={13} style={{ transform: `translateY(${(i - 1.5) * 36}px)` }} />
        ))}
      </g>
    ),
  },
  { x: 58, y: 800, s: 0.6, rot: 18, tone: "moon", node: <g className="origin-top-self" style={anim("sway", 9, -3)}><LeafG /></g> },
  { x: 86, y: 945, s: 0.5, tone: "bronze", node: <g className="origin-self animate-spin-slower"><CompassRoseG letters={false} /></g> },
  // Right margin
  { x: 1538, y: 130, s: 0.6, tone: "bronze", node: <g className="origin-self" style={anim("float-y", 12, -4)}><SunMoonG /></g> },
  { x: 1520, y: 285, s: 0.42, tone: "bronze", node: <g className="origin-self" style={anim("twinkle", 9)}><DottedBurstG /></g> },
  { x: 1534, y: 430, s: 0.58, tone: "moon", node: <OrbitG /> },
  {
    x: 1506,
    y: 600,
    s: 0.72,
    rot: 70,
    tone: "cream",
    node: <g transform="translate(-50 -50)"><AsterismG asterism={CASSIOPEIA} lineOpacity={0.6} /></g>,
  },
  { x: 1544, y: 760, s: 0.46, tone: "cream", node: <g className="origin-self" style={anim("float-y", 10, -6)}><CrescentG deg={300} /></g> },
  { x: 1530, y: 900, s: 0.58, flip: true, rot: -12, tone: "moon", node: <g className="origin-top-self" style={anim("sway", 10, -5)}><LeafG /></g> },
  // Second figure, top-left corner of the second pane.
  { x: 150, y: 40, s: 0.55, rot: -10, tone: "cream", node: <g transform="translate(-50 -50)"><AsterismG asterism={LYRA} lineOpacity={0.5} /></g> },
];

const TONE = { cream: "text-cream", bronze: "text-bronze", moon: "text-moon" } as const;

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
      {/* Layer 4 — atmospheric nebulae (indigo by night, warm beige by day) */}
      <div
        className="absolute -left-[22%] -top-[28%] h-[85vh] w-[80vw] blur-3xl"
        style={{
          ...anim("nebula", 95),
          background: "radial-gradient(closest-side at 42% 46%, var(--nebula-a), transparent), radial-gradient(closest-side at 66% 62%, var(--nebula-c), transparent 80%)",
        }}
      />
      <div
        className="absolute -bottom-[32%] -right-[18%] h-[90vh] w-[75vw] blur-3xl"
        style={{ ...anim("nebula", 120, -45), background: "radial-gradient(closest-side at 50% 50%, var(--nebula-b), transparent), radial-gradient(closest-side at 30% 38%, var(--nebula-a), transparent 85%)" }}
      />
      <div
        className="absolute right-[-12%] top-[26%] hidden h-[55vh] w-[48vw] blur-3xl sm:block"
        style={{ ...anim("nebula", 80, -20), background: "radial-gradient(ellipse closest-side, var(--nebula-c), transparent)" }}
      />

      {/* Parchment mottling and aged edges (day only) */}
      <div className="absolute inset-0" style={{ backgroundImage: PARCHMENT, backgroundSize: "640px 640px", opacity: "var(--parchment-opacity)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 55%, var(--vignette))" }} />

      {/* Layer 1 — distant stars, barely moving */}
      <ParallaxLoop speed={0.02}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" style={{ opacity: "var(--star-opacity)" }}>
          <g fill="var(--star-color)">
            {DISTANT.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fillOpacity={s.o}
                className={s.mobile ? undefined : "max-sm:hidden"}
                style={s.twinkle ? anim("twinkle-soft", s.twinkle.dur, s.twinkle.delay) : undefined}
              />
            ))}
          </g>
        </svg>
      </ParallaxLoop>

      {/* Layer 2 — visible gold stars, each on its own rhythm */}
      <ParallaxLoop speed={0.06}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          style={{ opacity: "calc(0.4 + var(--star-opacity) * 0.6)" }}
        >
          <defs>
            <radialGradient id="sky-halo">
              <stop offset="0" style={{ stopColor: "var(--sky-halo)" }} />
              <stop offset="1" style={{ stopColor: "var(--sky-halo)", stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          {VISIBLE.map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y})`} data-sky-star="" className={s.mobile ? undefined : "max-sm:hidden"}>
              <circle className="sky-halo" r={22} fill="url(#sky-halo)" />
              <g className={`sky-core ${s.tone}`} fill="currentColor" fillOpacity={s.o}>
                <g transform={`scale(${s.s})`}>
                  <g className="origin-self" style={anim(s.anim, s.dur, s.delay)}>
                    <StarShape shape={s.shape} />
                  </g>
                </g>
              </g>
            </g>
          ))}
        </svg>
      </ParallaxLoop>

      {/* Margin ornaments, drifting a little faster */}
      <ParallaxLoop speed={0.1}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
          <g style={{ opacity: "var(--ornament-opacity)" }}>
            {ORNAMENTS.map((o, i) => (
              <g
                key={i}
                className={TONE[o.tone]}
                transform={`translate(${o.x} ${o.y}) rotate(${o.rot ?? 0}) scale(${o.flip ? -o.s : o.s} ${o.s})`}
              >
                {o.node}
              </g>
            ))}
          </g>
        </svg>
      </ParallaxLoop>

      {/* Constellation lines drawn between stars near the pointer */}
      <SkyInteraction />

      {/* Layer 3 — gold dust in the foreground, fastest of all */}
      <ParallaxLoop speed={0.16}>
        <div className="absolute inset-0" style={{ opacity: "var(--dust-opacity)" }}>
          {DUST.map((d, i) => (
            <span
              key={i}
              data-sky-dust=""
              className={`sky-dust absolute block rounded-full ${d.mobile ? "" : "max-sm:hidden"}`}
              style={{
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: d.size,
                height: d.size,
                background: "radial-gradient(circle, var(--dust) 0%, transparent 72%)",
                ["--dx" as string]: `${d.dx}px`,
                ["--dy" as string]: `${d.dy}px`,
                ...anim("dust", d.dur, d.delay),
              }}
            />
          ))}
        </div>
      </ParallaxLoop>

      <ShootingStars />
    </div>
  );
}
