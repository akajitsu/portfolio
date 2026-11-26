"use client";
import { useEffect, useId, useRef, useState } from "react";
import { EightStar } from "@/components/celestial/Ornaments";
import { cn } from "@/lib/utils";

type Props = {
  /** Common name, e.g. "Sirius". */
  name: string;
  /** Bayer designation, e.g. "α Canis Majoris". */
  designation: string;
  /** J2000 coordinates, e.g. "06h 45m 09s". */
  ra: string;
  dec: string;
  /** One short, true note about the star. */
  note: string;
  /** Position inside a `relative` parent, e.g. "left-[56%] top-[58%]". */
  className?: string;
  /** Draw the star itself, or (false) only the hotspot over a star drawn elsewhere. */
  showGlyph?: boolean;
  /** Where the note opens relative to the star. */
  align?: "center" | "start" | "end";
  side?: "top" | "bottom";
  /** Offsets the hint ripple so several stars don't pulse together. */
  hintDelay?: number;
};

/**
 * A "discoverable" star: a small star with a ripple that hints it can be
 * explored. Hover, focus or tap it to open a short note — its name,
 * designation, coordinates and one fact — like an annotation in the margin
 * of a star atlas. Escape or tapping elsewhere closes it.
 */
export default function DiscoveryStar({ name, designation, ra, dec, note, className, showGlyph = true, align = "center", side = "top", hintDelay = 0 }: Props) {
  const [open, setOpenState] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const openedAt = useRef(0);
  const setOpen = (v: boolean) => {
    if (v) openedAt.current = performance.now();
    setOpenState(v);
  };
  // Hover and focus open the note just before the click arrives, so a click
  // only closes it once it has been open for a moment (otherwise it toggles).
  const onClick = () => setOpen(!(open && performance.now() - openedAt.current > 400));
  const id = useId();

  // Close on a tap/click anywhere else, or on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpenState(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenState(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={root} className={cn("absolute z-10", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={id}
        onClick={onClick}
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="group/disc absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-moon dark:text-cream"
      >
        <span className="sr-only">{name}: star note</span>
        {/* Hint: a ring that ripples out every few seconds */}
        <span
          aria-hidden="true"
          className="absolute inset-1.5 rounded-full border border-moon/60"
          style={{ animation: `disc-ping 5s ease-out ${hintDelay}s infinite` }}
        />
        {showGlyph && (
          <span
            aria-hidden="true"
            className={cn(
              "relative flex transition-[scale,filter] duration-500 ease-out-expo",
              open ? "scale-130 drop-shadow-[0_0_8px_var(--star-glow)]" : "drop-shadow-[0_0_4px_var(--star-glow-soft)] group-hover/disc:scale-115",
            )}
          >
            <EightStar size={13} className="animate-twinkle [animation-duration:6s]" />
          </span>
        )}
      </button>

      {/* The note: always in the DOM (it describes the button), shown when open */}
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute w-56 rounded-xl border border-moon/40 bg-card/95 p-3.5 text-left shadow-[0_20px_40px_-24px_var(--shadow-deep)]  transition-[opacity,translate,visibility] duration-300 ease-out-expo",
          side === "top" ? "bottom-6" : "top-6",
          align === "center" && "left-0 -translate-x-1/2",
          align === "start" && "-left-4",
          align === "end" && "-right-4",
          open ? "visible translate-y-0 opacity-100" : cn("invisible opacity-0", side === "top" ? "translate-y-1.5" : "-translate-y-1.5"),
        )}
      >
        <span className="eyebrow block text-[0.58rem] tracking-[0.18em]">
          <span className="font-display text-[1.15em] normal-case tracking-normal">{designation.slice(0, 1)}</span>
          {designation.slice(1)}
        </span>
        <span className="display mt-0.5 block text-[1.45rem] leading-tight text-ink">{name}</span>
        <span className="mt-0.5 block font-caps text-[0.55rem] tracking-[0.14em] text-faint">
          RA {ra} · Dec {dec}
        </span>
        <span className="mt-2 block text-[0.8rem] leading-snug text-mute">{note}</span>
      </span>
    </span>
  );
}
