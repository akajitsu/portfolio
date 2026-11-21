import CopyEmail from "@/components/contact/CopyEmail";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight, Mail } from "@/components/ui/Icons";
import { profile, socials } from "@/data/profile";
import { isUsableLink } from "@/lib/utils";

export default function Contact() {
  const hasEmail = /\S+@\S+\.\S+/.test(profile.email);

  return (
    <section id="contact" aria-labelledby="contact-title" className="shell py-16 sm:py-20">
      <SectionHeading
        id="contact-title"
        title="Contact"
        description="Have an interesting project in mind? Let's build something."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5">
          {hasEmail ? (
            <>
              <p className="label">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="group mt-1 inline-flex max-w-full items-center gap-2 break-all font-display text-[clamp(1.35rem,2.7vw,2.1rem)] font-medium leading-tight tracking-[-0.02em] transition-colors hover:text-accent"
              >
                {profile.email}
                <ArrowUpRight size={24} className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-paper transition-colors duration-300 hover:bg-accent dark:bg-accent dark:hover:bg-ink"
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
          <p className="label">Elsewhere</p>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {socials.map((s) =>
              isUsableLink(s.href) ? (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-3.5"
                  >
                    <span className="font-medium transition-colors group-hover:text-accent">{s.platform}</span>
                    <span className="flex items-center gap-2 text-sm text-mute">
                      {s.handle}
                      <ArrowUpRight size={14} className="self-center transition-colors group-hover:text-ink" />
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ) : (
                <li key={s.platform} className="flex items-baseline justify-between gap-4 py-3.5 text-mute">
                  <span>{s.platform}</span>
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
