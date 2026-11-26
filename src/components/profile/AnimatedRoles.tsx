"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = { roles: string[]; interval?: number; className?: string };

/** How long the outgoing word takes to lift away before the next rises in (ms). */
const EXIT_MS = 330;

/**
 * Cycles through roles letter by letter. Every role is rendered invisibly in the
 * same grid cell, so the element is always as wide as the longest role — the
 * surrounding text never shifts. Screen readers get the full list once.
 *
 * The letters animate with short CSS animations (no per-frame JavaScript),
 * kept brief because each swap briefly wakes the main thread. Cycling pauses
 * while the role is off-screen or the tab is hidden; with reduced motion the
 * words simply swap.
 */
export default function AnimatedRoles({ roles, interval = 3000, className }: Props) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (roles.length < 2 || !root.current) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root.current);

    let swap = 0;
    const tick = window.setInterval(
      () => {
        if (!visible || document.hidden) return;
        if (reduce) return setIndex((i) => (i + 1) % roles.length);
        setLeaving(true);
        swap = window.setTimeout(() => {
          setIndex((i) => (i + 1) % roles.length);
          setLeaving(false);
        }, EXIT_MS);
      },
      reduce ? interval * 1.6 : interval,
    );
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(swap);
      io.disconnect();
    };
  }, [roles.length, interval]);

  const current = roles[index] ?? "";

  return (
    <span ref={root} className={cn("relative inline-grid align-bottom", className)}>
      <span className="sr-only">{roles.join(", ")}</span>
      {/* Width reservers */}
      {roles.map((r) => (
        <span key={r} aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {r}
        </span>
      ))}
      <span aria-hidden="true" className="col-start-1 row-start-1 overflow-hidden whitespace-nowrap pb-[0.08em]">
        {/* Keyed by word: each new word mounts fresh, so its letters' rise-in replays. */}
        <span key={current} className="inline-block">
          {Array.from(current).map((ch, i) => (
            <span
              key={i}
              className="inline-block whitespace-pre"
              style={{
                animation: leaving
                  ? `role-out 0.26s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.008}s both`
                  : `role-in 0.46s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.016}s both`,
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
