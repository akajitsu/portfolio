import type { CSSProperties } from "react";
import BackToTop from "@/components/layout/BackToTop";
import CelestialBand from "@/components/celestial/CelestialBand";
import { DoubleCrescentG, EightStar, SPARKLE_G, SunBurstG } from "@/components/celestial/Ornaments";
import { navigation } from "@/data/navigation";
import { profile, socials } from "@/data/profile";
import { isUsableLink } from "@/lib/utils";

/** Place a w-wide box centred on (x, y) in the emblem's 340×100 box (centred on 0). */
const at = (x: number, y: number, w: number): CSSProperties => ({
  left: `${((x + 170 - w / 2) / 340) * 100}%`,
  top: `${((y + 50 - w / 2) / 100) * 100}%`,
  width: `${(w / 340) * 100}%`,
  height: `${(w / 100) * 100}%`,
});

const SPARKS: [number, number, number, number][] = [
  [-150, -30, 12, 0],
  [-60, 36, 8, -2],
  [62, -38, 10, -1],
  [152, 28, 13, -3],
];

/**
 * Crescent · sun · crescent — the arch illustration's column, laid on its side.
 * Each piece is its own small layer, so floating and turning cost no repaints.
 */
function Emblem() {
  return (
    <div aria-hidden="true" className="relative aspect-[340/100] w-[260px] sm:w-[320px]">
      <div className="absolute text-cream" style={at(-105, 0, 55)}>
        <svg viewBox="-50 -50 100 100" className="animate-float block h-full w-full overflow-visible">
          <DoubleCrescentG deg={90} />
        </svg>
      </div>
      <div className="absolute text-bronze" style={at(0, 0, 100)}>
        <svg viewBox="-50 -50 100 100" className="animate-spin-slow block h-full w-full overflow-visible">
          <SunBurstG />
        </svg>
      </div>
      <div className="absolute text-cream" style={at(105, 0, 55)}>
        <svg viewBox="-50 -50 100 100" className="animate-float block h-full w-full overflow-visible [animation-delay:-4s]">
          <DoubleCrescentG deg={270} />
        </svg>
      </div>
      {SPARKS.map(([x, y, w, d], i) => (
        <div key={i} className="absolute text-cream" style={at(x, y, w)}>
          <svg viewBox="-50 -50 100 100" className="animate-twinkle block h-full w-full overflow-visible" fill="currentColor" style={{ animationDelay: `${d}s` }}>
            <path d={SPARKLE_G} />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const liveSocials = socials.filter((s) => isUsableLink(s.href));
  const linkCls = "link-gold text-sm text-mute transition-colors duration-300 hover:text-accent";

  return (
    <footer className="relative mt-16 overflow-x-clip">
      <CelestialBand />

      <div className="relative isolate flex justify-center pb-4 pt-14">
        <Emblem />
      </div>

      <div className="shell grid gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="display flex items-center gap-3 text-6xl">
            {profile.shortName}
            <EightStar size={20} className="animate-twinkle text-moon [animation-duration:5s]" />
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mute">{profile.tagline}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-4">Menu</p>
          <ul className="space-y-2.5">
            {navigation.map((n) => (
              <li key={n.id}>
                <a href={n.id === "home" ? "/" : `/#${n.id}`} className={linkCls}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow mb-4">Connect</p>
          <ul className="space-y-2.5">
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className={linkCls}>
                  Email
                </a>
              </li>
            )}
            {liveSocials.map((s) => (
              <li key={s.platform}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {s.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell">
        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-moon/25 py-6 sm:flex-row sm:items-center">
          <p className="label">
            © {year} {profile.name} · Designed &amp; built with Next.js
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
