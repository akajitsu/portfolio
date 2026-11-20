import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/Icons";
import { skillCategories } from "@/data/skills";
import type { Skill } from "@/types";
import { isUsableLink } from "@/lib/utils";

function monogramFor(s: Skill) {
  if (s.monogram) return s.monogram;
  const words = s.name.split(/\s+/);
  return (words.length > 1 ? words[0][0] + words[1][0] : s.name.slice(0, 2)).toUpperCase();
}

function SkillTile({ skill }: { skill: Skill }) {
  const body = (
    <>
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper-2 font-mono text-xs font-semibold transition-colors duration-300 group-hover:bg-accent group-hover:text-paper"
      >
        {skill.icon ? <Image src={skill.icon} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" /> : monogramFor(skill)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-tight">{skill.name}</span>
        {skill.level && <span className="label block">{skill.level}</span>}
      </span>
      {isUsableLink(skill.url) && (
        <ArrowUpRight size={14} className="shrink-0 text-mute opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </>
  );

  const cls =
    "group flex h-full items-center gap-3 rounded-xl border border-line bg-card p-3 pr-4 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-mute";

  return isUsableLink(skill.url) ? (
    <a href={skill.url} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default function TechStack() {
  const categories = skillCategories.filter((c) => c.skills.length > 0);

  return (
    <section id="stack" aria-labelledby="stack-title" className="shell py-16 sm:py-20">
      <SectionHeading id="stack-title" title="Tech stack" description="What I've used so far, with honest levels." />

      <div className="mt-12 divide-y divide-line border-y border-line">
        {categories.map((cat) => (
          <div key={cat.id} className="grid gap-x-12 gap-y-4 py-8 lg:grid-cols-12">
            <FadeIn className="lg:col-span-5">
              <h3 className="font-medium">{cat.title}</h3>
              {cat.description && <p className="label mt-1">{cat.description}</p>}
            </FadeIn>
            <ul className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-7 xl:grid-cols-3">
              {cat.skills.map((s, i) => (
                <FadeIn as="li" key={s.name} delay={i * 0.04} y={12}>
                  <SkillTile skill={s} />
                </FadeIn>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
