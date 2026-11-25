import { Constellation } from "@/components/celestial/Constellation";
import HeroCelestial from "@/components/celestial/HeroCelestial";
import { EightStar } from "@/components/celestial/Ornaments";
import AnimatedRoles from "@/components/profile/AnimatedRoles";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import RevealLines from "@/components/ui/RevealLines";
import { ArrowDown, ArrowRight, Download } from "@/components/ui/Icons";
import { profile } from "@/data/profile";
import { getResumeInfo } from "@/lib/resume";

const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

const NORTH: { points: [number, number][]; edges: [number, number][] } = {
  points: [[6, 62], [24, 40], [46, 48], [60, 22], [82, 30], [94, 8], [70, 70]],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6]],
};

export default function Hero() {
  const resume = getResumeInfo();
  const firstRole = profile.roles[0] ?? "";

  return (
    <section id="home" aria-label="Introduction" className="relative isolate overflow-x-clip pb-24 pt-28 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center">
      <Constellation {...NORTH} delay={1.6} className="pointer-events-none absolute left-[46%] top-[16%] -z-10 hidden w-36 opacity-70 xl:block" />

      <div className="shell relative grid items-center gap-x-10 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {profile.title && (
            <FadeIn trigger="mount" y={8}>
              <p className="eyebrow flex items-center gap-2.5">
                <EightStar size={13} className="animate-twinkle text-moon [animation-duration:4s]" />
                {profile.title}
              </p>
            </FadeIn>
          )}

          <RevealLines
            delay={0.1}
            className={`display ${profile.title ? "mt-6" : ""} text-[clamp(2.9rem,6.4vw,5.6rem)] leading-[0.98]`}
            lines={[profile.greeting, ...profile.headline]}
            lineClassNames={[undefined, "italic font-normal text-shimmer pr-[0.08em]", "italic font-normal text-shimmer pr-[0.08em]"]}
          />

          <FadeIn trigger="mount" delay={0.4}>
            <p className="mt-8 text-lg sm:text-xl">
              I&apos;m {article(firstRole)} <AnimatedRoles roles={profile.roles} className="font-semibold text-accent" />
            </p>
          </FadeIn>

          <FadeIn trigger="mount" delay={0.5}>
            <p className="mt-5 max-w-xl text-[1.08rem] leading-relaxed">{profile.tagline}</p>
            <p className="mt-3 max-w-xl leading-relaxed text-mute">{profile.intro}</p>
          </FadeIn>

          <FadeIn trigger="mount" delay={0.6} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="#work" icon={<ArrowDown size={16} />}>
              Explore my work
            </Button>
            <Button href="#about" variant="secondary">
              About me
            </Button>
            {resume.available ? (
              <Button href={resume.href} download={resume.downloadName} variant="secondary" icon={<Download size={16} />}>
                Download resume
              </Button>
            ) : (
              <Button disabled disabledLabel="Soon" variant="secondary">
                Resume
              </Button>
            )}
            <Button href="#contact" variant="ghost" icon={<ArrowRight size={16} />}>
              Contact me
            </Button>
          </FadeIn>
        </div>

        <div className="lg:col-span-5">
          <HeroCelestial
            src={profile.photo.src || undefined}
            alt={profile.photo.alt}
            objectPosition={profile.photo.position}
            name={profile.name}
            motto={profile.motto}
            className="max-w-[330px] sm:max-w-[400px] lg:max-w-[440px]"
          />
          {/* Plate caption, as under an engraved figure */}
          <p aria-hidden="true" className="mt-1 text-center font-caps text-[0.6rem] tracking-[0.24em] text-faint uppercase">
            Fig. I · The observer
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#work"
        aria-label="Scroll to projects"
        className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-moon lg:flex"
      >
        <span className="h-10 w-px bg-linear-to-b from-transparent to-moon/70 transition-[height] duration-500 group-hover:h-12" />
        <EightStar size={11} className="animate-float" />
      </a>
    </section>
  );
}
