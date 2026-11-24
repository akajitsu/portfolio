import type { ReactNode } from "react";
import AnimatedRule from "@/components/celestial/AnimatedRule";
import { roman } from "@/components/celestial/Ornaments";
import Pendants from "@/components/celestial/Pendants";
import FadeIn from "@/components/ui/FadeIn";
import SplitText from "@/components/ui/SplitText";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  /** Optional element aligned to the right of the title (e.g. a link). */
  aside?: ReactNode;
  id?: string;
  className?: string;
  /** Heading level — keep the document outline correct. */
  level?: "h1" | "h2";
  /** Plate number shown as a Roman numeral above the title. */
  index?: number;
  /** Small catalogue label next to the numeral. */
  eyebrow?: string;
};

/**
 * Section header in the style of a star-atlas plate: an animated triple-moon
 * rule with ornaments hanging from it, a numeral + engraved label, then the
 * serif title, whose letters rise out of a blur.
 */
export default function SectionHeading({ title, description, aside, id, className, level = "h2", index, eyebrow }: Props) {
  const H = level;
  return (
    <header className={cn("relative", className)}>
      <AnimatedRule />
      <FadeIn y={-12} delay={0.3} duration={1.4} className="pointer-events-none absolute right-2 top-[11px] hidden w-[120px] md:block lg:right-8">
        <Pendants variant={index ?? 0} />
      </FadeIn>

      {(index || eyebrow) && (
        <FadeIn delay={0.05} y={10}>
          <p className="eyebrow mt-6 flex items-center gap-3">
            {index && <span className="text-sm text-moon">{roman(index)}</span>}
            {index && eyebrow && <span aria-hidden="true" className="h-px w-6 bg-moon/50" />}
            {eyebrow}
          </p>
        </FadeIn>
      )}
      <div className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-4", index || eyebrow ? "mt-3" : "mt-6")}>
        <H id={id} className="display text-[clamp(2.5rem,5.2vw,4.1rem)] text-balance">
          {typeof title === "string" ? <SplitText text={title} /> : title}
        </H>
        {aside && <FadeIn delay={0.2}>{aside}</FadeIn>}
      </div>
      {description && (
        <FadeIn delay={0.25}>
          <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-mute">{description}</p>
        </FadeIn>
      )}
    </header>
  );
}
