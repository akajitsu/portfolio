"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease, inViewOnce } from "@/lib/motion";

type Props = {
  children: ReactNode;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header" | "article" | "p" | "span";
  /** "view" reveals on scroll (default); "mount" animates immediately on load. */
  trigger?: "view" | "mount";
  duration?: number;
};

/**
 * The site's basic reveal: a soft fade + rise. Reduced-motion users get the
 * content without movement via <MotionConfig reducedMotion="user">.
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
  trigger = "view",
  duration = 0.8,
}: Props) {
  const Comp = motion[as];
  const target = { opacity: 1, y: 0 };
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      {...(trigger === "mount" ? { animate: target } : { whileInView: target, viewport: inViewOnce })}
      transition={{ duration, delay, ease }}
    >
      {children}
    </Comp>
  );
}
