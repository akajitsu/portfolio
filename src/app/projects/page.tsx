import type { Metadata } from "next";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: `Projects | ${profile.name}` };

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-6 max-w-prose leading-relaxed">Things I have built while learning to code. More coming soon.</p>
      <ul className="mt-10 grid gap-4">
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} />
        ))}
      </ul>
    </div>
  );
}