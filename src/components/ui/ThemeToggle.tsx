"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EightStar, SunGlyph } from "@/components/celestial/Ornaments";

type Theme = "light" | "dark";

/**
 * The initial theme is applied before paint by the inline script in layout.tsx
 * (no flash). This component only reads it after mount, so SSR markup matches.
 *
 * Icons show the mode you'll switch *to*: an engraved eight-pointed star for
 * night, a celestial sun for day. They turn through each other on change.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-moon/35 bg-card/60 text-accent backdrop-blur transition-[border-color,box-shadow] duration-500 hover:border-moon hover:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-moon)_12%,transparent)]"
    >
      {/* Faint orbit ring */}
      <span aria-hidden="true" className="absolute inset-[3px] rounded-full border border-dashed border-moon/25 transition-transform duration-[1.2s] ease-out-expo group-hover:rotate-90" />
      <AnimatePresence mode="popLayout" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            initial={{ opacity: 0, scale: 0.4, rotate: -120 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.4, rotate: 120 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex"
          >
            {theme === "dark" ? (
              <SunGlyph size={20} className="[&_.sun-rays]:transition-transform [&_.sun-rays]:duration-[1.4s] [&_.sun-rays]:ease-out group-hover:[&_.sun-rays]:rotate-45" />
            ) : (
              <EightStar size={19} className="transition-transform duration-700 ease-out-expo group-hover:rotate-[22.5deg] group-hover:scale-110" />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
