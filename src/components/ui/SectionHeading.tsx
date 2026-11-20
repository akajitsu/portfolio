import type { ReactNode } from "react";
import FadeIn from "@/components/ui/FadeIn";
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
};

/**
 * Section header. Everything sits on one left edge — the same edge as the
 * section content below it.
 */
export default function SectionHeading({ title, description, aside, id, className, level = "h2" }: Props) {
  const H = level;
  return (
    <header className={cn("border-t border-line pt-8", className)}>
      <FadeIn className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <H id={id} className="font-display text-[clamp(2.4rem,5vw,3.75rem)] leading-[1] tracking-[-0.015em]">
          {title}
        </H>
        {aside}
      </FadeIn>
      {description && (
        <FadeIn delay={0.08}>
          <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-mute">{description}</p>
        </FadeIn>
      )}
    </header>
  );
}
