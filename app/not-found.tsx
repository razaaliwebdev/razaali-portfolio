"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

const SUGGESTIONS = [
  { cmd: "cd ~/", href: "/", label: "home" },
  { cmd: "cat ./about.sh", href: "/#about", label: "about" },
  { cmd: "cat ./skills.json", href: "/#skills", label: "skills" },
  { cmd: "./contact.cmd", href: "/contact", label: "contact" },
] as const;

const GLITCH_LINES = [
  "segfault (core dumped)",
  "ENOENT: no such file or directory",
  "route table miss — packet dropped",
  "resolver returned NXDOMAIN",
] as const;

export default function NotFound() {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);
  const [path, setPath] = useState("/lost");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPath(window.location.pathname || "/lost");
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const glitch = GLITCH_LINES[tick % GLITCH_LINES.length];

  return (
    <main className="relative flex min-h-[calc(100dvh-3.75rem)] w-full items-center justify-center px-4 py-12 md:px-12 lg:px-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-35" />
      </div>

      <div className="relative w-full max-w-2xl overflow-hidden border border-border bg-[#0f131a] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        {/* Title bar */}
        <div className="relative flex items-center border-b border-border bg-[#1a1f2a] px-3 py-2.5">
          <div className="z-10 flex gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: MAC_DOTS.close }}
              aria-hidden
            />
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: MAC_DOTS.minimize }}
              aria-hidden
            />
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: MAC_DOTS.maximize }}
              aria-hidden
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-[11px] text-foreground-muted sm:text-xs">
            visitor@razaali.dev:~/404.sh
          </span>
        </div>

        <div className="space-y-5 px-4 py-5 font-mono text-[12px] sm:px-6 sm:py-6 sm:text-[13px]">
          <div className="space-y-1 text-foreground-muted">
            <p>
              <span className="text-primary">visitor@razaali.dev</span>
              <span>:~$</span> resolve{" "}
              <span className="text-secondary">{path}</span>
            </p>
            <p className="text-danger">
              bash: {path}: No such file or directory
            </p>
            <p>
              <span className="text-foreground-muted">#</span>{" "}
              <span className="text-secondary">{glitch}</span>
            </p>
          </div>

          {/* Giant exit code */}
          <div className="relative overflow-hidden border border-border/70 bg-[#0b0e14] px-3 py-6 text-center sm:py-8">
            <p
              className="select-none font-mono text-[clamp(4.5rem,18vw,7.5rem)] font-bold leading-none tracking-tighter text-primary/15"
              aria-hidden
            >
              404
            </p>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <p className="text-[11px] uppercase tracking-[0.35em] text-foreground-muted sm:text-xs">
                process exited
              </p>
              <p className="text-3xl font-bold text-danger sm:text-4xl">
                exit{" "}
                <span className="text-primary">404</span>
              </p>
              <p className="mt-1 max-w-xs text-[11px] text-foreground-muted sm:text-xs">
                The route you requested never compiled.
              </p>
            </div>
          </div>

          {/* Recovery commands */}
          <div className="space-y-2">
            <p className="text-foreground-muted">
              <span className="text-tertiary">hint</span>
              {" → "}try one of these:
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 border border-border bg-[#0b0e14] px-3 py-2 text-foreground-muted transition-colors hover:border-primary hover:text-primary"
                  >
                    <span className="text-primary opacity-70 group-hover:opacity-100">
                      $
                    </span>
                    <span className="truncate">{item.cmd}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-5">
            <p className="text-[11px] text-foreground-muted">
              <span className="text-primary">pid</span>=lost{" "}
              <span className="text-border">·</span>{" "}
              <span className="text-secondary">errno</span>=ENOENT
            </p>
            <Link href="/" className="btn text-sm">
              $ cd ~/
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
