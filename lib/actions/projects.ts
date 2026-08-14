"use server";

import { asc, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, withDbRetry } from "@/db";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/lib/actions/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export type ProjectFormState = {
  ok?: boolean;
  error?: string;
};

export async function getProjectStats() {
  await requireAdmin();
  const [total] = await db.select({ value: count() }).from(projects);
  const [published] = await db
    .select({ value: count() })
    .from(projects)
    .where(eq(projects.isPublished, true));
  return {
    total: total?.value ?? 0,
    published: published?.value ?? 0,
  };
}

export async function listProjects() {
  await requireAdmin();
  return withDbRetry(() =>
    db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder), asc(projects.title)),
  );
}

/** Public catalog — published projects only */
export async function listPublishedProjects() {
  return withDbRetry(() =>
    db
      .select()
      .from(projects)
      .where(eq(projects.isPublished, true))
      .orderBy(asc(projects.sortOrder), asc(projects.title)),
  );
}

export async function getProject(id: string) {
  await requireAdmin();
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return row ?? null;
}

export async function upsertProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const liveUrl = String(formData.get("liveUrl") ?? "").trim();
  const repoUrl = String(formData.get("repoUrl") ?? "").trim();
  const techStack = String(formData.get("techStack") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const isPublished = formData.get("isPublished") === "on";
  const isFeatured = formData.get("isFeatured") === "on";

  if (!title) return { error: "Title is required." };
  const slug = slugify(slugInput || title);
  if (!slug) return { error: "Slug is required." };

  try {
    if (id) {
      await db
        .update(projects)
        .set({
          title,
          slug,
          summary,
          description,
          coverImageUrl,
          liveUrl,
          repoUrl,
          techStack,
          sortOrder,
          isPublished,
          isFeatured,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id));
    } else {
      await db.insert(projects).values({
        title,
        slug,
        summary,
        description,
        coverImageUrl,
        liveUrl,
        repoUrl,
        techStack,
        sortOrder,
        isPublished,
        isFeatured,
      });
    }
    revalidatePath("/admin");
    revalidatePath("/admin/projects");
    return { ok: true };
  } catch {
    return { error: "Could not save project. Slug may already exist." };
  }
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function toggleProjectPublished(id: string, next: boolean) {
  await requireAdmin();
  await db
    .update(projects)
    .set({ isPublished: next, updatedAt: new Date() })
    .where(eq(projects.id, id));
  revalidatePath("/admin/projects");
}
