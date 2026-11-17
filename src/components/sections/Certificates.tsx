import Section from "@/components/ui/Section";
import CertificateCard from "@/components/ui/CertificateCard";
import { certificates } from "@/data/certificates";

export default function Certificates() {
  return (
    <Section id="certificates" title="Certificates">
      <ul className="grid gap-4 sm:grid-cols-2">
        {certificates.map((c, i) => (
          <CertificateCard key={i} certificate={c} />
        ))}
      </ul>
    </Section>
  );
}