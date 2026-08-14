"use server";

import { desc, eq, count } from "drizzle-orm";
import { db, withDbRetry } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/actions/auth";

export type AdminNotificationItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
};

export type AdminNotificationsPayload = {
  unreadCount: number;
  items: AdminNotificationItem[];
};

export async function getAdminNotifications(): Promise<AdminNotificationsPayload> {
  await requireAdmin();

  return withDbRetry(async () => {
    const [unread] = await db
      .select({ value: count() })
      .from(inquiries)
      .where(eq(inquiries.status, "new"));

    const recent = await db
      .select({
        id: inquiries.id,
        name: inquiries.name,
        email: inquiries.email,
        subject: inquiries.subject,
        createdAt: inquiries.createdAt,
      })
      .from(inquiries)
      .where(eq(inquiries.status, "new"))
      .orderBy(desc(inquiries.createdAt))
      .limit(8);

    return {
      unreadCount: unread?.value ?? 0,
      items: recent.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        subject: row.subject,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  });
}
