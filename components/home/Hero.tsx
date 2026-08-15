"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GitBranch, FolderOpen } from "lucide-react";
import CommitCount from "@/components/home/CommitCount";
import SkillsMarquee from "@/components/home/SkillsMarquee";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

type TabId = "profile" | "config";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "profile.ts" },
  { id: "config", label: "config.json" },
];

const ROLES = [
  "Full Stack Engineer",
  "MERN / PERN Developer",
  "Backend Engineer",
  "Frontend Engineer",
] as const;

const PHRASES = [
  "Real Problems",
  "Complex Challenges",
  "Difficult Problems",
  "Real-World Needs",
] as const;

function useTypewriter(
  text: string,
  enabled: boolean,
  speed = 42,
  startDelay = 0,
) {
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(() => !enabled);

  useEffect(() => {
    if (!enabled) return;

    let intervalId = 0;
    const startId = window.setTimeout(() => {
      setStarted(true);
      intervalId = window.setInterval(() => {
        setTyped((prev) => {
          const next = Math.min(prev + 1, text.length);
          if (next >= text.length) window.clearInterval(intervalId);
          return next;
        });
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [text, enabled, speed, startDelay]);

  const shown = !enabled ? text : started ? text.slice(0, typed) : "";
  const done = !enabled || (started && typed >= text.length);

  return { shown, done };
}

function Caret({ className = "text-primary" }: { className?: string }) {
  return (
    <span
      className={`inline-block translate-y-px ${className} cursor-blink`}
      aria-hidden
    />
  );
}

function useCyclingTyper(
  phrases: readonly string[],
  options?: {
    typeSpeed?: number;
    deleteSpeed?: number;
    holdMs?: number;
    gapMs?: number;
    enabled?: boolean;
  },
) {
  const typeSpeed = options?.typeSpeed ?? 90;
  const deleteSpeed = options?.deleteSpeed ?? 45;
  const holdMs = options?.holdMs ?? 2200;
  const gapMs = options?.gapMs ?? 400;
  const enabled = options?.enabled ?? true;

  // Start fully typed on mount so swapping in is seamless
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(() => phrases[0]?.length ?? 0);

  useEffect(() => {
    if (!enabled || phrases.length === 0) return;

    let phrase = 0;
    let chars = phrases[0].length;
    let deleting = false;
    let timerId = 0;

    const step = () => {
      const word = phrases[phrase];
      if (!deleting) {
        if (chars < word.length) {
          chars += 1;
          setCount(chars);
          timerId = window.setTimeout(step, typeSpeed);
        } else {
          deleting = true;
          timerId = window.setTimeout(step, holdMs);
        }
      } else if (chars > 0) {
        chars -= 1;
        setCount(chars);
        timerId = window.setTimeout(step, deleteSpeed);
      } else {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        setIndex(phrase);
        timerId = window.setTimeout(step, gapMs);
      }
    };

    timerId = window.setTimeout(step, 0);
    return () => window.clearTimeout(timerId);
  }, [phrases, typeSpeed, deleteSpeed, holdMs, gapMs, enabled]);

  const word = phrases[index] ?? phrases[0] ?? "";
  return word.slice(0, count);
}

function LoopingTail({
  phrases,
  reduceMotion,
}: {
  phrases: readonly string[];
  reduceMotion: boolean;
}) {
  const tail = useCyclingTyper(phrases, { enabled: !reduceMotion });
  return <>{tail}</>;
}

function ProfileCode() {
  return (
    <pre className="m-0 overflow-x-auto font-mono text-[11px] leading-[1.65] whitespace-pre sm:text-xs">
      <span className="ayu-kw">export</span> <span className="ayu-kw">const</span>{" "}
      <span className="ayu-const">profile</span> <span className="ayu-op">=</span>{" "}
      <span className="ayu-kw">new</span> <span className="ayu-type">Profile</span>
      <span className="ayu-punct">(</span>
      <span className="ayu-punct">{"{"}</span>
      {"\n"}
      {"  "}
      <span className="ayu-prop">name</span>
      <span className="ayu-punct">:</span>{" "}
      <span className="ayu-str">&quot;Raza Ali&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"  "}
      <span className="ayu-prop">role</span>
      <span className="ayu-punct">:</span>{" "}
      <span className="ayu-str">&quot;Full Stack Engineer&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"  "}
      <span className="ayu-prop">stack</span>
      <span className="ayu-punct">:</span> <span className="ayu-punct">[</span>
      {"\n"}
      {"    "}
      <span className="ayu-str">&quot;JavaScript&quot;</span>
      <span className="ayu-punct">,</span> <span className="ayu-str">&quot;Node.js&quot;</span>
      <span className="ayu-punct">,</span> <span className="ayu-str">&quot;React.js&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"    "}
      <span className="ayu-str">&quot;Next.js&quot;</span>
      <span className="ayu-punct">,</span> <span className="ayu-str">&quot;Express.js&quot;</span>
      <span className="ayu-punct">,</span> <span className="ayu-str">&quot;Docker&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"    "}
      <span className="ayu-str">&quot;MongoDB&quot;</span>
      <span className="ayu-punct">,</span> <span className="ayu-str">&quot;PostgreSQL&quot;</span>
      <span className="ayu-punct">,</span> <span className="ayu-str">&quot;Git&quot;</span>
      {"\n"}
      {"  "}
      <span className="ayu-punct">]</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"  "}
      <span className="ayu-prop">location</span>
      <span className="ayu-punct">:</span>{" "}
      <span className="ayu-str">&quot;Lahore, Pakistan&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"  "}
      <span className="ayu-prop">email</span>
      <span className="ayu-punct">:</span>{" "}
      <span className="ayu-str">&quot;razaali.webdev@gmail.com&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"  "}
      <span className="ayu-prop">github_handle</span>
      <span className="ayu-punct">:</span>{" "}
      <span className="ayu-str">&quot;razaaliwebdev&quot;</span>
      {"\n"}
      <span className="ayu-punct">{"}"}</span>
      <span className="ayu-punct">)</span>
      <span className="ayu-punct">;</span>
    </pre>
  );
}

