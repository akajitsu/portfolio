import { animate, type AnimationPlaybackControls } from "motion/react";
import { ease } from "@/lib/motion";

let current: AnimationPlaybackControls | null = null;
let listening = false;

const stop = () => {
  current?.stop();
  current = null;
};

/**
 * Glide the window to `top` (px). Driven by Motion rather than native
 * smooth scrolling, so the pace is the same in every browser and nothing
 * cuts it short. Stops the moment the visitor scrolls on their own; jumps
 * instantly when `instant` is set (reduced motion).
 */
export function glideTo(top: number, instant = false) {
  stop();
  const from = window.scrollY;
  const to = Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
  if (instant || Math.abs(to - from) < 2) {
    window.scrollTo({ top: to, behavior: "instant" });
    return;
  }
  if (!listening) {
    listening = true;
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
  }
  // Longer distances take a little longer, within 0.55–1.1s.
  current = animate(from, to, {
    duration: Math.min(1.1, Math.max(0.55, Math.abs(to - from) / 5000)),
    ease,
    onUpdate: (y) => window.scrollTo({ top: y, behavior: "instant" }),
    onComplete: () => (current = null),
  });
}

/** Glide so `el` sits just below the fixed header. */
export function glideToElement(el: HTMLElement, instant = false, offset = 96) {
  glideTo(el.getBoundingClientRect().top + window.scrollY - offset, instant);
}
