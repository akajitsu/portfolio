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

/**
 * Vertical timeline; the line fills in as you scroll through it.
 * From `sm` up, dates sit in their own column left of the line, so the
 * period and the description never compete. On phones the date joins the
 * entry's label instead.
 */
export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // The line runs at 7px on phones, and through the middle of the gutter from sm up.
  const line = "absolute bottom-2 top-2 left-[7px] w-px sm:left-[8.25rem]";

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className={cn(line, "bg-moon/20")} />
      {/* Graduations: a tick every 28px, like the scale on an instrument */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[3px] top-2 w-[9px] opacity-45 sm:left-[calc(8.25rem-4px)]"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--color-moon) 0 1px, transparent 1px 28px)" }}
      />
      <motion.span aria-hidden="true" style={{ scaleY }} className={cn(line, "origin-top bg-linear-to-b from-moon to-accent")} />

      {entries.map((e, i) => (
        <motion.li
          key={`${e.title}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease }}
          className="group/entry relative pb-14 pl-10 last:pb-0 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-x-10 sm:pl-0"
        >
          {/* Arrival: a ring of light opens around the milestone as it comes into view */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: [0, 0.8, 0], scale: [0.4, 2.6] }}
            viewport={inViewOnce}
            transition={{ duration: 1.3, delay: 0.25, ease: "easeOut" }}
            className="pointer-events-none absolute left-[0.5px] top-[0.2rem] h-[14px] w-[14px] rounded-full border border-moon bg-[radial-gradient(closest-side,var(--halo-core),transparent)] sm:left-[calc(8.25rem-7px)]"
          />

          {/* Marker: a twinkling star for the current entry, an engraved compass point otherwise.
              Each one lights up as it arrives. */}
          {e.current ? (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0.3, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={inViewOnce}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="absolute -left-[2px] top-[0.05rem] flex rounded-full bg-paper p-[1px] text-moon drop-shadow-[0_0_7px_var(--star-glow-soft)] sm:left-[calc(8.25rem-10px)]"
            >
              <EightStar size={18} className="animate-twinkle [animation-duration:5s]" />
            </motion.span>
          ) : (
            <motion.svg
              initial={{ opacity: 0.3 }}
              whileInView={{ opacity: 1 }}
              viewport={inViewOnce}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              aria-hidden="true"
              viewBox="0 0 14 14"
              className={cn(
                "absolute left-[0.5px] top-[0.2rem] h-[14px] w-[14px] overflow-visible transition-[rotate,scale] duration-700 ease-out-expo group-hover/entry:scale-125 group-hover/entry:rotate-45 sm:left-[calc(8.25rem-7px)]",
                e.placeholder ? "text-faint" : "text-moon",
              )}
            >
              <path
                d="M7 0.5L8.6 5.4L13.5 7L8.6 8.6L7 13.5L5.4 8.6L0.5 7L5.4 5.4Z"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinejoin="round"
                strokeDasharray={e.placeholder ? "2 1.5" : undefined}
                className="fill-paper transition-[fill] duration-500 group-hover/entry:fill-moon/40"
              />
            </motion.svg>
          )}

          {/* Date column (sm and up) */}
          <div className="hidden text-right sm:block">
            {e.period && <p className="font-caps text-[0.8rem] leading-snug tracking-[0.08em] text-accent">{e.period}</p>}
            {e.current && <p className="eyebrow mt-1 text-[0.6rem] text-moon">Current</p>}
          </div>

          <div>
            <p className="eyebrow text-mute">
              {KIND[e.kind]}
              <span className="sm:hidden">
                {e.period && <> · {e.period}</>}
                {e.current && <span className="text-accent"> · Current</span>}
              </span>
            </p>
            <h3 className={cn("display mt-2 text-[clamp(1.7rem,2.6vw,2.2rem)] leading-[1.1]", e.placeholder && "text-mute")}>
              {e.title}
            </h3>
            {e.org && <p className="mt-1 text-[0.95rem] font-medium text-ink/85">{e.org}</p>}
            <p className="mt-3 max-w-xl leading-relaxed text-mute">{e.placeholder ? "More to come." : e.description}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
