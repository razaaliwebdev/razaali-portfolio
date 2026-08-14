"use server";

import { asc, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, withDbRetry } from "@/db";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/actions/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export type ServiceFormState = {
  ok?: boolean;
  error?: string;
};

export async function getServiceStats() {
  await requireAdmin();
  const [total] = await db.select({ value: count() }).from(services);
  const [published] = await db
    .select({ value: count() })
    .from(services)
    .where(eq(services.isPublished, true));
  return {
    total: total?.value ?? 0,
    published: published?.value ?? 0,
  };
}

export async function listServices() {
  await requireAdmin();
  return withDbRetry(() =>
    db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder), asc(services.title)),
  );
}

/** Public catalog — published services only */
export async function listPublishedServices() {
  return withDbRetry(() =>
    db
      .select()
      .from(services)
      .where(eq(services.isPublished, true))
      .orderBy(asc(services.sortOrder), asc(services.title)),
  );
}

export async function getService(id: string) {
  await requireAdmin();
  const [row] = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return row ?? null;
}

export async function upsertService(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const isPublished = formData.get("isPublished") === "on";

  if (!title) return { error: "Title is required." };
  const slug = slugify(slugInput || title);
  if (!slug) return { error: "Slug is required." };

  try {
    if (id) {
      await db
        .update(services)
        .set({
          title,
          slug,
          summary,
          description,
          sortOrder,
          isPublished,
          updatedAt: new Date(),
        })
        .where(eq(services.id, id));
    } else {
      await db.insert(services).values({
        title,
        slug,
        summary,
        description,
        sortOrder,
        isPublished,
      });
    }
    revalidatePath("/admin");
    revalidatePath("/admin/services");
    return { ok: true };
  } catch {
    return { error: "Could not save service. Slug may already exist." };
  }
}

export async function deleteService(id: string) {
  await requireAdmin();
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/services");
}

export async function toggleServicePublished(id: string, next: boolean) {
  await requireAdmin();
  await db
    .update(services)
    .set({ isPublished: next, updatedAt: new Date() })
    .where(eq(services.id, id));
  revalidatePath("/admin/services");
}
