import { Constellation } from "@/components/celestial/Constellation";
import { Sparkle } from "@/components/celestial/Ornaments";
import CopyEmail from "@/components/contact/CopyEmail";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight, Mail } from "@/components/ui/Icons";
import { profile, socials } from "@/data/profile";
import { isUsableLink } from "@/lib/utils";

export default function Contact() {
  const hasEmail = /\S+@\S+\.\S+/.test(profile.email);

  return (
    <section id="contact" aria-labelledby="contact-title" className="shell relative py-20 sm:py-28">
      <SectionHeading
        id="contact-title"
        index={7}
        eyebrow="Correspondence"
        title="Contact"
        description="Have an interesting project in mind? Let's build something."
      />

      <div className="relative mt-14 grid gap-12 lg:grid-cols-12">
        <Constellation
          points={[[8, 70], [26, 52], [40, 66], [58, 30], [78, 42], [92, 18]]}
          edges={[[0, 1], [1, 2], [1, 3], [3, 4], [4, 5]]}
          className="pointer-events-none absolute -top-28 right-0 hidden w-40 opacity-60 lg:block"
        />
        <FadeIn className="lg:col-span-5">
          {hasEmail ? (
            <>
              <p className="eyebrow">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="group display mt-2 inline-flex max-w-full items-center gap-2 break-all text-[clamp(1.6rem,3.2vw,2.5rem)] italic leading-tight transition-colors hover:text-accent"
              >
                {profile.email}
                <ArrowUpRight size={24} className="shrink-0 text-moon transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[0.9rem] font-medium tracking-[0.01em] text-paper shadow-[0_10px_30px_-14px_rgba(16,23,43,0.55)] transition-colors duration-500 hover:bg-accent dark:bg-accent dark:text-night dark:hover:bg-[#f0d9a6]"
                >
                  <Mail size={16} /> Send an email
                </a>
                <CopyEmail email={profile.email} />
              </div>
            </>
          ) : (
            <p className="text-mute">Email coming soon.</p>
          )}
        </FadeIn>

        <FadeIn delay={0.08} className="lg:col-span-7">
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-3 divide-y divide-moon/25 border-y border-moon/25">
            {socials.map((s) =>
              isUsableLink(s.href) ? (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="display inline-flex items-center gap-2.5 text-[1.45rem] transition-colors group-hover:text-accent">
                      <Sparkle size={9} className="text-moon opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {s.platform}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-mute">
                      {s.handle}
                      <ArrowUpRight size={14} className="self-center transition-colors group-hover:text-accent" />
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ) : (
                <li key={s.platform} className="flex items-baseline justify-between gap-4 py-4 text-mute">
                  <span className="display pl-[1.15rem] text-[1.45rem]">{s.platform}</span>
                  <span className="text-sm">Soon</span>
                </li>
              ),
            )}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
