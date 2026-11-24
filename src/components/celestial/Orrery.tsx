import { polar } from "@/components/celestial/Ornaments";
import { cn } from "@/lib/utils";

const ORBITS = [
  { r: 46, planet: 3.2, start: 40, dur: 70 },
  { r: 78, planet: 4.2, start: 200, dur: 120 },
  { r: 112, planet: 2.6, start: 300, dur: 190 },
];
const RAYS = Array.from({ length: 16 }, (_, i) => {
  const [x1, y1] = polar(0, 0, 15, i * 22.5);
  const [x2, y2] = polar(0, 0, i % 2 ? 20 : 25, i * 22.5);
  return { x1, y1, x2, y2 };
});

/** A small engraved orrery: a sun with three planets on slow orbits. */
export default function Orrery({ className }: { className?: string }) {
  return (
    <svg viewBox="-130 -130 260 260" aria-hidden="true" focusable="false" className={cn("text-moon", className)} fill="none" stroke="currentColor">
      <circle r="124" strokeWidth="0.5" strokeOpacity="0.35" strokeDasharray="1 4" />
      {ORBITS.map((o, i) => {
        const [px, py] = polar(0, 0, o.r, o.start);
        return (
          <g key={i}>
            <circle r={o.r} strokeWidth="0.6" strokeOpacity="0.45" />
            <g style={{ transformOrigin: "0px 0px", animation: `spin ${o.dur}s linear infinite` }}>
              <circle cx={px} cy={py} r={o.planet} fill="currentColor" stroke="none" />
              {i === 1 && <circle cx={px} cy={py} r={o.planet + 4} strokeWidth="0.5" strokeOpacity="0.7" />}
            </g>
          </g>
        );
      })}
      {/* Sun */}
      <circle r="9" strokeWidth="0.9" />
      <circle r="4" fill="currentColor" stroke="none" />
      {RAYS.map((r, i) => (
        <line key={i} {...r} strokeWidth="0.7" strokeOpacity="0.8" />
      ))}
    </svg>
  );
}
