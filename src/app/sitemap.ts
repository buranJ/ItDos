import type { MetadataRoute } from "next";
import { getProjects, getServices, getPosts } from "@/server/content";

const base = "https://itdos.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/process",
    "/reviews",
    "/blog",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [services, projects, posts] = await Promise.all([
    getServices(),
    getProjects(),
    getPosts(),
  ]);

  const dynamic = [
    ...services.map((s) => `/services/${s.slug}`),
    ...projects.map((p) => `/portfolio/${p.slug}`),
    ...posts.map((b) => `/blog/${b.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPaths, ...dynamic];
}
