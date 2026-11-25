"use client";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { ArrowUpRight } from "@/components/ui/Icons";
import type { Project } from "@/types";
import { cn, displayHost, isUsableLink } from "@/lib/utils";

type Props = { project: Project; className?: string; showPhone?: boolean; priority?: boolean };

/**
 * Browser-window mockup with the project's screenshot, plus a phone mockup
 * when a `mobileThumbnail` is provided. Both drift slightly on scroll.
 * When the project has a live URL, the whole preview opens the site.
 * On hover the window tilts toward the pointer and a band of light sweeps it.
 */
export default function ProjectPreview({ project, className, showPhone = true, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Read through a ref so the drift functions stay identical on server and client.
  const reduce = useReducedMotionSafe();
  const still = useRef(reduce);
  still.current = reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const windowY = useTransform(scrollYProgress, (v) => (still.current ? 0 : 24 - 48 * v));
  const phoneY = useTransform(scrollYProgress, (v) => (still.current ? 0 : 70 - 120 * v));
  const host = project.displayUrl ?? displayHost(project.liveUrl) ?? `${project.slug}.app`;
  const phone = showPhone ? project.mobileThumbnail : undefined;
  const href = isUsableLink(project.liveUrl) ? project.liveUrl : undefined;

  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rotateY = useSpring(useTransform(tx, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(ty, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    tx.set((e.clientX - r.left) / r.width - 0.5);
    ty.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    tx.set(0);
    ty.set(0);
  }

  const body = (
    <>
      <motion.div style={{ y: windowY, rotateX, rotateY, transformPerspective: 1400 }}>
        <div className="overflow-hidden rounded-[14px] border border-moon/35 bg-card shadow-[0_50px_90px_-50px_var(--shadow-deep)] transition-[transform,border-color] duration-700 ease-out-expo group-hover/preview:-translate-y-1 group-hover/preview:border-moon/70">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 border-b border-moon/20 bg-paper-2 px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full border border-moon/60" />
              <span className="h-2 w-2 rounded-full border border-moon/60" />
              <span className="h-2 w-2 rounded-full border border-moon/60" />
            </div>
            <div className="mx-auto min-w-0 max-w-[60%] flex-1 truncate rounded-full border border-line bg-card px-3 py-0.5 text-center text-[0.7rem] tracking-[0.04em] text-mute">
              {host}
            </div>
            <span className="w-[34px]" aria-hidden="true" />
          </div>

          <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail.src}
                alt={project.thumbnail.alt}
                fill
                priority={priority}
                sizes="(min-width: 1280px) 900px, (min-width: 1024px) 66vw, 100vw"
                className="object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover/preview:scale-[1.025]"
              />
            ) : (
              <div className="hatch absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="display text-4xl text-mute">{project.name}</span>
              </div>
            )}
            {/* Light sweep */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-(--shimmer-hi)/25 to-transparent transition-transform duration-[1.3s] ease-out group-hover/preview:translate-x-[520%]"
            />
            {href && (
              <>
                <span aria-hidden="true" className="absolute inset-0 bg-night/0 transition-colors duration-500 group-hover/preview:bg-night/25 group-focus-visible/preview:bg-night/25" />
                <span
                  aria-hidden="true"
                  className="absolute bottom-4 left-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full border border-[#e4c58b]/70 bg-night/85 px-3.5 py-1.5 text-xs font-medium tracking-[0.04em] text-[#f0d9a6] opacity-0 backdrop-blur transition-[opacity,transform] duration-500 ease-out-expo group-hover/preview:translate-y-0 group-hover/preview:opacity-100 group-focus-visible/preview:translate-y-0 group-focus-visible/preview:opacity-100"
                >
                  Visit site <ArrowUpRight size={13} />
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {phone && (
        <motion.div style={{ y: phoneY }} className="absolute -bottom-8 right-0 hidden w-[22%] min-w-[110px] sm:block">
          <div className="rounded-[22px] border border-moon/45 bg-night p-[4px] shadow-[0_30px_50px_-25px_var(--shadow-deep)]">
            <div className="relative aspect-[390/844] overflow-hidden rounded-[18px] bg-black">
              <Image src={phone.src} alt={phone.alt} fill sizes="160px" className="object-cover object-top" />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );

  const cls = cn("group/preview relative block", phone && "sm:pr-[8%]", className);

  return href ? (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit the ${project.name} website (opens in a new tab)`}
        className={cn(cls, "rounded-[14px] focus-visible:outline-offset-8")}
      >
        {body}
      </a>
    </div>
  ) : (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cls}>
      {body}
    </div>
  );
}
