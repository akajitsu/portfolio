import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "Socials", description: `Where to find ${profile.name} online.` };

export default function SocialsPage() {
  return (
    <div className="pt-12">
      <h1 className="sr-only">Socials and contact</h1>
      <Contact />
    </div>
  );
}
