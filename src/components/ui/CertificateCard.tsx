import Image from "next/image";
import { DrawFrame } from "@/components/celestial/Drawn";
import { Corners, Sparkle, SunBurst, roman } from "@/components/celestial/Ornaments";
import FadeIn from "@/components/ui/FadeIn";
import { ArrowUpRight } from "@/components/ui/Icons";
import type { Certificate } from "@/types";
import { cn } from "@/lib/utils";

/** Decorative seal shown when a certificate has no image yet. */
function Seal() {
  return (
    <div aria-hidden="true" className="hatch absolute inset-0 flex items-center justify-center">
      <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-moon/45 bg-card">
        <span className="absolute inset-1.5 animate-spin-slow rounded-full border border-dashed border-moon/35" />
        <SunBurst size={56} spin className="text-bronze" />
      </span>
    </div>
  );
}

/**
 * A certificate as an archive plate: framed preview, issuer, title and date.
 * The whole card links to the verification page when `href` is set.
 */
export default function CertificateCard({
  certificate,
  heading: H = "h3",
  index = 0,
}: {
  certificate: Certificate;
  heading?: "h2" | "h3";
  /** Position in its list: cards arrive one after another. */
  index?: number;
}) {
  const { title, issuer, date, image, href } = certificate;
  const body = (
    <>
      <DrawFrame radius={18} delay={0.2 + index * 0.15} opacity={0.5} />
      <Corners inset="6px" />
      <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-moon/20 bg-paper-2">
        {image ? (
          <Image src={image} alt={`${title} certificate`} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]" />
        ) : (
          <Seal />
        )}
      </div>
      <div className="px-2 pb-2 pt-5">
        <p className="eyebrow flex items-baseline justify-between gap-3">
          <span>{issuer}</span>
          <span aria-hidden="true" className="shrink-0 text-[0.58rem] text-faint">
            Arch. {roman(index + 1)}
          </span>
        </p>
        <H className="display mt-2 text-[1.65rem] leading-[1.1]">{title}</H>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-moon/20 pt-3">
          <span className="label inline-flex items-center gap-1.5">
            <Sparkle size={9} className="text-moon" /> {date}
          </span>
          {href && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              Verify <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </>
  );

  const cls =
    "group relative block h-full rounded-[18px] border border-moon/10 bg-card/80 p-3 transition-[border-color,transform,box-shadow] duration-500 ease-out-expo";

  if (!href)
    return (
      <FadeIn as="li" delay={index * 0.12} className={cls}>
        {body}
      </FadeIn>
    );
  return (
    <FadeIn as="li" delay={index * 0.12} className="h-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(cls, "hover:-translate-y-1 hover:border-moon/80 hover:shadow-[0_30px_60px_-40px_var(--shadow-deep)]")}
      >
        {body}
        <span className="sr-only"> (verification opens in a new tab)</span>
      </a>
    </FadeIn>
  );
}

/** Shown until the first certificate is added: three empty, numbered plates. */
export function CertificateArchiveEmpty({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[22px] border border-moon/10 bg-card/40 px-5 py-10 sm:px-10 sm:py-14", className)}>
      <DrawFrame radius={22} opacity={0.45} />
      <Corners inset="10px" />
      {/* Empty plates arrive one by one; each marker lights as it lands */}
      <ul aria-hidden="true" className="grid gap-4 opacity-80 sm:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <FadeIn
            as="li"
            key={n}
            delay={0.35 + n * 0.18}
            y={14}
            className={cn("relative flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-moon/30", n > 1 && "hidden sm:flex")}
          >
            <span className="display text-4xl italic text-moon/40">{roman(n)}</span>
            <Sparkle size={9} className="animate-twinkle absolute right-3 top-3 text-cream/60" style={{ animationDelay: `${-n * 1.3}s` }} />
          </FadeIn>
        ))}
      </ul>
      <div className="mt-10 flex flex-col items-center text-center">
        <SunBurst size={52} spin className="text-bronze" />
        <p className="display mt-3 text-3xl italic">None yet</p>
        <p className="mt-2 max-w-sm text-mute">They&apos;ll be listed here as I complete them.</p>
      </div>
    </div>
  );
}
