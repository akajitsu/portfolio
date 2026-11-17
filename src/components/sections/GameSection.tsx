import GameCard from "@/components/ui/GameCard";
import type { GameCategory } from "@/types";

export default function GameSection({ category }: { category: GameCategory }) {
  return (
    <section id={category.id} className="pt-14">
      <h3 className="text-xl font-semibold tracking-tight">{category.title}</h3>
      <p className="mt-1 text-sm text-mute">{category.blurb}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {category.games.map((g) => (
          <GameCard key={g.name} game={g} />
        ))}
      </ul>
    </section>
  );
}