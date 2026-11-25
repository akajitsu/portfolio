import { Corners, EightStar } from "@/components/celestial/Ornaments";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { Download, Eye, FileText } from "@/components/ui/Icons";
import { profile } from "@/data/profile";
import { getResumeInfo } from "@/lib/resume";

export default function Resume() {
  const resume = getResumeInfo();

  return (
    <section id="resume" aria-labelledby="resume-title" className="shell py-20 sm:py-28">
      <SectionHeading id="resume-title" index={5} eyebrow="Document" title="Resume" description="A one-page summary you can view or download." />

      <div className="mt-14 grid items-start gap-12 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5">
          {resume.available ? (
            <>
              <dl className="divide-y divide-moon/25 border-y border-moon/25">
                {(
                  [
                    ["Format", "PDF"],
                    ["Last updated", resume.lastUpdated],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                      <dt className="eyebrow text-mute">{k}</dt>
                      <dd className="display text-xl">{v}</dd>
                    </div>
                  ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                {/* Download is the main action; viewing stays available beside it. */}
                <Button href={resume.href} download={resume.downloadName} icon={<Download size={16} />}>
                  Download PDF
                </Button>
                <Button href={resume.href} external variant="secondary" icon={<Eye size={16} />}>
                  View resume
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="leading-relaxed text-mute">
                My resume isn&apos;t up yet. In the meantime, you can{" "}
                <a href="#contact" className="text-ink underline decoration-moon/50 underline-offset-4 hover:decoration-accent">
                  contact me
                </a>{" "}
                directly.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button disabled disabledLabel="Soon">
                  View resume
                </Button>
                <Button disabled disabledLabel="Soon" variant="secondary">
                  Download PDF
                </Button>
              </div>
            </>
          )}
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-7">
          {resume.available ? (
            <>
              <div className="relative rounded-[18px] border border-moon/35 bg-card p-2.5 shadow-[0_40px_80px_-50px_var(--shadow-deep)]">
                <Corners inset="5px" />
                <div className="overflow-hidden rounded-[12px] border border-moon/20">
                  <div className="flex items-center justify-between border-b border-moon/20 bg-paper-2 px-4 py-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText size={15} className="shrink-0 text-moon" />
                      <span className="truncate">{resume.downloadName}</span>
                    </span>
                    <EightStar size={12} className="shrink-0 text-moon" />
                  </div>
                  {/* Inline PDF viewers are unreliable on phones — show a note there instead. */}
                  <iframe
                    src={`${resume.href}#view=FitH&toolbar=0`}
                    title={`${profile.name}'s resume`}
                    loading="lazy"
                    className="hidden aspect-[8.5/11] w-full bg-white md:block"
                  />
                  <p className="p-5 text-sm text-mute md:hidden">Open the PDF to read it on your phone.</p>
                </div>
              </div>
              {/* Archive caption, like the label under a filed plate */}
              <p aria-hidden="true" className="mt-3 flex justify-between gap-4 px-1 font-caps text-[0.6rem] tracking-[0.2em] text-faint uppercase">
                <span>Plate V · Curriculum vitae</span>
                {resume.lastUpdated && <span>Archived {resume.lastUpdated}</span>}
              </p>
            </>
          ) : (
            <div className="relative flex aspect-[4/3] flex-col items-center justify-center rounded-[18px] border border-dashed border-moon/40 text-center sm:aspect-[16/9]">
              <FileText size={28} className="text-moon" />
              <p className="display mt-3 text-3xl italic">Resume coming soon</p>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
