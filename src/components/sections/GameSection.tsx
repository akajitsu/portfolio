"use client";
import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Crescent, EightStar, roman, SunBurst } from "@/components/celestial/Ornaments";
import GameCard from "@/components/ui/GameCard";
import type { GameCategory } from "@/types";
import { ease, inViewOnce } from "@/lib/motion";

const ROW = 44; // px — matches GameCard's h-11
const MARKERS = [3, 10, 5, 11, 1, 8, 11, 4, 9, 2, 7];

// A celestial symbol per category: sun · crescent · north star.
const SYMBOLS: Record<string, { mark: ReactNode; watermark: ReactNode; float: string }> = {
  popular: {
    mark: <SunBurst size={30} spin className="text-bronze" />,
    watermark: <SunBurst size={150} spin className="text-bronze" />,
    float: "float-y 9s ease-in-out 0s infinite",
  },
  indie: {
    mark: <Crescent size={22} className="-rotate-12 text-cream" />,
    watermark: <Crescent size={140} className="-rotate-12 text-cream" />,
    float: "float-y 11s ease-in-out -3.5s infinite",
  },
  "rpg-maker": {
    mark: <EightStar size={22} className="text-cream" />,
    watermark: <EightStar size={140} className="text-cream" />,
    float: "float-y 13s ease-in-out -7s infinite",
  },
};

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } } };
const row: Variants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };

type Props = {
  category: GameCategory;
  /** Plate number for the category (I, II, III…). */
  index: number;
  /** Show only the first N games (the home page shows a selection). */
  limit?: number;
  headingLevel?: "h3" | "h4";
};

/**
 * A category as a page of the celestial journal: a floating symbol, numeral,
 * title and note, then the index of games. Interacting with the category draws
 * a constellation through the row markers. One game is "active" at a time —
 * by mouse hover, keyboard focus or a tap (tap again, or tap elsewhere, to close).
 */
export default function GameSection({ category, index, limit, headingLevel: H = "h3" }: Props) {
  const games = limit ? category.games.slice(0, limit) : category.games;
  const [active, setActive] = useState<number | null>(null);
  const pointerType = useRef<string>("mouse");
  const focusedAt = useRef(0);
  const root = useRef<HTMLElement>(null);
  const symbol = SYMBOLS[category.id] ?? SYMBOLS["rpg-maker"];

  // A tap outside the category closes a preview opened by touch.
  useEffect(() => {
    if (active === null) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active]);

  const handlersFor = (i: number) => ({
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setActive(i),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setActive((a) => (a === i ? null : a)),
    onPointerDown: (e: React.PointerEvent) => {
      pointerType.current = e.pointerType;
    },
    onFocus: () => {
      focusedAt.current = performance.now();
      setActive(i);
    },
    onBlur: () => setActive((a) => (a === i ? null : a)),
    onClick: () => {
      if (pointerType.current === "mouse") return;
      // The tap that focused the row already opened it; a later tap toggles.
      if (performance.now() - focusedAt.current < 400) return setActive(i);
      setActive((a) => (a === i ? null : i));
    },
  });

  const points = games.map((_, i) => `${MARKERS[i % MARKERS.length] + 4.5} ${ROW * i + ROW / 2}`);
  const total = category.games.length;

  return (
    <section
      ref={root}
      aria-labelledby={`${category.id}-title`}
      data-lit={active !== null}
      className="group/cat relative"
    >
      {/* Category header */}
      <header className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-8 opacity-[0.06] transition-opacity duration-700 group-hover/cat:opacity-[0.11]"
          style={{ animation: symbol.float }}
        >
          {symbol.watermark}
        </span>
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-moon/40 bg-paper/40 transition-[border-color,box-shadow] duration-700 group-hover/cat:border-moon group-hover/cat:shadow-[0_0_24px_-4px_rgba(228,197,139,0.45)]"
          >
            <span className="flex" style={{ animation: symbol.float }}>
              {symbol.mark}
            </span>
          </span>
          <div>
            <p className="eyebrow text-mute">
              <span className="text-moon">{roman(index)}</span>
              <span aria-hidden="true"> · </span>
              {limit && limit < total ? `${games.length} of ${total}` : `${total} games`}
            </p>
            <H id={`${category.id}-title`} className="display mt-1 text-[1.9rem]">
              {category.title}
            </H>
          </div>
        </div>
        {/* Two lines reserved on wide screens so the three indexes start level. */}
        <p className="mt-3 text-sm italic leading-relaxed text-mute lg:min-h-[3.25em]">{category.blurb}</p>
        <div className="rule-fade mt-5" />
      </header>

      {/* Index of games, with the constellation drawn through its markers */}
      <div className="relative mt-3">
        <svg
          aria-hidden="true"
          width={20}
          height={ROW * games.length}
          className="pointer-events-none absolute left-0 top-0 overflow-visible text-moon"
        >
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            className="opacity-60 transition-[stroke-dashoffset] duration-[1600ms] ease-out [stroke-dashoffset:1] group-focus-within/cat:[stroke-dashoffset:0] group-hover/cat:[stroke-dashoffset:0] group-data-[lit=true]/cat:[stroke-dashoffset:0]"
          />
        </svg>
        <motion.ul variants={list} initial="hidden" whileInView="show" viewport={inViewOnce}>
          {games.map((g, i) => (
            <GameCard
              key={g.name}
              game={g}
              id={`${category.id}-${i}`}
              active={active === i}
              markerX={MARKERS[i % MARKERS.length]}
              handlers={handlersFor(i)}
              variants={row}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

