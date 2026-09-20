import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { PostCover } from "@/components/blog/PostCover";
import { getPosts, getPostBySlug } from "@/server/content";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    alternates: { canonical: `/blog/${slug}` },
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  // Две соседние статьи под текстом — читать дальше, а не уходить с сайта.
  const more = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 2);

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
          <TextReveal
            as="h1"
            className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight text-fg"
          >
            {post.title}
          </TextReveal>

          <FadeIn delay={0.2}>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
              <span>{formatDate(post.publishedAt)}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {post.readTime} мин чтения
              </span>
              {post.author && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10">
              <PostCover post={post} className="aspect-16/9 rounded-[1.75rem]" />
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container size="md">
          <FadeIn>
            {/* Лид — крупнее тела статьи, он задаёт тон */}
            <p className="border-l-2 border-accent pl-5 text-lg leading-relaxed text-fg sm:text-xl">
              {post.excerpt}
            </p>
            <div className="mt-10">
              <ArticleBody markdown={post.content} />
            </div>
          </FadeIn>

          {post.tags.length > 0 && (
            <FadeIn>
              <div className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 text-xs text-fg-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          )}
        </Container>
      </Section>

      {more.length > 0 && (
        <Section className="border-t border-line">
          <Container size="md">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              Читайте дальше
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {more.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  data-cursor="card"
                  data-cursor-label="ЧИТАТЬ"
                  className="group flex flex-col gap-4"
                >
                  <PostCover post={item} className="aspect-16/10 rounded-2xl" />
                  <div>
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-muted">
                      {item.readTime} мин
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-fg transition-colors group-hover:text-accent-text">
                      {item.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors group-hover:text-fg">
                    Читать
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaBanner />
    </>
  );
}
