import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/** Admin accounts (seeded; sign-in only) */
export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull().default("Admin"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Inquiry lifecycle: new → read → replied → archived */
export const INQUIRY_STATUSES = [
  "new",
  "read",
  "replied",
  "archived",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** Public contact / inquiry submissions */
export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull().default("General inquiry"),
  message: text("message").notNull(),
  /** contact | services | projects | home */
  source: varchar("source", { length: 40 }).notNull().default("contact"),
  /** slug / id of service or project when applicable */
  sourceRef: varchar("source_ref", { length: 120 }).notNull().default(""),
  status: varchar("status", { length: 32 }).notNull().default("new"),
  adminNotes: text("admin_notes").notNull().default(""),
  confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
  repliedAt: timestamp("replied_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Outbound emails sent from admin for an inquiry */
export const inquiryReplies = pgTable("inquiry_replies", {
  id: uuid("id").defaultRandom().primaryKey(),
  inquiryId: uuid("inquiry_id")
    .notNull()
    .references(() => inquiries.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 200 }).notNull(),
  body: text("body").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Portfolio services managed from admin */
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  summary: text("summary").notNull().default(""),
  description: text("description").notNull().default(""),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Portfolio projects managed from admin */
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  summary: text("summary").notNull().default(""),
  description: text("description").notNull().default(""),
  coverImageUrl: text("cover_image_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  repoUrl: text("repo_url").notNull().default(""),
  techStack: text("tech_stack").notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Newsletter subscribers (home page signup) */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  unsubscribeToken: varchar("unsubscribe_token", { length: 64 }).notNull().unique(),
  source: varchar("source", { length: 64 }).notNull().default("home"),
  confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Broadcast emails sent to newsletter list */
export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  subject: varchar("subject", { length: 200 }).notNull(),
  body: text("body").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("sent"),
  sentCount: integer("sent_count").notNull().default(0),
  failedCount: integer("failed_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export type Admin = typeof admins.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type InquiryReply = typeof inquiryReplies.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;
