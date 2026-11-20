import type { Transition, Variants } from "motion/react";

/** The site's one easing curve — a soft expo-out used for every reveal. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = { type: "spring", stiffness: 120, damping: 20, mass: 0.6 };
export const springSnappy: Transition = { type: "spring", stiffness: 380, damping: 28 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Shared viewport config for scroll reveals: trigger once, a little before fully in view. */
export const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
