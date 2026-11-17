import Image from "next/image";

type Props = { src?: string; alt: string; ratio?: string };

// Shows the real image if `src` is given, otherwise an empty placeholder box.
export default function ImageSlot({ src, alt, ratio = "aspect-video" }: Props) {
  if (src) {
    return (
      <div className={`relative ${ratio} overflow-hidden rounded-lg bg-line`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${ratio} flex items-center justify-center rounded-lg border border-dashed border-line bg-paper text-xs text-mute`}
      aria-hidden="true"
    >
      Image placeholder
    </div>
  );
}