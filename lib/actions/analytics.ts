"use server";

import { sql } from "drizzle-orm";
import { db, withDbRetry } from "@/db";
import { requireAdmin } from "@/lib/actions/auth";

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function rowsOf(result: unknown): Array<Record<string, unknown>> {
  return (
    (result as { rows?: Array<Record<string, unknown>> })?.rows ?? []
  );
}

export type AnalyticsPoint = {
  date: string;
  label: string;
  inquiries: number;
  replied: number;
};

export type AnalyticsStatusSlice = {
  status: string;
  count: number;
};

export type AdminAnalytics = {
  rangeDays: number;
  totals: {
    inquiries: number;
    unread: number;
    replied: number;
    archived: number;
    read: number;
    confirmationsSent: number;
    outboundReplies: number;
    services: number;
    servicesPublished: number;
    projects: number;
    projectsPublished: number;
    projectsFeatured: number;
  };
  rates: {
    replyRate: number;
    confirmationRate: number;
    publishRateServices: number;
    publishRateProjects: number;
  };
  timeline: AnalyticsPoint[];
  statusBreakdown: AnalyticsStatusSlice[];
  contentMix: Array<{ name: string; published: number; draft: number }>;
};

function pct(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export async function getAdminAnalytics(
  rangeDays = 30,
): Promise<AdminAnalytics> {
  await requireAdmin();
  const days = Math.min(Math.max(rangeDays, 7), 90);

  return withDbRetry(async () => {
    const totalsResult = await db.execute(sql`
      SELECT
        (SELECT count(*)::int FROM inquiries) AS inquiries_total,
        (SELECT count(*)::int FROM inquiries WHERE status = 'new') AS inquiries_new,
        (SELECT count(*)::int FROM inquiries WHERE status = 'read') AS inquiries_read,
        (SELECT count(*)::int FROM inquiries WHERE status = 'replied') AS inquiries_replied,
        (SELECT count(*)::int FROM inquiries WHERE status = 'archived') AS inquiries_archived,
        (SELECT count(*)::int FROM inquiries WHERE confirmation_sent_at IS NOT NULL) AS confirmations_sent,
        (SELECT count(*)::int FROM inquiry_replies) AS outbound_replies,
        (SELECT count(*)::int FROM services) AS services_total,
        (SELECT count(*)::int FROM services WHERE is_published = true) AS services_published,
        (SELECT count(*)::int FROM projects) AS projects_total,
        (SELECT count(*)::int FROM projects WHERE is_published = true) AS projects_published,
        (SELECT count(*)::int FROM projects WHERE is_featured = true) AS projects_featured
    `);

    const timelineResult = await db.execute(sql`
      WITH days AS (
        SELECT generate_series(
          (CURRENT_DATE - (${days}::int - 1) * INTERVAL '1 day')::date,
          CURRENT_DATE::date,
          INTERVAL '1 day'
        )::date AS day
      )
      SELECT
        to_char(d.day, 'YYYY-MM-DD') AS date,
        to_char(d.day, 'Mon DD') AS label,
        coalesce((
          SELECT count(*)::int
          FROM inquiries i
          WHERE i.created_at::date = d.day
        ), 0) AS inquiries,
        coalesce((
          SELECT count(*)::int
          FROM inquiries i
          WHERE i.replied_at::date = d.day
        ), 0) AS replied
      FROM days d
      ORDER BY d.day ASC
    `);

    const statusResult = await db.execute(sql`
      SELECT status, count(*)::int AS count
      FROM inquiries
      GROUP BY status
      ORDER BY count DESC
    `);

    const t = rowsOf(totalsResult)[0] ?? {};
    const inquiriesTotal = num(t.inquiries_total);
    const replied = num(t.inquiries_replied);
    const confirmations = num(t.confirmations_sent);
    const servicesTotal = num(t.services_total);
    const servicesPublished = num(t.services_published);
    const projectsTotal = num(t.projects_total);
    const projectsPublished = num(t.projects_published);

    const statusMap = new Map<string, number>();
    for (const row of rowsOf(statusResult)) {
      statusMap.set(String(row.status), num(row.count));
    }

    const statusBreakdown: AnalyticsStatusSlice[] = [
      "new",
      "read",
      "replied",
      "archived",
    ].map((status) => ({
      status,
      count: statusMap.get(status) ?? 0,
    }));

    const timeline: AnalyticsPoint[] = rowsOf(timelineResult).map((row) => ({
      date: String(row.date),
      label: String(row.label),
      inquiries: num(row.inquiries),
      replied: num(row.replied),
    }));

    return {
      rangeDays: days,
      totals: {
        inquiries: inquiriesTotal,
        unread: num(t.inquiries_new),
        replied,
        archived: num(t.inquiries_archived),
        read: num(t.inquiries_read),
        confirmationsSent: confirmations,
        outboundReplies: num(t.outbound_replies),
        services: servicesTotal,
        servicesPublished,
        projects: projectsTotal,
        projectsPublished,
        projectsFeatured: num(t.projects_featured),
      },
      rates: {
        replyRate: pct(replied, inquiriesTotal),
        confirmationRate: pct(confirmations, inquiriesTotal),
        publishRateServices: pct(servicesPublished, servicesTotal),
        publishRateProjects: pct(projectsPublished, projectsTotal),
      },
      timeline,
      statusBreakdown,
      contentMix: [
        {
          name: "Services",
          published: servicesPublished,
          draft: Math.max(servicesTotal - servicesPublished, 0),
        },
        {
          name: "Projects",
          published: projectsPublished,
          draft: Math.max(projectsTotal - projectsPublished, 0),
        },
      ],
    };
  });
}
