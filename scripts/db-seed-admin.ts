import "dotenv/config";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { admins } from "../db/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!url) throw new Error("DATABASE_URL is not set");
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set for seeding");
  }

  const sql = neon(url);
  const db = drizzle(sql);

  // Remove legacy table
  await sql`DROP TABLE IF EXISTS contact_messages CASCADE`;

  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      password_hash text NOT NULL,
      name varchar(120) DEFAULT 'Admin' NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      name varchar(120) NOT NULL,
      email varchar(255) NOT NULL,
      message text NOT NULL,
      is_read boolean DEFAULT false NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      slug varchar(120) NOT NULL UNIQUE,
      title varchar(160) NOT NULL,
      summary text DEFAULT '' NOT NULL,
      is_published boolean DEFAULT false NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `;

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (existing[0]) {
    await db
      .update(admins)
      .set({
        passwordHash,
        name: "Raza Ali",
        updatedAt: new Date(),
      })
      .where(eq(admins.email, email));
    console.log(`Updated admin: ${email}`);
  } else {
    await db.insert(admins).values({
      email,
      passwordHash,
      name: "Raza Ali",
    });
    console.log(`Seeded admin: ${email}`);
  }

  console.log("Tables ready: admins, inquiries, services");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
