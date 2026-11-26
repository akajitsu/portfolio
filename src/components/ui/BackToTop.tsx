"use client";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUp } from "@/components/ui/Icons";
import { glideTo } from "@/lib/glide";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/** How far down (px) the page must be before the button appears. */
const SHOW_AFTER = 600;

/**
 * Floating "back to top" button. Fades in once the visitor has scrolled a
 * little way down; its gold ring fills as they read, like a slow orbit.
 */
export default function BackToTop() {
  const reduce = useReducedMotionSafe();
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    // Send keyboard / screen-reader focus back to the start of the content too.
    document.getElementById("main")?.focus({ preventScroll: true });
    glideTo(0, reduce);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          title="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: reduce ? 0 : 0.45, ease }}
          className="group fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-moon/40 bg-card/90 text-accent shadow-[0_14px_34px_-14px_var(--shadow-deep)] transition-[border-color,box-shadow] duration-300 hover:border-moon hover:shadow-[0_0_26px_-4px_var(--star-glow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moon sm:bottom-8 sm:right-8"
        >
          {/* Scroll-progress ring */}
          <svg aria-hidden="true" viewBox="0 0 48 48" className="pointer-events-none absolute inset-0 -rotate-90">
            <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} />
            <motion.circle cx="24" cy="24" r="22" fill="none" stroke="var(--color-moon)" strokeWidth={1.5} strokeLinecap="round" style={{ pathLength: progress }} />
          </svg>
          <ArrowUp size={18} className="relative transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
