import type { SkillCategory } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
//  TECH STACK — only list what you've actually used. Categories with no skills
//  are hidden automatically. `level` is a short honest label (no percentages).
//  `icon` is optional: put an SVG in /public/images/icons/ and set
//  icon: "/images/icons/react.svg". Without it, a monogram tile is shown.
// ─────────────────────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    description: "What I've learned in school and on my own.",
    skills: [
      { name: "C++", level: "Basic", monogram: "C++" },
      { name: "Java", level: "Basic", monogram: "Jv" },
      { name: "JavaScript", level: "Basic", monogram: "JS" },
      { name: "HTML", level: "Basic", monogram: "</>" },
      { name: "CSS", level: "Basic", monogram: "{ }" },
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks & Libraries",
    description: "Used to build BeanZz.",
    skills: [
      { name: "Next.js", level: "Used in BeanZz", url: "https://nextjs.org", monogram: "N" },
      { name: "React", level: "Used in BeanZz", url: "https://react.dev", monogram: "Re" },
      { name: "Tailwind CSS", level: "Used in BeanZz", url: "https://tailwindcss.com", monogram: "Tw" },
    ],
  },
  {
    id: "platforms",
    title: "APIs & Platforms",
    skills: [
      { name: "MangaDex API", level: "Used in BeanZz", url: "https://api.mangadex.org/docs/", monogram: "MD" },
      { name: "Vercel", level: "Deployment", url: "https://vercel.com", monogram: "▲" },
    ],
  },
  {
    id: "tools",
    title: "Design & Tools",
    skills: [
      { name: "Canva", level: "Basic", monogram: "Ca" },
      { name: "Claude, Gemini, ChatGPT", level: "AI assistants", monogram: "AI" },
    ],
  },
  // Add these when you have something to list:
  // { id: "backend", title: "Backend Development", skills: [] },
  // { id: "databases", title: "Database Technologies", skills: [] },
];
