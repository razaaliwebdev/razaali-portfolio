"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

const GITHUB_USER = "razaaliwebdev";
const JOIN_YEAR = 2024;
/** Stable calendar column width — prevents layout jump on year change */
const CALENDAR_MIN_W = "min-w-[52rem]";

const THEME = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#3fb950"],
};

function computeStats(days: Activity[]) {
  const today = new Date().toISOString().slice(0, 10);
  let longest = 0;
  let run = 0;
  let active = 0;
  let peak = 0;

  for (const d of days) {
    if (d.count > peak) peak = d.count;
    if (d.count > 0) {
      active += 1;
      run += 1;
      longest = Math.max(longest, run);
    } else if (d.date <= today) {
      run = 0;
    }
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i -= 1) {
    if (days[i].date > today) continue;
    if (days[i].count > 0) current += 1;
    else break;
  }

  return { longest, current, active, peak };
}

function CalendarSkeleton() {
  return (
    <div className={`${CALENDAR_MIN_W} space-y-2`} aria-hidden>
      <div className="flex gap-1 pl-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 animate-pulse rounded-sm bg-white/5"
          />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="flex w-6 flex-col justify-around py-1">
          <div className="h-2 w-full animate-pulse rounded-sm bg-white/5" />
          <div className="h-2 w-full animate-pulse rounded-sm bg-white/5" />
          <div className="h-2 w-full animate-pulse rounded-sm bg-white/5" />
        </div>
        <div className="grid flex-1 grid-cols-[repeat(53,minmax(0,1fr))] gap-[3px]">
          {Array.from({ length: 53 * 7 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-[2px] bg-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-4 lg:gap-x-10">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2 text-center">
          <div className="mx-auto h-2 w-16 animate-pulse rounded bg-white/5" />
          <div className="mx-auto h-6 w-12 animate-pulse rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export default function Contributions() {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear; y >= JOIN_YEAR; y -= 1) list.push(y);
    return list;
  }, [currentYear]);

  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<Activity[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const stats = useMemo(() => (data ? computeStats(data) : null), [data]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    // Keep previous data visible — avoids width collapse / flicker

    fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=${year}`,
      { signal: controller.signal, headers: { Accept: "application/json" } },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`contributions ${res.status}`);
        return res.json();
      })
      .then(
        (json: {
          contributions?: Activity[];
          total?: Record<string, number>;
        }) => {
          const days = json.contributions ?? [];
          setData(days);
          const count = json.total?.[String(year)];
          setTotal(
            typeof count === "number"
              ? count
              : days.reduce((a, d) => a + d.count, 0),
          );
        },
      )
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [year]);

  return (
    <section
      id="contributions"
      className="relative w-full border-t border-border/40 py-10 lg:py-12"
      aria-labelledby="contributions-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative w-full px-6 md:px-12 lg:px-24">
        <div className="mb-5">
          <p className="mb-1 text-[11px] text-foreground-muted sm:text-xs">
            <span className="text-primary">$</span> git log --graph --oneline
          </p>
          <h2
            id="contributions-heading"
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            <span className="text-foreground-muted">~/</span>contributions
          </h2>
          <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
            {error ? (
              <>Couldn’t load contributions.</>
            ) : total !== null ? (
              <>
                <span className="text-primary">
                  {total.toLocaleString("en-US")}
                </span>{" "}
                contributions in {year}
                {loading && (
                  <span className="ml-2 text-foreground-muted">updating…</span>
                )}
              </>
            ) : (
              <>Loading contribution graph…</>
            )}
          </p>

          <div
            className="mt-3 flex flex-wrap gap-1.5 sm:hidden"
            role="tablist"
            aria-label="Contribution year"
          >
            {years.map((y) => {
              const active = y === year;
              return (
                <button
                  key={y}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setYear(y)}
                  className={`rounded-sm px-2.5 py-1 text-xs transition-colors ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full items-stretch overflow-hidden rounded-md border border-border/60 bg-[#0f131a]">
          {/* Fixed min-width column — no shrink on year switch */}
          <div
            className={`shrink-0 overflow-x-auto p-3 sm:p-5 [scrollbar-width:thin] ${CALENDAR_MIN_W}`}
          >
            <div
              className={`text-foreground-muted transition-opacity duration-200 [&_text]:fill-[#8b949e] ${
                loading ? "opacity-45" : "opacity-100"
              }`}
            >
              {data ? (
                <ActivityCalendar
                  data={data}
                  colorScheme="dark"
                  theme={THEME}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  showWeekdayLabels
                />
              ) : (
                <CalendarSkeleton />
              )}
            </div>

            <div className="mt-3 text-[10px] text-foreground-muted sm:text-[11px]">
              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                @{GITHUB_USER} on GitHub →
              </a>
            </div>
          </div>

          {/* Stats — always mounted so middle panel width stays stable */}
          <div className="hidden min-w-0 flex-1 items-center justify-center border-l border-border/40 bg-[#0c1018] sm:flex">
            <div
              className={`transition-opacity duration-200 ${
                loading ? "opacity-45" : "opacity-100"
              }`}
            >
              {stats ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-4 lg:gap-x-10">
                  <div className="text-center">
                    <p className="text-[9px] tracking-wide text-foreground-muted uppercase">
                      Current streak
                    </p>
                    <p className="text-lg font-semibold text-primary lg:text-xl">
                      {stats.current}
                      <span className="ml-1 text-[10px] font-normal text-foreground-muted">
                        days
                      </span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] tracking-wide text-foreground-muted uppercase">
                      Longest streak
                    </p>
                    <p className="text-lg text-foreground lg:text-xl">
                      {stats.longest}
                      <span className="ml-1 text-[10px] text-foreground-muted">
                        days
                      </span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] tracking-wide text-foreground-muted uppercase">
                      Active days
                    </p>
                    <p className="text-lg text-foreground lg:text-xl">
                      {stats.active}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] tracking-wide text-foreground-muted uppercase">
                      Best day
                    </p>
                    <p className="text-lg text-foreground lg:text-xl">
                      {stats.peak}
                      <span className="ml-1 text-[10px] text-foreground-muted">
                        contribs
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <StatsSkeleton />
              )}
            </div>
          </div>

          <div
            className="hidden w-[4.5rem] shrink-0 flex-col gap-1 border-l border-border/40 p-2 sm:flex lg:w-[5rem]"
            role="tablist"
            aria-label="Contribution year"
          >
            {years.map((y) => {
              const active = y === year;
              return (
                <button
                  key={y}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setYear(y)}
                  disabled={loading && active}
                  className={`rounded-md px-2 py-1.5 text-left text-xs transition-colors lg:text-sm ${
                    active
                      ? "bg-primary/15 font-medium text-primary"
                      : "text-foreground-muted hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
