"use client";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { CompassG, DoubleCrescentG, SPARKLE_G, polar } from "@/components/celestial/Ornaments";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Composition box: 520 × 680. The sun (and portrait) sits at (CX, CY).
const CX = 260;
const CY = 330;
const PORTRAIT_R = 104;

const FINE_RAYS = Array.from({ length: 96 }, (_, i) => {
  const deg = i * 3.75;
  const len = 140 + ((i * 37) % 7) * 6 + (i % 4 === 0 ? 18 : 0);
  const [x1, y1] = polar(CX, CY, 122, deg);
  const [x2, y2] = polar(CX, CY, len, deg);
  return `M${x1} ${y1}L${x2} ${y2}`;
}).join("");

const BOLD_RAYS = Array.from({ length: 16 }, (_, i) => {
  const deg = i * 22.5;
  const tip = polar(CX, CY, i % 2 === 0 ? 182 : 154, deg);
  const a = polar(CX, CY, 120, deg - 2.4);
  const b = polar(CX, CY, 120, deg + 2.4);
  return `M${a.join(" ")}L${tip.join(" ")}L${b.join(" ")}Z`;
}).join("");

/** Height of the arch (r = 220, centre 260,260) at a given x. */
const archY = (x: number) => Math.round(260 - Math.sqrt(220 * 220 - (x - 260) ** 2));

type End = "sparkle" | "star" | "dot" | "drop";
const PENDANTS: { x: number; to: number; end: End; sway: number; delay: number }[] = [
  { x: 92, to: 500, end: "sparkle", sway: 7, delay: 0 },
  { x: 128, to: 430, end: "star", sway: 9, delay: -2 },
  { x: 168, to: 122, end: "dot", sway: 6, delay: -1 },
  { x: 352, to: 114, end: "dot", sway: 6.5, delay: -3 },
  { x: 392, to: 446, end: "star", sway: 8.5, delay: -4 },
  { x: 428, to: 520, end: "sparkle", sway: 7.5, delay: -1.5 },
];

const SPARKLES = [
  { x: 150, y: 196, s: 0.16, d: 0 },
  { x: 372, y: 128, s: 0.12, d: -1.4 },
  { x: 84, y: 338, s: 0.1, d: -2.2 },
  { x: 446, y: 392, s: 0.15, d: -3.1 },
  { x: 182, y: 626, s: 0.12, d: -0.6 },
  { x: 352, y: 640, s: 0.1, d: -2.7 },
  { x: 214, y: 478, s: 0.08, d: -1.9 },
  { x: 330, y: 206, s: 0.08, d: -3.6 },
  { x: 470, y: 600, s: 0.11, d: -4.2 },
  { x: 56, y: 600, s: 0.09, d: -2.4 },
];

const loop = (name: string, dur: number, delay = 0): CSSProperties => ({ animation: `${name} ${dur}s ease-in-out ${delay}s infinite` });

/** Place a w×h box (composition units) centred on (x, y) in the 520×680 composition. */
const at = (x: number, y: number, w: number, h = w): CSSProperties => ({
  left: `${((x - w / 2) / 520) * 100}%`,
  top: `${((y - h / 2) / 680) * 100}%`,
  width: `${(w / 520) * 100}%`,
  height: `${(h / 680) * 100}%`,
});
/** The sun's centre as a CSS transform-origin within the composition box. */
const SUN_ORIGIN = `50% ${(CY / 680) * 100}%`;

function PendantEnd({ end, x, y }: { end: End; x: number; y: number }): ReactNode {
  switch (end) {
    case "sparkle":
      return <path d={SPARKLE_G} transform={`translate(${x} ${y + 14}) scale(0.28)`} className="text-cream" fill="currentColor" />;
    case "star":
      return <CompassG className="text-cream" style={{ transform: `translate(${x}px, ${y + 11}px) scale(0.22)` }} />;
    case "drop":
      return <path d={`M${x} ${y}q-4 5.4 0 9.4 4-4 0-9.4Z`} fill="currentColor" />;
    default:
      return <circle cx={x} cy={y + 3} r={3} className="text-cream" fill="currentColor" />;
  }
}

