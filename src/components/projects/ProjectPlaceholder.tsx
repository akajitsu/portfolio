import { StatusChip } from "@/components/projects/ProjectCard";
import type { Project } from "@/types";

/**
 * A quiet "coming soon" card. Not a link — there's nothing to open yet.
 * Replace by editing the matching entry in src/data/projects.ts.
 */
export default function ProjectPlaceholder({ project }: { project: Project }) {
  return (
    <article
      aria-label={`${project.name}: ${project.category}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-line"
    >
      <div className="hatch aspect-[16/10] border-b border-dashed border-line" aria-hidden="true" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label">{project.category}</span>
          <StatusChip status={project.status} />
        </div>
        <h3 className="mt-2 font-display text-3xl text-mute">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mute">{project.description}</p>
      </div>
    </article>
  );
}
