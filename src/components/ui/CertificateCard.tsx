import ImageSlot from "@/components/ui/ImageSlot";
import type { Certificate } from "@/types";

export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  const body = (
    <>
      <ImageSlot src={certificate.image} alt={certificate.title} ratio="aspect-[4/3]" />
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h2 className="font-medium">{certificate.title}</h2>
        <span className="shrink-0 text-sm text-mute">{certificate.year}</span>
      </div>
      <p className="mt-1 text-sm text-mute">{certificate.issuer}</p>
      {certificate.placeholder && <p className="mt-3 text-xs text-mute">Placeholder</p>}
    </>
  );

  const base = "block rounded-xl border border-line bg-card p-4 transition-colors";
  if (certificate.placeholder) return <li className={base}>{body}</li>;

  return (
    <li>
      <a href={certificate.href} target="_blank" rel="noreferrer" className={`${base} hover:border-accent`}>
        {body}
      </a>
    </li>
  );
}