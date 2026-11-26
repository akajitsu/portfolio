"use client";
import { useInView } from "motion/react";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { CompassG, Corners, EightStar, Sparkle, SPARKLE_G, roman } from "@/components/celestial/Ornaments";
import { ProjectLinks, StatusChip, TechTags } from "@/components/projects/ProjectCard";
import ProjectPreview from "@/components/projects/ProjectPreview";
import { GREEK, desktopLayout, mobileLayout, wideLayout, type Layout } from "@/components/projects/constellation-layout";
import FadeIn from "@/components/ui/FadeIn";
import { glideToElement } from "@/lib/glide";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const CONSTELLATION = "Operum"; // "of the works" — the constellation's name

/** Bayer letter in a lowercase serif, so the engraved-capitals label can't turn α into "A". */
const Bayer = ({ i }: { i: number }) => <span className="font-display text-[1.15em] normal-case tracking-normal">{GREEK[i] ?? i + 1}</span>;

/** A distinct star for each project; cycles if there are more projects than designs. */
function StarGlyph({ variant, size = 1 }: { variant: number; size?: number }): ReactNode {
  const cls = "text-moon dark:text-cream";
  switch (variant % 3) {
    case 0:
      return <EightStar size={36 * size} className={cls} />;
    case 1:
      return (
        <svg viewBox="-50 -50 100 100" width={40 * size} height={40 * size} aria-hidden="true" className={cls}>
          <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
            <path d="M-26 -26L-12 -12M26 -26L12 -12M-26 26L-12 12M26 26L12 12" />
          </g>
          <path d={SPARKLE_G} fill="currentColor" />
          <circle r={5} style={{ fill: "var(--color-paper)" }} />
          <circle r={2.4} fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="-50 -50 100 100" width={38 * size} height={38 * size} aria-hidden="true" className={cls}>
          <CompassG />
          <path d={SPARKLE_G} transform="scale(0.45)" fill="currentColor" />
        </svg>
      );
  }
}

// ─── Entrance timeline (seconds after the chart first comes into view) ───────
// 1. faint stars appear · 2. lines draw · 3. each project star bursts into
// being, scattering a few motes · 4. its label follows · 5. the lines glint.
const LINE_T = (k: number) => 0.5 + k * 0.45;
const STAR_T = (i: number) => 1.15 + i * 0.5;
const LABEL_T = (i: number) => STAR_T(i) + 0.45;
const GLINT_T = (n: number) => STAR_T(Math.max(n - 1, 0)) + 0.7;
const MOTES = Array.from({ length: 6 }, (_, k) => {
  const a = ((k * 60 + 18) * Math.PI) / 180;
  const d = 26 + ((k * 7) % 4) * 5;
  return { dx: `${Math.round(Math.cos(a) * d)}px`, dy: `${Math.round(Math.sin(a) * d)}px` };
});

const delay = (s: number): CSSProperties => ({ transitionDelay: `${s}s` });

// Where each label sits relative to its star, and where it slides in from.
const LABEL_PLACE = {
  right: "left-10 text-left [transform:translateY(-50%)]",
  left: "right-10 text-right [transform:translateY(-50%)]",
  above: "bottom-9 left-0 text-center [transform:translateX(-50%)]",
  below: "left-0 top-9 text-center [transform:translateX(-50%)]",
} as const;
const LABEL_FROM = { right: "-translate-x-2", left: "translate-x-2", above: "translate-y-2", below: "-translate-y-2" } as const;
const once = (name: string, dur: number, at: number, timing = "ease-out"): CSSProperties => ({ animation: `${name} ${dur}s ${timing} ${at}s both` });

type Coords = { ra: string; dec: string };

type ChartProps = {
  layout: Layout;
  projects: Project[];
  coords: Coords[];
  lit: number | null;
  reduce: boolean;
  shown: boolean;
  onJump: (i: number) => void;
  onLight: (i: number | null) => void;
  className?: string;
};

