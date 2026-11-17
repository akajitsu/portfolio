import type { GameCategory } from "@/types";

export const gameCategories: GameCategory[] = [
  {
    id: "popular",
    title: "Popular",
    blurb: "Big titles I have spent a lot of hours in.",
    games: [
      { name: "Elden Ring", genre: "Action RPG" },
      { name: "Dark Souls 3", genre: "Action RPG" },
      { name: "Red Dead Redemption", genre: "Open world" },
      { name: "Valorant", genre: "Tactical shooter" },
      { name: "CS:GO", genre: "Tactical shooter" },
      { name: "Marvel Rivals", genre: "Hero shooter" },
      { name: "Minecraft", genre: "Sandbox" },
      { name: "GTA V", genre: "Open world" },
      { name: "The Witcher 3", genre: "Action RPG" },
    ],
  },
  {
    id: "indie",
    title: "Indie",
    blurb: "Smaller games with a lot of heart.",
    games: [
      { name: "Hollow Knight", genre: "Metroidvania" },
      { name: "Until Then", genre: "Story adventure" },
      { name: "Omori", genre: "Psychological RPG" },
      { name: "Hades", genre: "Roguelike" },
      { name: "Project Zomboid", genre: "Survival" },
      { name: "Unturned", genre: "Survival" },
      { name: "Celeste", genre: "Platformer" },
      { name: "Stardew Valley", genre: "Farming sim" },
      { name: "Undertale", genre: "RPG" },
    ],
  },
  {
    id: "rpg-maker",
    title: "RPG Maker",
    blurb: "Short, strange and memorable games made with RPG Maker.",
    games: [
      { name: "IB", genre: "Horror adventure" },
      { name: "Ao Oni", genre: "Horror" },
      { name: "The Witch's House", genre: "Horror puzzle" },
      { name: "Mad Father", genre: "Horror adventure" },
      { name: "Yume Nikki", genre: "Exploration" },
      { name: "Corpse Party", genre: "Horror adventure" },
    ],
  },
];