import type { TimelineEntry } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
//  JOURNEY — education, work, leadership, projects and milestones.
//  Newest first. `period` and `org` are optional. Add an entry by copying one.
//  kind: "education" | "work" | "leadership" | "project" | "milestone" | "learning"
// ─────────────────────────────────────────────────────────────────────────────

export const journey: TimelineEntry[] = [
  {
    title: "Public Information Officer",
    org: "CETSO department",
    period: "2026 – 2027",
    description: "School committee role.",
    kind: "leadership",
  },
  {
    title: "Shipped BeanZz",
    org: "Personal project",
    description: "My first full web app: a manhwa reader built with Next.js on the MangaDex API.",
    kind: "project",
  },
  {
    title: "BS Information Technology",
    org: "2nd year student",
    period: "Present",
    description: "Learning programming and web development.",
    kind: "education",
    current: true,
  },
  {
    title: "Small Business Owner",
    org: "Laptop seller, Facebook Marketplace",
    period: "4 years",
    description: "Sold laptops and handled listings and customer support.",
    kind: "work",
  },
  {
    title: "Next milestone",
    description: "Add your school, past roles, or achievements in src/data/experience.ts.",
    kind: "milestone",
    placeholder: true,
  },
];
