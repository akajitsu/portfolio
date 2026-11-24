import type { Metadata } from "next";
import { FeaturedProject, ProjectCard } from "@/components/projects/ProjectCard";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { realProjects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects", description: "Things I've built while learning web development." };

export default function ProjectsPage() {
  const featured = realProjects.filter((p) => p.featured);
  const rest = realProjects.filter((p) => !p.featured);

  return (
    <div className="shell pb-24 pt-32">
      <SectionHeading level="h1" eyebrow="Work" title="Projects" description="Things I've built while learning web development." />
      <div className="mt-20 space-y-32">
        {featured.map((p, i) => (
          <FeaturedProject key={p.slug} project={p} index={i + 1} reverse={i % 2 === 1} />
        ))}
      </div>
      {rest.length > 0 && (
        <ul className="mt-28 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <FadeIn as="li" key={p.slug} delay={i * 0.06} className="h-full">
              <ProjectCard project={p} />
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}
