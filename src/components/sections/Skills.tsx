import Section from "@/components/ui/Section";
import { skills } from "@/data/profile";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <ul className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <li key={s.name} className="rounded-full border border-line bg-card px-4 py-2 text-sm transition-colors hover:border-accent">
            {s.name} <span className="text-mute">({s.level})</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}