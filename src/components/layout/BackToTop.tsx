"use client";
import { ArrowUp } from "@/components/ui/Icons";

export default function BackToTop() {
  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move focus to the top of the page for keyboard users.
    document.getElementById("main")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      className="group inline-flex items-center gap-3 text-sm text-mute transition-colors hover:text-ink"
    >
      Back to top
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
        <ArrowUp size={16} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
