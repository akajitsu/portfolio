import type { CSSProperties, ReactNode } from "react";
import { OrnamentRule, Sparkle } from "@/components/celestial/Ornaments";
import GameSection from "@/components/sections/GameSection";
import FadeIn from "@/components/ui/FadeIn";
import SplitText from "@/components/ui/SplitText";
import { gameCategories } from "@/data/games";
import { cn } from "@/lib/utils";

// Golden stars, each on its own rhythm so no two pulse together. Kept to the
// edges and the gutters between columns, away from the text.
const STARS: { pos: CSSProperties; size: number; dur: number; delay: number; lg?: boolean }[] = [
  { pos: { right: "4%", top: "2%" }, size: 13, dur: 4.6, delay: 0, lg: true },
  { pos: { right: "14%", top: "11%" }, size: 7, dur: 6.3, delay: -2.1, lg: true },
  { pos: { right: "24%", top: "1%" }, size: 9, dur: 5.4, delay: -3.7, lg: true },
  { pos: { left: "33.3%", top: "46%" }, size: 8, dur: 7.1, delay: -1.2, lg: true },
  { pos: { left: "66.6%", top: "62%" }, size: 10, dur: 5.9, delay: -4.4, lg: true },
  { pos: { right: "1%", bottom: "6%" }, size: 9, dur: 6.8, delay: -0.6 },
  { pos: { left: "-1%", bottom: "30%" }, size: 7, dur: 4.9, delay: -2.8 },
];

const SHOOTING = [
  { top: "6%", left: "88%", dur: 13, delay: 4 },
  { top: "52%", left: "70%", dur: 19, delay: 11 },
];

type Props = {
  /** Heading level for "Games I love" (h3 inside the home About section, h2 on /about). */
  level?: "h2" | "h3";
  /** Show only the first N games per category (home page). */
  limit?: number;
  /** Optional element beside the heading, e.g. a "Full list" link. */
  aside?: ReactNode;
  className?: string;
};

/**
 * "Games I love" as a page from a celestial journal: an engraved heading and
 * note, then one page per category (sun · crescent · north star) with its index
 * of games. Golden stars twinkle independently behind it, with the odd
 * shooting star.
 */
export default function GamesJournal({ level: H = "h3", limit, aside, className }: Props) {
  const shown = gameCategories.reduce((n, c) => n + (limit ? Math.min(limit, c.games.length) : c.games.length), 0);

  return (
    <div className={cn("relative isolate", className)}>
      {/* Decorative sky for this section */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 overflow-hidden">
        {STARS.map((s, i) => (
          <Sparkle
            key={i}
            size={s.size}
            className={cn("absolute text-cream/80", s.lg && "hidden lg:block")}
            style={{ ...s.pos, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }}
          />
        ))}
        {SHOOTING.map((s, i) => (
          <span key={i} className="absolute hidden -rotate-[28deg] sm:block" style={{ top: s.top, left: s.left }}>
            <span className="block h-px w-28 bg-linear-to-r from-cream to-transparent opacity-0" style={{ animation: `shoot ${s.dur}s linear ${s.delay}s infinite` }} />
          </span>
        ))}
      </div>

      <FadeIn y={0} duration={1.2}>
        <OrnamentRule align="start" />
      </FadeIn>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <FadeIn y={8}>
            <p className="eyebrow">
              {shown} worlds <span aria-hidden="true">·</span> {gameCategories.length} constellations
            </p>
          </FadeIn>
          <H className="display mt-2 text-[clamp(2.3rem,4.2vw,3.3rem)]">
            <SplitText text="Games I love" />
          </H>
          <FadeIn delay={0.2}>
            <p className="display mt-3 text-[1.3rem] font-normal italic leading-snug text-mute">
              A little universe of mine — different worlds, different stories, and countless hours spent exploring them.
            </p>
          </FadeIn>
        </div>
        {aside && <FadeIn delay={0.25}>{aside}</FadeIn>}
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-3 lg:gap-12">
        {gameCategories.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.12} className="max-w-xl lg:max-w-none">
            <GameSection category={c} index={i + 1} limit={limit} headingLevel={H === "h2" ? "h3" : "h4"} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
