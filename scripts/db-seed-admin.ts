import "dotenv/config";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { admins, projects, services } from "../db/schema";

const DEFAULT_SERVICES = [
  {
    slug: "full-stack",
    title: "Full Stack Development",
    summary:
      "End-to-end web apps from UI to database — shipped as one product.",
    description:
      "Product-ready applications with React/Next on the front, Node APIs in the middle, and Postgres or Mongo where data lives. Auth, dashboards, forms, and admin tooling included.",
    sortOrder: 0,
    isPublished: true,
  },
  {
    slug: "frontend",
    title: "Frontend Engineering",
    summary:
      "Fast, accessible interfaces that feel intentional — not template-y.",
    description:
      "Pixel-tight UI with React, Next.js, TypeScript, and Tailwind. Motion where it helps, performance budgets, and layouts that hold up on mobile and desktop.",
    sortOrder: 1,
    isPublished: true,
  },
  {
    slug: "backend",
    title: "Backend & APIs",
    summary: "Solid APIs, clean data models, and auth that doesn’t fall over.",
    description:
      "Express/Node services, REST endpoints, Drizzle/Mongoose schemas, validation, and integrations. Built to be readable, testable, and ready for real traffic.",
    sortOrder: 2,
    isPublished: true,
  },
  {
    slug: "deployment",
    title: "Deployment & DevOps",
    summary: "Get it live — CI, containers, and hosting that stay maintainable.",
    description:
      "Docker, GitHub Actions, VPS/Cloud setups, env management, and zero-drama deploys so shipping doesn’t become a weekend project.",
    sortOrder: 3,
    isPublished: true,
  },
] as const;

const DEFAULT_PROJECTS = [
  {
    slug: "sello-pk",
    title: "Sello.pk",
    summary:
      "Pakistan’s car marketplace — listings, auctions, and AI price estimates.",
    description:
      "A full MERN platform for buying and selling cars across Pakistan: verified listings, live auctions, seller dashboards, and an AI car estimator tuned for the local market.",
    coverImageUrl: "",
    liveUrl: "https://sello.pk",
    repoUrl: "",
    techStack: "MongoDB, Express, React, Node.js",
    isFeatured: true,
    isPublished: true,
    sortOrder: 0,
  },
  {
    slug: "amin-garage",
    title: "Amin Garage",
    summary:
      "Amin Auto Care — React marketing site for a full-service auto garage.",
    description:
      "A React.js website for Amin Garage (Faqir Wali): service catalog, quotes, gallery, reviews, and location — built to convert walk-in and local search traffic.",
    coverImageUrl: "",
    liveUrl: "https://amingarage.com",
    repoUrl: "",
    techStack: "React.js",
    isFeatured: false,
    isPublished: true,
    sortOrder: 1,
  },
] as const;

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
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source varchar(40) DEFAULT 'contact' NOT NULL`;
  await sql`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source_ref varchar(120) DEFAULT '' NOT NULL`;
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

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      status varchar(32) DEFAULT 'active' NOT NULL,
      unsubscribe_token varchar(64) NOT NULL UNIQUE,
      source varchar(64) DEFAULT 'home' NOT NULL,
      confirmation_sent_at timestamptz,
      unsubscribed_at timestamptz,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_campaigns (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      subject varchar(200) NOT NULL,
      body text NOT NULL,
      status varchar(32) DEFAULT 'sent' NOT NULL,
      sent_count integer DEFAULT 0 NOT NULL,
      failed_count integer DEFAULT 0 NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      sent_at timestamptz
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

  for (const service of DEFAULT_SERVICES) {
    const found = await db
      .select()
      .from(services)
      .where(eq(services.slug, service.slug))
      .limit(1);
    if (found[0]) {
      await db
        .update(services)
        .set({
          title: service.title,
          summary: service.summary,
          description: service.description,
          sortOrder: service.sortOrder,
          isPublished: service.isPublished,
          updatedAt: new Date(),
        })
        .where(eq(services.slug, service.slug));
    } else {
      await db.insert(services).values(service);
    }
  }
  console.log(`Services ready: ${DEFAULT_SERVICES.length} published`);

  for (const project of DEFAULT_PROJECTS) {
    const found = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, project.slug))
      .limit(1);
    if (found[0]) {
      await db
        .update(projects)
        .set({
          title: project.title,
          summary: project.summary,
          description: project.description,
          coverImageUrl: project.coverImageUrl,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
          techStack: project.techStack,
          isFeatured: project.isFeatured,
          isPublished: project.isPublished,
          sortOrder: project.sortOrder,
          updatedAt: new Date(),
        })
        .where(eq(projects.slug, project.slug));
    } else {
      await db.insert(projects).values(project);
    }
  }
  console.log(`Projects ready: ${DEFAULT_PROJECTS.length} published`);

  console.log(
    "Tables ready: admins, inquiries, inquiry_replies, services, projects, newsletter_subscribers, newsletter_campaigns",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
