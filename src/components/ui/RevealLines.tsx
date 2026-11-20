"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  lines: ReactNode[];
  className?: string;
  /** Per-line class names, by index (serialisable, so server components can pass it). */
  lineClassNames?: (string | undefined)[];
  delay?: number;
  as?: "h1" | "h2" | "p";
};

/** Masked line-by-line reveal for display headlines (on load). */
export default function RevealLines({ lines, className, lineClassNames, delay = 0, as = "h1" }: Props) {
  const Tag = as;
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={cn("block", lineClassNames?.[i])}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
