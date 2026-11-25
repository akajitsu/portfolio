"use client";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { Sparkle } from "@/components/celestial/Ornaments";
import type { Game } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  game: Game;
  id: string;
  active: boolean;
  /** Horizontal offset of the star marker (px) — feeds the constellation line. */
  markerX: number;
  /** Entrance animation, staggered by the parent list. */
  variants?: Variants;
  /** Event wiring from the parent category, which owns the active state. */
  handlers: {
    onPointerEnter: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    onPointerDown: (e: React.PointerEvent) => void;
    onFocus: () => void;
    onBlur: () => void;
    onClick: () => void;
  };
};

/**
 * One entry in the journal's index: star marker · title · dotted leader · genre.
 * When active (hover, keyboard focus or tap) the title lifts with a gold glow
 * and the game's official artwork rises above it in a small framed plate.
 * The plate floats, so the list layout never shifts.
 */
export default function GameCard({ game, id, active, markerX, handlers, variants }: Props) {
  const previewId = `${id}-art`;
  return (
    <motion.li variants={variants} className={cn("relative h-11", active && "z-20")}>
      <button
        type="button"
        {...handlers}
        aria-expanded={game.art ? active : undefined}
        aria-controls={game.art ? previewId : undefined}
        className="relative flex h-full w-full items-center gap-2.5 rounded-md text-left focus-visible:outline-offset-2"
      >
        {/* Soft gold glow behind the row */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-x-3 inset-y-0.5 rounded-lg bg-[radial-gradient(closest-side,var(--row-glow),transparent)] transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <span aria-hidden="true" className="relative h-full w-5 shrink-0">
          <Sparkle
            size={9}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 transition-[color,scale,filter] duration-500 ease-out-expo",
              active ? "scale-150 text-cream drop-shadow-[0_0_6px_var(--star-glow)]" : "text-moon/55",
            )}
            style={{ left: markerX }}
          />
        </span>
        <span
          className={cn(
            "display min-w-0 truncate text-[1.22rem] leading-tight transition-[color,translate,text-shadow] duration-500 ease-out-expo",
            active ? "-translate-y-px translate-x-1.5 text-accent [text-shadow:0_0_18px_var(--text-glow)]" : "text-ink",
          )}
        >
          {game.name}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "mb-1 min-w-4 flex-1 self-end border-b border-dotted transition-colors duration-500",
            active ? "border-moon/70" : "border-moon/25",
          )}
        />
        <span className={cn("shrink-0 whitespace-nowrap text-xs transition-colors duration-500", active ? "text-accent" : "text-mute")}>
          {game.genre}
        </span>
      </button>

      {game.art && (
        <span
          id={previewId}
          aria-hidden={!active}
          className={cn(
            "pointer-events-none absolute bottom-[calc(100%-2px)] right-0 block w-[min(190px,62%)] origin-bottom-right rounded-[10px] border border-moon/60 bg-night p-[3px] shadow-[0_18px_40px_-18px_var(--shadow-deep),0_0_28px_-8px_var(--text-glow)] transition-[opacity,translate,scale] duration-500 ease-out-expo",
            active ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0",
          )}
        >
          <span className="relative block aspect-[460/215] overflow-hidden rounded-[7px]">
            <Image src={game.art} alt={`${game.name} official artwork`} fill sizes="190px" className="object-cover" />
          </span>
        </span>
      )}
    </motion.li>
  );
}
