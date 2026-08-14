import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { CmdHeading, TerminalPanel } from "@/components/admin/TerminalUi";
import { getAdminAnalytics } from "@/lib/actions/analytics";

export const metadata: Metadata = {
  title: "Analytics | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = Number(params.range ?? 30) || 30;

  let data = null as Awaited<ReturnType<typeof getAdminAnalytics>> | null;
  let error: string | null = null;

  try {
    data = await getAdminAnalytics(range);
  } catch (err) {
    console.error("[admin/analytics]", err);
    error = "Failed to load analytics. Check Neon connection.";
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <CmdHeading
            path="analytics"
            command={`plot --range ${data?.rangeDays ?? range}d`}
            hint="Inquiry traffic, reply rates, and content publish mix."
          />
          <div className="flex gap-2 font-mono text-xs">
            {[7, 14, 30, 90].map((d) => {
              const active = (data?.rangeDays ?? range) === d;
              return (
                <Link
                  key={d}
                  href={`/admin/analytics?range=${d}`}
                  className={`border px-2.5 py-1.5 ${
                    active
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border text-foreground-muted hover:border-primary hover:text-primary"
                  }`}
                >
                  {d}d
                </Link>
              );
            })}
          </div>
        </div>

        {error ? (
          <p className="border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
            // error: {error}
          </p>
        ) : null}

        {data ? (
          <AnalyticsCharts data={data} />
        ) : !error ? (
          <TerminalPanel title="loading" bodyClassName="p-6 font-mono text-sm text-foreground-muted">
            $ fetching metrics…
          </TerminalPanel>
        ) : null}
      </div>
    </AdminShell>
  );
}
