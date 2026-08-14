"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminAnalytics } from "@/lib/actions/analytics";
import { TerminalPanel } from "@/components/admin/TerminalUi";

const COLORS = {
  primary: "#3fb950",
  secondary: "#ffa657",
  tertiary: "#58a6ff",
  muted: "#8b949e",
  danger: "#f85149",
  grid: "#30363d",
  panel: "#0b0e14",
  text: "#e6edf3",
};

const STATUS_COLOR: Record<string, string> = {
  new: COLORS.primary,
  read: COLORS.secondary,
  replied: COLORS.tertiary,
  archived: COLORS.muted,
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border bg-[#0f131a] px-3 py-2 font-mono text-[11px] text-foreground shadow-lg">
      {label ? <p className="mb-1 text-foreground-muted">{label}</p> : null}
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color ?? COLORS.text }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "primary" | "secondary" | "tertiary" | "muted";
}) {
  const toneClass =
    tone === "secondary"
      ? "text-secondary"
      : tone === "tertiary"
        ? "text-tertiary"
        : tone === "muted"
          ? "text-foreground-muted"
          : "text-primary";

  return (
    <div className="border border-border bg-[#0b0e14] p-3">
      <p className="font-mono text-[10px] uppercase tracking-wide text-foreground-muted">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
      {hint ? (
        <p className="mt-1 font-mono text-[10px] text-foreground-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export default function AnalyticsCharts({ data }: { data: AdminAnalytics }) {
  const statusData = data.statusBreakdown.map((s) => ({
    ...s,
    name: s.status,
    value: s.count,
  }));
  const hasInquiries = data.totals.inquiries > 0;
  const hasTimeline = data.timeline.some(
    (p) => p.inquiries > 0 || p.replied > 0,
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="inquiries"
          value={data.totals.inquiries}
          hint={`${data.totals.unread} unread`}
          tone="primary"
        />
        <MetricCard
          label="reply rate"
          value={`${data.rates.replyRate}%`}
          hint={`${data.totals.replied} replied`}
          tone="tertiary"
        />
        <MetricCard
          label="confirm mail"
          value={`${data.rates.confirmationRate}%`}
          hint={`${data.totals.confirmationsSent} sent`}
          tone="secondary"
        />
        <MetricCard
          label="outbound"
          value={data.totals.outboundReplies}
          hint="admin replies"
          tone="muted"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <TerminalPanel
          title={`plot · inquiries (${data.rangeDays}d)`}
          className="xl:col-span-3"
          bodyClassName="h-72 p-3 sm:h-80"
        >
          {hasTimeline ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeline} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="inqFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="repFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.tertiary} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS.tertiary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: COLORS.muted, fontSize: 10, fontFamily: "monospace" }}
                  axisLine={{ stroke: COLORS.grid }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={28}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: COLORS.muted, fontSize: 10, fontFamily: "monospace" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  name="inquiries"
                  stroke={COLORS.primary}
                  fill="url(#inqFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="replied"
                  name="replied"
                  stroke={COLORS.tertiary}
                  fill="url(#repFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart text="// no inquiry traffic in this window yet" />
          )}
        </TerminalPanel>

        <TerminalPanel
          title="status · pie"
          className="xl:col-span-2"
          bodyClassName="flex h-72 flex-col p-3 sm:h-80"
        >
          {hasInquiries ? (
            <>
              <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      stroke={COLORS.panel}
                    >
                      {statusData.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={STATUS_COLOR[entry.status] ?? COLORS.muted}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[10px]">
                {statusData.map((s) => (
                  <li key={s.status} className="flex items-center gap-2 text-foreground-muted">
                    <span
                      className="size-2 shrink-0"
                      style={{ background: STATUS_COLOR[s.status] ?? COLORS.muted }}
                    />
                    {s.status} · {s.count}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyChart text="// inbox empty — charts wake up after first inquiry" />
          )}
        </TerminalPanel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TerminalPanel title="content · published vs draft" bodyClassName="h-64 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.contentMix} barGap={6} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: "monospace" }}
                axisLine={{ stroke: COLORS.grid }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: COLORS.muted, fontSize: 10, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="published" name="published" fill={COLORS.primary} radius={[0, 0, 0, 0]} />
              <Bar dataKey="draft" name="draft" fill={COLORS.secondary} radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </TerminalPanel>

        <TerminalPanel title="rates · summary" bodyClassName="space-y-4 p-4 font-mono text-xs">
          <RateBar
            label="inquiry reply rate"
            value={data.rates.replyRate}
            color={COLORS.tertiary}
          />
          <RateBar
            label="confirmation delivery"
            value={data.rates.confirmationRate}
            color={COLORS.secondary}
          />
          <RateBar
            label="services published"
            value={data.rates.publishRateServices}
            color={COLORS.primary}
          />
          <RateBar
            label="projects published"
            value={data.rates.publishRateProjects}
            color={COLORS.tertiary}
          />
          <p className="pt-2 text-foreground-muted">
            // featured projects:{" "}
            <span className="text-secondary">{data.totals.projectsFeatured}</span>
            {" · "}
            range: last {data.rangeDays} days
          </p>
        </TerminalPanel>
      </div>
    </div>
  );
}

function RateBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-foreground-muted">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 border border-border bg-[#0b0e14]">
        <div
          className="h-full transition-[width] duration-500"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-foreground-muted">
      {text}
    </div>
  );
}
