"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { navigation } from "@/data/navigation";
import { profile } from "@/data/profile";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Tracks which home-page section is currently in the reading zone. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (!enabled) return;
    const els = navigation.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const first = navigation.find((n) => visible.get(n.id));
        if (first) setActive(first.id);
      },
      // A thin band ~35% down the viewport acts as the "reading line".
      { rootMargin: "-35% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape, lock page scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the menu so keyboard / screen-reader users land on the links.
    const t = window.setTimeout(() => document.querySelector<HTMLAnchorElement>("#mobile-menu a")?.focus(), 50);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const hrefFor = (id: string) => (id === "home" ? (isHome ? "#home" : "/") : isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-paper transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-accent"
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-b border-line/60 bg-paper/70 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={isHome ? "#home" : "/"}
            className="group flex items-baseline gap-1.5 font-display text-2xl leading-none tracking-tight"
            aria-label={`${profile.name} — home`}
          >
            <span className="relative">
              {profile.shortName}
              <span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop pill */}
          <nav
            aria-label="Primary"
            className={cn(
              "absolute left-1/2 hidden -translate-x-1/2 rounded-full border p-1 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 md:block",
              scrolled
                ? "border-line bg-card/75 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.25)]"
                : "border-transparent bg-transparent",
            )}
          >
            <ul className="flex items-center">
              {navigation.map((item) => {
                const isActive = isHome && active === item.id;
                return (
                  <li key={item.id} className="relative">
                    <a
                      href={hrefFor(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative z-10 block rounded-full px-4 py-2 text-sm transition-colors duration-300",
                        isActive ? "text-paper" : "text-mute hover:text-ink",
                      )}
                    >
                      {item.label}
                    </a>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-ink dark:bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card/70 backdrop-blur md:hidden"
            >
              <span className="sr-only">Menu</span>
              <span
                className={cn(
                  "absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ease-out-expo",
                  open ? "rotate-45" : "-translate-y-[3.5px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] w-4 bg-ink transition-transform duration-300 ease-out-expo",
                  open ? "-rotate-45" : "translate-y-[3.5px]",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-[4.5rem] md:hidden"
          >
            <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center">
              <ul className="space-y-1">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.12 + i * 0.05 }}
                    className="border-b border-line"
                  >
                    <a
                      href={hrefFor(item.id)}
                      onClick={() => setOpen(false)}
                      aria-current={isHome && active === item.id ? "true" : undefined}
                      className={cn(
                        "block py-3 font-display text-5xl leading-tight",
                        isHome && active === item.id && "text-accent",
                      )}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="shell label pb-8"
            >
              {profile.email}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
