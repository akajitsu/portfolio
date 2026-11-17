import type { Metadata } from "next";
import CertificateCard from "@/components/ui/CertificateCard";
import { certificates } from "@/data/certificates";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: `Certificates | ${profile.name}` };

export default function CertificatesPage() {
  return (
    <div className="pt-20">
      <h1 className="text-4xl font-semibold tracking-tight">Certificates</h1>
      <p className="mt-6 max-w-prose leading-relaxed">Courses and certifications I have completed. More coming soon.</p>
      <ul className="mt-10 grid gap-4">
        {certificates.map((c, i) => (
          <CertificateCard key={i} certificate={c} />
        ))}
      </ul>
    </div>
  );
}