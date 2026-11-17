import Section from "@/components/ui/Section";
import { profile, socials } from "@/data/profile";

export default function Socials() {
  return (
    <Section id="socials" title="Socials">
      <p className="max-w-prose leading-relaxed">
        I used to be a content creator with a niche on TikTok. You can find my accounts below.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {socials.map((s) => (
          <li key={s.platform}>
            <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-baseline justify-between gap-4 py-5">
              <div>
                <h3 className="font-medium transition-colors group-hover:text-accent">{s.platform}</h3>
                <p className="mt-1 text-sm text-mute">{s.note}</p>
              </div>
              <span className="shrink-0 text-sm text-mute">{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-mute">
        Prefer email? <a className="text-accent underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
    </Section>
  );
}