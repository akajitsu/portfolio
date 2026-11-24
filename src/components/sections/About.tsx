import Link from "next/link";
import { Sparkle } from "@/components/celestial/Ornaments";
import GamesJournal from "@/components/sections/GamesJournal";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

export default function About() {
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
              <ul className="mt-3 border-t border-moon/25">
                {profile.quickFacts.map((f) => (
                  <li key={f} className="flex items-baseline gap-3 border-b border-moon/25 py-3.5 text-[0.95rem]">
                    <Sparkle size={9} className="shrink-0 translate-y-[1px] text-moon" />
                    {f}
                  </li>
                ))}
              </ul>
            </FadeIn>
          )}
        </div>

        {/* Blocks */}
        <dl className="border-t border-moon/25 lg:col-span-7">
          {profile.aboutBlocks.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.05} className="grid gap-2 border-b border-moon/25 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
              <dt className="display text-[1.35rem] italic">{b.label}</dt>
              <dd className="leading-relaxed text-mute">
                {b.placeholder || !b.body ? <span className="italic text-faint">More on this soon.</span> : b.body}
              </dd>
            </FadeIn>
          ))}
        </dl>
      </div>

      {/* Games */}
      <GamesJournal
        className="mt-28"
        limit={6}
        aside={
          <Link href="/about" className="group flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-accent">
            Full list
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        }
      />
    </section>
  );
}
