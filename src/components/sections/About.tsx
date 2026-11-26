import Link from "next/link";
import DiscoveryStar from "@/components/celestial/DiscoveryStar";
import { DrawRule } from "@/components/celestial/Drawn";
import { MoonPhase, roman, Sparkle } from "@/components/celestial/Ornaments";
import GamesJournal from "@/components/sections/GamesJournal";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

/** The eight lunar phases, new → waning crescent, for the journal plate. */
const LUNATION = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];

export default function About() {
  const notes = profile.aboutBlocks.length;
  return (
    <section id="about" aria-labelledby="about-title" className="shell relative py-20 sm:py-28">
      <SectionHeading id="about-title" index={3} eyebrow="Profile" title="About me" />

      <div className="mt-14 grid gap-14 lg:grid-cols-12">
        {/* Intro + quick facts */}
        <div className="lg:col-span-5">
          <FadeIn>
            <p className="display text-[clamp(1.8rem,3vw,2.5rem)] font-normal leading-[1.2]">{profile.aboutLead}</p>
            <p className="mt-6 max-w-md leading-relaxed text-mute">{profile.about}</p>
          </FadeIn>

          {profile.quickFacts.length > 0 && (
            <FadeIn delay={0.1} className="mt-10">
              <h3 className="eyebrow">Quick facts</h3>
              <ul className="relative mt-3">
                <DrawRule className="absolute inset-x-0 top-0" delay={0.15} />
                {profile.quickFacts.map((f, i) => (
                  <FadeIn as="li" key={f} y={10} delay={0.2 + i * 0.1} className="relative flex items-baseline gap-3 py-3.5 text-[0.95rem]">
                    <Sparkle
                      size={9}
                      className="shrink-0 translate-y-[1px] animate-twinkle text-moon"
                      style={{ animationDuration: `${5 + i * 1.4}s`, animationDelay: `${-i * 1.7}s` }}
                    />
                    {f}
                    <DrawRule className="absolute inset-x-0 bottom-0" delay={0.3 + i * 0.12} />
                  </FadeIn>
                ))}
              </ul>
            </FadeIn>
          )}

          {/* Journal plate: one lunation, drawn in phase by phase */}
          <div className="relative mt-12 max-w-md">
            <figure aria-hidden="true">
              <div className="flex items-center justify-between text-moon">
                {LUNATION.map((p, i) => (
                  <FadeIn key={p} delay={0.1 + i * 0.09} y={6} duration={0.9}>
                    {i === 4 ? (
                      // The full moon floats, carrying a thin orbit with it
                      <span className="relative flex animate-float [animation-duration:7s]">
                        <MoonPhase phase={p} size={26} className="text-cream drop-shadow-[0_0_8px_var(--star-glow-soft)]" />
                        <span className="pointer-events-none absolute left-1/2 top-1/2 h-[16px] w-[52px] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-dashed border-moon/40" />
                      </span>
                    ) : (
                      <MoonPhase phase={p} size={20} />
                    )}
                  </FadeIn>
                ))}
              </div>
              <div className="rule-fade mt-3" />
              <figcaption className="mt-2 flex justify-between font-caps text-[0.6rem] tracking-[0.18em] text-faint uppercase">
                <span>Luna nova</span>
                <span>Plenilunium</span>
                <span>Luna vetus</span>
              </figcaption>
            </figure>
            <DiscoveryStar
              name="Vega"
              designation="α Lyrae"
              ra="18h 36m 56s"
              dec="+38° 47′ 01″"
              note="The brightest star in Lyra and the fifth-brightest in the night sky, about 25 light-years away."
              className="-top-7 right-3"
              align="end"
              side="bottom"
              hintDelay={0.5}
            />
          </div>
        </div>

        {/* Blocks */}
        <dl className="relative lg:col-span-7">
          <DrawRule className="absolute inset-x-0 top-0" />
          {profile.aboutBlocks.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.05} className="group/note relative grid gap-2 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
              <dt className="display text-[1.35rem] italic">
                {/* Marginal annotation, like a dated note in a lunar journal: the moon waxes note by note */}
                <MoonPhase
                  phase={0.1 + (i * 0.4) / Math.max(notes - 1, 1)}
                  size={14}
                  className="mr-2 inline-block -translate-y-[2px] text-moon transition-transform duration-700 ease-out-expo group-hover/note:rotate-[-20deg] group-hover/note:scale-125"
                />
                <span aria-hidden="true" className="mr-2 font-display text-base not-italic text-moon">
                  {roman(i + 1).toLowerCase()}.
                </span>
                {b.label}
              </dt>
              <dd className="leading-relaxed text-mute">{b.placeholder || !b.body ? <span className="italic text-faint">More on this soon.</span> : b.body}</dd>
              <DrawRule className="absolute inset-x-0 bottom-0" delay={0.15 + i * 0.08} />
            </FadeIn>
          ))}
        </dl>
      </div>

      {/* Games */}
      <GamesJournal
        className="mt-28"
        limit={6}
        aside={
          <Link href="/about" className="link-gold group flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-accent">
            Full list
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        }
      />
    </section>
  );
}
