import Image from "next/image";
import Link from "next/link";
import { EightStar, roman } from "@/components/celestial/Ornaments";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import ProjectPreview from "@/components/projects/ProjectPreview";
import type { Project, ProjectStatus } from "@/types";
import { cn, isUsableLink } from "@/lib/utils";

const STATUS: Record<ProjectStatus, { label: string; lit: boolean }> = {
  live: { label: "Live", lit: true },
  "in-development": { label: "In progress", lit: false },
  "coming-soon": { label: "Planned", lit: false },
  archived: { label: "Archived", lit: false },
};

export function StatusChip({ status }: { status: ProjectStatus }) {
  const s = STATUS[status];
  return (
    <span className="eyebrow inline-flex items-center gap-1.5">
      <EightStar size={10} className={s.lit ? "animate-twinkle text-moon [animation-duration:4s]" : "text-faint"} />
      {s.label}
    </span>
  );
}

export function TechTags({ items, className }: { items: string[]; className?: string }) {
  if (!items.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="rounded-full border border-moon/35 px-3 py-1 text-xs tracking-[0.02em] text-mute">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Action buttons — only links that actually exist are rendered. */
export function ProjectLinks({ project, showDetail = true }: { project: Project; showDetail?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {isUsableLink(project.liveUrl) && (
        <Button href={project.liveUrl} external icon={<ArrowUpRight size={16} />}>
          Live website
        </Button>
      )}
      {showDetail && (
        <Button href={`/projects/${project.slug}`} variant="secondary" icon={<ArrowRight size={16} />}>
          View project
        </Button>
      )}
      {isUsableLink(project.githubUrl) && (
        <Button href={project.githubUrl} external variant="ghost" icon={<ArrowUpRight size={16} />}>
          Source code
        </Button>
      )}
    </div>
  );
}

/**
 * Large editorial presentation: text on one side, the clickable preview on
 * the other. Pass `reverse` to alternate sides down the page.
 */
export function FeaturedProject({ project, index, reverse = false }: { project: Project; index?: number; reverse?: boolean }) {
  return (
    <article className="group/project relative grid items-center gap-x-14 gap-y-12 lg:grid-cols-12">
      <div className={cn("relative order-2 lg:col-span-5", reverse ? "lg:order-2 lg:col-start-8 lg:row-start-1" : "lg:order-1")}>
        <FadeIn>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {index && (
              <span aria-hidden="true" className="font-display text-base font-semibold tracking-[0.08em] text-moon">
                {roman(index)}
              </span>
            )}
            <StatusChip status={project.status} />
            <span aria-hidden="true" className="h-px w-5 bg-moon/40" />
            <span className="label">{project.category}</span>
            {project.year && <span className="label">{project.year}</span>}
          </div>
          <h3 className="display mt-4 text-[clamp(2.6rem,5vw,3.9rem)]">
            <Link href={`/projects/${project.slug}`} className="transition-colors duration-500 hover:text-accent">
              {project.name}
            </Link>
          </h3>
          <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-mute">{project.description}</p>
        </FadeIn>

        {project.highlights && project.highlights.length > 0 && (
          <dl className="mt-8 border-t border-moon/25">
            {project.highlights.map((h, i) => (
              <FadeIn key={h.title} delay={0.06 * i} className="grid gap-1 border-b border-moon/25 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="display text-[1.2rem] italic">{h.title}</dt>
                <dd className="text-[0.93rem] leading-relaxed text-mute">{h.body}</dd>
              </FadeIn>
            ))}
          </dl>
        )}

        <FadeIn delay={0.1}>
          <TechTags items={project.technologies} className="mt-8" />
          <div className="mt-8">
            <ProjectLinks project={project} />
          </div>
        </FadeIn>
      </div>

      <FadeIn y={40} duration={1} className={cn("order-1 lg:col-span-7", reverse ? "lg:order-1 lg:col-start-1 lg:row-start-1" : "lg:order-2")}>
        <ProjectPreview project={project} />
      </FadeIn>
    </article>
  );
}

/** Compact card for non-featured real projects. The image opens the live site. */
export function ProjectCard({ project }: { project: Project }) {
  const live = isUsableLink(project.liveUrl) ? project.liveUrl : undefined;
  const image = (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-moon/25 bg-paper-2">
      {project.thumbnail ? (
        <Image
          src={project.thumbnail.src}
          alt={project.thumbnail.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover/project:scale-105"
        />
      ) : (
        <div className="hatch absolute inset-0" aria-hidden="true" />
      )}
    </div>
  );

  return (
    <article className="group/project relative flex h-full flex-col overflow-hidden rounded-2xl border border-moon/30 bg-card/80 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-moon/70">
      {live ? (
        <a href={live} target="_blank" rel="noopener noreferrer" aria-label={`Visit the ${project.name} website (opens in a new tab)`} className="relative z-10 block">
          {image}
        </a>
      ) : (
        image
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label">{project.category}</span>
          <StatusChip status={project.status} />
        </div>
        <h3 className="display mt-2 text-3xl">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{project.description}</p>
        <TechTags items={project.technologies} className="mt-5" />
      </div>
    </article>
  );
}
