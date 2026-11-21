import ImageSlot from "@/components/ui/ImageSlot";
import { ArrowUpRight } from "@/components/ui/Icons";
import type { Certificate } from "@/types";

export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  const body = (
    <>
      <ImageSlot src={certificate.image} alt={certificate.title} ratio="aspect-[4/3]" />
      <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
        <h2 className="font-display text-2xl font-semibold leading-tight tracking-[-0.015em]">{certificate.title}</h2>
        <span className="shrink-0 font-mono text-xs text-mute">{certificate.year}</span>
      </div>
      <p className="mt-1 px-1 text-sm text-mute">{certificate.issuer}</p>
    </>
  );

  const base = "group block h-full rounded-3xl border border-line bg-card p-3 pb-5 transition-[border-color,transform] duration-500";
  if (!certificate.href) return <li className={base}>{body}</li>;

  return (
    <li>
      <a href={certificate.href} target="_blank" rel="noopener noreferrer" className={`${base} hover:-translate-y-1 hover:border-ink`}>
        {body}
        <span className="mt-3 inline-flex items-center gap-1 px-1 text-sm text-mute group-hover:text-accent">
          View <ArrowUpRight size={13} />
        </span>
      </a>
    </li>
  );
}
