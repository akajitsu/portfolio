import { AsterismG, EIGHT_STAR_G, URSA_MINOR } from "@/components/celestial/Ornaments";
import { cn } from "@/lib/utils";

// Ursa Minor sits in a 100×100 box; the whole figure is offset by (10, 10)
// inside a 0…120 viewBox, so Polaris is at (24, 22) in viewBox units.
const POLARIS = { x: URSA_MINOR.stars[0].x + 10, y: URSA_MINOR.stars[0].y + 10 };

/**
 * The north star: Ursa Minor hanging from Polaris, which glows at the tip of
 * its handle. The constellation sways slowly about the pole star, the way
 * circumpolar stars turn around it, and its lines brighten when the parent
 * `group/contact` is hovered. Faint declination circles ring the pole.
 */
export default function NorthStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className={cn("overflow-visible text-moon", className)}>
      <defs>
        <radialGradient id="polaris-halo">
          <stop offset="0" style={{ stopColor: "var(--sky-halo)" }} />
          <stop offset="1" style={{ stopColor: "var(--sky-halo)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Declination circles around the pole */}
      <g fill="none" stroke="currentColor" strokeWidth={0.35} strokeOpacity={0.35} strokeDasharray="0.8 2.2">
        <circle cx={POLARIS.x} cy={POLARIS.y} r={32} />
        <circle cx={POLARIS.x} cy={POLARIS.y} r={62} />
      </g>

      {/* The figure, turning a little about Polaris */}
      <g style={{ transformOrigin: `${POLARIS.x}px ${POLARIS.y}px`, animation: "circumpolar 46s ease-in-out infinite" }}>
        <g transform="translate(10 10)">
          <AsterismG
            asterism={URSA_MINOR}
            lineOpacity={0.5}
            linesClassName="transition-[stroke-opacity] duration-700 group-hover/contact:[stroke-opacity:0.95]"
          />
        </g>
      </g>

      {/* Polaris */}
      <g transform={`translate(${POLARIS.x} ${POLARIS.y})`}>
        <circle r={13} fill="url(#polaris-halo)" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "breathe 7s ease-in-out infinite" }} />
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
  );
}
