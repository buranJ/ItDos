import type { MetadataRoute } from "next";
import { portfolioProjects } from "@/data/portfolio";
import { services } from "@/data/services";
import { blogPosts } from "@/data/blog";

const base = "https://itdos.ru";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const dynamic = [
    ...services.map((s) => `/services/${s.slug}`),
    ...portfolioProjects.map((p) => `/portfolio/${p.slug}`),
    ...blogPosts.map((b) => `/blog/${b.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPaths, ...dynamic];
}
