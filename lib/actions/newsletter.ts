"use server";

import { createHash, randomBytes } from "crypto";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, withDbRetry } from "@/db";
import {
  newsletterCampaigns,
  newsletterSubscribers,
} from "@/db/schema";
import { requireAdmin } from "@/lib/actions/auth";
import {
  isMailConfigured,
  newsletterCampaignEmail,
  newsletterWelcomeEmail,
  sendMail,
} from "@/lib/mail";

export type SubscribeState = {
  ok?: boolean;
  error?: string;
  alreadySubscribed?: boolean;
  confirmationSent?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeToken() {
  return createHash("sha256")
    .update(randomBytes(32))
    .digest("hex")
    .slice(0, 48);
}

export async function subscribeNewsletter(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1);

    const row = existing[0];

    if (row?.status === "active") {
      return {
        ok: true,
        alreadySubscribed: true,
        confirmationSent: false,
      };
    }

    let token = row?.unsubscribeToken ?? makeToken();
    let subscriberId = row?.id;

    if (row) {
      await db
        .update(newsletterSubscribers)
        .set({
          status: "active",
          unsubscribedAt: null,
          updatedAt: new Date(),
          source: "home",
        })
        .where(eq(newsletterSubscribers.id, row.id));
    } else {
      const [created] = await db
        .insert(newsletterSubscribers)
        .values({
          email,
          status: "active",
          unsubscribeToken: token,
          source: "home",
        })
        .returning({
          id: newsletterSubscribers.id,
          unsubscribeToken: newsletterSubscribers.unsubscribeToken,
        });
      subscriberId = created?.id;
      token = created?.unsubscribeToken ?? token;
    }

    let confirmationSent = false;
    if (isMailConfigured() && subscriberId) {
      try {
        const welcome = newsletterWelcomeEmail({
          email,
          unsubscribeToken: token,
        });
        await sendMail({
          to: email,
          subject: welcome.subject,
          text: welcome.text,
          html: welcome.html,
        });
        confirmationSent = true;
        await db
          .update(newsletterSubscribers)
          .set({
            confirmationSentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(newsletterSubscribers.id, subscriberId));
      } catch {
        // subscription saved; mail is best-effort
      }
    }

    return { ok: true, confirmationSent };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function unsubscribeByToken(token: string) {
  const value = token.trim();
  if (!value) return { ok: false as const, error: "Invalid unsubscribe link." };

  const [row] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribeToken, value))
    .limit(1);

  if (!row) return { ok: false as const, error: "Subscriber not found." };

  if (row.status !== "unsubscribed") {
    await db
      .update(newsletterSubscribers)
      .set({
        status: "unsubscribed",
        unsubscribedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.id, row.id));
  }

  return { ok: true as const, email: row.email };
}

export async function listNewsletterSubscribers() {
  await requireAdmin();
  return withDbRetry(() =>
    db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt)),
  );
}

export async function getNewsletterStats() {
  await requireAdmin();
  return withDbRetry(async () => {
    const [total] = await db
      .select({ value: count() })
      .from(newsletterSubscribers);
    const [active] = await db
      .select({ value: count() })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, "active"));
    const [campaigns] = await db
      .select({ value: count() })
      .from(newsletterCampaigns);
    return {
      total: total?.value ?? 0,
      active: active?.value ?? 0,
      campaigns: campaigns?.value ?? 0,
    };
  });
}

export async function listNewsletterCampaigns() {
  await requireAdmin();
  return withDbRetry(() =>
    db
      .select()
      .from(newsletterCampaigns)
      .orderBy(desc(newsletterCampaigns.createdAt))
      .limit(20),
  );
}

export async function setSubscriberStatus(
  id: string,
  status: "active" | "unsubscribed",
) {
  await requireAdmin();
  await db
    .update(newsletterSubscribers)
    .set({
      status,
      unsubscribedAt: status === "unsubscribed" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(newsletterSubscribers.id, id));
  revalidatePath("/admin/newsletter");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await db
    .delete(newsletterSubscribers)
    .where(eq(newsletterSubscribers.id, id));
  revalidatePath("/admin/newsletter");
}

export type BroadcastState = {
  ok?: boolean;
  error?: string;
  sentCount?: number;
  failedCount?: number;
};

export async function sendNewsletterBroadcast(
  _prev: BroadcastState,
  formData: FormData,
): Promise<BroadcastState> {
  await requireAdmin();

  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!subject) return { error: "Subject is required." };
  if (!body || body.length < 8) {
    return { error: "Write a short message body first." };
  }
  if (!isMailConfigured()) {
    return { error: "SMTP is not configured. Add SMTP_* keys to .env." };
  }

  const active = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.status, "active"));

  if (active.length === 0) {
    return { error: "No active subscribers to email." };
  }

  let sentCount = 0;
  let failedCount = 0;

  for (const sub of active) {
    try {
      const mail = newsletterCampaignEmail({
        subject,
        body,
        unsubscribeToken: sub.unsubscribeToken,
      });
      await sendMail({
        to: sub.email,
        subject,
        text: mail.text,
        html: mail.html,
      });
      sentCount += 1;
      // gentle pacing for Gmail SMTP limits
      await new Promise((r) => setTimeout(r, 350));
    } catch {
      failedCount += 1;
    }
  }

  await db.insert(newsletterCampaigns).values({
    subject,
    body,
    status: "sent",
    sentCount,
    failedCount,
    sentAt: new Date(),
  });

  revalidatePath("/admin/newsletter");
  return { ok: true, sentCount, failedCount };
}
