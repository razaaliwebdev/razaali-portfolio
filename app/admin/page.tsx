import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import { CmdHeading, TerminalPanel } from "@/components/admin/TerminalUi";
import { getAdminAnalytics } from "@/lib/actions/analytics";
import { isMailConfigured } from "@/lib/mail";

export const metadata: Metadata = {
  title: "Admin | Raza Ali",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  let analytics = null as Awaited<ReturnType<typeof getAdminAnalytics>> | null;
  let dbError: string | null = null;

  try {
    analytics = await getAdminAnalytics(14);
  } catch (error) {
    console.error("[admin/dashboard]", error);
    dbError = "Database query failed. Check DATABASE_URL / Neon status.";
  }

  const mailOk = isMailConfigured();

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <CmdHeading
            path="admin"
            command="status --watch"
            hint="Terminal console for inquiries, services, and projects."
          />
          <Link
            href="/admin/analytics"
            className="border border-border px-3 py-1.5 font-mono text-xs text-foreground-muted hover:border-primary hover:text-primary"
          >
            open analytics →
          </Link>
        </div>

        {dbError ? (
          <p className="border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
            // error: {dbError}
          </p>
        ) : null}

        {analytics ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link href="/admin/inquiries" className="block">
                <TerminalPanel title="inquiries" bodyClassName="p-4">
                  <p className="font-mono text-xs text-foreground-muted">
                    unread
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-primary">
                    {analytics.totals.unread}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-foreground-muted">
                    total {analytics.totals.inquiries} · replied{" "}
                    {analytics.totals.replied}
                  </p>
                </TerminalPanel>
              </Link>
              <Link href="/admin/services" className="block">
                <TerminalPanel title="services" bodyClassName="p-4">
                  <p className="font-mono text-xs text-foreground-muted">
                    published
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-secondary">
                    {analytics.totals.servicesPublished}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-foreground-muted">
                    total {analytics.totals.services}
                  </p>
                </TerminalPanel>
              </Link>
              <Link href="/admin/projects" className="block">
                <TerminalPanel title="projects" bodyClassName="p-4">
                  <p className="font-mono text-xs text-foreground-muted">
                    published
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-tertiary">
                    {analytics.totals.projectsPublished}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-foreground-muted">
                    total {analytics.totals.projects}
                  </p>
                </TerminalPanel>
              </Link>
            </div>

            <AnalyticsCharts data={analytics} />
          </>
        ) : null}

        <TerminalPanel
          title="system · env"
          bodyClassName="space-y-2 p-4 font-mono text-xs"
        >
          <p>
            <span className="text-foreground-muted">smtp </span>
            {mailOk ? (
              <span className="text-primary">ready</span>
            ) : (
              <span className="text-secondary">
                missing — add SMTP_* keys to .env
              </span>
            )}
          </p>
          <p className="text-foreground-muted">
            // contact form → DB + confirmation mail → admin actions
          </p>
        </TerminalPanel>
      </div>
    </AdminShell>
  );
}
