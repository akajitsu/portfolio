"use client";
import { motion } from "motion/react";
import { ease, inViewOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A gold hairline that draws itself from left to right when it scrolls into
 * view — the section dividers of the journal. Position it with `className`
 * (e.g. "absolute inset-x-0 bottom-0"). Appears fully drawn with reduced motion.
 */
export function DrawRule({ className, delay = 0, tone = "bg-moon/25" }: { className?: string; delay?: number; tone?: string }) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={inViewOnce}
      transition={{ duration: reduce ? 0 : 1.3, delay: reduce ? 0 : delay, ease }}
      className={cn("pointer-events-none block h-px origin-left", tone, className)}
    />
  );
}

/**
 * A frame whose border traces itself around the box when it scrolls into
 * view. Drop it inside a `relative` element with the matching corner
 * `radius` (px). Appears fully drawn with reduced motion.
 */
export function DrawFrame({ radius = 18, delay = 0, opacity = 0.4, className }: { radius?: number; delay?: number; opacity?: number; className?: string }) {
  const reduce = useReducedMotionSafe();
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full overflow-visible", className)}>
      <motion.rect
        x={0.5}
        y={0.5}
        rx={radius}
        style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)", stroke: "var(--color-moon)" }}
        fill="none"
        strokeOpacity={opacity}
        strokeWidth={1}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={inViewOnce}
        transition={{ duration: reduce ? 0 : 2.2, delay: reduce ? 0 : delay, ease }}
      />
    </svg>
  );
}
