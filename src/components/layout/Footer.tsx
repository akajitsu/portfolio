import { profile, socials } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-2xl border-t border-line px-6 py-10 text-sm text-mute">
      <p>Want to work together? <a className="text-accent underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a></p>
      <ul className="mt-3 flex gap-4">
        {socials.map((s) => (
          <li key={s.platform}><a className="hover:text-ink" href={s.href} target="_blank" rel="noreferrer">{s.platform}</a></li>
        ))}
      </ul>
    </footer>
  );
}