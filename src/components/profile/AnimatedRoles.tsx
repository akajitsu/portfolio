"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = { roles: string[]; interval?: number; className?: string };

/**
 * Cycles through roles letter by letter. Every role is rendered invisibly in the
 * same grid cell, so the element is always as wide as the longest role — the
 * surrounding text never shifts. Screen readers get the full list once.
 */
export default function AnimatedRoles({ roles, interval = 2600, className }: Props) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (roles.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), reduce ? interval * 1.6 : interval);
    return () => window.clearInterval(id);
  }, [roles.length, interval, reduce]);

  const current = roles[index] ?? "";

  return (
    <span className={cn("relative inline-grid align-bottom", className)}>
      <span className="sr-only">{roles.join(", ")}</span>
      {/* Width reservers */}
      {roles.map((r) => (
        <span key={r} aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {r}
        </span>
      ))}
      <span aria-hidden="true" className="col-start-1 row-start-1 overflow-hidden whitespace-nowrap pb-[0.08em]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={current} className="inline-block" initial="hidden" animate="show" exit="exit">
            {Array.from(current).map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block whitespace-pre"
                variants={{
                  hidden: { y: "105%", opacity: 0 },
                  show: { y: "0%", opacity: 1, transition: { duration: 0.55, ease, delay: i * 0.022 } },
                  exit: { y: "-105%", opacity: 0, transition: { duration: 0.32, ease, delay: i * 0.012 } },
                }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
