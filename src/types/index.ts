// ─── Shared content types ────────────────────────────────────────────────────
// Every section reads from typed data in `src/data/`. Optional fields are truly
// optional: leave them out and the UI hides the related element.

export type Social = {
  platform: string;
  handle?: string;
  /** Leave empty/undefined to show the platform as "coming soon" (not clickable). */
  href?: string;
  note?: string;
};

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectStatus = "live" | "in-development" | "coming-soon" | "archived";

export type ProjectImage = {
  /** Path inside /public, e.g. "/images/projects/beanzz-home.png" */
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Project = {
  /** URL-safe id. Used for the detail page at /projects/[slug]. */
  slug: string;
  name: string;
  description: string;
  category: string;
  year?: string;
  technologies: string[];
  /** Main screenshot shown in the browser mockup. */
  thumbnail?: ProjectImage;
  /** Phone-sized screenshot shown in the phone mockup (hidden when omitted). */
  mobileThumbnail?: ProjectImage;
  /** Extra screenshots shown on the detail page. */
  previews?: ProjectImage[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  status: ProjectStatus;
  /** Placeholder entries render as tasteful "coming soon" cards with no links. */
  placeholder?: boolean;
  /** Short feature highlights: a bold lead sentence plus one line of detail. */
  highlights?: { title: string; body: string }[];
  /** Longer write-up paragraphs for the detail page. */
  details?: string[];
  /** Domain shown in the mockup's address bar. Derived from liveUrl when omitted. */
  displayUrl?: string;
};

// ─── Journey / timeline ──────────────────────────────────────────────────────

export type TimelineKind = "education" | "work" | "leadership" | "project" | "milestone" | "learning";

export type TimelineEntry = {
  title: string;
  org?: string;
  period?: string;
  description?: string;
  kind: TimelineKind;
  current?: boolean;
  placeholder?: boolean;
};

// ─── Skills ──────────────────────────────────────────────────────────────────

export type Skill = {
  name: string;
  /** Optional path to an SVG/PNG icon in /public. A monogram is shown when omitted. */
  icon?: string;
  /** Short text shown inside the tile instead of an auto-generated monogram. */
  monogram?: string;
  url?: string;
  /** Honest, plain-language level, e.g. "Basic", "Learning", "Used in BeanZz". */
  level?: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  description?: string;
  skills: Skill[];
};

// ─── Misc ────────────────────────────────────────────────────────────────────

export type NavItem = { label: string; id: string };

export type Game = {
  name: string;
  genre: string;
  /** Official artwork (e.g. the Steam header), shown when the game is hovered or tapped. */
  art?: string;
};
export type GameCategory = { id: string; title: string; blurb: string; games: Game[] };

export type Certificate = {
  title: string;
  /** Issuing organization. */
  issuer: string;
  /** Date issued, written as you want it shown, e.g. "March 2026". */
  date: string;
  /** Certificate image or preview in /public, e.g. "/images/certificates/cs50.webp". */
  image?: string;
  /** Optional verification / credential link. */
  href?: string;
};
