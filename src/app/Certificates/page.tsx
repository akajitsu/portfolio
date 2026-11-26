import type { Metadata } from "next";
import CertificateCard, { CertificateArchiveEmpty } from "@/components/ui/CertificateCard";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { certificates } from "@/data/certificates";

export const metadata: Metadata = { title: "Certificates" };

export default function CertificatesPage() {
  return (
    <div className="shell pb-24 pt-32">
      <SectionHeading level="h1" eyebrow="Archive" title="Certificates" description="Courses and certifications I have completed." />
      <FadeIn className="mt-14">
        {certificates.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c, i) => (
              <CertificateCard key={`${c.title}-${i}`} certificate={c} heading="h2" index={i} />
            ))}
          </ul>
        ) : (
          <CertificateArchiveEmpty />
        )}
      </FadeIn>
    </div>
  );
}
