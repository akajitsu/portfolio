import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/Icons";
import { gameCategories } from "@/data/games";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="shell py-16 sm:py-20">
      <SectionHeading id="about-title" title="About me" />

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        {/* Intro + quick facts */}
        <div className="lg:col-span-5">
          <FadeIn>
            <p className="font-display text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.15]">{profile.aboutLead}</p>
            <p className="mt-5 max-w-md leading-relaxed text-mute">{profile.about}</p>
          </FadeIn>

          {profile.quickFacts.length > 0 && (
            <FadeIn delay={0.1} className="mt-10">
              <h3 className="label">Quick facts</h3>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {profile.quickFacts.map((f) => (
                  <li key={f} className="py-3 text-[0.95rem]">
                    {f}
                  </li>
                ))}
              </ul>
            </FadeIn>
          )}
        </div>

        {/* Blocks */}
        <dl className="border-t border-line lg:col-span-7 lg:border-t-0">
          {profile.aboutBlocks.map((b, i) => (
            <FadeIn
              key={b.label}
              delay={i * 0.05}
              className="grid gap-2 border-b border-line py-5 first:pt-5 sm:grid-cols-[11rem_1fr] sm:gap-6 lg:first:pt-0"
            >
              <dt className="font-medium">{b.label}</dt>
              <dd className="leading-relaxed text-mute">
                {b.placeholder || !b.body ? <span className="italic">More on this soon.</span> : b.body}
              </dd>
            </FadeIn>
          ))}
        </dl>
      </div>

      {/* Games */}
      <div className="mt-20">
        <FadeIn className="flex items-baseline justify-between gap-4 border-t border-line pt-6">
          <h3 className="font-display text-3xl">Games I love</h3>
          <Link href="/about" className="group flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-ink">
            Full list
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {gameCategories.map((c, i) => (
            <FadeIn key={c.id} delay={i * 0.06}>
              <h4 className="label">{c.title}</h4>
              <ul className="mt-2 space-y-1.5">
                {c.games.slice(0, 6).map((g) => (
                  <li key={g.name} className="flex items-baseline justify-between gap-3">
                    <span>{g.name}</span>
                    <span className="text-xs text-mute">{g.genre}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
