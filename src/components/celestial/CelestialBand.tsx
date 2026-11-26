import type { ReactNode } from "react";
import {
  CompassG,
  CrescentG,
  DottedBurstG,
  HangingCrescentG,
  LeafG,
  MoonFaceG,
  SPARKLE_G,
  SunBurstG,
  TripleMoonG,
} from "@/components/celestial/Ornaments";
import { cn } from "@/lib/utils";

/** `anim` animates the whole small SVG (a GPU layer), never shapes inside it. */
type Item = { w: number; box: string; tone: string; node: ReactNode; anim?: string };

// One "repeat" of the pattern illustration, laid out in a line.
const ITEMS: Item[] = [
  { w: 66, box: "-60 -20 120 40", tone: "text-cream", node: <TripleMoonG /> },
  { w: 16, box: "-50 -50 100 100", tone: "text-cream", node: <path d={SPARKLE_G} fill="currentColor" />, anim: "animate-twinkle" },
  { w: 52, box: "-50 -50 100 100", tone: "text-bronze", node: <SunBurstG /> },
  { w: 44, box: "-50 -50 100 100", tone: "text-moon", node: <MoonFaceG /> },
  { w: 30, box: "-50 -50 100 100", tone: "text-bronze", node: <DottedBurstG /> },
  { w: 30, box: "-50 -50 100 140", tone: "text-cream", node: <HangingCrescentG /> },
  { w: 10, box: "-50 -50 100 100", tone: "text-cream", node: <path d={SPARKLE_G} fill="currentColor" />, anim: "animate-twinkle [animation-delay:-2s]" },
  { w: 34, box: "-50 -50 100 100", tone: "text-moon", node: <g transform="rotate(70)"><LeafG /></g> },
  { w: 26, box: "-50 -50 100 100", tone: "text-cream", node: <CrescentG deg={60} /> },
  { w: 22, box: "-50 -50 100 100", tone: "text-moon", node: <CompassG /> },
  { w: 40, box: "-50 -50 100 100", tone: "text-bronze", node: <SunBurstG /> },
  { w: 14, box: "-50 -50 100 100", tone: "text-cream", node: <path d={SPARKLE_G} fill="currentColor" />, anim: "animate-twinkle [animation-delay:-3.5s]" },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
      {ITEMS.map((it, i) => (
        <svg key={i} viewBox={it.box} width={it.w} height={(it.w * Number(it.box.split(" ")[3])) / Number(it.box.split(" ")[2])} className={cn("shrink-0 overflow-visible", it.tone, it.anim)}>
          {it.node}
        </svg>
      ))}
    </div>
  );
}

/**
 * A slowly scrolling band of celestial motifs between hairlines — the pattern
 * illustration as a ribbon. Pauses on hover; still under reduced motion.
 */
export default function CelestialBand({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" data-pause-offscreen="" className={cn("relative py-5", className)}>
      <div className="rule-fade" />
      <div className="mask-fade-x overflow-hidden py-5">
        <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
          <Row />
          <Row />
          <Row />
          <Row />
        </div>
      </div>
      <div className="rule-fade" />
    </div>
  );
}
