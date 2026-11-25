"use client";
import { useEffect, useRef } from "react";

/** Stars within this distance of the pointer wake up (glow and swell). */
const WAKE = 150;
/** Stars within this distance can join the pointer's little constellation. */
const LINK = 190;
/** Never draw a line longer than this, so no long strokes cross the sky. */
const MAX_SEGMENT = 165;
/** Element pools: glows and lines are reused, never created per frame. */
const GLOWS = 6;
const LINES = 5;
/** How long a released glow or line takes to fade (matches the CSS). */
const FADE_MS = 850;

type Pt = { i: number; el: Element; x: number; y: number; d: number };
type Slot<T> = { el: T; key: string | null; last: string | null; freeAt: number };

/**
 * Pools of overlay elements keyed by what they show (a star, or a pair of
 * stars). An element keeps its key while it's needed, so it never jumps to
 * another star mid-fade; released ones fade out in place before reuse.
 */
function acquire<T>(slots: Slot<T>[], key: string, now: number): Slot<T> | null {
  const held = slots.find((s) => s.key === key);
  if (held) return held;
  // Coming back to something that's still fading out: pick it up in place.
  const resumed = slots.find((s) => s.key === null && s.last === key);
  if (resumed) {
    resumed.key = key;
    return resumed;
  }
  const free = slots.filter((s) => s.key === null).sort((a, b) => a.freeAt - b.freeAt)[0];
  if (!free || free.freeAt > now) return null; // all busy or still fading: skip this one
  free.key = free.last = key;
  return free;
}
function release<T extends SVGElement>(slots: Slot<T>[], keep: Set<string>, now: number) {
  for (const s of slots) {
    if (s.key !== null && !keep.has(s.key)) {
      s.last = s.key;
      s.key = null;
      s.freeAt = now + FADE_MS;
      s.el.style.opacity = "0";
    }
  }
}

/**
 * Lets the fixed sky respond to a mouse, subtly:
 *  • visible stars near the pointer swell and a soft glow fades up around them;
 *  • the nearest few are joined by short hairline constellation lines;
 *  • gold dust nearby drifts a little out of the way.
 * Glows and lines are drawn on this full-screen overlay (not inside the
 * star layer), so they're never clipped at a layer edge. Everything fades
 * back when the pointer leaves. Mouse only — touch and pen are ignored —
 * and off entirely with reduced motion. One passive pointermove listener,
 * throttled to one update per frame; all changes are direct DOM writes.
 */
