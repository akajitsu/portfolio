import Link from "next/link";
import Timeline from "@/components/journey/Timeline";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/Icons";
import { certificates } from "@/data/certificates";
import { journey } from "@/data/experience";

export default function Journey() {
  const realCerts = certificates.filter((c) => !c.placeholder);

  return (
    <section id="journey" aria-labelledby="journey-title" className="shell py-16 sm:py-20">
      <SectionHeading id="journey-title" title="Experience" description="School, work, and the things I've built along the way." />

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:order-2 lg:col-span-7">
          <Timeline entries={journey} />
        </div>

        <FadeIn className="lg:order-1 lg:col-span-5">
          <h3 className="font-medium">Certificates</h3>
          {realCerts.length === 0 ? (
            <p className="mt-2 leading-relaxed text-mute">None yet. They&apos;ll be listed here as I complete them.</p>
          ) : (
            <>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {realCerts.map((c) => (
                  <li key={c.title} className="py-3">
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                        {c.title}
                      </a>
                    ) : (
                      c.title
                    )}
                    <p className="label">
                      {c.issuer} · {c.year}
                    </p>
                  </li>
                ))}
              </ul>
              <Link href="/Certificates" className="mt-3 inline-flex items-center gap-1 text-sm text-mute hover:text-ink">
                All certificates <ArrowUpRight size={13} />
              </Link>
            </>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
