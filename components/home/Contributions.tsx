"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

const GITHUB_USER = "razaaliwebdev";
const JOIN_YEAR = 2024;
const CALENDAR_MIN_W = "min-w-[52rem]";

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

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
        {/* Terminal window */}
        <div className="overflow-hidden rounded-lg border border-border bg-[#0f131a] font-mono shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          {/* Title bar */}
          <div className="relative flex items-center border-b border-border bg-[#1a1f2a] px-3 py-2.5">
            <div className="z-10 flex items-center gap-1.5">
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
            <span className="pointer-events-none absolute inset-x-10 truncate text-center text-[11px] text-foreground-muted sm:inset-x-0 sm:text-xs">
              bash — git@github:{GITHUB_USER}/contributions
            </span>
          </div>

          {/* Command line */}
          <div className="space-y-1 border-b border-border/50 px-3 py-3 text-[11px] sm:px-4 sm:text-xs">
            <p>
              <span className="text-primary">visitor@razaali.dev</span>
              <span className="text-foreground-muted">:~$</span>{" "}
              <span>gh contribs --user={GITHUB_USER}</span>{" "}
              <span className="text-secondary">--year={year}</span>
            </p>
            <p className="text-foreground-muted">
              {error ? (
                <span className="text-danger"># error: fetch failed</span>
              ) : loading && !data ? (
                <span># fetching heatmap…</span>
              ) : (
                <>
                  <span className="text-primary"># ok</span>
                  {" — "}
                  <span className="text-foreground">
                    {total?.toLocaleString("en-US") ?? "—"}
                  </span>{" "}
                  commits mapped for {year}
                  {loading && (
                    <span className="text-foreground-muted"> · refreshing</span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Mobile year select as shell flags */}
          <div
            className="flex flex-wrap gap-1.5 border-b border-border/50 px-3 py-2 sm:hidden"
            role="tablist"
            aria-label="Contribution year"
          >
            <span className="mr-1 self-center text-[10px] text-foreground-muted">
              --year
            </span>
            {years.map((y) => {
              const active = y === year;
              return (
                <button
                  key={y}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setYear(y)}
                  className={`rounded-sm px-2 py-1 text-[11px] transition-colors ${
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

          <div className="flex w-full items-stretch">
            {/* Heatmap pane */}
            <div
              className={`shrink-0 overflow-x-auto p-3 sm:p-4 [scrollbar-width:thin] ${CALENDAR_MIN_W}`}
            >
              <p className="mb-2 text-[10px] text-foreground-muted">
                <span className="text-secondary">cat</span> ./heatmap/{year}
                .svg
              </p>
              <div
                className={`text-foreground-muted transition-opacity duration-200 [&_text]:fill-[#8b949e] ${
                  loading ? "opacity-50" : "opacity-100"
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
                    showTotalCount={false}
                    showColorLegend={false}
                  />
                ) : (
                  <CalendarSkeleton />
                )}
              </div>
            </div>

            {/* Stats as shell exports */}
            <div className="hidden min-w-0 flex-1 flex-col justify-center border-l border-border/50 bg-[#0c1018] px-4 py-3 sm:flex lg:px-5">
              <p className="mb-3 text-[10px] text-foreground-muted">
                <span className="text-secondary">source</span> ./stats.env
              </p>
              <div
                className={`space-y-1.5 text-[12px] leading-relaxed transition-opacity duration-200 lg:text-[13px] ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
              >
                {stats ? (
                  <>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">STREAK</span>
                      <span className="text-foreground-muted">=</span>
                      <span className="text-primary">{stats.current}</span>
                    </p>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">LONGEST</span>
                      <span className="text-foreground-muted">=</span>
                      <span className="text-foreground">{stats.longest}</span>
                    </p>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">ACTIVE_DAYS</span>
                      <span className="text-foreground-muted">=</span>
                      <span className="text-foreground">{stats.active}</span>
                    </p>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">BEST_DAY</span>
                      <span className="text-foreground-muted">=</span>
                      <span className="text-foreground">{stats.peak}</span>
                    </p>
                  </>
                ) : (
                  <div className="space-y-2" aria-hidden>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-40 animate-pulse rounded-sm bg-white/5"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Year checkout pane */}
            <div
              className="hidden w-[5.5rem] shrink-0 flex-col border-l border-border/50 bg-[#0c1018] p-2 sm:flex lg:w-24"
              role="tablist"
              aria-label="Contribution year"
            >
              <p className="mb-2 px-1 text-[10px] text-foreground-muted">
                <span className="text-secondary">cd</span> years/
              </p>
              {years.map((y) => {
                const active = y === year;
                return (
                  <button
                    key={y}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setYear(y)}
                    className={`rounded-sm px-1.5 py-1 text-left text-[11px] transition-colors lg:text-xs ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-foreground-muted hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <span className="text-foreground-muted">
                      {active ? ">" : " "}
                    </span>{" "}
                    {y}
                    {active ? "/" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between gap-3 border-t border-border bg-[#1a1f2a] px-3 py-2 text-[10px] text-foreground-muted sm:px-4 sm:text-[11px]">
            <span>
              <span className="text-primary">✓</span> exit 0
            </span>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate transition-colors hover:text-primary"
            >
              open https://github.com/{GITHUB_USER}
            </a>
            <span className="hidden sm:inline">
              Less
              <span className="mx-1.5 inline-flex items-center gap-0.5 align-middle">
                {THEME.dark.map((color) => (
                  <span
                    key={color}
                    className="inline-block size-2 rounded-[1px]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              More
            </span>
          </div>
        </div>

        <h2 id="contributions-heading" className="sr-only">
          GitHub contributions
        </h2>
      </div>
    </section>
  );
}
