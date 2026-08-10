"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const BOOT_LINES = [
  "$ initializing_portfolio.sh",
  "$ loading assets...",
  "$ compiling components...",
  "$ syncing theme tokens...",
  "$ ready.",
] as const;

export type TerminalLoaderProps = {
  /** Total unicode block characters between the brackets */
  blocks?: number;
  /** Progress animation duration in ms */
  duration?: number;
  /** Fade out and unmount after reaching 100% (splash mode) */
  autoDismiss?: boolean;
  /** Called after the fade-out finishes (or when dismissed) */
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
  duration = 2200,
  autoDismiss = false,
  onDismiss,
  className = "",
}: TerminalLoaderProps) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [bootIndex, setBootIndex] = useState(0);
  const [typedLen, setTypedLen] = useState(0);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      setDone(true);
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

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(1);
        setDone(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, reduceMotion]);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => {
      setBootIndex((i) => (i + 1) % BOOT_LINES.length);
    }, 720);
    return () => window.clearInterval(id);
  }, [done]);

  useEffect(() => {
    const full = done ? "$ done." : BOOT_LINES[bootIndex];
    setTypedLen(0);

    if (reduceMotion) {
      setTypedLen(full.length);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedLen(i);
      if (i >= full.length) window.clearInterval(id);
    }, 18);

    return () => window.clearInterval(id);
  }, [bootIndex, done, reduceMotion]);

  useEffect(() => {
    if (!done || !autoDismiss) return;
    const hold = reduceMotion ? 120 : 420;
    const startExit = window.setTimeout(() => setVisible(false), hold);
    return () => window.clearTimeout(startExit);
  }, [done, autoDismiss, reduceMotion]);

  const percent = Math.min(100, Math.round(progress * 100));
  const bar = buildBar(progress, blocks);
  const bootFull = done ? "$ done." : BOOT_LINES[bootIndex];
  const bootVisible = bootFull.slice(0, typedLen);

  return (
    <AnimatePresence onExitComplete={() => onDismiss?.()}>
      {visible && (
        <motion.div
          key="terminal-loader"
          className={`fixed inset-0 z-50 flex items-center justify-center bg-background ${className}`}
          role="status"
          aria-live="polite"
          aria-label={`Loading ${percent}%`}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0 dot-grid"
            aria-hidden
          />

          <motion.div
            className="relative w-[min(92vw,28rem)] overflow-hidden rounded-[6px] border border-border bg-background-panel font-mono"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="size-2.5 rounded-full bg-danger" aria-hidden />
              <span className="size-2.5 rounded-full bg-secondary" aria-hidden />
              <span className="size-2.5 rounded-full bg-primary" aria-hidden />
              <span className="ml-2 text-xs text-foreground-muted">boot.sh</span>
            </div>

            <div className="flex flex-col items-center gap-3.5 px-5 py-8 sm:px-8">
              <p className="flex min-h-[1.25rem] w-full max-w-[22rem] items-baseline justify-center text-sm text-foreground-muted">
                <span className="truncate">{bootVisible}</span>
                {!done && <span className="cursor-blink shrink-0" aria-hidden />}
              </p>

              {/* Flat ASCII bar — filled blocks use primary */}
              <pre className="m-0 select-none font-mono text-base leading-none tracking-tight text-foreground sm:text-lg">
                <span aria-hidden>&apos;</span>
                <span>[</span>
                <span className="text-primary">
                  {bar.filled}
                  {bar.partial}
                </span>
                <span className="text-foreground-muted">{bar.empty}</span>
                <span>]</span>
                <span> {percent}%</span>
                <span aria-hidden>&quot;</span>
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** First-visit splash overlay for the root layout */
export function BootSplash({
  blocks = 24,
  duration = 5000,
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
