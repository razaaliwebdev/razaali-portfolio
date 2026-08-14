"use server";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admins } from "@/db/schema";
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
} from "@/lib/auth";
import { getAdminSession } from "@/lib/session";

export type SignInState = {
  error?: string;
};

export async function signInAdmin(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const rows = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    const admin = rows[0];
    if (!admin) {
      return { error: "Invalid email or password." };
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return { error: "Invalid email or password." };
    }

    const token = await createAdminSessionToken(admin.email);
    const jar = await cookies();
    jar.set(ADMIN_SESSION_COOKIE, token, adminCookieOptions());
  } catch {
    return { error: "Sign-in failed. Check database connection." };
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, "", adminCookieOptions(0));
  redirect("/admin/login");
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
