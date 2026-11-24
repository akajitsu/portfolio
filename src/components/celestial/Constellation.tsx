import { cn } from "@/lib/utils";

type Point = [number, number];

/**
 * A constellation that draws itself in once. Coordinates are in a 100×100 box.
 * `edges` are pairs of indices into `points`.
 */
export function Constellation({
  points,
  edges,
  className,
  delay = 0.6,
}: {
  points: Point[];
  edges: [number, number][];
  className?: string;
  delay?: number;
}) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cn("overflow-visible text-moon", className)}>
      <g stroke="currentColor" strokeWidth="0.35" strokeOpacity="0.55" fill="none">
        {edges.map(([a, b], i) => (
          <path
            key={i}
            d={`M${points[a].join(" ")}L${points[b].join(" ")}`}
            pathLength={1}
            className="draw-in"
            style={{ animationDelay: `${delay + i * 0.18}s` }}
          />
        ))}
      </g>
      <g fill="currentColor">
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.3 : 0.85} />
        ))}
      </g>
    </svg>
  );
}
