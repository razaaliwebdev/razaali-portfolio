"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

type SkillFlag = {
  flag: string;
  label: string;
};

type SkillCategory = {
  file: string;
  accent: string;
  flags: SkillFlag[];
};

const CATEGORIES: SkillCategory[] = [
  {
    file: "frontend.json",
    accent: "#58a6ff",
    flags: [
      { flag: "--react", label: "React.js" },
      { flag: "--nextjs", label: "Next.js" },
      { flag: "--expo", label: "Expo" },
      { flag: "--tailwind", label: "Tailwind CSS" },
      { flag: "--typescript", label: "TypeScript" },
      { flag: "--bootstrap", label: "Bootstrap" },
    ],
  },
  {
    file: "backend.json",
    accent: "#3fb950",
    flags: [
      { flag: "--nodejs", label: "Node.js" },
      { flag: "--express", label: "Express.js" },
      { flag: "--mongodb", label: "MongoDB" },
      { flag: "--postgres", label: "PostgreSQL" },
      { flag: "--drizzle", label: "Drizzle" },
      { flag: "--mongoose", label: "Mongoose" },
    ],
  },
  {
    file: "devops.json",
    accent: "#ffa657",
    flags: [
      { flag: "--git", label: "Git" },
      { flag: "--docker", label: "Docker" },
      { flag: "--actions", label: "GitHub Actions" },
      { flag: "--cloudinary", label: "Cloudinary" },
      { flag: "--vps", label: "Hostinger VPS" },
      { flag: "--deploy", label: "Deployment" },
    ],
  },
];

const PROFICIENCY = [
  { name: "React / Next.js", value: 75 },
  { name: "Node.js / Express", value: 83 },
  { name: "PostgreSQL / Drizzle", value: 58 },
  { name: "TypeScript", value: 55 },
  { name: "Docker / CI·CD", value: 60 },
] as const;

function CategoryPane({
  category,
  activeFlag,
  onSelect,
}: {
  category: SkillCategory;
  activeFlag: string | null;
  onSelect: (flag: string, label: string, file: string) => void;
}) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-md border border-border bg-[#0f131a]">
      <div className="flex items-center gap-2 border-b border-border bg-[#1a1f2a] px-3 py-2">
        <div className="flex shrink-0 gap-1">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: MAC_DOTS.close }}
            aria-hidden
          />
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: MAC_DOTS.minimize }}
            aria-hidden
          />
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: MAC_DOTS.maximize }}
            aria-hidden
          />
        </div>
        <span
          className="truncate font-mono text-[11px]"
          style={{ color: category.accent }}
        >
          {category.file}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
        <p className="font-mono text-[10px] text-foreground-muted">
          <span className="text-secondary">$</span> stack --list
        </p>
        <ul className="flex flex-wrap gap-2">
          {category.flags.map((item) => {
            const selected = activeFlag === item.flag;
            return (
              <li key={item.flag}>
                <button
                  type="button"
                  onClick={() =>
                    onSelect(item.flag, item.label, category.file)
                  }
                  className={`rounded-sm border px-2 py-1 font-mono text-[11px] transition-colors sm:text-xs ${
                    selected
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border text-foreground-muted hover:border-primary/40 hover:text-foreground"
                  }`}
                  aria-pressed={selected}
                >
                  {item.flag}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

function ProficiencyBar({
  name,
  value,
  animate,
}: {
  name: string;
  value: number;
  animate: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,8.5rem)_auto_1fr_auto] items-center gap-1.5 sm:grid-cols-[minmax(0,12rem)_auto_1fr_auto] sm:gap-2">
      <span className="truncate font-mono text-[11px] text-foreground sm:text-xs">
        {name}
      </span>
      <span className="font-mono text-foreground-muted" aria-hidden>
        [
      </span>
      <div
        className="skills-meter relative h-3.5 min-w-0 overflow-hidden rounded-[1px] sm:h-4"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} proficiency`}
      >
        <div
          className="skills-meter__track absolute inset-0"
          aria-hidden
        />
        <div
          className="relative h-full bg-primary transition-[width] duration-1000 ease-out"
          style={{ width: animate ? `${value}%` : "0%" }}
        />
      </div>
      <span className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
        <span className="text-foreground-muted" aria-hidden>
          ]
        </span>
        <span className="w-9 text-right text-primary">{value}%</span>
      </span>
    </div>
  );
}

export default function Skills() {
  const reduceMotion = useReducedMotion();
  const meterRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [selected, setSelected] = useState<{
    flag: string;
    label: string;
    file: string;
  } | null>(null);

  useEffect(() => {
    const el = meterRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animateBars = inView || reduceMotion === true;

  return (
    <section
      id="skills"
      className="relative scroll-mt-20 border-t border-border/40 py-12 lg:py-16"
      aria-labelledby="skills-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative w-full px-4 md:px-12 lg:px-24">
        <div className="mb-6 space-y-2 sm:mb-8">
          <p className="font-mono text-sm text-foreground-muted">
            <span className="text-[#d4bfff]">$</span>{" "}
            <span className="text-primary">cat</span> ./skills.json{" "}
            <span className="text-foreground-muted">|</span>{" "}
            <span className="text-secondary">jq</span>
          </p>
          <h2
            id="skills-heading"
            className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Skills<span className="text-primary">.</span>
          </h2>
          <p className="max-w-xl font-mono text-sm text-foreground-muted">
            // Runtime modules I ship with — pick a flag to inspect the stack.
          </p>
        </div>

        {/* Category panes */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {CATEGORIES.map((category) => (
            <CategoryPane
              key={category.file}
              category={category}
              activeFlag={selected?.flag ?? null}
              onSelect={(flag, label, file) =>
                setSelected({ flag, label, file })
              }
            />
          ))}
        </div>

        {/* Inspect output */}
        <div className="mt-3 overflow-hidden rounded-md border border-border bg-[#0c1018] px-3 py-2.5 font-mono text-[11px] sm:mt-4 sm:px-4 sm:text-xs">
          <p className="text-foreground-muted">
            <span className="text-secondary">stdout</span>
            <span className="text-foreground-muted"> · </span>
            {selected ? (
              <>
                resolved{" "}
                <span className="text-tertiary">{selected.flag}</span>
                {" → "}
                <span className="text-primary">{selected.label}</span>
                <span className="text-foreground-muted">
                  {" "}
                  from {selected.file}
                </span>
              </>
            ) : (
              <span>awaiting flag selection…</span>
            )}
          </p>
        </div>

        {/* Proficiency monitor */}
        <div
          ref={meterRef}
          className="mt-6 overflow-hidden rounded-md border border-border bg-[#0f131a] sm:mt-8"
        >
          <div className="border-b border-border bg-[#1a1f2a] px-3 py-2.5 sm:px-4">
            <p className="font-mono text-[11px] text-foreground-muted sm:text-xs">
              <span className="text-foreground-muted">
                // System Proficiency Status
              </span>
            </p>
          </div>

          <div className="space-y-3 px-3 py-4 sm:space-y-3.5 sm:px-5 sm:py-5">
            {PROFICIENCY.map((row) => (
              <ProficiencyBar
                key={row.name}
                name={row.name}
                value={row.value}
                animate={animateBars}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-[#1a1f2a] px-3 py-2 font-mono text-[10px] text-foreground-muted sm:px-4 sm:text-[11px]">
            <span>
              <span className="text-primary">✓</span> probe complete
            </span>
            <span>
              {CATEGORIES.reduce((n, c) => n + c.flags.length, 0)} flags ·{" "}
              {PROFICIENCY.length} meters
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
