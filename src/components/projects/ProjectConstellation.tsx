"use client";
import { useInView } from "motion/react";
import { useCallback, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { CompassG, Corners, EightStar, OrnamentRule, Sparkle, SPARKLE_G, roman } from "@/components/celestial/Ornaments";
import { ProjectLinks, StatusChip, TechTags } from "@/components/projects/ProjectCard";
import ProjectPreview from "@/components/projects/ProjectPreview";
import { GREEK, desktopLayout, mobileLayout, wideLayout, type Layout } from "@/components/projects/constellation-layout";
import type { Project } from "@/types";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const CONSTELLATION = "Operum"; // "of the works" — the constellation's name

/** Bayer letter in a lowercase serif, so the engraved-capitals label can't turn α into "A". */
const Bayer = ({ i }: { i: number }) => (
  <span className="font-display text-[1.15em] normal-case tracking-normal">{GREEK[i] ?? i + 1}</span>
);

/** A distinct star for each project; cycles if there are more projects. */
function StarGlyph({ variant }: { variant: number }): ReactNode {
  switch (variant % 3) {
    case 0:
      return <EightStar size={36} className="text-moon dark:text-cream" />;
    case 1:
      return (
        <svg viewBox="-50 -50 100 100" width={40} height={40} aria-hidden="true" className="text-moon dark:text-cream">
          <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
            <path d="M-26 -26L-12 -12M26 -26L12 -12M-26 26L-12 12M26 26L12 12" />
          </g>
          <path d={SPARKLE_G} fill="currentColor" />
          <circle r={5} fill="var(--color-paper)" />
          <circle r={2.4} fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="-50 -50 100 100" width={38} height={38} aria-hidden="true" className="text-moon dark:text-cream">
          <CompassG />
          <path d={SPARKLE_G} transform="scale(0.45)" fill="currentColor" />
        </svg>
      );
  }
}

const delay = (s: number): CSSProperties => ({ transitionDelay: `${s}s` });

type ChartProps = {
  layout: Layout;
  projects: Project[];
  selected: number;
  idPrefix: string;
  reduce: boolean;
  shown: boolean;
  onSelect: (i: number) => void;
  onHover: (i: number | null) => void;
  className?: string;
};

/** The star chart: map markings, constellation lines, and one button per project star. */
function Chart({ layout, projects, selected, idPrefix, reduce, shown, onSelect, onHover, className }: ChartProps) {
  const { w, h, stars, segments } = layout;
  const n = projects.length;

  // Deterministic background: twinkling stars and a few drifting motes.
  const twinkles = useMemo(
    () =>
      Array.from({ length: Math.round((w * h) / 9000) }, (_, i) => ({
        x: Math.round((i * 137.5 + 31) % w),
        y: Math.round((i * 73.3 + 19) % h),
        r: 0.6 + ((i * 7) % 5) / 8,
        dur: 3.5 + ((i * 0.7) % 4.2),
        delay: -((i * 1.3) % 6),
      })),
    [w, h],
  );
  const motes = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ x: Math.round(w * (0.12 + i * 0.19)), y: Math.round(h * (0.2 + ((i * 0.37) % 0.65))), dur: 9 + i * 1.7 })),
    [w, h],
  );

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const j = (next + n) % n;
    onSelect(j);
    document.getElementById(`${idPrefix}-tab-${j}`)?.focus();
  }

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-[22px] border border-moon/25 bg-paper/90 shadow-[0_40px_90px_-60px_var(--shadow-deep)]" style={{ aspectRatio: `${w} / ${h}` }}>
        <Corners inset="10px" />

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
            <ellipse cx={w * 0.6} cy={h * 0.58} rx={w * 0.5} ry={h * 0.3} transform={`rotate(-14 ${w * 0.6} ${h * 0.58})`} fill="none" stroke="currentColor" strokeWidth={0.6} strokeDasharray="3 7" opacity={0.28} />
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
            <g transform={`translate(${w - 34} 34) scale(0.15)`}>
              <CompassG className="origin-self animate-spin-slow" />
            </g>
          </g>

          {/* Distant stars and drifting motes */}
          <g fill="var(--color-cream)">
            {twinkles.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={0.7} className="origin-self" style={{ animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
            ))}
            {motes.map((m, i) => (
              <circle key={`m${i}`} cx={m.x} cy={m.y} r={1.3} opacity={0.45} style={{ animation: `float-y ${m.dur}s ease-in-out ${-i * 2}s infinite` }} />
            ))}
          </g>

          {/* Constellation */}
          {segments.map((s, k) => {
            const lit = selected === s.a || selected === s.b;
            const t0 = 0.35 + k * 0.6;
            return (
              <g key={k}>
                <path
                  d={s.branch.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.6}
                  strokeDasharray="2 4"
                  className={cn("transition-opacity duration-1000", shown ? "opacity-60" : "opacity-0")}
                  style={delay(t0 + 1.2)}
                />
                <g style={{ animation: "line-breathe 7s ease-in-out infinite", animationDelay: `${-k * 2.4}s` }}>
                  <path
                    d={s.d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.9}
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray="1"
                    opacity={0.6}
                    className={cn("transition-[stroke-dashoffset] duration-[1800ms] ease-out", shown ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:1]")}
                    style={delay(t0)}
                  />
                </g>
                {/* Highlight for the selected star's lines */}
                <path
                  d={s.d}
                  fill="none"
                  stroke="var(--color-cream)"
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                  className={cn("transition-opacity duration-700", shown && lit ? "opacity-80" : "opacity-0")}
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
                    style={{ animation: `travel ${7 + k * 2.3}s linear ${2.6 + k * 1.7}s infinite`, opacity: 0 }}
                  />
                )}
                {[...s.minors, ...s.branch.pts].map((m, j) => (
                  <g key={j} transform={`translate(${m.x} ${m.y})`}>
                    <circle
                      r={j < 2 ? 2.3 : 1.6}
                      fill="var(--color-cream)"
                      className={cn("transition-opacity duration-700", shown ? "opacity-90" : "opacity-0")}
                      style={{ ...delay(t0 + 0.4 + j * 0.25), animation: `twinkle ${4.5 + j * 1.3}s ease-in-out ${-j}s infinite` }}
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
              <animateMotion dur="16s" begin="5s" repeatCount="indefinite" path={layout.path} keyPoints="0;1;1" keyTimes="0;0.45;1" calcMode="linear" />
              <animate attributeName="opacity" dur="16s" begin="5s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.04;0.41;0.45;1" />
            </g>
          )}
        </svg>

        {/* Shooting star */}
        <span aria-hidden="true" className="pointer-events-none absolute left-[86%] top-[10%] -rotate-[28deg]">
          <span className="block h-px w-24 bg-linear-to-r from-cream to-transparent opacity-0" style={{ animation: "shoot 17s linear 7s infinite" }} />
        </span>

        {/* Project stars */}
        <div role="tablist" aria-label="Projects" className="absolute inset-0">
          {stars.map((s, i) => {
            const p = projects[i];
            const active = selected === i;
            const t0 = 0.25 + i * 0.6;
            return (
              <div key={p.slug} className="absolute" style={{ left: pct(s.x, w), top: pct(s.y, h) }}>
                {/* Entrance: the star illuminates */}
                <div className={cn("transition-[opacity,scale] duration-[1300ms] ease-out-expo", shown ? "scale-100 opacity-100" : "scale-50 opacity-0")} style={delay(t0)}>
                  <button
                    type="button"
                    role="tab"
                    id={`${idPrefix}-tab-${i}`}
                    aria-selected={active}
                    aria-controls={`project-panel-${i}`}
                    aria-label={`Project ${roman(i + 1)}: ${p.name}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => onSelect(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && onHover(i)}
                    onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
                    className="group/star absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-offset-4"
                  >
                    {/* Halo: breathes on its own rhythm; expands when selected or hovered */}
                    <span
                      aria-hidden="true"
                      className={cn("pointer-events-none absolute -inset-7 transition-[scale] duration-700 ease-out-expo group-hover/star:scale-125", active && "scale-125")}
                    >
                      <span
                        className={cn(
                          "block h-full w-full rounded-full bg-[radial-gradient(closest-side,var(--halo-core),var(--halo-edge)_55%,transparent)] transition-[filter] duration-700",
                          active && "brightness-125",
                        )}
                        style={{ animation: `breathe ${5.5 + i * 1.6}s ease-in-out ${-i * 2.2}s infinite` }}
                      />
                    </span>
                    {/* Turning ring */}
                    <svg aria-hidden="true" viewBox="0 0 64 64" className={cn("absolute inset-0 animate-spin-slow transition-opacity duration-700", active ? "opacity-90" : "opacity-40 group-hover/star:opacity-75")}>
                      <circle cx="32" cy="32" r="29" fill="none" stroke="var(--color-moon)" strokeWidth="0.8" strokeDasharray="1.5 5" strokeLinecap="round" />
                    </svg>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative flex transition-[scale,filter] duration-500 ease-out-expo group-hover/star:scale-115",
                        active ? "scale-115 drop-shadow-[0_0_10px_var(--star-glow)]" : "drop-shadow-[0_0_5px_var(--star-glow-soft)]",
                      )}
                    >
                      <StarGlyph variant={i} />
                    </span>
                  </button>
                </div>

                {/* Label: numeral, name and coordinates (the button carries the accessible name) */}
                <div
                  aria-hidden="true"
                  onClick={() => onSelect(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && onHover(i)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && onHover(null)}
                  className={cn(
                    "absolute w-max max-w-[11rem] cursor-pointer transition-[opacity,translate] duration-1000 ease-out-expo",
                    s.label.side === "right" ? "left-10 text-left" : "right-10 text-right",
                    shown ? "opacity-100" : "opacity-0",
                    shown ? "translate-x-0" : s.label.side === "right" ? "-translate-x-2" : "translate-x-2",
                  )}
                  style={{ top: s.label.dy * s.label.lift, transform: "translateY(-50%)", ...delay(t0 + 0.9) }}
                >
                  <p className="eyebrow text-[0.6rem] tracking-[0.22em]">
                    <Bayer i={i} /> {CONSTELLATION} · {roman(i + 1)}
                  </p>
                  <p
                    className={cn(
                      "display text-[1.35rem] leading-tight transition-[color,text-shadow] duration-500 sm:text-[1.5rem]",
                      active ? "text-accent [text-shadow:0_0_16px_var(--text-glow)]" : "text-ink/85",
                    )}
                  >
                    {p.name}
                  </p>
                  <p className="font-caps text-[0.55rem] tracking-[0.16em] text-faint">
                    RA {s.ra} · Dec {s.dec}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * The Projects section as an interactive star chart. Each project is a major
 * star (a tab); the selected star's project is shown in the panel beside it.
 * Hover (after a short pause), click, tap or arrow keys select a star.
 */
export default function ProjectConstellation({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const shown = useInView(root, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = useReducedMotionSafe();
  const [selected, setSelected] = useState(0);
  const hoverTimer = useRef<number | undefined>(undefined);

  const wide = useMemo(() => wideLayout(projects.length), [projects.length]);
  const desktop = useMemo(() => desktopLayout(projects.length), [projects.length]);
  const mobile = useMemo(() => mobileLayout(projects.length), [projects.length]);

  const onHover = useCallback((i: number | null) => {
    window.clearTimeout(hoverTimer.current);
    // A short pause, so sweeping the pointer across the chart doesn't flip the panel.
    if (i !== null) hoverTimer.current = window.setTimeout(() => setSelected(i), 110);
  }, []);

  const chart = { projects, selected, reduce, shown, onSelect: setSelected, onHover };

  return (
    <div ref={root}>
      {/* The chart: panoramic on large screens, compact on tablets, vertical on phones */}
      <Chart {...chart} layout={wide} idPrefix="cst-w" className="hidden lg:block" />
      <Chart {...chart} layout={desktop} idPrefix="cst-d" className="hidden md:block lg:hidden" />
      <Chart {...chart} layout={mobile} idPrefix="cst-m" className="mx-auto max-w-[420px] md:hidden" />
      <p className={cn("label mt-4 flex items-center gap-2 transition-opacity duration-1000", shown ? "opacity-100" : "opacity-0")} style={delay(2.2)}>
        <Sparkle size={9} className="text-moon" />
        <span className="hidden md:inline">Hover or select a star to discover its project.</span>
        <span className="md:hidden">Tap a star to discover its project.</span>
      </p>

      {/* Information panel — one per project, stacked in one cell so switching never shifts the layout */}
      <div
        className={cn("mt-14 grid transition-[opacity,translate] duration-1000 ease-out-expo lg:mt-16", shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}
        style={delay(1.1)}
      >
        {projects.map((p, i) => {
          const on = i === selected;
          return (
            <article
              key={p.slug}
              id={`project-panel-${i}`}
              role="tabpanel"
              aria-label={`${p.name} — project details`}
              inert={!on}
              className={cn(
                "[grid-area:1/1] transition-[opacity,translate] duration-700 ease-out-expo",
                on ? "translate-x-0 opacity-100 delay-150" : "pointer-events-none translate-x-4 opacity-0",
              )}
            >
              <OrnamentRule align="start" />
              {/* Large screens: big preview on the left (8 cols), details on the right (4 cols).
                  Smaller screens: heading, preview, then details. */}
              <div className="mt-8 grid gap-x-12 lg:grid-cols-12">
                <header className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="eyebrow">
                      <Bayer i={i} /> {CONSTELLATION} · Project {roman(i + 1)}
                    </span>
                    <StatusChip status={p.status} />
                  </div>
                  <h3 className="display mt-3 text-[clamp(2.6rem,4.6vw,3.8rem)]">{p.name}</h3>
                  <p className="label mt-1">{p.category}</p>
                </header>

                <div className="mt-8 pb-10 lg:col-span-8 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:pb-8">
                  <ProjectPreview project={p} />
                </div>

                <div className="mt-2 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:mt-6">
                  <p className="leading-relaxed text-mute">{p.description}</p>
                  <TechTags items={p.technologies} className="mt-6" />
                  <div className="mt-8">
                    <ProjectLinks project={p} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
