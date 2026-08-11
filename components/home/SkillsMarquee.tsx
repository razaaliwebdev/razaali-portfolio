"use client";

import type { IconType } from "react-icons";
import {
  SiBootstrap,
  SiCloudinary,
  SiCss,
  SiDocker,
  SiDrizzle,
  SiExpo,
  SiExpress,
  SiGit,
  SiGithubactions,
  SiHostinger,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { TbBrandMongodb, TbCloudUp } from "react-icons/tb";
import { useReducedMotion } from "motion/react";

type Skill = {
  name: string;
  Icon: IconType;
  color: string;
};

const SKILLS: Skill[] = [
  { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
  { name: "CSS", Icon: SiCss, color: "#1572B6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Bootstrap", Icon: SiBootstrap, color: "#7952B3" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "React.js", Icon: SiReact, color: "#61DAFB" },
  { name: "Expo", Icon: SiExpo, color: "#3fb950" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#339933" },
  { name: "Express.js", Icon: SiExpress, color: "#e6edf3" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#416EE4" },
  { name: "Drizzle", Icon: SiDrizzle, color: "#C5F74F" },
  { name: "Mongoose", Icon: TbBrandMongodb, color: "#880000" },
  { name: "Cloudinary", Icon: SiCloudinary, color: "#3448C5" },
  { name: "Hostinger VPS", Icon: SiHostinger, color: "#673DE6" },
  { name: "Deployment", Icon: TbCloudUp, color: "#3fb950" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "CI/CD", Icon: SiGithubactions, color: "#2088FF" },
];

function SkillItem({ name, Icon, color }: Skill) {
  return (
    <span
      className="skills-marquee__item group/skill relative inline-flex shrink-0"
      title={name}
    >
      <span
        className="relative inline-flex size-10 flex-col items-center justify-center sm:size-11"
        style={{ ["--skill" as string]: color }}
      >
        <Icon
          className="size-[1.35rem] opacity-[0.38] grayscale transition-[opacity,filter,transform,color] duration-300 ease-out group-hover/skill:translate-y-[-1px] group-hover/skill:scale-110 group-hover/skill:opacity-100 group-hover/skill:grayscale-0 group-hover/skill:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--skill)_45%,transparent)] sm:size-6"
          style={{ color: "var(--skill)" }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -bottom-0.5 h-px w-0 bg-[color-mix(in_srgb,var(--skill)_70%,#3fb950)] transition-[width] duration-300 ease-out group-hover/skill:w-4"
          aria-hidden
        />
      </span>
    </span>
  );
}

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="skills-marquee__track flex shrink-0 items-center gap-1 sm:gap-1.5"
      aria-hidden={ariaHidden || undefined}
    >
      {SKILLS.map((skill, i) => (
        <span key={`${ariaHidden ? "b" : "a"}-${skill.name}`} className="contents">
          {i > 0 ? (
            <span
              className="mx-1.5 size-0.5 shrink-0 rounded-full bg-border/80 sm:mx-2"
              aria-hidden
            />
          ) : null}
          <SkillItem {...skill} />
        </span>
      ))}
    </div>
  );
}

export default function SkillsMarquee() {
  const reduceMotion = useReducedMotion();
  const label = `Tech stack: ${SKILLS.map((s) => s.name).join(", ")}`;

  return (
    <div
      className="skills-marquee w-full min-w-0 pt-1"
      aria-label={label}
      role="region"
    >
      <div className="mb-2.5 flex items-center gap-2 font-mono text-[10px] text-foreground-muted sm:text-[11px]">
        <span>
          <span className="text-secondary">ls</span> ./skills/
        </span>
        <span className="h-px flex-1 bg-border/50" aria-hidden />
        <span className="text-[9px] tracking-wide text-foreground-muted/70 sm:text-[10px]">
          {SKILLS.length} modules
        </span>
      </div>

      <div
        className={`skills-marquee__viewport relative overflow-hidden bg-[#0c1018]/55 py-2.5 sm:py-3 ${
          reduceMotion ? "skills-marquee__viewport--static" : ""
        }`}
      >
        <div
          className={`skills-marquee__rail flex w-max items-center gap-1 sm:gap-1.5 ${
            reduceMotion ? "" : "skills-marquee__rail--scroll"
          }`}
        >
          <Track ariaHidden />
          {!reduceMotion && <Track ariaHidden />}
        </div>
      </div>
    </div>
  );
}
