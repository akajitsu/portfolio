// Server-only: uses the filesystem. Import from server components only.
import fs from "node:fs";
import path from "node:path";
import { profile } from "@/data/profile";

export type ResumeInfo = {
  available: boolean;
  href: string;
  downloadName: string;
  sizeLabel?: string;
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
    const kb = stat.size / 1024;
    const sizeLabel = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB`;
    return { ...base, available: true, sizeLabel };
  } catch {
    return { ...base, available: false };
  }
}
