"use client";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { Cloud, CompassG, DoubleCrescentG, SPARKLE_G, polar } from "@/components/celestial/Ornaments";
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

  const origin = { transformOrigin: `${CX}px ${CY}px` };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("relative mx-auto aspect-[520/680] w-full", className)}>
      <motion.svg
        viewBox="0 0 520 680"
        aria-hidden="true"
        focusable="false"
        style={{ x: backX, y: backY }}
        className="absolute inset-0 h-full w-full overflow-visible text-moon"
      >
        <defs>
          <radialGradient id="hero-foil" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="var(--foil-a)" />
            <stop offset="55%" stopColor="var(--foil-b)" />
            <stop offset="100%" stopColor="var(--foil-c)" />
          </radialGradient>
          <radialGradient id="hero-glow">
            <stop offset="0%" stopColor="var(--foil-a)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--foil-a)" stopOpacity="0" />
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

        {/* Sun: glow, counter-turning rays, foil disc, rings */}
        <circle cx={CX} cy={CY} r={200} fill="url(#hero-glow)" className="animate-glow" style={origin} />
        <motion.g
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease, delay: 0.25 }}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        >
          <g className="animate-spin-slow" style={origin}>
            <path d={FINE_RAYS} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
          </g>
          <g className="animate-spin-reverse" style={origin}>
            <path d={BOLD_RAYS} fill="currentColor" className="text-bronze" />
          </g>
        </motion.g>
        <circle cx={CX} cy={CY} r={118} fill="url(#hero-foil)" />
        <circle cx={CX} cy={CY} r={124} fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={131} fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="0.5 6" strokeLinecap="round" />

        {/* Crescents above and below */}
        {/* (Position on the outer group; the CSS entrance + float go on the inner one.) */}
        <g transform="translate(260 90) scale(0.62)" className="text-cream">
          <g style={{ animation: "rise-in 1.4s cubic-bezier(.22,1,.36,1) 0.6s both" }}>
            <DoubleCrescentG deg={180} className="origin-self" style={loop("float-y", 8)} />
          </g>
        </g>
        <g transform="translate(260 584) scale(0.62)" className="text-cream">
          <g style={{ animation: "rise-in 1.4s cubic-bezier(.22,1,.36,1) 0.8s both" }}>
            <DoubleCrescentG deg={0} className="origin-self" style={loop("float-y", 9, -3)} />
          </g>
        </g>

        {/* Hanging stars */}
        {PENDANTS.map((p, i) => {
          const top = archY(p.x);
          return (
            <g key={i} className="origin-top-self" style={loop("sway", p.sway, p.delay)}>
              <path
                d={`M${p.x} ${top}V${p.to}`}
                stroke="currentColor"
                strokeWidth="0.9"
                pathLength={1}
                className="draw-in"
                style={{ animationDelay: `${0.9 + i * 0.12}s`, animationDuration: "2.2s" }}
              />
              <g style={{ animation: `fade-in 1s ease ${1.8 + i * 0.12}s both` }}>
                <PendantEnd end={p.end} x={p.x} y={p.to} />
              </g>
            </g>
          );
        })}

        {/* Compass stars and sparkles */}
        <g transform="translate(112 548) scale(0.22)">
          <CompassG className="origin-self animate-spin-slow" />
        </g>
        <g transform="translate(410 176) scale(0.18)">
          <CompassG className="origin-self animate-spin-reverse" />
        </g>
        <g className="text-cream" fill="currentColor">
          {SPARKLES.map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.s})`}>
              <path d={SPARKLE_G} className="origin-self" style={loop("twinkle", 4 + (i % 4), s.d)} />
            </g>
          ))}
        </g>
      </motion.svg>

      {/* Engraved clouds framing the arch's corners, drifting */}
      <motion.div style={{ x: frontX, y: frontY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[10%] -top-[3%] w-[34%]" style={{ animation: "fade-in 1.6s ease 1s both" }}>
          <Cloud className="animate-cloud w-full -scale-x-100 [--cloud-shift:-14px]" style={{ animationDuration: "19s" }} />
        </div>
        <div className="absolute -left-[9%] bottom-[1%] w-[44%]" style={{ animation: "fade-in 1.6s ease 1.2s both" }}>
          <Cloud className="animate-cloud w-full [--cloud-shift:16px]" style={{ animationDuration: "23s" }} />
        </div>
        <div className="absolute -right-[8%] bottom-[5%] w-[38%]" style={{ animation: "fade-in 1.6s ease 1.4s both" }}>
          <Cloud className="animate-cloud w-full -scale-x-100 [--cloud-shift:-18px]" style={{ animationDuration: "27s", animationDelay: "-9s" }} />
        </div>
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
          className="group relative h-full w-full overflow-hidden rounded-full shadow-[0_0_0_3px_var(--foil-c),0_30px_60px_-25px_rgba(9,13,24,0.8)]"
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
          <span aria-hidden="true" className="absolute inset-[5px] rounded-full border border-[#fbe7a8]/45" />
        </motion.div>
      </motion.div>
    </div>
  );
}
