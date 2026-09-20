import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { PostCover } from "@/components/blog/PostCover";
import { getPosts } from "@/server/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Блог",
  description:
    "Статьи ITDOS о разработке, AI-автоматизации, CRM-системах и цифровизации бизнеса.",
};

export default async function BlogPage() {
  const blogPosts = await getPosts();
  // Свежая статья идёт крупной карточкой, остальные — сеткой под ней.
  const [lead, ...rest] = blogPosts;
  return (
    <>
      <Section spacing="lg" className="bg-bg pt-32!">
        <Container>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
            Блог
          </p>
          <TextReveal
            as="h1"
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-tight tracking-tight text-fg max-w-3xl"
          >
            {"Статьи и\nкейсы"}
          </TextReveal>
        </Container>
      </Section>

      <Section className="theme-light border-t border-line">
        <Container>
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              data-cursor="card"
              data-cursor-label="ЧИТАТЬ"
              className="group grid gap-8 border-b border-line pb-14 lg:grid-cols-12 lg:items-center lg:gap-12"
            >
              <PostCover
                post={lead}
                priority
                className="aspect-16/10 rounded-[1.75rem] lg:col-span-7"
              />
              <div className="lg:col-span-5">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-fg-muted">
                  Свежая статья · {lead.readTime} мин
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-tight text-fg transition-colors duration-300 group-hover:text-accent-text">
                  {lead.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-fg-secondary">
                  {lead.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg">
                  Читать
                  <ArrowUpRight
                    size={16}
                    className="text-accent-text transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          )}

          <StaggerGroup className="grid gap-x-6 gap-y-12 pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                data-cursor="card"
                data-cursor-label="ЧИТАТЬ"
                className="group flex flex-col gap-5"
              >
                <PostCover post={post} className="aspect-16/10 rounded-2xl" />
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-muted">
                    {formatDate(post.publishedAt)} · {post.readTime} мин
                  </p>
                  <h2 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-fg transition-colors duration-300 group-hover:text-accent-text">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-3 py-0.5 text-xs text-fg-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

    </>
  );
}