function ConfigCode() {
  return (
    <pre className="m-0 overflow-x-auto font-mono text-[11px] leading-[1.65] whitespace-pre sm:text-xs">
      <span className="ayu-punct">{"{"}</span>
      {"\n"}
      {"  "}
      <span className="ayu-str">&quot;developer&quot;</span>
      <span className="ayu-punct">:</span> <span className="ayu-punct">{"{"}</span>
      {"\n"}
      {"    "}
      <span className="ayu-str">&quot;status&quot;</span>
      <span className="ayu-punct">:</span> <span className="ayu-str">&quot;Online&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"    "}
      <span className="ayu-str">&quot;focus&quot;</span>
      <span className="ayu-punct">:</span> <span className="ayu-punct">[</span>
      {"\n"}
      {"      "}
      <span className="ayu-str">&quot;React&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"      "}
      <span className="ayu-str">&quot;Node.js&quot;</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"      "}
      <span className="ayu-str">&quot;PostgreSQL&quot;</span>
      {"\n"}
      {"    "}
      <span className="ayu-punct">]</span>
      <span className="ayu-punct">,</span>
      {"\n"}
      {"    "}
      <span className="ayu-str">&quot;current_mission&quot;</span>
      <span className="ayu-punct">:</span>
      {"\n"}
      {"    "}
      <span className="ayu-str">&quot;Building scalable web apps&quot;</span>
      {"\n"}
      {"  "}
      <span className="ayu-punct">{"}"}</span>
      {"\n"}
      <span className="ayu-punct">{"}"}</span>
    </pre>
  );
}

