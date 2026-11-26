import Link from "next/link";
import CertificateCard, { CertificateArchiveEmpty } from "@/components/ui/CertificateCard";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/Icons";
import { certificates } from "@/data/certificates";

/** Home-page archive of certificates, training and completed courses. */
export default function Certificates() {
  const shown = certificates.slice(0, 6);

  return (
    <section id="certificates" aria-labelledby="certificates-title" className="shell py-20 sm:py-28">
      <SectionHeading
        id="certificates-title"
        index={2}
        eyebrow="Archive"
        title="Certificates"
        description="Courses and certifications I have completed."
        aside={
          certificates.length > 0 ? (
            <Link href="/Certificates" className="link-gold group inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-accent">
              All certificates
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          ) : undefined
        }
      />

      {shown.length > 0 ? (
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c, i) => (
            <CertificateCard key={`${c.title}-${i}`} certificate={c} index={i} />
          ))}
        </ul>
      ) : (
        <FadeIn className="mt-14">
          <CertificateArchiveEmpty />
        </FadeIn>
      )}
    </section>
  );
}
