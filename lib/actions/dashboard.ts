"use server";

import { sql } from "drizzle-orm";
import { db, withDbRetry } from "@/db";
import { requireAdmin } from "@/lib/actions/auth";

export type AdminDashboardStats = {
  inquiries: { total: number; unread: number; replied: number };
  services: { total: number; published: number };
  projects: { total: number; published: number };
};

function num(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  await requireAdmin();

  return withDbRetry(async () => {
    const result = await db.execute(sql`
      SELECT
        (SELECT count(*)::int FROM inquiries) AS inquiries_total,
        (SELECT count(*)::int FROM inquiries WHERE status = 'new') AS inquiries_unread,
        (SELECT count(*)::int FROM inquiries WHERE status = 'replied') AS inquiries_replied,
        (SELECT count(*)::int FROM services) AS services_total,
        (SELECT count(*)::int FROM services WHERE is_published = true) AS services_published,
        (SELECT count(*)::int FROM projects) AS projects_total,
        (SELECT count(*)::int FROM projects WHERE is_published = true) AS projects_published
    `);

    const rows = (result as unknown as { rows?: Array<Record<string, unknown>> })
      .rows;
    const row = rows?.[0] ?? {};

    return {
      inquiries: {
        total: num(row.inquiries_total),
        unread: num(row.inquiries_unread),
        replied: num(row.inquiries_replied),
      },
      services: {
        total: num(row.services_total),
        published: num(row.services_published),
      },
      projects: {
        total: num(row.projects_total),
        published: num(row.projects_published),
      },
    };
  });
}
