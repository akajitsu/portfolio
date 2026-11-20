import GameCard from "@/components/ui/GameCard";
import type { GameCategory } from "@/types";

export default function GameSection({ category }: { category: GameCategory }) {
  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`} className="mt-12">
      <h3 id={`${category.id}-title`} className="font-medium">
        {category.title}
      </h3>
      <p className="label">{category.blurb}</p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {category.games.map((g) => (
          <GameCard key={g.name} game={g} />
        ))}
      </ul>
    </section>
  );
}
