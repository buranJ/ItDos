import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Content schema.
 *
 * Shape note: list- and object-valued fields (features, tags, results,
 * process steps…) are stored as JSON columns rather than being normalised
 * into child tables. That is a deliberate call for this workload — they are
 * always read as a whole with their parent row, never queried across rows,
 * and never joined. Normalising them would buy nothing and cost every read
 * a join plus every admin save a diff-and-reconcile.
 *
 * Anything that IS queried independently (slug, category, published,
 * position) is a real column with an index.
 */

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
};

/** Editors of the site. Small, hand-managed table — no public sign-up. */
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    /** scrypt: `<salt-hex>:<derived-key-hex>`. Never a plaintext password. */
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["admin", "editor"] }).notNull().default("editor"),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

/** Server-side sessions. The cookie holds an opaque id, never user data. */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const services = sqliteTable(
  "services",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    shortTitle: text("short_title").notNull().default(""),
    description: text("description").notNull().default(""),
    longDescription: text("long_description").notNull().default(""),
    icon: text("icon").notNull().default("Monitor"),
    features: text("features", { mode: "json" }).$type<string[]>().notNull().default([]),
    technologies: text("technologies", { mode: "json" }).$type<string[]>().notNull().default([]),
    deliverables: text("deliverables", { mode: "json" }).$type<string[]>().notNull().default([]),
    timeframe: text("timeframe").notNull().default(""),
    category: text("category").notNull().default("development"),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("services_slug_idx").on(t.slug),
    index("services_category_idx").on(t.category),
  ],
);

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    tagline: text("tagline").notNull().default(""),
    category: text("category").notNull().default("website"),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
    year: text("year").notNull().default(""),
    accent: text("accent"),
    mockup: text("mockup").notNull().default("browser"),
    highlight: text("highlight"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),

    coverImage: text("cover_image"),
    coverVideo: text("cover_video"),
    gallery: text("gallery", { mode: "json" }).$type<string[]>().notNull().default([]),
    desktopScreens: text("desktop_screens", { mode: "json" }).$type<string[]>().notNull().default([]),
    mobileScreens: text("mobile_screens", { mode: "json" }).$type<string[]>().notNull().default([]),
    videos: text("videos", { mode: "json" }).$type<string[]>().notNull().default([]),

    client: text("client"),
    services: text("services", { mode: "json" }).$type<string[]>().notNull().default([]),
    role: text("role"),
    liveUrl: text("live_url"),

    overview: text("overview").notNull().default(""),
    goals: text("goals", { mode: "json" }).$type<string[]>().notNull().default([]),
    challenges: text("challenges", { mode: "json" }).$type<string[]>().notNull().default([]),
    solutions: text("solutions", { mode: "json" }).$type<string[]>().notNull().default([]),
    stack: text("stack", { mode: "json" }).$type<string[]>().notNull().default([]),
    results: text("results", { mode: "json" })
      .$type<{ label: string; value: string; description: string }[]>()
      .notNull()
      .default([]),
    process: text("process", { mode: "json" })
      .$type<{ phase: string; title: string; description: string; duration: string }[]>()
      .notNull()
      .default([]),
    nextProject: text("next_project"),

    published: integer("published", { mode: "boolean" }).notNull().default(true),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("projects_slug_idx").on(t.slug),
    index("projects_category_idx").on(t.category),
    index("projects_featured_idx").on(t.featured),
  ],
);

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    coverImage: text("cover_image").notNull().default(""),
    category: text("category").notNull().default("development"),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
    author: text("author").notNull().default(""),
    publishedAt: text("published_at").notNull().default(""),
    readTime: integer("read_time").notNull().default(5),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (t) => [uniqueIndex("posts_slug_idx").on(t.slug)],
);

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  author: text("author").notNull(),
  position: text("position").notNull().default(""),
  company: text("company").notNull().default(""),
  text: text("text").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  projectSlug: text("project_slug"),
  date: text("date").notNull().default(""),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  initials: text("initials").notNull().default(""),
  photo: text("photo"),
  tag: text("tag"),
  tagColor: text("tag_color"),
  bio: text("bio"),
  skills: text("skills", { mode: "json" }).$type<string[]>().notNull().default([]),
  experience: text("experience"),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  price: text("price").notNull().default(""),
  period: text("period").notNull().default(""),
  features: text("features", { mode: "json" }).$type<string[]>().notNull().default([]),
  popular: integer("popular", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

export const faqItems = sqliteTable("faq_items", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull().default(""),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

export const processPhases = sqliteTable("process_phases", {
  id: text("id").primaryKey(),
  number: text("number").notNull().default(""),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  duration: text("duration").notNull().default(""),
  deliverables: text("deliverables", { mode: "json" }).$type<string[]>().notNull().default([]),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

/**
 * Leads captured by the contact form.
 *
 * Today the form fires a Telegram message and forgets. If that call fails —
 * or the bot token expires — the enquiry is gone. Persisting first makes
 * delivery a best-effort side effect instead of the system of record.
 */
export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    service: text("service"),
    message: text("message"),
    status: text("status", { enum: ["new", "in_progress", "won", "lost"] })
      .notNull()
      .default("new"),
    source: text("source").notNull().default("contact-form"),
    /** Delivery outcome for the Telegram notification, for debugging. */
    notified: integer("notified", { mode: "boolean" }).notNull().default(false),
    notifyError: text("notify_error"),
    ...timestamps,
  },
  (t) => [index("leads_status_idx").on(t.status), index("leads_created_idx").on(t.createdAt)],
);

/** Free-form key/value settings (contact details, response time, toggles). */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value", { mode: "json" }).$type<unknown>().notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type UserRow = typeof users.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type ServiceRow = typeof services.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type PostRow = typeof posts.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type TeamMemberRow = typeof teamMembers.$inferSelect;
export type PlanRow = typeof plans.$inferSelect;
export type FaqRow = typeof faqItems.$inferSelect;
export type ProcessPhaseRow = typeof processPhases.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
