"use client";
import { useEffect, useRef } from "react";

/** Stars within this distance of the pointer wake up. */
const WAKE = 150;
/** Stars within this distance can join the pointer's little constellation. */
const LINK = 210;
/** At most this many lines at once (so at most five stars are joined). */
const LINES = 4;
/** Dust within this distance is nudged aside. */
const PUSH = 110;

type Pt = { el: Element; x: number; y: number; d: number };

/**
 * Lets the fixed sky respond to a mouse, subtly:
 *  • visible stars near the pointer brighten (a halo fades up, they swell);
 *  • the nearest few are joined by hairline constellation lines;
 *  • gold dust nearby drifts a little out of the way.
 * Everything eases back when the pointer leaves. Mouse only — touch and
 * pen are ignored — and off entirely with reduced motion. One passive
 * pointermove listener, throttled to one update per animation frame;
 * all changes are direct DOM writes, so React never re-renders.
 */
export default function SkyInteraction() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lines = Array.from(root.querySelectorAll("line"));
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
    let woken = new Set<Element>();
    let pushed = new Set<HTMLElement>();

    const update = () => {
      frame = 0;
      // Read every position first, then write — one layout per frame.
      const near: Pt[] = [];
      for (const el of stars) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue; // hidden (e.g. dropped on small screens)
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const d = Math.hypot(x - px, y - py);
        if (d < LINK) near.push({ el, x, y, d });
      }
      const dustNear: { el: HTMLElement; dx: number; dy: number; d: number }[] = [];
      for (const el of dust) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        const dx = r.left + r.width / 2 - px;
        const dy = r.top + r.height / 2 - py;
        const d = Math.hypot(dx, dy);
        if (d < PUSH) dustNear.push({ el, dx, dy, d });
      }

      near.sort((a, b) => a.d - b.d);

      // Brighten the stars close to the pointer.
      const nextWoken = new Set<Element>();
      for (const p of near) if (p.d < WAKE) nextWoken.add(p.el);
      woken.forEach((el) => !nextWoken.has(el) && el.removeAttribute("data-near"));
      nextWoken.forEach((el) => !woken.has(el) && el.setAttribute("data-near", ""));
      woken = nextWoken;

      // Join the nearest few, each to its nearest not-yet-joined neighbour.
      const chain = near.slice(0, LINES + 1);
      const order: Pt[] = chain.length ? [chain.shift()!] : [];
      while (chain.length) {
        const last = order[order.length - 1];
        let best = 0;
        for (let i = 1; i < chain.length; i++) {
          if (Math.hypot(chain[i].x - last.x, chain[i].y - last.y) < Math.hypot(chain[best].x - last.x, chain[best].y - last.y)) best = i;
        }
        order.push(chain.splice(best, 1)[0]);
      }
      lines.forEach((line, i) => {
        const a = order[i];
        const b = order[i + 1];
        if (!a || !b) {
          line.style.opacity = "0";
          return;
        }
        line.setAttribute("x1", String(a.x));
        line.setAttribute("y1", String(a.y));
        line.setAttribute("x2", String(b.x));
        line.setAttribute("y2", String(b.y));
        // Lines fade with the distance of their farther star from the pointer.
        line.style.opacity = String(Math.max(0, 1 - Math.max(a.d, b.d) / LINK).toFixed(3));
      });

      // Nudge nearby dust away from the pointer.
      const nextPushed = new Set<HTMLElement>();
      for (const p of dustNear) {
        const k = ((PUSH - p.d) / PUSH) * 22;
        const len = p.d || 1;
        p.el.style.translate = `${((p.dx / len) * k).toFixed(1)}px ${((p.dy / len) * k).toFixed(1)}px`;
        nextPushed.add(p.el);
      }
      pushed.forEach((el) => !nextPushed.has(el) && (el.style.translate = ""));
      pushed = nextPushed;
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
    // The stars drift with scroll, so re-measure while the pointer is in use.
    const onScroll = () => woken.size + pushed.size > 0 && schedule();

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
      <g style={{ stroke: "var(--sky-line)" }} strokeWidth={0.75} strokeLinecap="round">
        {Array.from({ length: LINES }, (_, i) => (
          <line key={i} className="sky-line" style={{ opacity: 0 }} />
        ))}
      </g>
    </svg>
  );
}
