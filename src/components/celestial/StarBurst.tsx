"use client";
import { useEffect, useRef } from "react";
import { SPARKLE_PATH } from "@/components/celestial/Ornaments";

const COUNT = 8;

/**
 * A small burst of gold sparkles from the point where a marked control is
 * clicked. Opt in with the `data-burst` attribute (primary buttons, the
 * theme toggle). One delegated click listener for the whole page; the
 * sparkles are created per burst and removed when their animation ends.
 * Off with reduced motion.
 */
export default function StarBurst() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e: MouseEvent) => {
      if (reduce.matches) return;
      const target = (e.target as Element | null)?.closest?.("[data-burst]");
      if (!target) return;
      // Keyboard "clicks" have no pointer position: burst from the centre.
      const box = target.getBoundingClientRect();
      const x = e.detail === 0 ? box.left + box.width / 2 : e.clientX;
      const y = e.detail === 0 ? box.top + box.height / 2 : e.clientY;
      const turn = Math.random() * 360;

      for (let i = 0; i < COUNT; i++) {
        const s = document.createElement("span");
        const size = 5 + Math.random() * 6;
        s.className = "absolute left-0 top-0 block text-cream";
        s.style.width = s.style.height = `${size}px`;
        s.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="${SPARKLE_PATH}"/></svg>`;
        root.appendChild(s);
        const a = ((turn + (i * 360) / COUNT + Math.random() * 18) * Math.PI) / 180;
        const dist = 26 + Math.random() * 22;
        const x0 = x - size / 2;
        const y0 = y - size / 2;
        s.animate(
          [
            { transform: `translate(${x0}px, ${y0}px) scale(0.3) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${x0 + Math.cos(a) * dist}px, ${y0 + Math.sin(a) * dist}px) scale(1) rotate(90deg)`, opacity: 0.9, offset: 0.55 },
            { transform: `translate(${x0 + Math.cos(a) * dist * 1.25}px, ${y0 + Math.sin(a) * dist * 1.25 + 6}px) scale(0.2) rotate(160deg)`, opacity: 0 },
          ],
          { duration: 700 + Math.random() * 250, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        ).onfinish = () => s.remove();
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      root.replaceChildren();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[66] overflow-hidden" />;
}
