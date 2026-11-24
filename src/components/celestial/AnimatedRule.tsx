"use client";
import { motion } from "motion/react";
import { TripleMoon } from "@/components/celestial/Ornaments";
import { ease, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Triple-moon rule: the moons rise in, then the hairline draws out to the right. */
export default function AnimatedRule({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className={cn("flex items-center gap-3", className)}
    >
      <motion.span
        variants={{ hidden: { opacity: 0, y: 8, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease } } }}
        className="flex text-cream"
      >
        <TripleMoon width={58} />
      </motion.span>
      <motion.span
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.6, ease, delay: 0.25 } } }}
        className="rule-fade h-px flex-1 origin-left"
      />
    </motion.div>
  );
}
