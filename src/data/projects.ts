import type { Project } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
//  PROJECTS — the single source for the Work section, /projects and the
//  /projects/[slug] detail pages.
//
//  To add a real project: copy the BeanZz entry, change the fields, and remove
//  one of the placeholders below. Optional fields can simply be left out —
//  missing links are never shown as buttons.
//
//  Screenshots go in /public/images/projects/ and are referenced like:
//    thumbnail: { src: "/images/projects/my-app.webp", alt: "My App home page" }
// ─────────────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "beanzz",
    name: "BeanZz",
    category: "Full-Stack Web Development",
    description:
      "BeanZz is a manhwa reading platform designed to provide users with a modern browsing and reading experience, powered by the MangaDex API.",
    // Verified against the live site: served by Next.js on Vercel, styled with
    // Tailwind CSS, data from the MangaDex API. Add "TypeScript" once confirmed.
    technologies: ["Next.js", "React", "Tailwind CSS", "MangaDex API", "Vercel"],
    liveUrl: "https://beanszz.vercel.app",
    // githubUrl: "https://github.com/your-name/beanzz",
    // year: "2026",
    thumbnail: { src: "/images/projects/beanzz-home.webp", alt: "BeanZz home page with a featured series and latest chapter updates", width: 1440, height: 900 },
    mobileThumbnail: { src: "/images/projects/beanzz-mobile.webp", alt: "BeanZz home page on a phone", width: 780, height: 1688 },
    previews: [
      { src: "/images/projects/beanzz-series.webp", alt: "BeanZz series page with synopsis, tags and chapter list", width: 1440, height: 900 },
      { src: "/images/projects/beanzz-reader.webp", alt: "BeanZz vertical chapter reader", width: 1440, height: 900 },
    ],
    featured: true,
    status: "live",
    highlights: [
      { title: "Home feed", body: "A featured carousel, the latest chapter updates, and popular rankings by all time, rating and new." },
      { title: "Series pages", body: "Synopsis, tags, ratings, available translations and a searchable chapter list." },
      { title: "Reader", body: "A vertical-scroll reader with chapter switching and a page counter." },
    ],
    details: [
      "BeanZz is my first full web application: a reader for manhwa, manga and manhua built on top of the public MangaDex API.",
      // TODO: add a paragraph or two about how you built it — problems you ran
      // into, what you learned, and what you'd do next.
    ],
  },
  {
    slug: "project-02",
    name: "Coming soon",
    category: "In progress",
    description: "I'm working on my next project. It'll show up here when it's ready.",
    technologies: [],
    status: "in-development",
    placeholder: true,
  },
  {
    slug: "project-03",
    name: "Coming soon",
    category: "Planned",
    description: "Reserved for a future project.",
    technologies: [],
    status: "coming-soon",
    placeholder: true,
  },
  {
    slug: "project-04",
    name: "Coming soon",
    category: "Planned",
    description: "Reserved for a future project.",
    technologies: [],
    status: "coming-soon",
    placeholder: true,
  },
];

export const realProjects = projects.filter((p) => !p.placeholder);
export const featuredProjects = projects.filter((p) => p.featured && !p.placeholder);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug && !p.placeholder);
