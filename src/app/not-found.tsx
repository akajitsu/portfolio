import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col items-start justify-center pt-24">
      <p className="label">Error 404</p>
      <h1 className="mt-3 font-display text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-none tracking-[-0.03em]">Page not found</h1>
      <p className="mt-5 max-w-md text-mute">This page doesn&apos;t exist or has moved.</p>
      <div className="mt-10">
        <Button href="/" icon={<ArrowRight size={16} />}>
          Back home
        </Button>
      </div>
    </div>
  );
}
