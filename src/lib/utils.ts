/** Tiny className joiner — avoids pulling in a dependency for this. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** "https://beanszz.vercel.app/" → "beanszz.vercel.app" */
export function displayHost(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** True for non-empty, absolute http(s)/mailto links. */
export const isUsableLink = (href?: string): href is string => !!href && /^(https?:|mailto:)/.test(href);
