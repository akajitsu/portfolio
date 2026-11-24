import type { CSSProperties, ReactNode } from "react";
import {
  CrescentG,
  DottedBurstG,
  HangingCrescentG,
  LeafG,
  MoonFaceG,
  SPARKLE_G,
  SunBurstG,
  TripleMoonG,
} from "@/components/celestial/Ornaments";
import ParallaxLoop from "@/components/celestial/ParallaxLoop";

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

const STARS = Array.from({ length: 130 }, (_, i) => {
  const big = rand() > 0.92;
  return {
    x: r2(rand() * W),
    y: r2(rand() * H),
    r: r2(big ? 1.3 + rand() * 0.6 : 0.45 + rand() * 0.7),
    o: r2(0.25 + rand() * 0.75),
    twinkle: i % 6 === 0 ? { dur: r2(4 + rand() * 5), delay: r2(rand() * -9) } : null,
  };
});

const SPARKLES = Array.from({ length: 26 }, () => ({
  x: r2(rand() * W),
  y: r2(rand() * H),
  s: r2(0.08 + rand() * 0.14),
  dur: r2(4 + rand() * 5),
  delay: r2(rand() * -9),
}));

const anim = (name: string, dur: number, delay = 0): CSSProperties => ({ animation: `${name} ${dur}s ease-in-out ${delay}s infinite` });

type Orn = { x: number; y: number; s: number; rot?: number; flip?: boolean; tone: "cream" | "bronze" | "moon"; node: ReactNode };

// Art-directed placement: the pattern lives only in the outer margins
// (outside the 1240px content column on a typical laptop); the centre gets
// nothing but stars and tiny sparkles, so ornaments never drift behind text.
const ORNAMENTS: Orn[] = [
  // Left margin
  { x: 72, y: 110, s: 0.6, tone: "bronze", node: <SunBurstG spin /> },
  { x: 62, y: 290, s: 0.62, tone: "moon", node: <g className="origin-self" style={anim("float-y", 11)}><MoonFaceG /></g> },
  { x: 84, y: 455, s: 0.52, tone: "cream", node: <g className="origin-top-self" style={anim("sway", 7)}><HangingCrescentG /></g> },
  { x: 70, y: 640, s: 0.5, tone: "cream", node: <TripleMoonG /> },
  { x: 58, y: 800, s: 0.6, rot: 18, tone: "moon", node: <g className="origin-top-self" style={anim("sway", 9, -3)}><LeafG /></g> },
  { x: 86, y: 945, s: 0.45, tone: "bronze", node: <g className="origin-self" style={anim("twinkle", 8, -2)}><DottedBurstG /></g> },
  // Right margin
  { x: 1538, y: 130, s: 0.62, flip: true, tone: "moon", node: <g className="origin-self" style={anim("float-y", 12, -4)}><MoonFaceG /></g> },
  { x: 1520, y: 285, s: 0.42, tone: "bronze", node: <g className="origin-self" style={anim("twinkle", 9)}><DottedBurstG /></g> },
  { x: 1534, y: 430, s: 0.56, tone: "bronze", node: <SunBurstG spin /> },
  { x: 1516, y: 600, s: 0.52, tone: "cream", node: <g className="origin-top-self" style={anim("sway", 8, -2)}><HangingCrescentG /></g> },
  { x: 1544, y: 760, s: 0.46, tone: "cream", node: <g className="origin-self" style={anim("float-y", 10, -6)}><CrescentG deg={300} /></g> },
  { x: 1530, y: 900, s: 0.58, flip: true, rot: -12, tone: "moon", node: <g className="origin-top-self" style={anim("sway", 10, -5)}><LeafG /></g> },
];

const TONE = { cream: "text-cream", bronze: "text-bronze", moon: "text-moon" } as const;

const SHOOTING = [
  { top: "14%", left: "78%", dur: 17, delay: 3 },
  { top: "38%", left: "96%", dur: 23, delay: 11 },
  { top: "8%", left: "48%", dur: 29, delay: 19 },
];

/**
 * The fixed night sky behind every page, after the pattern illustration:
 * a static star field, a slowly drifting layer of celestial ornaments,
 * twinkling sparkles, two light washes and the occasional shooting star.
 * Decorative only — never intercepts input.
 */
export default function Starfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Soft moving light */}
      <div
        className="animate-drift absolute -left-[20%] -top-[25%] h-[80vh] w-[80vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--glow-a), transparent)" }}
      />
      <div
        className="animate-drift absolute -bottom-[30%] -right-[15%] h-[85vh] w-[70vw] rounded-full blur-3xl [animation-delay:-11s]"
        style={{ background: "radial-gradient(closest-side, var(--glow-b), transparent)" }}
      />

      {/* Far layer: stars */}
      <ParallaxLoop speed={0.03}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" style={{ opacity: "var(--star-opacity)" }}>
          <g fill="var(--star-color)">
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fillOpacity={s.o}
                className={s.twinkle ? "origin-self" : undefined}
                style={s.twinkle ? anim("twinkle", s.twinkle.dur, s.twinkle.delay) : undefined}
              />
            ))}
          </g>
        </svg>
      </ParallaxLoop>

      {/* Near layer: ornaments and sparkles, drifting faster */}
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
          <g className="text-cream" fill="currentColor" style={{ opacity: "calc(var(--star-opacity) * 0.9)" }}>
            {SPARKLES.map((s, i) => (
              // Position on the group; the CSS twinkle transform goes on the path.
              <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.s})`}>
                <path d={SPARKLE_G} className="origin-self" style={anim("twinkle", s.dur, s.delay)} />
              </g>
            ))}
          </g>
        </svg>
      </ParallaxLoop>

      {/* Shooting stars */}
      {SHOOTING.map((s, i) => (
        <span key={i} className="absolute -rotate-[28deg]" style={{ top: s.top, left: s.left }}>
          <span
            className="block h-px w-36 bg-linear-to-r from-cream to-transparent opacity-0"
            style={{ animation: `shoot ${s.dur}s linear ${s.delay}s infinite` }}
          />
        </span>
      ))}
    </div>
  );
}