function HeroIntro({ reduceMotion }: { reduceMotion: boolean | null }) {
  const enableType = !reduceMotion;
  const greeting = useTypewriter("Hi, I'm ", enableType, 38, 200);
  const name = useTypewriter("Raza Ali", enableType, 55, enableType ? 520 : 0);
  const lineA = useTypewriter(
    "Building Software That Solves",
    enableType && name.done,
    40,
    180,
  );

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (!lineA.done) return;
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [lineA.done]);

  const showRoles = lineA.done || reduceMotion;
  const activeRole = ROLES[roleIndex];

  return (
    <div className="flex h-full w-full flex-col justify-center gap-4.5 py-4 lg:w-full lg:gap-5 lg:py-2">
      {/* $ whoami */}
      <p className="flex flex-wrap items-baseline gap-x-2 text-sm sm:text-base">
        <span>
          <span className="text-[#d4bfff]">$</span>{" "}
          <span className="text-primary">whoami</span>
        </span>
        <span className="text-primary">
          Full Stack Developer (MERN / PERN)
        </span>
        {!greeting.done && <span className="text-foreground">|</span>}
      </p>

      {/* Hi, I'm Raza Ali_ */}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
        <span className="text-foreground">{greeting.shown}</span>
        <span className="text-primary">{name.shown}</span>
        {enableType && !name.done && <Caret />}
        {enableType && name.done && lineA.shown.length === 0 && <Caret />}
        {reduceMotion && <Caret />}
      </h1>

      {/* Headline — reserved height avoids CLS while typewriter runs */}
      <div className="min-h-[4.5rem] space-y-2 text-2xl font-semibold sm:min-h-[5.25rem] sm:text-3xl lg:min-h-[5.5rem] lg:text-[2rem] lg:leading-snug">
        <p>
          <span className="text-foreground">{lineA.shown}</span>
          {enableType &&
            lineA.done === false &&
            name.done &&
            lineA.shown.length > 0 && <Caret />}
        </p>
        <p className="text-primary">
          {enableType && lineA.done ? (
            <LoopingTail phrases={PHRASES} reduceMotion={false} />
          ) : reduceMotion ? (
            PHRASES[0]
          ) : (
            <span className="invisible" aria-hidden>
              {PHRASES[0]}
            </span>
          )}
          {(lineA.done || reduceMotion) && <Caret />}
        </p>
      </div>

      {/* Comments */}
      <div className="max-w-lg space-y-2 text-[15px] text-foreground-muted sm:text-base">
        <p>{"// Turning complex problems into elegant solutions."}</p>
        <p>
          {"// Specializing in scalable architectures — MongoDB, Express, React, Node, PostgreSQL & Drizzle."}
        </p>
      </div>

      {/* Cycling role */}
      <div className="relative min-h-[2rem]">
        <span className="mr-2 text-xl text-foreground-muted">&gt;</span>
        <span className="relative inline-block align-middle">
          {showRoles && (
            <AnimatePresence mode="wait">
              <motion.span
                key={activeRole}
                className="inline-block text-lg font-semibold text-primary sm:text-xl"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeRole}
              </motion.span>
            </AnimatePresence>
          )}
        </span>
      </div>

      {/* CTAs — single row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Link href="/projects" className="btn">
          <span className="inline-flex items-center gap-2">
            <FolderOpen className="size-4" aria-hidden />
            ./view_projects.sh
          </span>
        </Link>
        <Link
          href="/contact?source=home"
          className="inline-flex items-center border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <span>git contact --verbose</span>
        </Link>
        <div className="inline-flex min-w-[11.5rem] items-center gap-2 border border-border px-3 py-2 text-xs text-foreground-muted">
          <GitBranch className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span>
            <CommitCount className="inline-block min-w-[3.75ch] tabular-nums" />{" "}
            commits this year
          </span>
        </div>
      </div>

      <SkillsMarquee />
    </div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<TabId>("profile");

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100dvh-3.75rem)] w-full overflow-hidden py-8 lg:py-10"
    >
      {/* Full-bleed line grid (no page padding) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(63,185,80,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10 grid w-full grid-cols-1 gap-10 px-6 md:px-12 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-24">
        <div className="w-full min-w-0">
          <HeroIntro reduceMotion={reduceMotion} />
        </div>

        <motion.div
          className="relative w-full min-w-0"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
        <div className="ayu-mirage overflow-hidden rounded-md border border-[#141820] bg-[#1a1f2a] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <div className="border-b border-[#141820] bg-[#1a1f2a]">
            <div className="relative flex items-center px-3 pt-2.5 pb-0">
              <div className="mb-2 flex items-center gap-1.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: MAC_DOTS.close }}
                />
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: MAC_DOTS.minimize }}
                />
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: MAC_DOTS.maximize }}
                />
              </div>
            </div>

            <div
              className="flex gap-0 px-2"
              role="tablist"
              aria-label="Editor files"
            >
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(t.id)}
                    className={`relative px-3 py-2 text-[11px] transition-colors sm:text-xs ${
                      active
                        ? "text-[#cbccc6]"
                        : "text-[#a8b2c1] hover:text-[#cbccc6]"
                    }`}
                  >
                    {t.label}
                    {active && (
                      <motion.span
                        layoutId="hero-tab-underline"
                        className="absolute inset-x-2 bottom-0 h-0.5 bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Height hugs content on mobile — no tall empty panel */}
          <div className="bg-[#0f131a] px-3 py-3 sm:px-4 sm:py-4 lg:min-h-[360px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                role="tabpanel"
              >
                {tab === "profile" ? <ProfileCode /> : <ConfigCode />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer inside panel — no overlapping badge */}
          <div className="flex items-center justify-between border-t border-[#141820] bg-[#1a1f2a] px-3 py-2 text-[10px] text-[#a8b2c1] sm:px-4 sm:text-[11px]">
            <span>UTF-8</span>
            <span className="inline-flex items-center gap-1.5 text-[#cbccc6]">
              <GitBranch className="size-3 text-[#bae67e]" aria-hidden />
              <CommitCount className="inline-block min-w-[3.75ch] tabular-nums" />{" "}
              commits
            </span>
          </div>
        </div>
        </motion.div>
      </div>
    </section>
  );
}
