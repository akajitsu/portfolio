import type { Game } from "@/types";

export default function GameCard({ game }: { game: Game }) {
  return (
    <li className="rounded-xl border border-line bg-card px-4 py-3 transition-colors hover:border-mute">
      <h4 className="font-medium leading-tight">{game.name}</h4>
      <p className="label mt-0.5">{game.genre}</p>
    </li>
  );
}
