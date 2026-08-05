/**
 * Seeds the database from the existing `src/data/*.ts` files.
 *
 * Idempotent: rows are matched on their natural key (slug / name / question)
 * and updated in place, so re-running never duplicates content. This is the
 * migration path off hard-coded content — nothing is lost, and the site
 * renders exactly what it rendered before.
 *
 *   npm run db:seed
 *   npm run db:seed -- --admin-email you@itdos.kg --admin-password 'secret'
 */
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../src/server/db/client";
import {
  faqItems,
  plans,
  posts,
  processPhases,
  projects,
  reviews,
  services,
  teamMembers,
  users,
} from "../src/server/db/schema";
import { hashPassword } from "./lib/password";

import { services as servicesData } from "../src/data/services";
import { portfolioProjects } from "../src/data/portfolio";
import { blogPosts } from "../src/data/blog";
import { reviews as reviewsData } from "../src/data/reviews";
import { team } from "../src/data/team";
import { plans as plansData } from "../src/data/pricing";
import { faq as faqData } from "../src/data/faq";
import { processPhases as processData } from "../src/data/process";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  console.log("→ seeding from src/data …");

  /* ── services ── */
  for (const [i, s] of servicesData.entries()) {
    const existing = await db.select({ id: services.id }).from(services).where(eq(services.slug, s.slug)).limit(1);
    const row = {
      slug: s.slug,
      title: s.title,
      shortTitle: s.shortTitle,
      description: s.description,
      longDescription: s.longDescription,
      icon: s.icon,
      features: s.features,
      technologies: s.technologies,
      deliverables: s.deliverables,
      timeframe: s.timeframe,
      category: s.category,
      position: i,
    };
    if (existing[0]) await db.update(services).set(row).where(eq(services.id, existing[0].id));
    else await db.insert(services).values({ id: randomUUID(), ...row });
  }
  console.log(`  services: ${servicesData.length}`);

  /* ── projects ── */
  for (const [i, p] of portfolioProjects.entries()) {
    const existing = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, p.slug)).limit(1);
    const row = {
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      category: p.category,
      tags: p.tags,
      year: p.year,
      accent: p.accent ?? null,
      mockup: p.mockup,
      highlight: p.highlight ?? null,
      featured: p.featured ?? false,
      coverImage: p.coverImage ?? null,
      coverVideo: p.coverVideo ?? null,
      gallery: p.gallery ?? [],
      desktopScreens: p.desktopScreens ?? [],
      mobileScreens: p.mobileScreens ?? [],
      videos: p.videos ?? [],
      client: p.client ?? null,
      services: p.services ?? [],
      role: p.role ?? null,
      liveUrl: p.liveUrl ?? null,
      overview: p.overview,
      goals: p.goals,
      challenges: p.challenges,
      solutions: p.solutions,
      stack: p.stack,
      results: p.results,
      process: p.process,
      nextProject: p.nextProject ?? null,
      position: i,
    };
    if (existing[0]) await db.update(projects).set(row).where(eq(projects.id, existing[0].id));
    else await db.insert(projects).values({ id: randomUUID(), ...row });
  }
  console.log(`  projects: ${portfolioProjects.length}`);

  /* ── blog ── */
  for (const b of blogPosts) {
    const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, b.slug)).limit(1);
    const row = {
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.coverImage,
      category: b.category,
      tags: b.tags,
      author: b.author,
      publishedAt: b.publishedAt,
      readTime: b.readTime,
    };
    if (existing[0]) await db.update(posts).set(row).where(eq(posts.id, existing[0].id));
    else await db.insert(posts).values({ id: randomUUID(), ...row });
  }
  console.log(`  posts: ${blogPosts.length}`);

  /* ── reviews ── */
  for (const [i, r] of reviewsData.entries()) {
    const existing = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.id, r.id)).limit(1);
    const row = {
      author: r.author,
      position: r.position,
      company: r.company,
      text: r.text,
      rating: r.rating,
      projectSlug: r.project ?? null,
      date: r.date,
      sortOrder: i,
    };
    if (existing[0]) await db.update(reviews).set(row).where(eq(reviews.id, r.id));
    else await db.insert(reviews).values({ id: r.id, ...row });
  }
  console.log(`  reviews: ${reviewsData.length}`);

  /* ── team ── */
  for (const [i, m] of team.entries()) {
    const existing = await db.select({ id: teamMembers.id }).from(teamMembers).where(eq(teamMembers.name, m.name)).limit(1);
    const row = {
      name: m.name,
      role: m.role,
      initials: m.initials,
      photo: m.photo ?? null,
      tag: m.tag ?? null,
      tagColor: m.tagColor ?? null,
      bio: m.bio ?? null,
      skills: m.skills ?? [],
      experience: m.experience ?? null,
      position: i,
    };
    if (existing[0]) await db.update(teamMembers).set(row).where(eq(teamMembers.id, existing[0].id));
    else await db.insert(teamMembers).values({ id: randomUUID(), ...row });
  }
  console.log(`  team: ${team.length}`);

  /* ── plans ── */
  for (const [i, p] of plansData.entries()) {
    const existing = await db.select({ id: plans.id }).from(plans).where(eq(plans.name, p.name)).limit(1);
    const row = {
      name: p.name,
      tagline: p.tagline,
      price: p.price,
      period: p.period,
      features: p.features,
      popular: p.popular ?? false,
      position: i,
    };
    if (existing[0]) await db.update(plans).set(row).where(eq(plans.id, existing[0].id));
    else await db.insert(plans).values({ id: randomUUID(), ...row });
  }
  console.log(`  plans: ${plansData.length}`);

  /* ── faq ── */
  for (const [i, f] of faqData.entries()) {
    const existing = await db.select({ id: faqItems.id }).from(faqItems).where(eq(faqItems.question, f.q)).limit(1);
    const row = { question: f.q, answer: f.a, position: i };
    if (existing[0]) await db.update(faqItems).set(row).where(eq(faqItems.id, existing[0].id));
    else await db.insert(faqItems).values({ id: randomUUID(), ...row });
  }
  console.log(`  faq: ${faqData.length}`);

  /* ── process ── */
  for (const [i, p] of processData.entries()) {
    const existing = await db.select({ id: processPhases.id }).from(processPhases).where(eq(processPhases.number, p.number)).limit(1);
    const row = {
      number: p.number,
      title: p.title,
      description: p.description,
      duration: p.duration,
      deliverables: p.activities ?? [],
      position: i,
    };
    if (existing[0]) await db.update(processPhases).set(row).where(eq(processPhases.id, existing[0].id));
    else await db.insert(processPhases).values({ id: randomUUID(), ...row });
  }
  console.log(`  process phases: ${processData.length}`);

  /* ── admin user ── */
  const email = (arg("admin-email") ?? process.env.ADMIN_EMAIL ?? "admin@itdos.kg").toLowerCase();
  const password = arg("admin-password") ?? process.env.ADMIN_PASSWORD ?? "itdos-admin";
  const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (!existingUser[0]) {
    await db.insert(users).values({
      id: randomUUID(),
      email,
      name: "Администратор",
      passwordHash: await hashPassword(password),
      role: "admin",
    });
    console.log(`  admin created: ${email} / ${password}`);
    console.log("  ⚠ CHANGE THIS PASSWORD before the site goes public.");
  } else {
    console.log(`  admin already exists: ${email}`);
  }

  console.log("✓ seed complete");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
