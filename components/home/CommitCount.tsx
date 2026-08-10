"use client";

import { useEffect, useState } from "react";

const GITHUB_USER = "razaaliwebdev";
const CACHE_KEY = "razaali-github-commits-v1";
const CACHE_TTL = 6 * 60 * 60 * 1000;
const FALLBACK = 1547;

function readCache(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { count: number; fetchedAt: number };
    if (Date.now() - cached.fetchedAt < CACHE_TTL) return cached.count;
  } catch {
    /* ignore malformed cache */
  }
  return null;
}

function writeCache(count: number) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ count, fetchedAt: Date.now() }),
    );
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Real contribution count for the current year, fetched from the user's
 * GitHub contribution graph. GitHub REST has no public per-user commit
 * count, so this is the same tally as the profile contribution graph
 * (commits + PRs + issues).
 */
export default function CommitCount({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(() => readCache() ?? FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const year = new Date().getFullYear();

    fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=${year}`,
      { headers: { Accept: "application/json" } },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub contributions ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const total =
          data && typeof data === "object"
            ? (data as { total?: Record<string, number> }).total?.[year]
            : undefined;
        if (typeof total === "number" && total > 0) {
          setCount(total);
          writeCache(total);
        }
      })
      .catch(() => {
        /* keep cached / fallback value */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <span className={className}>{count.toLocaleString("en-US")}</span>;
}