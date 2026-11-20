"use client";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type ProfileVisualProps = {
  /** Image in /public, e.g. "/images/profile/jared.jpg". Empty → placeholder. */
  src?: string;
  alt: string;
  name: string;
  /** CSS object-position for the photo, e.g. "50% 20%" to keep a face in frame. */
  objectPosition?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Portrait card over a soft circle. The card floats gently and leans toward
 * the pointer; the circle drifts the opposite way for a little depth.
 * Fixed aspect ratio, so it never shifts the layout.
 */
export default function ProfileVisual({ src, alt, name, objectPosition = "50% 30%", className, priority }: ProfileVisualProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 80, damping: 18, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 80, damping: 18, mass: 0.6 });

  const circleX = useTransform(px, (v) => v * -18);
  const circleY = useTransform(py, (v) => v * -18);
  const cardX = useTransform(px, (v) => v * 12);
  const cardY = useTransform(py, (v) => v * 12);
  const tilt = useTransform(px, (v) => -2 + v * 3);

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative mx-auto aspect-[4/5] w-full max-w-[420px]", className)}
    >
      {/* Circle */}
      <motion.div aria-hidden="true" style={{ x: circleX, y: circleY }} className="absolute right-[-6%] top-[2%] aspect-square w-[72%]">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease, delay: 0.15 }}
          className="h-full w-full rounded-full bg-moon-soft"
        />
      </motion.div>

      {/* Card */}
      <motion.div style={{ x: cardX, y: cardY }} className="absolute inset-x-[8%] bottom-[4%] top-[6%]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.1 }}
          className="h-full w-full"
        >
          <motion.div
            style={{ rotate: reduce ? -2 : tilt }}
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
            whileHover={reduce ? undefined : { scale: 1.015 }}
            className="group relative h-full w-full overflow-hidden rounded-[24px] border border-line bg-card shadow-[0_30px_70px_-40px_rgba(15,23,42,0.55)]"
          >
            {src ? (
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 60vw, 80vw"
                className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
                style={{ objectPosition }}
              />
            ) : (
              <PortraitPlaceholder initial={name.trim().charAt(0).toUpperCase() || "?"} label={alt} />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Shown until a real photo is set in src/data/profile.ts. */
function PortraitPlaceholder({ initial, label }: { initial: string; label: string }) {
  return (
    <div role="img" aria-label={`${label} (photo coming soon)`} className="relative h-full w-full bg-paper-2">
      <svg viewBox="0 0 200 250" className="absolute inset-x-0 bottom-0 mx-auto h-[72%] text-ink/[0.08]" aria-hidden="true">
        <circle cx="100" cy="92" r="44" fill="currentColor" />
        <path d="M18 250c0-50 36-88 82-88s82 38 82 88z" fill="currentColor" />
      </svg>
      <span className="absolute left-6 top-4 font-display text-[6.5rem] leading-none text-ink/80">{initial}</span>
      <span className="label absolute bottom-5 left-6">Photo coming soon</span>
    </div>
  );
}
