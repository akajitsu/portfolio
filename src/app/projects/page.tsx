import type { Metadata } from "next";
import { FeaturedProject, ProjectCard } from "@/components/projects/ProjectCard";
import ProjectPlaceholder from "@/components/projects/ProjectPlaceholder";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects", description: "Things I've built while learning web development." };

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured && !p.placeholder);
  const rest = projects.filter((p) => !(p.featured && !p.placeholder));

  return (
    <div className="shell pb-24 pt-32">
      <SectionHeading level="h1" title="Projects" description="Things I've built while learning web development. More coming soon." />
      <div className="mt-14 space-y-24">
        {featured.map((p) => (
          <FeaturedProject key={p.slug} project={p} />
        ))}
      </div>
      <ul className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <FadeIn as="li" key={p.slug} delay={i * 0.06} className="h-full">
            {p.placeholder ? <ProjectPlaceholder project={p} /> : <ProjectCard project={p} />}
          </FadeIn>
        ))}
      </ul>
    </div>
  );
}
