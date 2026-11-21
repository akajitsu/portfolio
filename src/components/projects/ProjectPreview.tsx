"use client";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/types";
import { cn, displayHost } from "@/lib/utils";

type Props = { project: Project; className?: string; showPhone?: boolean; priority?: boolean };

/**
 * Browser-window mockup with the project's screenshot, plus a phone mockup
 * when a `mobileThumbnail` is provided. Both drift slightly on scroll.
 */
export default function ProjectPreview({ project, className, showPhone = true, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const windowY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -24]);
  const phoneY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -50]);
  const host = project.displayUrl ?? displayHost(project.liveUrl) ?? `${project.slug}.app`;
  const phone = showPhone ? project.mobileThumbnail : undefined;

  return (
    <div ref={ref} className={cn("relative", phone && "sm:pr-[8%]", className)}>
      <motion.div style={{ y: windowY }}>
        <div className="overflow-hidden rounded-xl border border-line bg-card shadow-[0_40px_80px_-50px_rgba(15,23,42,0.6)] transition-transform duration-700 ease-out-expo group-hover/project:-translate-y-1">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 border-b border-line bg-paper-2 px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
            </div>
            <div className="mx-auto min-w-0 max-w-[60%] flex-1 truncate rounded-md bg-card px-3 py-1 text-center text-xs text-mute">
              {host}
            </div>
            <span className="w-[42px]" aria-hidden="true" />
          </div>

          <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail.src}
                alt={project.thumbnail.alt}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover/project:scale-[1.02]"
              />
            ) : (
              <div className="hatch absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="font-display text-4xl font-semibold tracking-[-0.025em] text-ink/30">{project.name}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {phone && (
        <motion.div
          style={{ y: phoneY }}
          className="absolute -bottom-8 right-0 hidden w-[22%] min-w-[110px] sm:block"
        >
          <div className="rounded-[22px] border border-white/10 bg-[#0f1424] p-[4px] shadow-[0_30px_50px_-25px_rgba(0,0,0,0.6)]">
            <div className="relative aspect-[390/844] overflow-hidden rounded-[18px] bg-black">
              <Image src={phone.src} alt={phone.alt} fill sizes="160px" className="object-cover object-top" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
