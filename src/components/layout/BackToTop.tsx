"use client";
import { ArrowUp } from "@/components/ui/Icons";
import { glideTo } from "@/lib/glide";

export default function BackToTop() {
  function toTop() {
    // Move focus to the top of the page for keyboard users, then glide there.
    document.getElementById("main")?.focus({ preventScroll: true });
    glideTo(0, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  return (
    <button
      type="button"
      onClick={toTop}
      className="group inline-flex items-center gap-3 text-sm text-mute transition-colors hover:text-accent"
    >
      Back to top
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-moon/45 transition-colors duration-500 group-hover:border-moon group-hover:bg-moon/12 group-hover:text-accent">
        <ArrowUp size={16} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
