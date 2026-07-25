import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <div className="pt-28 pb-0">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
          >
            <ArrowLeft size={14} />
            Блог
          </Link>
        </Container>
      </div>

      <Section className="bg-bg">
        <Container size="md">
          <div className="flex flex-wrap gap-3 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border border-line rounded-full px-3 py-1 text-fg-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          <TextReveal
            as="h1"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight text-fg"
          >
            {post.title}
          </TextReveal>

          <FadeIn delay={0.2}>
            <div className="mt-6 flex items-center gap-4 text-sm text-fg-muted">
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span>{post.readTime} мин чтения</span>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container size="md">
          <FadeIn>
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-fg-secondary leading-relaxed">{post.excerpt}</p>
              {post.content ? (
                <div className="mt-8">{post.content}</div>
              ) : (
                <p className="mt-8 text-fg-muted italic">
                  Статья в процессе подготовки. Следите за обновлениями.
                </p>
              )}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
