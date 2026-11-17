import Section from "@/components/ui/Section";
import { experience } from "@/data/profile";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ul className="divide-y divide-line border-y border-line">
        {experience.map((j) => (
          <li key={j.role} className="py-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium">{j.role}</h3>
              <span className="shrink-0 text-sm text-mute">{j.period}</span>
            </div>
            <p className="text-sm text-mute">{j.org}</p>
            <p className="mt-2 text-sm leading-relaxed">{j.note}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}