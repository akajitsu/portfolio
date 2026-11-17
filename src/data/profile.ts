import type { Honor, Job, Skill, Social } from "@/types";

// Edit everything about you here. Components just read from this file.
export const profile = {
  name: "Jared", // change if needed
  title: "2nd year BSIT student",
  intro:
    "I'm a BSIT student learning programming and web development. I know the basics of C++, Java, JavaScript, HTML and CSS, and I'm building my first projects.",
  email: "rekillers4@gmail.com",
  about:
    "Outside of school, I game a lot. I have played everything from big popular titles to small indie games, and I enjoy story-heavy games, tough bosses, and games made with RPG Maker.",
};

export const experience: Job[] = [
  { role: "BSIT Student", org: "Currently 2nd year", period: "Present", note: "Learning programming and web development." },
  { role: "Small Business Owner", org: "Laptop seller, Facebook Marketplace", period: "4 years", note: "Sold laptops and handled listings and customer support." },
];

export const skills: Skill[] = [
  { name: "C++", level: "Basic" },
  { name: "Java", level: "Basic" },
  { name: "JavaScript", level: "Basic" },
  { name: "HTML", level: "Basic" },
  { name: "CSS", level: "Basic" },
  { name: "Canva", level: "Basic" },
  { name: "Claude, Gemini, ChatGPT", level: "Basic" },
];

export const honors: Honor[] = [
  { title: "Public Information Officer", detail: "CETSO department", year: "2026 - 2027" },
];

export const socials: Social[] = [
  { platform: "Facebook", handle: "Jredsethlo", href: "https://www.facebook.com/Jredsethlo", note: "Where I sell laptops and post updates." },
  { platform: "Instagram", handle: "@jredseth", href: "https://www.instagram.com/jredseth/", note: "Photos and everyday posts." },
  { platform: "TikTok", handle: "@wuthering.fire", href: "https://www.tiktok.com/@wuthering.fire", note: "My former content creator account. I made videos around one gaming niche." },
];