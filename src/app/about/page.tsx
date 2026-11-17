import type { Metadata } from "next";
import GameSection from "@/components/sections/GameSection";
import { gameCategories } from "@/data/games";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: `About | ${profile.name}` };

export default function AboutPage() {
  return (
    <div className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">About me</h1>
      <p className="mt-6 max-w-prose leading-relaxed">{profile.about}</p>
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Games I love</h2>
      {gameCategories.map((c) => (
        <GameSection key={c.id} category={c} />
      ))}
    </div>
  );
}