/** The star chart: map markings, constellation lines, and one link per project star. */
function Chart({ layout, projects, coords, lit, reduce, shown, onJump, onLight, className }: ChartProps) {
  const { w, h, stars, segments } = layout;
  const n = projects.length;

  // Deterministic background: faint stars (twinkling in three groups) and a few drifting motes.
  const twinkles = useMemo(
    () =>
      Array.from({ length: Math.round((w * h) / 9000) }, (_, i) => ({
        x: Math.round((i * 137.5 + 31) % w),
        y: Math.round((i * 73.3 + 19) % h),
        r: 0.6 + ((i * 7) % 5) / 8,
      })),
    [w, h],
  );
  const motes = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ x: Math.round(w * (0.12 + i * 0.19)), y: Math.round(h * (0.2 + ((i * 0.37) % 0.65))), dur: 9 + i * 1.7 })),
    [w, h],
  );

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  // Light the hovered/focused star from either the chart or its entry.
  const pointer = (i: number | null) => (e: PointerEvent) => e.pointerType === "mouse" && onLight(i);

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative overflow-hidden rounded-[22px] border border-moon/25 bg-paper/90 shadow-[0_40px_90px_-60px_var(--shadow-deep)]"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <Corners inset="10px" />

        {/* 1 · Faint stars appear group by group, then twinkle. Three scattered
            groups, each one SVG fading as a whole on the GPU (no repainting). */}
        {[0, 1, 2].map((c) => (
          <div key={c} aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-1000", shown ? "opacity-70" : "opacity-0")} style={delay(0.1 + c * 0.25)}>
            <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" style={{ animation: `twinkle-soft ${4.5 + c * 2}s ease-in-out ${-c * 1.7}s infinite` }}>
              <g fill="var(--color-cream)">
                {twinkles
                  .filter((_, i) => i % 3 === c)
                  .map((s, i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r} />
                  ))}
              </g>
            </svg>
          </div>
        ))}
        {/* Turning compass at the chart's corner */}
        <div
          aria-hidden="true"
          className={cn("absolute text-moon transition-opacity duration-[1400ms]", shown ? "opacity-100" : "opacity-0")}
          style={{ left: pct(w - 41.5, w), top: pct(26.5, h), width: pct(15, w), aspectRatio: "1" }}
        >
          <svg viewBox="-50 -50 100 100" className="animate-spin-slow block h-full w-full overflow-visible">
            <CompassG />
          </svg>
        </div>
        {/* Drifting motes */}
        {motes.map((m, i) => (
          <span
            key={`m${i}`}
            aria-hidden="true"
            className="absolute h-[2.6px] w-[2.6px] rounded-full bg-cream opacity-45"
            style={{ left: pct(m.x, w), top: pct(m.y, h), animation: `float-y ${m.dur}s ease-in-out ${-i * 2}s infinite` }}
          />
        ))}

        <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full text-moon">
          {/* Map markings */}
          <g className={cn("transition-opacity duration-[1400ms]", shown ? "opacity-100" : "opacity-0")}>
            <g stroke="currentColor" strokeWidth={0.5} strokeDasharray="1 6" opacity={0.35}>
              {[0.25, 0.5, 0.75].map((t) => (
                <line key={`h${t}`} x1={14} x2={w - 14} y1={h * t} y2={h * t} />
              ))}
              {[0.25, 0.5, 0.75].map((t) => (
                <line key={`v${t}`} y1={14} y2={h - 14} x1={w * t} x2={w * t} />
              ))}
            </g>
            <ellipse
              cx={w * 0.6}
              cy={h * 0.58}
              rx={w * 0.5}
              ry={h * 0.3}
              transform={`rotate(-14 ${w * 0.6} ${h * 0.58})`}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.6}
              strokeDasharray="3 7"
              opacity={0.28}
            />
            <g fill="currentColor" opacity={0.75} style={{ fontFamily: "var(--font-caps)", fontSize: 9.5, letterSpacing: "0.14em" }}>
              {[6, 12, 18].map((hr, k) => (
                <text key={hr} x={w * (0.25 + k * 0.25) + 4} y={h - 12}>
                  RA {hr}h
                </text>
              ))}
              {["+30°", "0°", "−30°"].map((d, k) => (
                <text key={d} x={18} y={h * (0.25 + k * 0.25) - 4}>
                  {d}
                </text>
              ))}
              <text x={30} y={32} style={{ fontSize: 10.5, letterSpacing: "0.26em" }}>
                CONSTELLATIO {CONSTELLATION.toUpperCase()}
              </text>
            </g>
          </g>

          {/* 2 · Constellation lines draw themselves */}
          {segments.map((s, k) => {
            const on = lit === s.a || lit === s.b;
            return (
              <g key={k}>
                <path
                  d={s.branch.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.6}
                  strokeDasharray="2 4"
                  className={cn("transition-opacity duration-1000", shown ? "opacity-60" : "opacity-0")}
                  style={delay(LINE_T(k) + 1.1)}
                />
                <g>
                  <path
                    d={s.d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.9}
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray="1"
                    opacity={0.6}
                    className={cn("transition-[stroke-dashoffset] duration-[1600ms] ease-out", shown ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]")}
                    style={delay(LINE_T(k))}
                  />
                </g>
                {/* 5 · Once the figure is complete, every line glints once */}
                {shown && !reduce && (
                  <path d={s.d} fill="none" stroke="var(--color-cream)" strokeWidth={1.3} strokeLinejoin="round" style={once("line-glint", 1.6, GLINT_T(n) + k * 0.15, "ease-in-out")} />
                )}
                {/* Lit when either of its stars (or their entries) is hovered or focused */}
                <path
                  d={s.d}
                  fill="none"
                  stroke="var(--color-cream)"
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                  className={cn("transition-opacity duration-500", shown && on ? "opacity-85" : "opacity-0")}
                />
                {/* Light travelling between the stars */}
                {shown && !reduce && (
                  <path
                    d={s.d}
                    fill="none"
                    stroke="var(--color-cream)"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="0.08 2"
                    style={{ animation: `travel ${7 + k * 2.3}s linear ${GLINT_T(n) + 1.5 + k * 1.7}s infinite`, opacity: 0 }}
                  />
                )}
                {[...s.minors, ...s.branch.pts].map((m, j) => (
                  <g key={j} transform={`translate(${m.x} ${m.y})`}>
                    <circle
                      r={j < 2 ? 2.3 : 1.6}
                      fill="var(--color-cream)"
                      className={cn("transition-opacity duration-700", shown ? "opacity-90" : "opacity-0")}
                      style={delay(LINE_T(k) + 0.5 + j * 0.25)}
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {/* An occasional particle travelling the whole figure */}
          {shown && !reduce && segments.length > 0 && (
            <g opacity={0}>
              <circle r={7} fill="var(--color-cream)" opacity={0.25} />
              <circle r={2.2} fill="var(--color-cream)" />
              <animateMotion dur="16s" begin="6s" repeatCount="indefinite" path={layout.path} keyPoints="0;1;1" keyTimes="0;0.45;1" calcMode="linear" />
              <animate attributeName="opacity" dur="16s" begin="6s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.04;0.41;0.45;1" />
            </g>
          )}
        </svg>

        {/* Project stars — every one always visible, each a link to its entry below */}
        <ul aria-label="Project stars" className="absolute inset-0">
          {stars.map((s, i) => {
            const p = projects[i];
            const on = lit === i;
            return (
              <li key={p.slug} className="absolute" style={{ left: pct(s.x, w), top: pct(s.y, h) }}>
                {/* 3 · The star is discovered: a burst of light and a few scattering motes */}
                {shown && !reduce && (
                  <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0">
                    <span
                      className="absolute -left-10 -top-10 h-20 w-20 rounded-full border border-cream/70 bg-[radial-gradient(closest-side,var(--halo-core),transparent)]"
                      style={once("star-burst", 1.5, STAR_T(i))}
                    />
                    {MOTES.map((m, k) => (
                      <span
                        key={k}
                        className="absolute -left-[2px] -top-[2px] h-1 w-1 rounded-full bg-cream"
                        style={{ ["--dx" as string]: m.dx, ["--dy" as string]: m.dy, ...once("mote-out", 1.3, STAR_T(i) + 0.05 + k * 0.03) }}
                      />
                    ))}
                  </span>
                )}

                <div
                  className={cn("transition-[opacity,scale] duration-[1100ms] ease-out-expo", shown ? "scale-100 opacity-100" : "scale-50 opacity-0")}
                  style={delay(STAR_T(i))}
                >
                  <a
                    href={`#project-${p.slug}`}
                    aria-label={`${p.name}, project ${roman(i + 1)}: go to its details`}
                    onClick={(e) => {
                      e.preventDefault();
                      onJump(i);
                    }}
                    onPointerEnter={pointer(i)}
                    onPointerLeave={pointer(null)}
                    onFocus={() => onLight(i)}
                    onBlur={() => onLight(null)}
                    className="group/star absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-offset-4"
                  >
                    {/* Halo: breathes on its own rhythm; grows and brightens when lit */}
                    <span
                      aria-hidden="true"
                      className={cn("pointer-events-none absolute -inset-7 transition-[scale] duration-700 ease-out-expo", on ? "scale-140" : "group-hover/star:scale-125")}
                    >
                      <span
                        className={cn(
                          "block h-full w-full rounded-full bg-[radial-gradient(closest-side,var(--halo-core),var(--halo-edge)_55%,transparent)] transition-[filter] duration-700",
                          on && "brightness-130",
                        )}
                        style={{ animation: `breathe ${5.5 + i * 1.6}s ease-in-out ${-i * 2.2}s infinite` }}
                      />
                    </span>
                    {/* Turning ring */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 64 64"
                      className={cn("absolute inset-0 animate-spin-slow transition-opacity duration-700", on ? "opacity-95" : "opacity-45 group-hover/star:opacity-80")}
                    >
                      <circle cx="32" cy="32" r="29" fill="none" stroke="var(--color-moon)" strokeWidth="0.8" strokeDasharray="1.5 5" strokeLinecap="round" />
                    </svg>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative flex transition-[scale,filter] duration-500 ease-out-expo",
                        on ? "scale-120 drop-shadow-[0_0_12px_var(--star-glow)]" : "drop-shadow-[0_0_5px_var(--star-glow-soft)]",
                      )}
                    >
                      <StarGlyph variant={i} />
                    </span>
                  </a>
                </div>

                {/* 4 · Label: identifier, name and coordinates (the link carries the accessible name) */}
                <div
                  aria-hidden="true"
                  onClick={() => onJump(i)}
                  onPointerEnter={pointer(i)}
                  onPointerLeave={pointer(null)}
                  className={cn(
                    "absolute w-max max-w-[11rem] cursor-pointer transition-[opacity,translate] duration-1000 ease-out-expo",
                    LABEL_PLACE[s.label.side],
                    shown ? "translate-x-0 translate-y-0 opacity-100" : `${LABEL_FROM[s.label.side]} opacity-0`,
                  )}
                  style={{ ...(s.label.side === "left" || s.label.side === "right" ? { top: s.label.dy * s.label.lift } : {}), ...delay(LABEL_T(i)) }}
                >
                  <p className="eyebrow text-[0.6rem] tracking-[0.22em]">
                    <Bayer i={i} /> {CONSTELLATION} · {roman(i + 1)}
                  </p>
                  <p
                    className={cn(
                      "display text-[1.35rem] leading-tight transition-[color,text-shadow] duration-500 sm:text-[1.5rem]",
                      on ? "text-accent [text-shadow:0_0_16px_var(--text-glow)]" : "text-ink/85",
                    )}
                  >
                    {p.name}
                  </p>
                  <p className="font-caps text-[0.55rem] tracking-[0.16em] text-faint">
                    RA {coords[i].ra} · Dec {coords[i].dec}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

type EntryProps = { project: Project; index: number; coords: Coords; on: boolean; onLight: (i: number | null) => void };

/**
 * One project, always visible: preview and details side by side, alternating
 * sides down the list. Lights up together with its star.
 */
function ProjectEntry({ project: p, index: i, coords, on, onLight }: EntryProps) {
  const reverse = i % 2 === 1;
  // Hovering the entry, or focusing anything inside it, lights its star.
  const onFocus = (e: FocusEvent<HTMLElement>) => e.target !== e.currentTarget && onLight(i);
  const onBlur = (e: FocusEvent<HTMLElement>) => !e.currentTarget.contains(e.relatedTarget as Node | null) && onLight(null);

  return (
    <article
      id={`project-${p.slug}`}
      tabIndex={-1}
      aria-labelledby={`project-${p.slug}-title`}
      onPointerEnter={(e) => e.pointerType === "mouse" && onLight(i)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onLight(null)}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        "relative rounded-[28px] p-4 outline-none transition-[background-color,box-shadow] duration-700 ease-out-expo sm:p-6 lg:p-8",
        on
          ? "bg-card/45 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-moon)_45%,transparent),0_40px_90px_-60px_var(--star-glow-soft)]"
          : "shadow-[0_0_0_1px_transparent]",
      )}
    >
      <Corners inset="10px" className={cn("transition-opacity duration-700", on ? "opacity-100" : "opacity-0")} />
      <div className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-12">
        <FadeIn y={28} duration={1} className={cn("lg:col-span-7", reverse && "lg:order-2")}>
          <ProjectPreview project={p} />
        </FadeIn>

        <div className="lg:col-span-5">
          <FadeIn y={14}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                aria-hidden="true"
                className={cn(
                  "flex transition-[scale,filter] duration-500 ease-out-expo",
                  on ? "scale-115 drop-shadow-[0_0_8px_var(--star-glow)]" : "drop-shadow-[0_0_3px_var(--star-glow-soft)]",
                )}
              >
                <StarGlyph variant={i} size={0.55} />
              </span>
              <span className="eyebrow">
                <Bayer i={i} /> {CONSTELLATION} · Project {roman(i + 1)}
              </span>
              <StatusChip status={p.status} />
            </div>
            <p aria-hidden="true" className="mt-1.5 font-caps text-[0.58rem] tracking-[0.16em] text-faint">
              RA {coords.ra} · Dec {coords.dec}
            </p>
          </FadeIn>
          <FadeIn y={14} delay={0.08}>
            <h3 id={`project-${p.slug}-title`} className="display mt-4 text-[clamp(2.4rem,4vw,3.4rem)]">
              {p.name}
            </h3>
            <p className="label mt-1">{p.category}</p>
          </FadeIn>
          <FadeIn y={14} delay={0.16}>
            <p className="mt-5 leading-relaxed text-mute">{p.description}</p>
          </FadeIn>
          <FadeIn y={14} delay={0.24}>
            <TechTags items={p.technologies} className="mt-6" />
          </FadeIn>
          <FadeIn y={14} delay={0.32} className="mt-8">
            <ProjectLinks project={p} />
          </FadeIn>
        </div>
      </div>
    </article>
  );
}

/**
 * The Projects section as a star chart with every project visible at once.
 * Each project is a major star in the chart and an entry below it; hovering
 * or focusing either lights both, and selecting a star glides to its entry.
 * The chart's entrance plays once, the first time it comes into view.
 */
export default function ProjectConstellation({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const shown = useInView(root, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotionSafe();
  const [hovered, setHovered] = useState<number | null>(null);
  const [flash, setFlash] = useState<number | null>(null);
  const flashTimer = useRef<number | undefined>(undefined);
  const lit = hovered ?? flash;

  const wide = useMemo(() => wideLayout(projects.length), [projects.length]);
  const desktop = useMemo(() => desktopLayout(projects.length), [projects.length]);
  const mobile = useMemo(() => mobileLayout(projects.length), [projects.length]);
  // One set of coordinates per project, whichever chart is showing.
  const coords = useMemo(() => wide.stars.map(({ ra, dec }) => ({ ra, dec })), [wide]);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const onJump = useCallback(
    (i: number) => {
      const el = document.getElementById(`project-${projects[i].slug}`);
      if (!el) return;
      // Move focus with the view (for keyboard and screen-reader users), then glide there.
      el.focus({ preventScroll: true });
      glideToElement(el, reduce);
      // Light the entry for a moment so it's clear where you've landed.
      window.clearTimeout(flashTimer.current);
      setFlash(i);
      flashTimer.current = window.setTimeout(() => setFlash(null), 2600);
    },
    [projects, reduce],
  );

  const chart = { projects, coords, lit, reduce, shown, onJump, onLight: setHovered };

  return (
    <div ref={root}>
      {/* The chart: panoramic on large screens, compact on tablets, vertical on phones */}
      <Chart {...chart} layout={wide} className="hidden lg:block" />
      <Chart {...chart} layout={desktop} className="hidden md:block lg:hidden" />
      <Chart {...chart} layout={mobile} className="mx-auto max-w-[420px] md:hidden" />
      <p className={cn("label mt-4 flex items-center gap-2 transition-opacity duration-1000", shown ? "opacity-100" : "opacity-0")} style={delay(GLINT_T(projects.length))}>
        <Sparkle size={9} className="text-moon" />
        <span className="hidden md:inline">Every star is a project below. Select one to go straight to it.</span>
        <span className="md:hidden">Every star is a project below. Tap one to go straight to it.</span>
      </p>

      {/* Every project, all visible at once, joined by a thread of light */}
      <div className="mt-14 lg:mt-20">
        {projects.map((p, i) => (
          <Fragment key={p.slug}>
            {i > 0 && (
              <div aria-hidden="true" className="flex flex-col items-center py-6 text-moon sm:py-8">
                <span className="h-12 w-px bg-linear-to-b from-transparent to-moon/60" />
                <Sparkle size={11} className="my-1.5 animate-twinkle [animation-duration:5s]" />
                <span className="h-12 w-px bg-linear-to-t from-transparent to-moon/60" />
              </div>
            )}
            <ProjectEntry project={p} index={i} coords={coords[i]} on={lit === i} onLight={setHovered} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
