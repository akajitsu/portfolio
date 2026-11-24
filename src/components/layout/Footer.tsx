import BackToTop from "@/components/layout/BackToTop";
import CelestialBand from "@/components/celestial/CelestialBand";
import { Cloud, DoubleCrescentG, EightStar, SPARKLE_G, SunBurstG } from "@/components/celestial/Ornaments";
import { navigation } from "@/data/navigation";
import { profile, socials } from "@/data/profile";
import { isUsableLink } from "@/lib/utils";

/** Crescent · sun · crescent — the arch illustration's column, laid on its side. */
function Emblem() {
  return (
    <svg viewBox="-170 -50 340 100" aria-hidden="true" focusable="false" className="w-[260px] overflow-visible sm:w-[320px]">
      <g transform="translate(-105 0) scale(0.55)" className="text-cream">
        <g className="origin-self animate-float">
          <DoubleCrescentG deg={90} />
        </g>
      </g>
      <g className="text-bronze">
        <SunBurstG spin />
      </g>
      <g transform="translate(105 0) scale(0.55)" className="text-cream">
        <g className="origin-self animate-float [animation-delay:-4s]">
          <DoubleCrescentG deg={270} />
        </g>
      </g>
      <g className="text-cream" fill="currentColor">
        {[
          [-150, -30, 0.12, 0],
          [-60, 36, 0.08, -2],
          [62, -38, 0.1, -1],
          [152, 28, 0.13, -3],
        ].map(([x, y, s, d], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path d={SPARKLE_G} className="origin-self animate-twinkle" style={{ animationDelay: `${d}s` }} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const liveSocials = socials.filter((s) => isUsableLink(s.href));
  const linkCls = "text-sm text-mute transition-colors duration-300 hover:text-accent";

  return (
    <footer className="relative mt-16 overflow-x-clip">
      <CelestialBand />

      <div className="relative isolate flex justify-center pb-4 pt-14">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-8 -z-10 w-[200px] sm:-left-8 sm:w-[260px]">
          <Cloud className="animate-cloud w-full [--cloud-shift:30px]" style={{ animationDuration: "28s" }} />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-12 -z-10 w-[190px] -scale-x-100 sm:-right-8 sm:w-[240px]">
          <Cloud className="animate-cloud w-full [--cloud-shift:-24px]" style={{ animationDuration: "33s", animationDelay: "-10s" }} />
        </div>
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
