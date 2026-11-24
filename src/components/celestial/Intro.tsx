import { crescentPath, polar } from "@/components/celestial/Ornaments";

const RAYS = Array.from({ length: 24 }, (_, i) => {
  const deg = i * 15;
  const [x1, y1] = polar(0, 0, 20, deg);
  const [x2, y2] = polar(0, 0, i % 2 === 0 ? 46 : 34, deg);
  return { d: `M${x1} ${y1}L${x2} ${y2}`, delay: 0.05 + (i % 12) * 0.035 };
});

/**
 * First-visit intro: a sun draws its rays, two crescents settle, then the
 * curtain lifts. Pure CSS (no JS needed to dismiss it), skipped for the rest
 * of the session via `data-intro="off"`, and never shown with reduced motion.
 */
export default function Intro() {
  return (
    <div aria-hidden="true" className="intro pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-paper">
      <svg viewBox="-80 -80 160 160" className="w-40 text-moon">
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          {RAYS.map((r, i) => (
            <path key={i} d={r.d} pathLength={1} className="intro-ray" style={{ animationDelay: `${r.delay}s` }} />
          ))}
        </g>
        <circle r="15" className="intro-fade" fill="var(--foil-b)" style={{ animationDelay: "0.35s" }} />
        <circle r="19" fill="none" stroke="currentColor" strokeWidth="1" className="intro-fade" style={{ animationDelay: "0.45s" }} />
        <path d={crescentPath(0, -64, 11, 5, 9.4, 180)} className="intro-fade text-cream" fill="currentColor" style={{ animationDelay: "0.6s" }} />
        <path d={crescentPath(0, 64, 11, 5, 9.4, 0)} className="intro-fade text-cream" fill="currentColor" style={{ animationDelay: "0.7s" }} />
      </svg>
    </div>
  );
}
