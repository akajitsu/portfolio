import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { Download, Eye, FileText } from "@/components/ui/Icons";
import { profile } from "@/data/profile";
import { getResumeInfo } from "@/lib/resume";

export default function Resume() {
  const resume = getResumeInfo();

  return (
    <section id="resume" aria-labelledby="resume-title" className="shell py-16 sm:py-20">
      <SectionHeading id="resume-title" title="Resume" description="A one-page summary you can view or download." />

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5">
          {resume.available ? (
            <>
              <dl className="divide-y divide-line border-y border-line">
                {(
                  [
                    ["Format", "PDF"],
                    ["Size", resume.sizeLabel],
                    ["Last updated", resume.lastUpdated],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="label">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={resume.href} external icon={<Eye size={16} />}>
                  View resume
                </Button>
                <Button href={resume.href} download={resume.downloadName} variant="secondary" icon={<Download size={16} />}>
                  Download PDF
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="leading-relaxed text-mute">
                My resume isn&apos;t up yet. In the meantime, you can{" "}
                <a href="#contact" className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
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
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="flex items-center justify-between border-b border-line px-4 py-3 text-sm">
                <span className="flex items-center gap-2">
                  <FileText size={15} /> {resume.downloadName}
                </span>
                <span className="text-mute">{resume.sizeLabel}</span>
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
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-line text-center sm:aspect-[16/9]">
              <FileText size={28} className="text-mute" />
              <p className="mt-3 font-display text-2xl font-medium tracking-[-0.015em]">Resume coming soon</p>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
