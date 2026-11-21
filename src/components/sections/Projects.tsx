import { FeaturedProject, ProjectCard } from "@/components/projects/ProjectCard";
import ProjectPlaceholder from "@/components/projects/ProjectPlaceholder";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";

export default function Projects() {
  const featured = projects.filter((p) => p.featured && !p.placeholder);
  const rest = projects.filter((p) => !(p.featured && !p.placeholder));

  return (
    <section id="work" aria-labelledby="work-title" className="shell py-16 sm:py-20">
      <SectionHeading id="work-title" title="Projects" description="Things I've built while learning web development." />

      <div className="mt-14 space-y-24">
        {featured.map((p) => (
          <FeaturedProject key={p.slug} project={p} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-24">
          <FadeIn>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.02em]">Up next</h3>
          </FadeIn>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <FadeIn as="li" key={p.slug} delay={i * 0.06} className="h-full">
                {p.placeholder ? <ProjectPlaceholder project={p} /> : <ProjectCard project={p} />}
              </FadeIn>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