export default function SkyInteraction() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glows: Slot<SVGCircleElement>[] = Array.from(root.querySelectorAll<SVGCircleElement>(".sky-glow"), (el) => ({ el, key: null, last: null, freeAt: 0 }));
    const lines: Slot<SVGLineElement>[] = Array.from(root.querySelectorAll<SVGLineElement>(".sky-line"), (el) => ({ el, key: null, last: null, freeAt: 0 }));
    let stars: Element[] = [];
    let dust: HTMLElement[] = [];
    const collect = () => {
      stars = Array.from(document.querySelectorAll("[data-sky-star]"));
      dust = Array.from(document.querySelectorAll<HTMLElement>("[data-sky-dust]"));
    };
    collect();

    let px = -1e4;
    let py = -1e4;
    let frame = 0;
    let active = false;
    let woken = new Set<Element>();
    let pushed = new Set<HTMLElement>();

    const update = () => {
      frame = 0;
      const now = performance.now();

      // Read every position first, then write — one layout per frame.
      const near: Pt[] = [];
      stars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return; // hidden (e.g. dropped on small screens)
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const d = Math.hypot(x - px, y - py);
        if (d < LINK) near.push({ i, el, x, y, d });
      });
      const dustNear: { el: HTMLElement; dx: number; dy: number; d: number }[] = [];
      for (const el of dust) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        const dx = r.left + r.width / 2 - px;
        const dy = r.top + r.height / 2 - py;
        const d = Math.hypot(dx, dy);
        if (d < 110) dustNear.push({ el, dx, dy, d });
      }
      near.sort((a, b) => a.d - b.d);

      // Wake the stars close to the pointer: swell (CSS) + a glow on the overlay.
      const nextWoken = new Set<Element>();
      const glowKeys = new Set<string>();
      for (const p of near) {
        if (p.d >= WAKE) break;
        nextWoken.add(p.el);
        const key = String(p.i);
        const slot = acquire(glows, key, now);
        if (!slot) continue;
        glowKeys.add(key);
        slot.el.setAttribute("cx", p.x.toFixed(1));
        slot.el.setAttribute("cy", p.y.toFixed(1));
        slot.el.style.opacity = (0.45 + 0.55 * (1 - p.d / WAKE)).toFixed(3);
      }
      release(glows, glowKeys, now);
      woken.forEach((el) => !nextWoken.has(el) && el.removeAttribute("data-near"));
      nextWoken.forEach((el) => !woken.has(el) && el.setAttribute("data-near", ""));
      woken = nextWoken;

      // Join the nearest few, each to its nearest neighbour — but only with
      // short segments, so the figure stays small and close to the pointer.
      const pool = near.slice(0, LINES + 1);
      const chain: Pt[] = pool.length ? [pool.shift()!] : [];
      while (pool.length) {
        const last = chain[chain.length - 1];
        let best = 0;
        let bestD = Infinity;
        pool.forEach((p, k) => {
          const d = Math.hypot(p.x - last.x, p.y - last.y);
          if (d < bestD) [best, bestD] = [k, d];
        });
        if (bestD > MAX_SEGMENT) break;
        chain.push(pool.splice(best, 1)[0]);
      }
      const lineKeys = new Set<string>();
      for (let k = 0; k + 1 < chain.length; k++) {
        const a = chain[k];
        const b = chain[k + 1];
        const key = a.i < b.i ? `${a.i}-${b.i}` : `${b.i}-${a.i}`;
        const slot = acquire(lines, key, now);
        if (!slot) continue;
        lineKeys.add(key);
        slot.el.setAttribute("x1", a.x.toFixed(1));
        slot.el.setAttribute("y1", a.y.toFixed(1));
        slot.el.setAttribute("x2", b.x.toFixed(1));
        slot.el.setAttribute("y2", b.y.toFixed(1));
        // Lines fade with the distance of their farther star from the pointer.
        slot.el.style.opacity = (0.9 * Math.max(0, 1 - Math.max(a.d, b.d) / LINK)).toFixed(3);
      }
      release(lines, lineKeys, now);

      // Nudge nearby dust away from the pointer.
      const nextPushed = new Set<HTMLElement>();
      for (const p of dustNear) {
        const k = ((110 - p.d) / 110) * 22;
        const len = p.d || 1;
        p.el.style.translate = `${((p.dx / len) * k).toFixed(1)}px ${((p.dy / len) * k).toFixed(1)}px`;
        nextPushed.add(p.el);
      }
      pushed.forEach((el) => !nextPushed.has(el) && (el.style.translate = ""));
      pushed = nextPushed;

      active = woken.size + pushed.size + lineKeys.size > 0;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      schedule();
    };
    const onLeave = () => {
      px = py = -1e4;
      schedule();
    };
    // The stars drift with scroll, so keep glows and lines on them while active.
    const onScroll = () => active && schedule();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", collect);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", collect);
      woken.forEach((el) => el.removeAttribute("data-near"));
      pushed.forEach((el) => (el.style.translate = ""));
    };
  }, []);

  return (
    <svg ref={svg} aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="sky-glow">
          <stop offset="0" style={{ stopColor: "var(--sky-halo)" }} />
          <stop offset="1" style={{ stopColor: "var(--sky-halo)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <g fill="url(#sky-glow)">
        {Array.from({ length: GLOWS }, (_, i) => (
          <circle key={i} r={22} className="sky-glow" style={{ opacity: 0 }} />
        ))}
      </g>
      <g style={{ stroke: "var(--sky-line)" }} strokeWidth={0.75} strokeLinecap="round">
        {Array.from({ length: LINES }, (_, i) => (
          <line key={i} className="sky-line" style={{ opacity: 0 }} />
        ))}
      </g>
    </svg>
  );
}
