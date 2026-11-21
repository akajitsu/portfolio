"use client";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { TimelineEntry, TimelineKind } from "@/types";
import { ease, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const KIND: Record<TimelineKind, string> = {
  education: "Education",
  work: "Work",
  leadership: "Leadership",
  project: "Project",
  milestone: "Milestone",
  learning: "Learning",
};

/** Vertical timeline; the line fills in as you scroll through it. */
export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line" />
      <motion.span aria-hidden="true" style={{ scaleY }} className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-accent" />

      {entries.map((e, i) => (
        <motion.li
          key={`${e.title}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease }}
          className="relative pb-10 pl-9 last:pb-0"
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 top-[0.4rem] h-[11px] w-[11px] rounded-full border-2 bg-paper",
              e.placeholder ? "border-dashed border-faint" : "border-accent",
              e.current && "bg-accent",
            )}
          />
          <p className="label">
            {KIND[e.kind]}
            {e.period && <> · {e.period}</>}
            {e.current && <span className="text-accent"> · Current</span>}
          </p>
          <h3 className={cn("mt-1 font-display text-[clamp(1.4rem,2.2vw,1.8rem)] font-semibold leading-tight tracking-[-0.02em]", e.placeholder && "text-mute")}>
            {e.title}
          </h3>
          {e.org && <p className="mt-0.5">{e.org}</p>}
          <p className="mt-2 max-w-xl leading-relaxed text-mute">{e.placeholder ? "More to come." : e.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
