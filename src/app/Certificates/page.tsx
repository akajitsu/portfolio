import type { Metadata } from "next";
import CertificateCard from "@/components/ui/CertificateCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { FileText } from "@/components/ui/Icons";
import { certificates } from "@/data/certificates";

export const metadata: Metadata = { title: "Certificates" };

export default function CertificatesPage() {
  const real = certificates.filter((c) => !c.placeholder);

  return (
    <div className="shell pb-24 pt-32">
      <SectionHeading level="h1" title="Certificates" description="Courses and certifications I have completed." />
      {real.length > 0 ? (
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {real.map((c, i) => (
            <CertificateCard key={i} certificate={c} />
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-20 text-center">
          <FileText size={28} className="text-mute" />
          <p className="mt-3 font-display text-2xl font-medium tracking-[-0.015em]">None yet</p>
          <p className="mt-1 text-mute">They&apos;ll be listed here as I complete them.</p>
        </div>
      )}
    </div>
  );
}
