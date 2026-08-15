"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const RESOLVE_STEPS = [
  "resolving react@19.0.0",
  "resolving node@20.x",
  "resolving postgresql-client",
  "resolving typescript@5.x",
] as const;

/** Classic macOS window control colors */
const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

export type TerminalLoaderProps = {
  blocks?: number;
  duration?: number;
  autoDismiss?: boolean;
  onDismiss?: () => void;
  className?: string;
};

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

function buildBar(progress: number, blocks: number) {
  const exact = progress * blocks;
  const filled = Math.floor(exact);
  const frac = exact - filled;
  const hasPartial = frac > 0.12 && filled < blocks;
  const empty = Math.max(0, blocks - filled - (hasPartial ? 1 : 0));

  return {
    filled: "█".repeat(filled),
    partial: hasPartial ? "▓" : "",
    empty: "░".repeat(empty),
  };
}

function blocksForWidth(width: number, max: number) {
  if (width < 360) return Math.min(max, 10);
  if (width < 400) return Math.min(max, 12);
  if (width < 480) return Math.min(max, 16);
  if (width < 640) return Math.min(max, 20);
  return max;
}

export default function TerminalLoader({
  blocks: blocksProp = 24,
  duration = 2000,
  autoDismiss = false,
  onDismiss,
  className = "",
}: TerminalLoaderProps) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const [minimizing, setMinimizing] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [blocks, setBlocks] = useState(blocksProp);

  // Fewer ASCII bar blocks on narrow screens to avoid overflow
  useEffect(() => {
    const update = () => setBlocks(blocksForWidth(window.innerWidth, blocksProp));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [blocksProp]);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      setDone(true);
      setElapsedSec(duration / 1000);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const delay = 180;

    const tick = (now: number) => {
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, elapsed / duration);
      setProgress(easeOutQuint(t));
      setElapsedSec(Math.max(0, elapsed) / 1000);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(1);
        setElapsedSec(duration / 1000);
        setDone(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, reduceMotion]);

  useEffect(() => {
    if (!done || !autoDismiss) return;

    const hold = reduceMotion ? 60 : 120;
    const exitMs = reduceMotion ? 120 : 220;

    const startMin = window.setTimeout(() => setMinimizing(true), hold);
    const finish = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, hold + exitMs);

    return () => {
      window.clearTimeout(startMin);
      window.clearTimeout(finish);
    };
  }, [done, autoDismiss, reduceMotion, onDismiss]);

  if (!visible) return null;

  const percent = Math.min(100, Math.round(progress * 100));
  const bar = buildBar(progress, blocks);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${percent}%`}
    >
      <motion.div
        className="absolute inset-0 bg-background"
        initial={false}
        animate={{ opacity: minimizing ? 0 : 1 }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.55,
          delay: minimizing && !reduceMotion ? 0.1 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 dot-grid"
        aria-hidden
        style={{ opacity: minimizing ? 0 : undefined }}
      />

      <motion.div
        className="relative flex max-h-[min(88dvh,38rem)] w-full max-w-[34rem] flex-col overflow-hidden rounded-lg border border-border bg-background-panel font-mono text-[12px] leading-relaxed text-foreground sm:text-sm"
        initial={false}
        animate={
          minimizing
            ? {
                opacity: 0,
              }
            : {
                opacity: 1,
              }
        }
        transition={
          minimizing
            ? {
                duration: reduceMotion ? 0.12 : 0.22,
                ease: "easeOut",
              }
            : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className="relative flex shrink-0 items-center border-b border-border bg-background/40 px-3 py-2.5">
          <div className="z-10 flex items-center gap-1.5 sm:gap-2">
            <span
              className="size-2.5 rounded-full sm:size-3"
              style={{ backgroundColor: MAC_DOTS.close }}
              aria-hidden
            />
            <motion.span
              className="size-2.5 rounded-full sm:size-3"
              style={{ backgroundColor: MAC_DOTS.minimize }}
              aria-hidden
              animate={
                done && !reduceMotion
                  ? {
                      scale: [1, 1.22, 1],
                      boxShadow: [
                        "0 0 0px rgba(254,188,46,0)",
                        "0 0 8px rgba(254,188,46,0.65)",
                        "0 0 0px rgba(254,188,46,0)",
                      ],
                    }
                  : undefined
              }
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <span
              className="size-2.5 rounded-full sm:size-3"
              style={{ backgroundColor: MAC_DOTS.maximize }}
              aria-hidden
            />
          </div>
          <span className="pointer-events-none absolute inset-x-10 truncate text-center text-[11px] text-foreground-muted sm:inset-x-0 sm:text-xs">
            root@dev-env: ~
          </span>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3.5 sm:px-5 sm:py-5">
          <p className="truncate text-[10px] text-foreground-muted sm:text-xs">
            # portfolio · registry: https://registry.npmjs.org/
          </p>

          <p className="break-all">
            <span className="text-foreground-muted">&gt;</span>{" "}
            <span>npm install razaali.dev</span>
          </p>

          <div className="text-foreground-muted">
            {RESOLVE_STEPS.map((step) => (
              <p key={step} className="break-all">
                <span>&gt;</span> {step}
              </p>
            ))}
          </div>

          <div className="flex min-w-0 items-baseline gap-2 overflow-hidden pt-1 font-mono text-[11px] leading-none tracking-tight sm:text-sm">
            <span className="shrink-0 text-primary">fetching</span>
            <span className="min-w-0 overflow-hidden whitespace-nowrap text-foreground">
              <span>[</span>
              <span className="text-primary">
                {bar.filled}
                {bar.partial}
              </span>
              <span className="text-foreground-muted">{bar.empty}</span>
              <span>]</span>
            </span>
            <span className="shrink-0 tabular-nums text-foreground">
              {percent}%
            </span>
          </div>

          {done && (
            <div className="space-y-1 pt-1">
              <p className="text-foreground-muted">
                <span className="text-primary">✓</span> audited 1 package · 0
                vulnerabilities
              </p>
              <p>added 1 package in {elapsedSec.toFixed(1)}s</p>
              <p>
                <span className="text-secondary">razaali.dev</span> ready.
              </p>
              <p className="flex items-center gap-1 pt-2 text-foreground-muted">
                <span>&gt;</span>
                <span className="inline-block h-3.5 w-2 animate-pulse bg-foreground-muted/70" />
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-3 py-2 text-[10px] text-foreground-muted sm:px-4 sm:text-[11px]">
          <span className="truncate">bash — 80×24</span>
          <span className="shrink-0 text-primary">
            {minimizing ? "minimizing…" : done ? "complete" : "installing…"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function BootSplash({
  blocks = 24,
  duration = 700,
}: Pick<TerminalLoaderProps, "blocks" | "duration">) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("razaali-boot-seen") === "1") {
        setShow(false);
        return;
      }
      sessionStorage.setItem("razaali-boot-seen", "1");
      setShow(true);
    } catch {
      // Prefer skipping splash if storage is unavailable (faster first paint)
      setShow(false);
    }

    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  if (!show) return null;

  return (
    <TerminalLoader
      blocks={blocks}
      duration={duration}
      autoDismiss
      onDismiss={() => {
        setShow(false);
        const hash = window.location.hash;
        if (hash) {
          requestAnimationFrame(() => {
            document
              .querySelector(hash)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }}
    />
  );
}
