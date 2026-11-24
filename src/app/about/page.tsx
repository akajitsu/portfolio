import type { Metadata } from "next";
import GamesJournal from "@/components/sections/GamesJournal";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "About", description: profile.about };

export default function AboutPage() {
  return (
    <div className="shell pb-24 pt-32">
      <SectionHeading level="h1" eyebrow="Profile" title="About me" />
      <FadeIn className="mt-10 max-w-2xl">
        <p className="display text-[clamp(1.8rem,3vw,2.5rem)] font-normal leading-[1.2]">{profile.aboutLead}</p>
        <p className="mt-5 text-lg leading-relaxed text-mute">{profile.about}</p>
      </FadeIn>

      <GamesJournal level="h2" className="mt-28" />
    </div>
  );
}
