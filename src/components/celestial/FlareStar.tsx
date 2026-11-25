"use client";
import { motion } from "motion/react";
import { EightStar } from "@/components/celestial/Ornaments";
import { inViewOnce } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A small star that flares once — swells, turns and settles — when its
 * section scrolls into view, then keeps a slow, quiet twinkle. Used as the
 * "this section is now active" cue in section headings.
 */
export default function FlareStar({ size = 11, className }: { size?: number; className?: string }) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.3, rotate: -60 }}
      whileInView={{ opacity: 1, scale: [0.3, 1.5, 1], rotate: [-60, 0, 0] }}
      viewport={inViewOnce}
      transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1], times: [0, 0.45, 1] }}
      className={cn("inline-flex text-moon drop-shadow-[0_0_6px_var(--star-glow-soft)]", className)}
    >
      <EightStar size={size} className="animate-twinkle [animation-duration:6s]" />
    </motion.span>
  );
}
