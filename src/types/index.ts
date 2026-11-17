export type Job = { role: string; org: string; period: string; note: string };
export type Skill = { name: string; level: string };
export type Honor = { title: string; detail: string; year: string };
export type Social = { platform: string; handle: string; href: string; note: string };
export type Game = { name: string; genre: string };
export type GameCategory = { id: string; title: string; blurb: string; games: Game[] };
export type Project = { title: string; description: string; stack: string[]; image?: string; href?: string; placeholder?: boolean };
export type Certificate = { title: string; issuer: string; year: string; image?: string; href?: string; placeholder?: boolean };