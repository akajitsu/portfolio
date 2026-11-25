import Image from "next/image";
import { roman } from "@/components/celestial/Ornaments";
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
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-moon/45 font-display text-[0.95rem] font-semibold text-accent transition-[background-color,border-color] duration-500 group-hover:border-moon group-hover:bg-moon/12"
      >
        {skill.icon ? <Image src={skill.icon} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" /> : monogramFor(skill)}
        {/* A small planet that makes one orbit of the icon on hover */}
        <span className="absolute -inset-[3px] rotate-0 transition-[rotate] duration-[1.4s] ease-out-expo group-hover:rotate-[360deg]">
          <span className="absolute left-1/2 top-0 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-moon opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-tight">{skill.name}</span>
        {skill.level && <span className="label block">{skill.level}</span>}
      </span>
      {isUsableLink(skill.url) && (
        <ArrowUpRight size={14} className="shrink-0 text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </>
  );

  const cls =
    "group flex h-full items-center gap-3 rounded-2xl border border-moon/25 bg-card/60 p-3 pr-4 backdrop-blur-[2px] transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-moon/60";

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
    <section id="stack" aria-labelledby="stack-title" className="shell py-20 sm:py-28">
      <SectionHeading id="stack-title" index={6} eyebrow="Instruments" title="Tech stack" description="What I've used so far, with honest levels." />

      <div className="mt-14 divide-y divide-moon/25 border-y border-moon/25">
        {categories.map((cat, ci) => (
          <div key={cat.id} className="grid gap-x-12 gap-y-4 py-8 lg:grid-cols-12">
            <FadeIn className="lg:col-span-5">
              {/* Inventory entry: catalogue number and count, like an instrument register */}
              <p aria-hidden="true" className="mb-1.5 font-caps text-[0.62rem] tracking-[0.2em] text-faint uppercase">
                Cat. {roman(ci + 1)} · {cat.skills.length} {cat.skills.length === 1 ? "instrument" : "instruments"}
              </p>
              <h3 className="display text-[1.75rem] leading-tight">{cat.title}</h3>
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
