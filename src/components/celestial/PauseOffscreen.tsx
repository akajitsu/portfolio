"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Elements whose looping CSS animation has been re-created as a Web Animation. */
const lifted = new WeakSet<Element>();
/** Web Animations this component paused (so only those are resumed). */
const pausedByUs = new WeakSet<Animation>();

/**
 * Re-creates every looping CSS animation as an identical Web Animation.
 *
 * Why: React listens for `animationiteration` at the document root (it does in
 * every React app, to support onAnimationIteration). With such a listener,
 * Chrome must wake the main thread each time any looping CSS animation starts
 * a new cycle, and every wake-up re-styles every animated element — with a few
 * hundred twinkling stars, that kept the main thread busy every frame. Web
 * Animations fire no DOM animation events, so they run purely on the GPU.
 *
 * The copy uses the same keyframes (per-keyframe easing included) and timing,
 * and takes over at the same point in its cycle, so nothing visibly changes.
 * Only elements with a single CSS animation are converted (cancelling the CSS
 * one must not undo, say, a finished entrance on the same element).
 */
function liftLoops() {
  for (const a of document.getAnimations()) {
    if (!(a instanceof CSSAnimation)) continue;
    const effect = a.effect as KeyframeEffect | null;
    const el = effect?.target;
    if (!effect || !el || lifted.has(el)) continue;
    const timing = effect.getTiming();
    if (timing.iterations !== Infinity) continue;
    if (el.getAnimations().filter((x) => x instanceof CSSAnimation).length !== 1) continue;

    const keyframes = effect.getKeyframes();
    const at = a.currentTime;
    const wasPaused = a.playState === "paused";
    (el as HTMLElement).style.animationName = "none"; // cancels the CSS animation
    const copy = el.animate(keyframes, {
      duration: timing.duration,
      delay: timing.delay,
      iterations: Infinity,
      direction: timing.direction,
      easing: timing.easing,
      fill: timing.fill,
    });
    if (at !== null) copy.currentTime = at;
    if (wasPaused) {
      copy.pause();
      pausedByUs.add(copy);
    }
    lifted.add(el);
  }
}

/**
 * Keeps the page's ambient motion cheap:
 *  1. looping CSS animations become Web Animations (see liftLoops);
 *  2. sections out of view pause their animations, resuming as they come back
 *     (with a 200px head start, so nothing visibly jumps). A paused entrance
 *     also waits until you arrive.
 *
 * Covers <main> sections, the footer, and anything marked data-pause-offscreen.
 * CSS animations pause via the .is-offscreen class (globals.css), Web
 * Animations via pause()/play(), SVG SMIL animations via pauseAnimations().
 */
export default function PauseOffscreen() {
  const pathname = usePathname();

  useEffect(() => {
    // Lift the loops once the page has painted, then now and then for anything
    // that mounts later (cheap when there's nothing new to lift).
    const first = window.setTimeout(liftLoops, 300);
    const later = window.setInterval(liftLoops, 3000);

    const setOffscreen = (el: HTMLElement, off: boolean) => {
      el.classList.toggle("is-offscreen", off);
      for (const a of el.getAnimations({ subtree: true })) {
        if (a instanceof CSSAnimation || a instanceof CSSTransition) continue;
        if (off && a.playState === "running") {
          a.pause();
          pausedByUs.add(a);
        } else if (!off && pausedByUs.has(a)) {
          a.play();
          pausedByUs.delete(a);
        }
      }
      el.querySelectorAll("svg").forEach((svg) => (off ? svg.pauseAnimations() : svg.unpauseAnimations()));
    };

    const els = Array.from(document.querySelectorAll<HTMLElement>("main section, footer, [data-pause-offscreen]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          const off = !e.isIntersecting;
          if (el.classList.contains("is-offscreen") === off) continue;
          if (!off) liftLoops(); // anything new in this section
          setOffscreen(el, off);
        }
      },
      { rootMargin: "200px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      window.clearTimeout(first);
      window.clearInterval(later);
      io.disconnect();
      els.forEach((el) => setOffscreen(el, false));
    };
  }, [pathname]);

  return null;
}
