import AnimatedRoles from "@/components/profile/AnimatedRoles";
import ProfileVisual from "@/components/profile/ProfileVisual";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import RevealLines from "@/components/ui/RevealLines";
import { ArrowDown, ArrowRight, Download } from "@/components/ui/Icons";
import { profile } from "@/data/profile";
import { getResumeInfo } from "@/lib/resume";

const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

export default function Hero() {
  const resume = getResumeInfo();
  const firstRole = profile.roles[0] ?? "";

  return (
    <section id="home" aria-label="Introduction" className="relative overflow-x-clip pb-16 pt-28 sm:pt-32 lg:flex lg:min-h-[92svh] lg:items-center lg:pb-20">
      <div className="shell grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RevealLines
            delay={0.05}
            className="font-display text-[clamp(2.9rem,6.2vw,5.6rem)] leading-[0.98] tracking-[-0.02em]"
            lines={[profile.greeting, ...profile.headline]}
            lineClassNames={[undefined, "text-mute", "text-mute"]}
          />

          <FadeIn trigger="mount" delay={0.35}>
            <p className="mt-8 text-xl sm:text-2xl">
              I&apos;m {article(firstRole)} <AnimatedRoles roles={profile.roles} className="font-medium text-accent" />
            </p>
          </FadeIn>

          <FadeIn trigger="mount" delay={0.45}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">{profile.tagline}</p>
            <p className="mt-3 max-w-xl leading-relaxed text-mute">{profile.intro}</p>
          </FadeIn>

          <FadeIn trigger="mount" delay={0.55} className="mt-9 flex flex-wrap items-center gap-3">
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
          <ProfileVisual
            src={profile.photo.src || undefined}
            alt={profile.photo.alt}
            objectPosition={profile.photo.position}
            name={profile.name}
            priority
            className="max-w-[300px] sm:max-w-[380px] lg:max-w-[420px]"
          />
        </div>
      </div>
    </section>
  );
}
