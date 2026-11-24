"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A fixed background layer that drifts upward at `speed` × the scroll
 * distance and wraps every viewport height. The content is rendered twice,
 * stacked, so the wrap is seamless however long the page is.
 */
export default function ParallaxLoop({ children, speed }: { children: ReactNode; speed: number }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const height = useRef(1000);
  const [h, setH] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      height.current = window.innerHeight;
      setH(window.innerHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const y = useTransform(scrollY, (v) => (reduce ? 0 : -((v * speed) % height.current)));
  const pane = h ? { height: h } : { height: "100vh" };

  return (
    <motion.div style={{ y }} className="absolute inset-x-0 top-0 will-change-transform">
      <div className="relative" style={pane}>
        {children}
      </div>
      <div className="relative" style={pane}>
        {children}
      </div>
    </motion.div>
  );
}
