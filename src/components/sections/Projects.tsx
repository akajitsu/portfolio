import ProjectConstellation from "@/components/projects/ProjectConstellation";
import SectionHeading from "@/components/ui/SectionHeading";
import { realProjects } from "@/data/projects";

/**
 * Home-page projects: every project is a star in an interactive constellation.
 * (The /projects page keeps the long-form editorial list.)
 */
export default function Projects() {
  return (
    <section id="work" aria-labelledby="work-title" className="py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          id="work-title"
          index={1}
          eyebrow="My creative universe"
          title="My Projects"
          description="Every project is a star in my universe."
        />
      </div>
      {/* Wider than the usual content column, so the chart and previews have room. */}
      <div className="mx-auto mt-14 w-full max-w-[1440px] px-5 sm:mt-16 sm:px-7 lg:px-10">
        <ProjectConstellation projects={realProjects} />
      </div>
    </section>
  );
}
