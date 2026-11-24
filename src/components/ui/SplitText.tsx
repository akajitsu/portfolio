"use client";
import { motion, type Variants } from "motion/react";
import { ease, inViewOnce } from "@/lib/motion";

const parent: Variants = { hidden: {}, show: {} };
const char: Variants = {
  hidden: { opacity: 0, y: "0.45em", filter: "blur(8px)" },
  show: (i: number) => ({ opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: 0.9, ease, delay: 0.1 + i * 0.035 } }),
};

/**
 * Letters rise out of a soft blur when the text scrolls into view.
 * Screen readers get the plain string; the split letters are hidden from them.
 */
export default function SplitText({ text, className }: { text: string; className?: string }) {
  let n = 0;
  const words = text.split(" ");
  return (
    <motion.span className={className} variants={parent} initial="hidden" whileInView="show" viewport={inViewOnce}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(w).map((ch) => {
                const i = n++;
                return (
                  <motion.span key={i} custom={i} variants={char} className="inline-block">
                    {ch}
                  </motion.span>
                );
              })}
            </span>
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </motion.span>
  );
}
