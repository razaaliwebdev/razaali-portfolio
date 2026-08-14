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
      subject varchar(200) DEFAULT 'General inquiry' NOT NULL,
      message text NOT NULL,
      status varchar(32) DEFAULT 'new' NOT NULL,
      admin_notes text DEFAULT '' NOT NULL,
      confirmation_sent_at timestamptz,
      replied_at timestamptz,
      is_read boolean DEFAULT false NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `;

  // Migrate older inquiries shape
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS subject varchar(200) DEFAULT 'General inquiry' NOT NULL`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status varchar(32) DEFAULT 'new' NOT NULL`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS admin_notes text DEFAULT '' NOT NULL`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS replied_at timestamptz`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now() NOT NULL`;
  await sql`UPDATE inquiries SET status = 'read' WHERE is_read = true AND status = 'new'`;

  await sql`
    CREATE TABLE IF NOT EXISTS inquiry_replies (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      inquiry_id uuid NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
      subject varchar(200) NOT NULL,
      body text NOT NULL,
      sent_at timestamptz DEFAULT now() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      slug varchar(120) NOT NULL UNIQUE,
      title varchar(160) NOT NULL,
      summary text DEFAULT '' NOT NULL,
      description text DEFAULT '' NOT NULL,
      is_published boolean DEFAULT false NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `;
  await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS description text DEFAULT '' NOT NULL`;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      slug varchar(120) NOT NULL UNIQUE,
      title varchar(160) NOT NULL,
      summary text DEFAULT '' NOT NULL,
      description text DEFAULT '' NOT NULL,
      cover_image_url text DEFAULT '' NOT NULL,
      live_url text DEFAULT '' NOT NULL,
      repo_url text DEFAULT '' NOT NULL,
      tech_stack text DEFAULT '' NOT NULL,
      is_featured boolean DEFAULT false NOT NULL,
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

  console.log(
    "Tables ready: admins, inquiries, inquiry_replies, services, projects",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
