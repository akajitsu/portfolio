import FadeIn from "@/components/ui/FadeIn";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="pt-20">
      <FadeIn>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Hi, I&apos;m {profile.name}.</h1>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="mt-3 text-lg text-mute">{profile.title}</p>
        <p className="mt-6 max-w-prose leading-relaxed">{profile.intro}</p>
      </FadeIn>
    </section>
  );
}