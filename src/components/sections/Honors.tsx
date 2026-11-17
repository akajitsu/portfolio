import Section from "@/components/ui/Section";
import { honors } from "@/data/profile";

export default function Honors() {
  return (
    <Section id="honors" title="School committee">
      <ul className="divide-y divide-line border-y border-line">
        {honors.map((h) => (
          <li key={h.title} className="flex items-baseline justify-between gap-4 py-5">
            <div>
              <h3 className="font-medium">{h.title}</h3>
              <p className="text-sm text-mute">{h.detail}</p>
            </div>
            <span className="shrink-0 text-sm text-mute">{h.year}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}