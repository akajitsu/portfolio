"use client";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { TimelineEntry, TimelineKind } from "@/types";
import { EightStar } from "@/components/celestial/Ornaments";
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
      <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-moon/20" />
      <motion.span aria-hidden="true" style={{ scaleY }} className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-linear-to-b from-moon to-accent" />

      {entries.map((e, i) => (
        <motion.li
          key={`${e.title}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease }}
          className="relative pb-12 pl-10 last:pb-0"
        >
          {e.current ? (
            <span aria-hidden="true" className="absolute -left-[2px] top-[0.05rem] flex rounded-full bg-paper p-[1px] text-moon">
              <EightStar size={18} className="animate-twinkle [animation-duration:5s]" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-[2px] top-[0.3rem] h-[11px] w-[11px] rotate-45 border bg-paper",
                e.placeholder ? "border-dashed border-faint" : "border-moon",
              )}
            />
          )}
          <p className="eyebrow text-mute">
            {KIND[e.kind]}
            {e.period && <> · {e.period}</>}
            {e.current && <span className="text-accent"> · Current</span>}
          </p>
          <h3 className={cn("display mt-2 text-[clamp(1.7rem,2.6vw,2.2rem)] leading-[1.1]", e.placeholder && "text-mute")}>
            {e.title}
          </h3>
          {e.org && <p className="mt-0.5">{e.org}</p>}
          <p className="mt-2 max-w-xl leading-relaxed text-mute">{e.placeholder ? "More to come." : e.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
