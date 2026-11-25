"use client";
import { useEffect, useRef } from "react";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Occasional shooting stars across the fixed sky. Each one is an event, not
 * a loop: a random wait (9–24s, longer on phones), a random start in the
 * upper part of the sky, a random shallow angle, length and speed. Two
 * reusable elements animated with the Web Animations API; nothing runs
 * while the tab is hidden, and nothing at all with reduced motion. They
 * live in the background layer, so they always pass behind content.
 */
export default function ShootingStars() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = host.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const meteors = Array.from(root.children) as HTMLElement[];
    const small = matchMedia("(max-width: 640px)").matches;
    let timer = 0;
    let next = 0;

    const fire = () => {
      if (document.hidden) return schedule();
      const el = meteors[next++ % meteors.length];
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x = rand(0.3, 1.02) * vw;
      const y = rand(0.02, 0.4) * vh;
      const angle = rand(18, 36); // degrees below horizontal, heading left
      const length = rand(110, 190);
      const travel = rand(280, 520) * (small ? 0.7 : 1);
      const dur = rand(900, 1500);
      el.style.width = `${length}px`;
      const at = (d: number, s: number) => `translate(${x}px, ${y}px) rotate(${-angle}deg) translateX(${-d}px) scaleX(${s})`;
      el.animate(
        [
          { transform: at(0, 0.25), opacity: 0 },
          { transform: at(travel * 0.15, 1), opacity: 1, offset: 0.15 },
          { transform: at(travel * 0.7, 0.9), opacity: 0.85, offset: 0.7 },
          { transform: at(travel, 0.4), opacity: 0 },
        ],
        { duration: dur, easing: "cubic-bezier(0.3, 0, 0.6, 1)" },
      );
      schedule();
    };
    const schedule = () => {
      timer = window.setTimeout(fire, rand(9000, 24000) * (small ? 1.6 : 1));
    };
    // The first one comes a little sooner, so the sky feels alive early on.
    timer = window.setTimeout(fire, rand(3500, 7000));
    return () => {
      window.clearTimeout(timer);
      meteors.forEach((m) => m.getAnimations().forEach((a) => a.cancel()));
    };
  }, []);

  return (
    <div ref={host} aria-hidden="true" className="absolute inset-0">
      {[0, 1].map((i) => (
        // Head at the left end (it travels left), tail fading out behind it.
        <span
          key={i}
          className="absolute left-0 top-0 block h-px origin-left opacity-0"
          style={{ background: "linear-gradient(90deg, var(--meteor), color-mix(in oklab, var(--meteor) 35%, transparent) 30%, transparent)" }}
        >
          <span
            className="absolute -left-[1.5px] -top-[1.5px] block h-1 w-1 rounded-full"
            style={{ background: "var(--meteor)", boxShadow: "0 0 6px 1.5px var(--star-glow-soft)" }}
          />
        </span>
      ))}
    </div>
  );
}
