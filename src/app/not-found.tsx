import { Crescent } from "@/components/celestial/Ornaments";
import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="shell relative flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <Crescent aria-hidden="true" size={260} className="pointer-events-none absolute right-[6%] top-1/2 -z-10 -translate-y-1/2 -rotate-12 text-moon opacity-[0.08]" />
      <p className="eyebrow">Error 404</p>
      <h1 className="display mt-4 text-[clamp(3rem,7.5vw,6rem)]">
        Page not <span className="italic text-accent">found</span>
      </h1>
      <p className="mt-5 max-w-md text-mute">This page doesn&apos;t exist or has moved.</p>
      <div className="mt-10">
        <Button href="/" icon={<ArrowRight size={16} />}>
          Back home
        </Button>
      </div>
    </div>
  );
}
