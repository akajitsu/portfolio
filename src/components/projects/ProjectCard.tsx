import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import ProjectPreview from "@/components/projects/ProjectPreview";
import type { Project, ProjectStatus } from "@/types";
import { cn, isUsableLink } from "@/lib/utils";

const STATUS: Record<ProjectStatus, { label: string; dot: string }> = {
  live: { label: "Live", dot: "bg-emerald-500" },
  "in-development": { label: "In progress", dot: "bg-amber-500" },
  "coming-soon": { label: "Planned", dot: "bg-faint" },
  archived: { label: "Archived", dot: "bg-faint" },
};

export function StatusChip({ status }: { status: ProjectStatus }) {
  const s = STATUS[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-mute">
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function TechTags({ items, className }: { items: string[]; className?: string }) {
  if (!items.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="rounded-md border border-line px-2.5 py-1 text-xs text-mute">
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

/** Large presentation for featured projects: text on the left, screenshots on the right. */
export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="group/project grid items-start gap-x-12 gap-y-12 lg:grid-cols-12">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <FadeIn>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <StatusChip status={project.status} />
            <span className="label">{project.category}</span>
            {project.year && <span className="label">{project.year}</span>}
          </div>
          <h3 className="mt-3 font-display text-[clamp(2.6rem,5vw,4rem)] leading-none tracking-[-0.015em]">
            <Link href={`/projects/${project.slug}`} className="transition-colors duration-300 hover:text-accent">
              {project.name}
            </Link>
          </h3>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-mute">{project.description}</p>
        </FadeIn>

        {project.highlights && project.highlights.length > 0 && (
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {project.highlights.map((h, i) => (
              <FadeIn key={h.title} delay={0.06 * i} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="font-medium">{h.title}</dt>
                <dd className="text-[0.95rem] leading-relaxed text-mute">{h.body}</dd>
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

      <FadeIn y={40} duration={1} className="order-1 lg:order-2 lg:col-span-7">
        <ProjectPreview project={project} />
      </FadeIn>
    </article>
  );
}

/** Compact card for non-featured real projects. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group/project relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-mute">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-paper-2">
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
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label">{project.category}</span>
          <StatusChip status={project.status} />
        </div>
        <h3 className="mt-2 font-display text-3xl">
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
