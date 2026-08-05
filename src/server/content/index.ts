import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  faqItems,
  plans,
  posts,
  processPhases,
  projects,
  reviews,
  services,
  teamMembers,
} from "@/server/db/schema";
import type { PortfolioProject, MockupKind, ProjectCategory } from "@/types/portfolio";
import type { Service, ServiceCategory } from "@/types/service";
import type { BlogPost, BlogCategory } from "@/types/blog";
import type { Review } from "@/types/review";

/**
 * Read side of the CMS.
 *
 * Every function returns the exact shape the components already consume, so
 * swapping `@/data/*` for `@/server/content` is an import change and nothing
 * else. Rows are mapped explicitly rather than spread — the DB row carries
 * bookkeeping columns (position, published, timestamps) that have no business
 * reaching a React component.
 *
 * No cache wrapper on purpose: the pages that call these are statically
 * rendered, so the query runs at build/revalidate time, not per request.
 * Admin writes call `revalidateContent()` to regenerate the affected routes.
 */

/* ─────────────────────────── services ─────────────────────────── */

export async function getServices(): Promise<Service[]> {
  const rows = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.position));

  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    shortTitle: r.shortTitle,
    description: r.description,
    longDescription: r.longDescription,
    icon: r.icon,
    features: r.features,
    technologies: r.technologies,
    deliverables: r.deliverables,
    timeframe: r.timeframe,
    category: r.category as ServiceCategory,
  }));
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const [r] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  if (!r || !r.published) return undefined;
  return {
    slug: r.slug,
    title: r.title,
    shortTitle: r.shortTitle,
    description: r.description,
    longDescription: r.longDescription,
    icon: r.icon,
    features: r.features,
    technologies: r.technologies,
    deliverables: r.deliverables,
    timeframe: r.timeframe,
    category: r.category as ServiceCategory,
  };
}

/* ─────────────────────────── portfolio ─────────────────────────── */

type ProjectRow = typeof projects.$inferSelect;

function toProject(r: ProjectRow): PortfolioProject {
  return {
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    category: r.category as ProjectCategory,
    tags: r.tags,
    year: r.year,
    accent: r.accent ?? undefined,
    mockup: r.mockup as MockupKind,
    highlight: r.highlight ?? undefined,
    featured: r.featured,
    coverImage: r.coverImage ?? undefined,
    coverVideo: r.coverVideo ?? undefined,
    gallery: r.gallery,
    desktopScreens: r.desktopScreens,
    mobileScreens: r.mobileScreens,
    videos: r.videos,
    client: r.client ?? undefined,
    services: r.services,
    role: r.role ?? undefined,
    liveUrl: r.liveUrl ?? undefined,
    overview: r.overview,
    goals: r.goals,
    challenges: r.challenges,
    solutions: r.solutions,
    stack: r.stack,
    results: r.results,
    process: r.process,
    nextProject: r.nextProject ?? undefined,
  };
}

export async function getProjects(): Promise<PortfolioProject[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.position));
  return rows.map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  const [r] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return r && r.published ? toProject(r) : undefined;
}

/* ─────────────────────────── clients ─────────────────────────── */

export type ClientBrand = {
  /** Company name as it should appear. */
  name: string;
  /** Case-study slug, so each mark links to real work. */
  slug: string;
  accent?: string;
  /** Path to a real logo file once one exists. */
  logo?: string;
};

/**
 * Trust strip source.
 *
 * Derived from the portfolio rather than a hand-kept list: every name here is
 * a client with a shipped, linkable case. A separate list would drift, and —
 * worse — invites filling with companies we never worked for.
 */
export async function getClientBrands(): Promise<ClientBrand[]> {
  const rows = await db
    .select({
      client: projects.client,
      title: projects.title,
      slug: projects.slug,
      accent: projects.accent,
    })
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.position));

  const seen = new Set<string>();
  const brands: ClientBrand[] = [];
  for (const r of rows) {
    const name = (r.client ?? r.title).trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    brands.push({ name, slug: r.slug, accent: r.accent ?? undefined });
  }
  return brands;
}

/* ─────────────────────────── blog ─────────────────────────── */

export async function getPosts(): Promise<BlogPost[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt));

  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    coverImage: r.coverImage,
    category: r.category as BlogCategory,
    tags: r.tags,
    author: r.author,
    publishedAt: r.publishedAt,
    readTime: r.readTime,
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const [r] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!r || !r.published) return undefined;
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    coverImage: r.coverImage,
    category: r.category as BlogCategory,
    tags: r.tags,
    author: r.author,
    publishedAt: r.publishedAt,
    readTime: r.readTime,
  };
}

/* ─────────────────────────── reviews ─────────────────────────── */

export async function getReviews(): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.published, true))
    .orderBy(asc(reviews.sortOrder));

  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    position: r.position,
    company: r.company,
    text: r.text,
    rating: r.rating,
    project: r.projectSlug ?? undefined,
    date: r.date,
  }));
}

/* ─────────────────────────── team ─────────────────────────── */

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  photo?: string;
  tag?: string;
  tagColor?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
};

export async function getTeam(): Promise<TeamMember[]> {
  const rows = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.published, true))
    .orderBy(asc(teamMembers.position));

  return rows.map((r) => ({
    name: r.name,
    role: r.role,
    initials: r.initials,
    photo: r.photo ?? undefined,
    tag: r.tag ?? undefined,
    tagColor: r.tagColor ?? undefined,
    bio: r.bio ?? undefined,
    skills: r.skills,
    experience: r.experience ?? undefined,
  }));
}

/* ─────────────────────────── pricing ─────────────────────────── */

export type Plan = {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
};

export async function getPlans(): Promise<Plan[]> {
  const rows = await db
    .select()
    .from(plans)
    .where(eq(plans.published, true))
    .orderBy(asc(plans.position));

  return rows.map((r) => ({
    name: r.name,
    tagline: r.tagline,
    price: r.price,
    period: r.period,
    features: r.features,
    popular: r.popular,
  }));
}

/* ─────────────────────────── faq ─────────────────────────── */

export type FaqItem = { q: string; a: string };

export async function getFaq(): Promise<FaqItem[]> {
  const rows = await db
    .select()
    .from(faqItems)
    .where(eq(faqItems.published, true))
    .orderBy(asc(faqItems.position));
  return rows.map((r) => ({ q: r.question, a: r.answer }));
}

/* ─────────────────────────── process ─────────────────────────── */

export type ProcessPhase = {
  number: string;
  title: string;
  description: string;
  activities: string[];
  duration: string;
};

export async function getProcessPhases(): Promise<ProcessPhase[]> {
  const rows = await db
    .select()
    .from(processPhases)
    .where(eq(processPhases.published, true))
    .orderBy(asc(processPhases.position));

  return rows.map((r) => ({
    number: r.number,
    title: r.title,
    description: r.description,
    activities: r.deliverables,
    duration: r.duration,
  }));
}
