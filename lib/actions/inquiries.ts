"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, withDbRetry } from "@/db";
import {
  inquiries,
  inquiryReplies,
  type InquiryStatus,
} from "@/db/schema";
import { requireAdmin } from "@/lib/actions/auth";
import {
  adminNotifyEmail,
  inquiryAdminAlertEmail,
  inquiryConfirmationEmail,
  inquiryReplyEmail,
  isMailConfigured,
  sendMail,
} from "@/lib/mail";
import { normalizeInquirySource } from "@/lib/inquiry-source";

export type SubmitInquiryState = {
  ok?: boolean;
  error?: string;
  confirmationSent?: boolean;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitInquiry(
  _prev: SubmitInquiryState,
  formData: FormData,
): Promise<SubmitInquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const subject =
    String(formData.get("subject") ?? "").trim() || "General inquiry";
  const message = String(formData.get("message") ?? "").trim();
  const source = normalizeInquirySource(formData.get("source"));
  const sourceRef = String(formData.get("sourceRef") ?? "")
    .trim()
    .slice(0, 120);

  if (!name) return { error: "Please enter your name." };
  if (!email || !isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!message || message.length < 8) {
    return { error: "Please write a short message (at least a sentence)." };
  }
  if (subject.length > 200) {
    return { error: "Subject is too long." };
  }

  try {
    const [row] = await db
      .insert(inquiries)
      .values({
        name,
        email,
        subject,
        message,
        source,
        sourceRef,
        status: "new",
      })
      .returning({ id: inquiries.id });

    if (!row) return { error: "Could not save your message. Try again." };

    let confirmationSent = false;

    if (isMailConfigured()) {
      try {
        const confirm = inquiryConfirmationEmail({ name, subject });
        await sendMail({
          to: email,
          subject: confirm.subject,
          text: confirm.text,
          html: confirm.html,
        });
        confirmationSent = true;
        await db
          .update(inquiries)
          .set({
            confirmationSentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(inquiries.id, row.id));
      } catch {
        // Inquiry is saved; confirmation email is best-effort.
      }

      const notifyTo = adminNotifyEmail();
      if (notifyTo) {
        try {
          const alert = inquiryAdminAlertEmail({
            name,
            email,
            subject,
            message,
            inquiryId: row.id,
            source,
            sourceRef,
          });
          await sendMail({
            to: notifyTo,
            subject: alert.subject,
            text: alert.text,
            html: alert.html,
            replyTo: email,
          });
        } catch {
          // Non-blocking for the visitor.
        }
      }
    }

    return { ok: true, confirmationSent };
  } catch {
    return { error: "Something went wrong. Please try again in a moment." };
  }
}

export async function getInquiryStats() {
  await requireAdmin();
  return withDbRetry(async () => {
    const [total] = await db.select({ value: count() }).from(inquiries);
    const [unread] = await db
      .select({ value: count() })
      .from(inquiries)
      .where(eq(inquiries.status, "new"));
    const [replied] = await db
      .select({ value: count() })
      .from(inquiries)
      .where(eq(inquiries.status, "replied"));

    return {
      total: total?.value ?? 0,
      unread: unread?.value ?? 0,
      replied: replied?.value ?? 0,
    };
  });
}

export async function listInquiries() {
  await requireAdmin();
  return withDbRetry(() =>
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)),
  );
}

export async function getInquiry(id: string) {
  await requireAdmin();
  return withDbRetry(async () => {
    const [inquiry] = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .limit(1);
    if (!inquiry) return null;

    const replies = await db
      .select()
      .from(inquiryReplies)
      .where(eq(inquiryReplies.inquiryId, id))
      .orderBy(desc(inquiryReplies.sentAt));

    return { inquiry, replies };
  });
}

export async function markInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  await db
    .update(inquiries)
    .set({
      status,
      updatedAt: new Date(),
      ...(status === "replied" ? { repliedAt: new Date() } : {}),
    })
    .where(eq(inquiries.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function saveInquiryNotes(id: string, notes: string) {
  await requireAdmin();
  await db
    .update(inquiries)
    .set({ adminNotes: notes, updatedAt: new Date() })
    .where(eq(inquiries.id, id));
  revalidatePath(`/admin/inquiries/${id}`);
}

export type ReplyInquiryState = {
  ok?: boolean;
  error?: string;
};

export async function replyToInquiry(
  _prev: ReplyInquiryState,
  formData: FormData,
): Promise<ReplyInquiryState> {
  await requireAdmin();

  const id = String(formData.get("inquiryId") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!id) return { error: "Missing inquiry." };
  if (!subject) return { error: "Subject is required." };
  if (!body || body.length < 2) return { error: "Message body is required." };
  if (!isMailConfigured()) {
    return { error: "SMTP is not configured. Add SMTP_* keys to .env." };
  }

  const [inquiry] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.id, id))
    .limit(1);

  if (!inquiry) return { error: "Inquiry not found." };

  try {
    const styled = inquiryReplyEmail({ body, title: subject });
    await sendMail({
      to: inquiry.email,
      subject,
      text: styled.text,
      html: styled.html,
      replyTo: adminNotifyEmail() || undefined,
    });

    await db.insert(inquiryReplies).values({
      inquiryId: id,
      subject,
      body,
    });

    await db
      .update(inquiries)
      .set({
        status: "replied",
        repliedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(inquiries.id, id));

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${id}`);
    return { ok: true };
  } catch {
    return { error: "Failed to send email. Check SMTP settings." };
  }
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
}

export async function openInquiryIfNew(id: string) {
  await requireAdmin();
  await db
    .update(inquiries)
    .set({ status: "read", updatedAt: new Date() })
    .where(and(eq(inquiries.id, id), eq(inquiries.status, "new")));
}
