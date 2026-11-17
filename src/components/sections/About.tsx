import Section from "@/components/ui/Section";
import GameSection from "@/components/sections/GameSection";
import { gameCategories } from "@/data/games";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <Section id="about" title="About me">
      <p className="max-w-prose leading-relaxed">{profile.about}</p>
      <h3 className="mt-12 text-lg font-medium text-mute">Games I love</h3>
      {gameCategories.map((c) => (
        <GameSection key={c.id} category={c} />
      ))}
    </Section>
  );
}