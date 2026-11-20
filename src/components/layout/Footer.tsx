import BackToTop from "@/components/layout/BackToTop";
import { navigation } from "@/data/navigation";
import { profile, socials } from "@/data/profile";
import { isUsableLink } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();
  const liveSocials = socials.filter((s) => isUsableLink(s.href));

  return (
    <footer className="border-t border-line">
      <div className="shell grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-5xl leading-none">
            {profile.shortName}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">{profile.tagline}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label mb-4">Menu</p>
          <ul className="space-y-2">
            {navigation.map((n) => (
              <li key={n.id}>
                <a href={n.id === "home" ? "/" : `/#${n.id}`} className="text-sm transition-colors hover:text-accent">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label mb-4">Connect</p>
          <ul className="space-y-2">
            {profile.email && (
              <li>
                <a href={`mailto:${profile.email}`} className="text-sm transition-colors hover:text-accent">
                  Email
                </a>
              </li>
            )}
            {liveSocials.map((s) => (
              <li key={s.platform}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-accent">
                  {s.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell">
      <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-line py-6 sm:flex-row sm:items-center">
        <p className="label">
          © {year} {profile.name} · Designed &amp; built with Next.js
        </p>
        <BackToTop />
      </div>
      </div>
    </footer>
  );
}
