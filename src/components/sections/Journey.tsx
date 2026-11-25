import ScrollCompass from "@/components/celestial/ScrollCompass";
import Timeline from "@/components/journey/Timeline";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/Icons";
import { journey } from "@/data/experience";

export default function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="shell py-20 sm:py-28">
      <SectionHeading id="journey-title" index={4} eyebrow="Education & experience" title="Experience" description="School, work, and the things I've built along the way." />

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="lg:order-2 lg:col-span-7 lg:col-start-6">
          <Timeline entries={journey} />
        </div>

        <FadeIn className="hidden lg:order-1 lg:col-span-4 lg:block">
          <div className="sticky top-28">
            <ScrollCompass className="w-full max-w-[300px] opacity-85" />
            <p aria-hidden="true" className="mt-5 max-w-[300px] text-center font-caps text-[0.62rem] tracking-[0.2em] text-faint uppercase">
              Rosa ventorum · bearing true north
            </p>
            <a href="#certificates" className="link-gold group mt-8 inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-accent">
              Certificates
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
