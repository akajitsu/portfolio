import ImageSlot from "@/components/ui/ImageSlot";
import type { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <ImageSlot src={project.image} alt={project.title} ratio="aspect-video" />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h2 className="font-medium">{project.title}</h2>
        {project.placeholder && <span className="shrink-0 text-xs text-mute">Placeholder</span>}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-mute">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((t) => (
          <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-mute">{t}</li>
        ))}
      </ul>
    </>
  );

  const base = "block rounded-xl border border-line bg-card p-4 transition-colors";
  if (project.placeholder) return <li className={base}>{body}</li>;

  return (
    <li>
      <a href={project.href} target="_blank" rel="noreferrer" className={`${base} hover:border-accent`}>
        {body}
      </a>
    </li>
  );
}