"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

const GITHUB_USER = "razaaliwebdev";
const JOIN_YEAR = 2024;

const MAC_DOTS = {
  close: "#FF5F57",
  minimize: "#FEBC2E",
  maximize: "#28C840",
} as const;

const THEME = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#3fb950"],
};

/** Base SVG units — `.contrib-heatmap` in globals.css stretches to full width */
const BASE_BLOCK = 12;
const BASE_MARGIN = 3;

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

function CalendarSkeleton({ withLabels }: { withLabels: boolean }) {
  return (
    <div className="w-full space-y-2" aria-hidden>
      <div className={`flex gap-1 ${withLabels ? "pl-7" : ""}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 animate-pulse rounded-sm bg-white/5"
          />
        ))}
      </div>
      <div className="flex gap-1.5">
        {withLabels ? (
          <div className="flex w-5 shrink-0 flex-col justify-around py-0.5">
            <div className="h-1.5 w-full animate-pulse rounded-sm bg-white/5" />
            <div className="h-1.5 w-full animate-pulse rounded-sm bg-white/5" />
            <div className="h-1.5 w-full animate-pulse rounded-sm bg-white/5" />
          </div>
        ) : null}
        <div
          className="grid w-full gap-0.5"
          style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
        >
          {Array.from({ length: 53 * 7 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-[1px] bg-white/5"
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
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showWeekdayLabels, setShowWeekdayLabels] = useState(true);

  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;

    const update = () => setShowWeekdayLabels(el.clientWidth >= 340);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

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
      className="relative w-full border-t border-border/40 py-10 [overflow-anchor:none] lg:py-12"
      aria-labelledby="contributions-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="hero-line-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative w-full px-4 md:px-12 lg:px-24">
        {/* Terminal window */}
        <div className="overflow-hidden rounded-lg border border-border bg-[#0f131a] font-mono shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          {/* Title bar */}
          <div className="flex items-center gap-2.5 border-b border-border bg-[#1a1f2a] px-3 py-2.5">
            <div className="flex shrink-0 items-center gap-1.5">
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
            <span className="min-w-0 flex-1 truncate text-[11px] text-foreground-muted sm:text-center sm:text-xs">
              bash — git@github:{GITHUB_USER}/contributions
            </span>
            <div
              className="hidden w-[calc(0.625rem*3+0.375rem*2)] shrink-0 sm:block"
              aria-hidden
            />
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

          {/* Mobile year select */}
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

          <div className="flex w-full min-w-0 flex-col sm:flex-row sm:items-stretch">
            {/* Heatmap — CSS-scaled to full pane width */}
            <div className="min-w-0 flex-1 p-3 sm:p-4">
              <p className="mb-2 text-[10px] text-foreground-muted">
                <span className="text-secondary">cat</span> ./heatmap/{year}
                .svg
              </p>
              <div
                ref={calendarRef}
                className={`contrib-heatmap text-foreground-muted transition-opacity duration-200 [&_text]:fill-[#8b949e] ${
                  showWeekdayLabels ? "contrib-heatmap--labels" : ""
                } ${loading ? "opacity-50" : "opacity-100"}`}
              >
                {data ? (
                  <ActivityCalendar
                    key={year}
                    data={data}
                    colorScheme="dark"
                    theme={THEME}
                    blockSize={BASE_BLOCK}
                    blockMargin={BASE_MARGIN}
                    blockRadius={2}
                    fontSize={11}
                    showWeekdayLabels={showWeekdayLabels}
                    showTotalCount={false}
                    showColorLegend={false}
                  />
                ) : (
                  <CalendarSkeleton withLabels={showWeekdayLabels} />
                )}
              </div>

              {/* Mobile stats — tight under heatmap */}
              <div className="mt-3 space-y-1 border-t border-border/40 pt-2.5 text-[11px] sm:hidden">
                <p className="mb-1.5 text-[10px] text-foreground-muted">
                  <span className="text-secondary">source</span> ./stats.env
                </p>
                {stats ? (
                  <>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">STREAK</span>=
                      <span className="text-primary">{stats.current}</span>
                    </p>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">LONGEST</span>=
                      <span className="text-foreground">{stats.longest}</span>
                    </p>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">ACTIVE_DAYS</span>=
                      <span className="text-foreground">{stats.active}</span>
                    </p>
                    <p>
                      <span className="text-secondary">export</span>{" "}
                      <span className="text-tertiary">BEST_DAY</span>=
                      <span className="text-foreground">{stats.peak}</span>
                    </p>
                  </>
                ) : null}
              </div>
            </div>

            {/* Stats — desktop */}
            <div className="hidden min-w-0 w-[12rem] shrink-0 flex-col justify-center border-l border-border/50 bg-[#0c1018] px-3 py-3 sm:flex lg:w-[14rem] lg:px-4">
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
                        className="h-3 w-36 animate-pulse rounded-sm bg-white/5"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Year pane — desktop */}
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
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-[#1a1f2a] px-3 py-2 text-[10px] text-foreground-muted sm:gap-3 sm:px-4 sm:text-[11px]">
            <span>
              <span className="text-primary">✓</span> exit 0
            </span>
            <a
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[60%] truncate transition-colors hover:text-primary sm:max-w-none"
            >
              open github.com/{GITHUB_USER}
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
