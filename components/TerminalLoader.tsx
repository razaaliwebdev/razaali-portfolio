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

export default function TerminalLoader({
  blocks = 24,
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

    const hold = reduceMotion ? 120 : 600;
    const exitMs = reduceMotion ? 200 : 700;

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
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 ${className}`}
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

      {/* Soft dock minimize — scale + sink + fade (no cartoon squash) */}
      <motion.div
        className="relative w-[min(92vw,36rem)] overflow-hidden rounded-lg border border-border bg-background-panel font-mono text-[13px] leading-relaxed text-foreground will-change-transform sm:text-sm"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={
          minimizing
            ? {
                opacity: 0,
                y: 56,
                scale: 0.86,
                filter: "blur(1.5px)",
              }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }
        }
        transition={
          minimizing
            ? {
                duration: reduceMotion ? 0.2 : 0.68,
                ease: [0.32, 0.72, 0, 1],
              }
            : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ transformOrigin: "50% 100%" }}
      >
        <div className="relative flex items-center border-b border-border bg-background/40 px-3 py-2.5">
          <div className="z-10 flex items-center gap-2">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: MAC_DOTS.close }}
              aria-hidden
            />
            <motion.span
              className="size-3 rounded-full"
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
              className="size-3 rounded-full"
              style={{ backgroundColor: MAC_DOTS.maximize }}
              aria-hidden
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 text-center text-xs text-foreground-muted">
            root@dev-env: ~
          </span>
        </div>

        <div className="space-y-1 px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-[11px] text-foreground-muted sm:text-xs">
            # portfolio · registry: https://registry.npmjs.org/
          </p>

          <p>
            <span className="text-foreground-muted">&gt;</span>{" "}
            <span>npm install razaali.dev</span>
          </p>

          <div className="text-foreground-muted">
            {RESOLVE_STEPS.map((step) => (
              <p key={step}>
                <span>&gt;</span> {step}
              </p>
            ))}
          </div>

          <pre className="m-0 flex flex-wrap items-center gap-x-2 pt-1 font-mono text-sm leading-none tracking-tight">
            <span className="text-primary">fetching</span>
            <span className="text-foreground">
              <span>[</span>
              <span className="text-primary">
                {bar.filled}
                {bar.partial}
              </span>
              <span className="text-foreground-muted">{bar.empty}</span>
              <span>]</span>
            </span>
            <span className="tabular-nums text-foreground">{percent}%</span>
          </pre>

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

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-foreground-muted sm:text-[11px]">
          <span>bash — 80×24</span>
          <span className="text-primary">
            {minimizing ? "minimizing…" : done ? "complete" : "installing…"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function BootSplash({
  blocks = 24,
  duration = 2000,
}: Pick<TerminalLoaderProps, "blocks" | "duration">) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <TerminalLoader
      blocks={blocks}
      duration={duration}
      autoDismiss
      onDismiss={() => setShow(false)}
    />
  );
}
