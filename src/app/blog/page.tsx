import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Статьи ITDOS о разработке, AI-автоматизации, CRM-системах и цифровизации бизнеса.",
};

export default function BlogPage() {
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
          <StaggerGroup className="flex flex-col">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                data-cursor="card"
                data-cursor-label="ЧИТАТЬ"
                className="group grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 py-8 border-b border-line hover:bg-surface -mx-5 px-5 sm:-mx-8 sm:px-8 transition-colors duration-200"
              >
                <div>
                  <p className="text-xs text-fg-muted mb-3">
                    {formatDate(post.publishedAt)} · {post.readTime} мин
                  </p>
                  <h2 className="text-xl font-semibold text-fg mb-2 group-hover:opacity-70 transition-opacity">
                    {post.title}
                  </h2>
                  <p className="text-sm text-fg-secondary leading-relaxed">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-line rounded-full px-3 py-0.5 text-fg-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start">
                  <ArrowUpRight
                    size={20}
                    className="text-fg opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                  />
                </div>
              </Link>
            ))}
          </StaggerGroup>
        </Container>
      </Section>
    </>
  );
}
