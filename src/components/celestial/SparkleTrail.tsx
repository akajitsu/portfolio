"use client";
import { useEffect, useRef } from "react";
import { SPARKLE_PATH } from "@/components/celestial/Ornaments";

const POOL = 18;

/**
 * Tiny gold sparkles that fall away behind the pointer. A fixed pool of
 * elements animated with the Web Animations API — no React re-renders.
 * Only for fine pointers, and off entirely with reduced motion.
 */
export default function SparkleTrail() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pool: HTMLSpanElement[] = [];
    for (let i = 0; i < POOL; i++) {
      const s = document.createElement("span");
      s.className = "absolute left-0 top-0 block text-cream opacity-0";
      s.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="${SPARKLE_PATH}"/></svg>`;
      root.appendChild(s);
      pool.push(s);
    }

    let next = 0;
    let last = 0;
    let lx = -100;
    let ly = -100;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - last < 40 || Math.hypot(e.clientX - lx, e.clientY - ly) < 16) return;
      last = now;
      lx = e.clientX;
      ly = e.clientY;
      const el = pool[next++ % POOL];
      const size = 6 + Math.random() * 8;
      const x = e.clientX - size / 2;
      const y = e.clientY - size / 2;
      const dx = (Math.random() - 0.5) * 30;
      const dy = 18 + Math.random() * 26;
      el.style.width = el.style.height = `${size}px`;
      el.animate(
        [
          { transform: `translate(${x}px, ${y}px) scale(1) rotate(0deg)`, opacity: 0.95 },
          { transform: `translate(${x + dx}px, ${y + dy}px) scale(0.15) rotate(140deg)`, opacity: 0 },
        ],
        { duration: 850 + Math.random() * 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      pool.forEach((s) => s.remove());
    };
  }, []);

  return <div ref={host} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65] overflow-hidden" />;
}
