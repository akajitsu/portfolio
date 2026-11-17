import ThemeToggle from "@/components/ui/ThemeToggle";
import { profile } from "@/data/profile";

const items = [
  { label: "Projects", href: "#projects" },
  { label: "Certificates", href: "#certificates" },
  { label: "About", href: "#about" },
  { label: "Socials", href: "#socials" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-6 py-4 text-sm">
        <a href="#" className="font-semibold">{profile.name}</a>
        <div className="flex items-center gap-3 sm:gap-5">
          <ul className="flex gap-3 text-mute sm:gap-5">
            {items.map((i) => (
              <li key={i.href}><a href={i.href} className="transition-colors hover:text-ink">{i.label}</a></li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}