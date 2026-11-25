"use client";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { CompassRoseG } from "@/components/celestial/Ornaments";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/**
 * Compass rose whose needle swings gently as the page scrolls past it —
 * as if taking a bearing through the timeline beside it. The needle stays
 * still (pointing north) with reduced motion.
 */
export default function ScrollCompass({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const swing = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [-38, 14, -8, 24],
  );
  const rotate = useSpring(swing, { stiffness: 40, damping: 12 });

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="-62 -62 124 124"
        aria-hidden="true"
        focusable="false"
        className="block w-full overflow-visible text-moon"
      >
        <CompassRoseG />
        <motion.g style={reduce ? undefined : { rotate }} className="text-cream">
          {/* Needle: the north half solid, the south half engraved */}
          <path d="M0 -39L2.4 0L-2.4 0Z" fill="currentColor" />
          <path
            d="M0 39L2.4 0L-2.4 0Z"
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
          />
          <circle r={2} fill="currentColor" />
        </motion.g>
      </svg>
    </div>
  );
}
