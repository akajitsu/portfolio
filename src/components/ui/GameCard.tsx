"use client";
import { motion } from "motion/react";
import type { Game } from "@/types";

export default function GameCard({ game }: { game: Game }) {
  return (
    <motion.li
      whileHover={{ y: -6, rotate: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="group cursor-default rounded-xl border border-line bg-card p-4 transition-colors hover:border-accent"
    >
      <h4 className="font-medium">{game.name}</h4>
      <p className="mt-1 text-sm text-mute transition-colors group-hover:text-accent">{game.genre}</p>
    </motion.li>
  );
}