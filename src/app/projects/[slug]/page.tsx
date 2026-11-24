import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectLinks, StatusChip, TechTags } from "@/components/projects/ProjectCard";
import ProjectPreview from "@/components/projects/ProjectPreview";
import { OrnamentRule } from "@/components/celestial/Ornaments";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowRight } from "@/components/ui/Icons";
import { getProject, realProjects } from "@/data/projects";
import { displayHost } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return realProjects.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    openGraph: project.thumbnail ? { images: [{ url: project.thumbnail.src, alt: project.thumbnail.alt }] } : undefined,
  };
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const others = realProjects.filter((p) => p.slug !== project.slug);
  const facts: [string, string | undefined][] = [
    ["Category", project.category],
    ["Year", project.year],
    ["Website", displayHost(project.liveUrl)],
  ];

  return (
    <article className="shell pb-24 pt-32">
      <FadeIn trigger="mount" y={6}>
        <Link href="/#work" className="inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-accent">
          <ArrowRight size={14} className="rotate-180" /> All projects
        </Link>
      </FadeIn>

      <header className="mt-8">
        <OrnamentRule align="start" />
        <FadeIn trigger="mount" className="mt-8">
          <StatusChip status={project.status} />
          <h1 className="display mt-3 text-[clamp(3rem,7.5vw,6rem)]">{project.name}</h1>
        </FadeIn>
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <FadeIn trigger="mount" delay={0.1} className="lg:col-span-7">
            <p className="text-xl leading-relaxed">{project.description}</p>
            <div className="mt-8">
              <ProjectLinks project={project} showDetail={false} />
            </div>
          </FadeIn>
          <FadeIn trigger="mount" delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-moon/25 border-y border-moon/25">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="label">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
            </dl>
            <TechTags items={project.technologies} className="mt-5" />
          </FadeIn>
        </div>
      </header>

      <FadeIn y={40} className="mt-20">
        <ProjectPreview project={project} priority />
      </FadeIn>

      {(project.highlights?.length || project.details?.length) && (
        <section className="mt-28 grid gap-10 border-t border-moon/25 pt-8 lg:grid-cols-12" aria-labelledby="overview-title">
          <h2 id="overview-title" className="display text-4xl lg:col-span-4">
            Overview
          </h2>
          <div className="lg:col-span-8">
            {project.details?.map((d, i) => (
              <FadeIn key={i} as="p" className="mb-5 text-lg leading-relaxed">
                {d}
              </FadeIn>
            ))}
            {project.highlights && (
              <dl className="mt-6 divide-y divide-moon/25 border-y border-moon/25">
                {project.highlights.map((h) => (
                  <FadeIn key={h.title} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="display text-[1.2rem] italic">{h.title}</dt>
                    <dd className="leading-relaxed text-mute">{h.body}</dd>
                  </FadeIn>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {project.previews && project.previews.length > 0 && (
        <section className="mt-24 border-t border-moon/25 pt-8" aria-labelledby="screens-title">
          <h2 id="screens-title" className="display text-4xl">
            Screenshots
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {project.previews.map((img) => (
              <FadeIn key={img.src} as="article">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-moon/30 bg-paper-2">
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
                </div>
                <p className="label mt-3">{img.alt}</p>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="More projects" className="mt-28 border-t border-moon/25 pt-8">
        <Link href={others[0] ? `/projects/${others[0].slug}` : "/#work"} className="group flex items-end justify-between gap-6">
          <span>
            <span className="label">{others[0] ? "Next project" : "Back to"}</span>
            <span className="display mt-1 block text-[clamp(2.2rem,4.8vw,3.8rem)] italic transition-colors group-hover:text-accent">
              {others[0]?.name ?? "All projects"}
            </span>
          </span>
          <ArrowRight size={32} className="mb-2 shrink-0 text-moon transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </nav>
    </article>
  );
}
