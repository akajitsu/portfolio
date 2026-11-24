import type { GameCategory } from "@/types";

// `art` is official artwork, saved locally in /public/images/games/:
//  • most games — the official Steam store header image;
//  • CS:GO — its original Steam header (2022, via the Internet Archive), since
//    the live store page now shows Counter-Strike 2;
//  • Valorant — the official Valorant logo (Wikimedia) on Valorant's brand navy;
//  • Ao Oni — art from the officially licensed 青鬼 app (LiTMUS) on the App Store.
// Games without `art` (currently Minecraft) simply show no preview.

export const gameCategories: GameCategory[] = [
  {
    id: "popular",
    title: "Popular",
    blurb: "Big titles I have spent a lot of hours in.",
    games: [
      { name: "Elden Ring", genre: "Action RPG", art: "/images/games/elden-ring.webp" },
      { name: "Dark Souls 3", genre: "Action RPG", art: "/images/games/dark-souls-3.webp" },
      { name: "Red Dead Redemption", genre: "Open world", art: "/images/games/red-dead-redemption.webp" },
      { name: "Valorant", genre: "Tactical shooter", art: "/images/games/valorant.webp" },
      { name: "CS:GO", genre: "Tactical shooter", art: "/images/games/csgo.webp" },
      { name: "Marvel Rivals", genre: "Hero shooter", art: "/images/games/marvel-rivals.webp" },
      { name: "Minecraft", genre: "Sandbox" },
      { name: "GTA V", genre: "Open world", art: "/images/games/gta-v.webp" },
      { name: "The Witcher 3", genre: "Action RPG", art: "/images/games/the-witcher-3.webp" },
    ],
  },
  {
    id: "indie",
    title: "Indie",
    blurb: "Smaller games with a lot of heart.",
    games: [
      { name: "Hollow Knight", genre: "Metroidvania", art: "/images/games/hollow-knight.webp" },
      { name: "Until Then", genre: "Story adventure", art: "/images/games/until-then.webp" },
      { name: "Omori", genre: "Psychological RPG", art: "/images/games/omori.webp" },
      { name: "Hades", genre: "Roguelike", art: "/images/games/hades.webp" },
      { name: "Project Zomboid", genre: "Survival", art: "/images/games/project-zomboid.webp" },
      { name: "Unturned", genre: "Survival", art: "/images/games/unturned.webp" },
      { name: "Celeste", genre: "Platformer", art: "/images/games/celeste.webp" },
      { name: "Stardew Valley", genre: "Farming sim", art: "/images/games/stardew-valley.webp" },
      { name: "Undertale", genre: "RPG", art: "/images/games/undertale.webp" },
    ],
  },
  {
    id: "rpg-maker",
    title: "RPG Maker",
    blurb: "Short, strange and memorable games made with RPG Maker.",
    games: [
      { name: "IB", genre: "Horror adventure", art: "/images/games/ib.webp" },
      { name: "Ao Oni", genre: "Horror", art: "/images/games/ao-oni.webp" },
      { name: "The Witch's House", genre: "Horror puzzle", art: "/images/games/the-witchs-house.webp" },
      { name: "Mad Father", genre: "Horror adventure", art: "/images/games/mad-father.webp" },
      { name: "Yume Nikki", genre: "Exploration", art: "/images/games/yume-nikki.webp" },
      { name: "Corpse Party", genre: "Horror adventure", art: "/images/games/corpse-party.webp" },
    ],
  },
];