import type { Metadata } from "next";
import GameSection from "@/components/sections/GameSection";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { gameCategories } from "@/data/games";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "About", description: profile.about };

export default function AboutPage() {
  return (
    <div className="shell pb-24 pt-32">
      <SectionHeading level="h1" title="About me" />
      <FadeIn className="mt-10 max-w-2xl">
        <p className="font-display text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.15]">{profile.aboutLead}</p>
        <p className="mt-5 text-lg leading-relaxed text-mute">{profile.about}</p>
      </FadeIn>

      <h2 className="mt-24 border-t border-line pt-8 font-display text-[clamp(2.2rem,4vw,3rem)] leading-none">Games I love</h2>
      {gameCategories.map((c) => (
        <GameSection key={c.id} category={c} />
      ))}
    </div>
  );
}
