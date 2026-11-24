import type { Social } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
//  YOUR PROFILE — edit everything about you here. Components only read this.
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: "Jared",
  /** Used in the logo, footer and page titles. */
  shortName: "Jared",
  title: "2nd year BSIT student",

  /** Hero copy. `headline` lines are rendered as separate lines in the hero. */
  greeting: "Hi, I'm Jared.",
  headline: ["Developer, creator", "& problem solver."],
  tagline: "Building digital experiences through code, creativity, and experimentation.",
  intro:
    "I'm a BSIT student learning programming and web development. I know the basics of C++, Java, JavaScript, HTML and CSS, and I'm building my first projects.",

  /**
   * Engraved along the top of the hero arch (from the reference illustration):
   * "through hardship to the stars". Change it to anything, or "" to hide it.
   */
  motto: "Per ardua ad astra",

  /** Rotating words after "I'm a / an …" in the hero. */
  roles: ["Web Developer", "Frontend Developer", "BSIT Student", "Creative Developer", "Problem Solver"],

  /**
   * Profile photo. Put your image in /public/images/profile/ and set `src`,
   * e.g. src: "/images/profile/jared.jpg". Leave src empty to show the placeholder.
   * Portrait images (around 4:5) look best. The original proportions are kept.
   */
  photo: {
    src: "/images/profile/jared.webp",
    alt: "Jared leaning against a softly lit tiled wall, looking up and to the side",
    /** Which part of the photo stays in frame, e.g. "50% 20%" keeps a face near the top. */
    position: "40% 30%",
  },

  email: "rekillers4@gmail.com",

  // About section ────────────────────────────────────────────────────────────
  about:
    "Outside of school, I game a lot. I have played everything from big popular titles to small indie games, and I enjoy story-heavy games, tough bosses, and games made with RPG Maker.",

  /** Opening sentence of the About section, shown larger. */
  aboutLead: "I'm a second-year BSIT student learning to build for the web. I'm also a lifelong gamer.",

  /** Short true facts shown as a list in the About section. */
  quickFacts: [
    "Ran a laptop-selling business for 4 years",
    "Public Information Officer, CETSO (2026 – 2027)",
    "Former TikTok creator in a gaming niche",
  ],

  /**
   * About blocks. Set `placeholder: true` on any block you haven't written yet —
   * visitors see a subtle "more soon" state instead of instructions or fake text.
   * When you're ready, write the `body` and remove `placeholder`.
   */
  aboutBlocks: [
    {
      label: "Background",
      body: "I'm currently in my second year of BSIT, learning programming and web development. Before and alongside school, I ran a small laptop-selling business on Facebook Marketplace for four years.",
    },
    {
      label: "Interests",
      body: "Gaming is a big part of my life, from big titles to small indie games. I love story-heavy games, tough bosses, and strange little RPG Maker games.",
    },
    {
      label: "What I enjoy building",
      body: "Websites that people actually use. My first real project, BeanZz, is a manhwa reader built on the MangaDex API.",
    },
    {
      label: "Development philosophy",
      // TODO: a few sentences on how you like to build — what you care about in code and design.
      body: "",
      placeholder: true,
    },
    {
      label: "Currently learning",
      // TODO: what you're learning right now — languages, frameworks, or concepts.
      body: "",
      placeholder: true,
    },
  ] as { label: string; body: string; placeholder?: boolean }[],

  // Resume ───────────────────────────────────────────────────────────────────
  resume: {
    /**
     * Drop your PDF at /public/documents/resume.pdf — the site detects it
     * automatically and enables the View / Download buttons and the preview.
     */
    path: "/documents/resume.pdf",
    /** File name used when someone downloads it. */
    downloadName: "Jared-Resume.pdf",
    /** e.g. "November 2026". Leave empty to hide. */
    lastUpdated: "November 2026",
  },

  // SEO ──────────────────────────────────────────────────────────────────────
  /** Your deployed URL, used for Open Graph links. e.g. "https://jared.vercel.app" */
  siteUrl: "",
};

/**
 * Social / contact links. Leave `href` empty for platforms you haven't added yet —
 * they render as muted "soon" items instead of broken links.
 */
export const socials: Social[] = [
  { platform: "GitHub", handle: "akajitsu", href: "https://github.com/akajitsu", note: "Code & experiments." },
  { platform: "LinkedIn", href: "", note: "Professional profile." },
  { platform: "Facebook", handle: "Jredsethlo", href: "https://www.facebook.com/Jredsethlo", note: "Where I sell laptops and post updates." },
  { platform: "Instagram", handle: "@jredseth", href: "https://www.instagram.com/jredseth/", note: "Photos and everyday posts." },
  { platform: "TikTok", handle: "@wuthering.fire", href: "https://www.tiktok.com/@wuthering.fire", note: "My former content creator account, built around one gaming niche." },
];