type Props = { src?: string; alt: string; name: string; objectPosition?: string; motto?: string; className?: string };

/**
 * The hero centrepiece, after the arch illustration: an engraved arch with
 * the motto along its crown, a crescent above, the portrait set in a
 * gold-foil sun with turning rays, a crescent below, and hanging stars.
 * Leans gently toward the pointer.
 */
export default function HeroCelestial({ src, alt, name, objectPosition = "50% 30%", motto, className }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 70, damping: 18, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.6 });
  const backX = useTransform(px, (v) => v * -14);
  const backY = useTransform(py, (v) => v * -14);
  const frontX = useTransform(px, (v) => v * 10);
  const frontY = useTransform(py, (v) => v * 10);

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("relative mx-auto aspect-[520/680] w-full", className)}>
      {/* Back plane: leans away from the pointer. Everything that moves forever
          here is its own small layer animated on the GPU (transform/opacity),
          so the large drawing underneath is painted once and never repainted. */}
      <motion.div aria-hidden="true" style={{ x: backX, y: backY }} className="pointer-events-none absolute inset-0">
        {/* Sun glow, breathing */}
        <div
          className="animate-glow absolute rounded-full"
          style={{ ...at(CX, CY, 400), background: "radial-gradient(closest-side, color-mix(in oklab, var(--foil-a) 45%, transparent), transparent)" }}
        />

        {/* Counter-turning rays: two full-size layers rotating about the sun */}
        <motion.div
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease, delay: 0.25 }}
          className="absolute inset-0"
          style={{ transformOrigin: SUN_ORIGIN }}
        >
          <svg viewBox="0 0 520 680" className="animate-spin-slow absolute inset-0 h-full w-full overflow-visible text-moon" style={{ transformOrigin: SUN_ORIGIN }}>
            <path d={FINE_RAYS} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
          </svg>
          <svg viewBox="0 0 520 680" className="animate-spin-reverse absolute inset-0 h-full w-full overflow-visible text-bronze" style={{ transformOrigin: SUN_ORIGIN }}>
            <path d={BOLD_RAYS} fill="currentColor" />
          </svg>
        </motion.div>

        {/* The still drawing: arch, motto, foil disc and rings. The arch's legs
            fade out softly toward the bottom rather than stopping at the edge. */}
        <svg
          viewBox="0 0 520 680"
          focusable="false"
          className="absolute inset-0 h-full w-full overflow-visible text-moon"
          style={{ maskImage: "linear-gradient(to bottom, #000 80%, transparent 99%)" }}
        >
          <defs>
            <radialGradient id="hero-foil" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor="var(--foil-a)" />
              <stop offset="55%" stopColor="var(--foil-b)" />
              <stop offset="100%" stopColor="var(--foil-c)" />
            </radialGradient>
            <path id="hero-motto-arc" d={`M${polar(260, 260, 238, -64).join(" ")}A238 238 0 0 1 ${polar(260, 260, 238, 64).join(" ")}`} />
          </defs>

          {/* Arch */}
          <g fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M40 676V260A220 220 0 0 1 480 260V676" strokeWidth="1.2" pathLength={1} className="draw-in" />
            <path
              d="M54 676V260A206 206 0 0 1 466 260V676"
              strokeWidth="0.7"
              strokeDasharray="2 6"
              opacity="0.55"
              style={{ animation: "fade-in 1.4s ease 1.4s both" }}
            />
          </g>

          {/* Motto */}
          {motto && (
            <text
              className="fill-cream"
              style={{ fontFamily: "var(--font-caps)", fontSize: 15, letterSpacing: "0.42em", animation: "fade-in 1.8s ease 1.2s both" }}
            >
              <textPath href="#hero-motto-arc" startOffset="50%" textAnchor="middle">
                {motto.toUpperCase()}
              </textPath>
            </text>
          )}

          {/* Foil disc and rings */}
          <circle cx={CX} cy={CY} r={118} fill="url(#hero-foil)" />
          <circle cx={CX} cy={CY} r={124} fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={131} fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="0.5 6" strokeLinecap="round" />
        </svg>

        {/* Crescents above and below: rise in, then float */}
        {[
          { y: 90, deg: 180, dur: 8, delay: 0, enter: 0.6 },
          { y: 584, deg: 0, dur: 9, delay: -3, enter: 0.8 },
        ].map((c) => (
          <div key={c.y} className="absolute text-cream" style={{ ...at(CX, c.y, 62), animation: `rise-in 1.4s cubic-bezier(.22,1,.36,1) ${c.enter}s both` }}>
            <div className="h-full w-full" style={loop("float-y", c.dur, c.delay)}>
              <svg viewBox="-50 -50 100 100" className="block h-full w-full overflow-visible">
                <DoubleCrescentG deg={c.deg} />
              </svg>
            </div>
          </div>
        ))}

        {/* Hanging stars: each thread is its own small layer, swaying from the arch */}
        {PENDANTS.map((p, i) => {
          const top = archY(p.x);
          const len = p.to - top;
          return (
            <div
              key={i}
              className="absolute"
              style={{ left: `${((p.x - 20) / 520) * 100}%`, top: `${(top / 680) * 100}%`, width: `${(40 / 520) * 100}%`, height: `${((len + 30) / 680) * 100}%` }}
            >
              <div className="h-full w-full" style={{ ...loop("sway", p.sway, p.delay), transformOrigin: "50% 0%" }}>
                <svg viewBox={`-20 0 40 ${len + 30}`} className="block h-full w-full overflow-visible text-moon">
                  <path
                    d={`M0 0V${len}`}
                    stroke="currentColor"
                    strokeWidth="0.9"
                    pathLength={1}
                    className="draw-in"
                    style={{ animationDelay: `${0.9 + i * 0.12}s`, animationDuration: "2.2s" }}
                  />
                  <g style={{ animation: `fade-in 1s ease ${1.8 + i * 0.12}s both` }}>
                    <PendantEnd end={p.end} x={0} y={len} />
                  </g>
                </svg>
              </div>
            </div>
          );
        })}

        {/* Turning compass stars */}
        <div className="animate-spin-slow absolute text-moon" style={at(112, 548, 22)}>
          <svg viewBox="-50 -50 100 100" className="block h-full w-full overflow-visible">
            <CompassG />
          </svg>
        </div>
        <div className="animate-spin-reverse absolute text-moon" style={at(410, 176, 18)}>
          <svg viewBox="-50 -50 100 100" className="block h-full w-full overflow-visible">
            <CompassG />
          </svg>
        </div>

        {/* Twinkling sparkles */}
        {SPARKLES.map((sp, i) => (
          <div key={i} className="absolute text-cream" style={{ ...at(sp.x, sp.y, sp.s * 100), ...loop("twinkle", 4 + (i % 4), sp.d) }}>
            <svg viewBox="-50 -50 100 100" className="block h-full w-full overflow-visible" fill="currentColor">
              <path d={SPARKLE_G} />
            </svg>
          </div>
        ))}
      </motion.div>

      {/* Portrait in the sun */}
      <motion.div
        style={{
          x: frontX,
          y: frontY,
          left: `${((CX - PORTRAIT_R) / 520) * 100}%`,
          top: `${((CY - PORTRAIT_R) / 680) * 100}%`,
          width: `${((PORTRAIT_R * 2) / 520) * 100}%`,
        }}
        className="absolute aspect-square"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.45 }}
          className="group relative h-full w-full overflow-hidden rounded-full shadow-[0_0_0_3px_var(--foil-c),0_30px_60px_-25px_var(--shadow-deep)]"
        >
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(min-width: 1024px) 200px, 40vw"
              className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
              style={{ objectPosition }}
            />
          ) : (
            <div role="img" aria-label={alt} className="flex h-full w-full items-center justify-center bg-paper-2">
              <span className="display text-6xl text-moon">{name.trim().charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span aria-hidden="true" className="absolute inset-[5px] rounded-full border border-(--foil-a)/45" />
        </motion.div>
      </motion.div>
    </div>
  );
}
