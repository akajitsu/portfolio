import { AsterismG, EIGHT_STAR_G, URSA_MINOR } from "@/components/celestial/Ornaments";
import { cn } from "@/lib/utils";

// Ursa Minor sits in a 100×100 box; the whole figure is offset by (10, 10)
// inside a 0…120 viewBox, so Polaris is at (24, 22) in viewBox units.
const POLARIS = { x: URSA_MINOR.stars[0].x + 10, y: URSA_MINOR.stars[0].y + 10 };
/** Polaris as a CSS position / transform-origin within the 120-unit square. */
const AT_POLARIS = `${(POLARIS.x / 120) * 100}% ${(POLARIS.y / 120) * 100}%`;
const pct = (v: number) => `${(v / 120) * 100}%`;

const MOTES: [number, number, number, number][] = [
  [-9, -6, 1.2, 6],
  [11, -10, 1, 8],
  [-13, 8, 1.1, 7],
  [8, 12, 1.3, 9],
  [16, 3, 0.9, 5.5],
  [-4, 15, 1, 10],
];

/**
 * The north star: Ursa Minor hanging from Polaris, which glows at the tip of
 * its handle. The constellation sways slowly about the pole star, the way
 * circumpolar stars turn around it, and its lines brighten when the parent
 * `group/contact` is hovered. Faint declination circles ring the pole.
 *
 * Built in layers: everything that moves (the swaying figure, the breathing
 * halo, the drifting motes) is its own element animated on the GPU, over a
 * still drawing — so nothing is repainted frame by frame.
 */
export default function NorthStar({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative aspect-square text-moon", className)}>
      {/* Declination circles around the pole (still) */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full overflow-visible">
        <g fill="none" stroke="currentColor" strokeWidth={0.35} strokeOpacity={0.35} strokeDasharray="0.8 2.2">
          <circle cx={POLARIS.x} cy={POLARIS.y} r={32} />
          <circle cx={POLARIS.x} cy={POLARIS.y} r={62} />
        </g>
      </svg>

      {/* The figure, turning a little about Polaris */}
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ transformOrigin: AT_POLARIS, animation: "circumpolar 46s ease-in-out infinite" }}
      >
        <g transform="translate(10 10)">
          <AsterismG asterism={URSA_MINOR} lineOpacity={0.5} linesClassName="transition-[stroke-opacity] duration-700 group-hover/contact:[stroke-opacity:0.95]" />
        </g>
      </svg>

      {/* Polaris's halo, breathing */}
      <span
        className="absolute rounded-full"
        style={{
          left: pct(POLARIS.x - 13),
          top: pct(POLARIS.y - 13),
          width: pct(26),
          height: pct(26),
          background: "radial-gradient(closest-side, var(--sky-halo), transparent)",
          animation: "breathe 7s ease-in-out infinite",
        }}
      />

      {/* Motes of light drifting around the pole star */}
      {MOTES.map(([dx, dy, size, dur], k) => (
        <span
          key={k}
          className="absolute rounded-full bg-cream"
          style={{
            left: pct(POLARIS.x + dx - size / 2),
            top: pct(POLARIS.y + dy - size / 2),
            width: pct(size),
            height: pct(size),
            animation: `mote-drift ${dur}s ease-in-out ${-k * 1.3}s infinite`,
          }}
        />
      ))}

      {/* Polaris and its label (still) */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full overflow-visible">
        <g transform={`translate(${POLARIS.x} ${POLARIS.y})`}>
          <path d="M0 -17V17M-17 0H17" stroke="currentColor" strokeWidth={0.35} strokeOpacity={0.7} />
          <g transform="scale(0.12)" className="text-cream" fill="currentColor">
            <path d={EIGHT_STAR_G.solid} />
            <path d={EIGHT_STAR_G.light} opacity={0.5} />
          </g>
        </g>
        <g fill="currentColor" style={{ fontFamily: "var(--font-caps)" }}>
          <text x={POLARIS.x + 10} y={POLARIS.y - 7} fontSize={4.6} letterSpacing={0.8}>
            POLARIS
          </text>
          <text x={POLARIS.x + 10} y={POLARIS.y - 1.5} fontSize={3.4} letterSpacing={0.3} opacity={0.75}>
            {/* Bayer letter in the serif: the engraved capitals have no Greek */}
            <tspan style={{ fontFamily: "var(--font-display)" }} fontSize={4.4}>
              α
            </tspan>{" "}
            UMi · +89° 15′
          </text>
        </g>
      </svg>
    </div>
  );
}
