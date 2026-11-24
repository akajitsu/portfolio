// Server-only: uses the filesystem. Import from server components only.
import fs from "node:fs";
import path from "node:path";
import { profile } from "@/data/profile";

export type ResumeInfo = {
  available: boolean;
  href: string;
  downloadName: string;
  lastUpdated?: string;
};

/**
 * Checks /public for the configured resume at build/render time, so the UI
 * enables itself automatically once the PDF is added — and never links to a
 * missing file.
 */
export function getResumeInfo(): ResumeInfo {
  const { path: href, downloadName, lastUpdated } = profile.resume;
  const base = { href, downloadName, lastUpdated: lastUpdated || undefined };
  try {
    const file = path.join(process.cwd(), "public", href.replace(/^\/+/, ""));
    const stat = fs.statSync(file);
    if (!stat.isFile() || stat.size === 0) return { ...base, available: false };
    return { ...base, available: true };
  } catch {
    return { ...base, available: false };
  }
}
