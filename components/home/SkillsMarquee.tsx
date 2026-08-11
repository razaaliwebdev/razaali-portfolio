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
  { name: "CI/CD · GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
];

function SkillItem({ name, Icon, color }: Skill) {
  return (
    <li className="skills-marquee__item group/skill shrink-0 list-none" title={name}>
      <span
        className="inline-flex size-10 items-center justify-center transition-[transform,filter] duration-300 ease-out group-hover/skill:scale-110 group-hover/skill:drop-shadow-[0_0_10px_color-mix(in_srgb,var(--skill)_35%,transparent)] sm:size-11"
        style={{ ["--skill" as string]: color }}
      >
        <Icon
          className="size-[1.35rem] opacity-45 grayscale transition-[opacity,filter] duration-300 group-hover/skill:opacity-100 group-hover/skill:grayscale-0 sm:size-6"
          style={{ color: "var(--skill)" }}
          aria-hidden
        />
      </span>
    </li>
  );
}

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="skills-marquee__track flex shrink-0 items-center gap-5 sm:gap-7"
      aria-hidden={ariaHidden || undefined}
    >
      {SKILLS.map((skill) => (
        <SkillItem key={`${ariaHidden ? "b" : "a"}-${skill.name}`} {...skill} />
      ))}
    </ul>
  );
}

export default function SkillsMarquee() {
  const reduceMotion = useReducedMotion();
  const label = `Tech stack: ${SKILLS.map((s) => s.name).join(", ")}`;

  return (
    <div className="skills-marquee w-full min-w-0" aria-label={label} role="region">
      <p className="mb-2 font-mono text-[10px] text-foreground-muted sm:text-[11px]">
        <span className="text-secondary">ls</span> ./skills/
      </p>

      <div
        className={`skills-marquee__viewport relative overflow-hidden ${
          reduceMotion ? "skills-marquee__viewport--static" : ""
        }`}
      >
        <div
          className={`skills-marquee__rail flex w-max items-center gap-5 sm:gap-7 ${
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
