import type { CSSProperties, ReactNode } from "react";
import { CompassG, DottedBurstG, HangingCrescentG, SPARKLE_G, SunBurstG } from "@/components/celestial/Ornaments";
import { cn } from "@/lib/utils";

type Drop = { x: number; len: number; end: ReactNode; sway: number; delay: number };

const sparkle = (s: number, tone = "text-cream") => (
  <path d={SPARKLE_G} transform={`scale(${s})`} fill="currentColor" className={tone} />
);

// Two arrangements, alternated by section so neighbours never repeat.
const SETS: Drop[][] = [
  [
    { x: 30, len: 70, end: sparkle(0.16), sway: 6, delay: 0 },
    { x: 70, len: 130, end: <g className="text-cream" transform="translate(0 -6) scale(0.5)"><HangingCrescentG /></g>, sway: 8, delay: -2 },
    { x: 112, len: 46, end: <circle cy={-4} r={2.6} fill="currentColor" className="text-cream" />, sway: 5, delay: -1 },
  ],
  [
    { x: 26, len: 50, end: <circle cy={-4} r={2.6} fill="currentColor" className="text-cream" />, sway: 5.5, delay: -1 },
    { x: 66, len: 110, end: <g className="text-bronze" transform="translate(0 14) scale(0.44)"><SunBurstG /></g>, sway: 9, delay: 0 },
    { x: 108, len: 78, end: <g className="text-moon" transform="translate(0 2) scale(0.2)"><CompassG /></g>, sway: 7, delay: -3 },
  ],
  [
    { x: 30, len: 92, end: <g className="text-bronze" transform="translate(0 6) scale(0.3)"><DottedBurstG /></g>, sway: 7.5, delay: -2 },
    { x: 72, len: 52, end: sparkle(0.2), sway: 6, delay: 0 },
    { x: 110, len: 120, end: sparkle(0.13), sway: 8.5, delay: -4 },
  ],
];

const sway = (dur: number, delay: number): CSSProperties => ({ animation: `sway ${dur}s ease-in-out ${delay}s infinite` });

/**
 * Ornaments hanging on fine threads — the pendants of the arch illustration.
 * Each thread draws down, its ornament fades in, then it sways gently. Every
 * thread is its own small layer swaying on the GPU, so nothing is repainted.
 */
export default function Pendants({ variant = 0, className }: { variant?: number; className?: string }) {
  const set = SETS[variant % SETS.length];
  return (
    <div aria-hidden="true" className={cn("relative aspect-[140/210] text-moon", className)}>
      {set.map((d, i) => {
        const h = d.len + 60;
        return (
          <div key={i} className="absolute top-0" style={{ left: `${((d.x - 20) / 140) * 100}%`, width: `${(40 / 140) * 100}%`, height: `${(h / 210) * 100}%` }}>
            <div className="h-full w-full" style={{ ...sway(d.sway, d.delay), transformOrigin: "50% 0%" }}>
              <svg viewBox={`-20 0 40 ${h}`} className="block h-full w-full overflow-visible">
                <path d={`M0 0V${d.len}`} stroke="currentColor" strokeWidth={0.8} pathLength={1} className="draw-in" style={{ animationDelay: `${0.2 + i * 0.15}s`, animationDuration: "1.8s" }} />
                <g transform={`translate(0 ${d.len + 8})`} style={{ animation: `fade-in 1s ease ${0.9 + i * 0.15}s both` }}>
                  {d.end}
                </g>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
