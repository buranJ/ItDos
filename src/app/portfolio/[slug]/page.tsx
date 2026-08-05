import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Parallax } from "@/components/motion/Parallax";
import { ProjectMedia } from "@/components/portfolio/ProjectMedia";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { getProjects, getProjectBySlug } from "@/server/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    alternates: { canonical: `/portfolio/${slug}` },
    title: project.title,
    description: project.tagline,
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const nextProject = project.nextProject
    ? await getProjectBySlug(project.nextProject)
    : undefined;

  const metaItems = [
    { label: "Клиент", value: project.client ?? project.title },
    { label: "Год", value: project.year },
    { label: "Роль", value: project.role ?? "Разработка" },
  ];

  return (
    <div style={{ "--m-accent": project.accent } as React.CSSProperties}>
      {/* Back */}
      <div className="pt-28">
        <Container>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={14} />
            Все проекты
          </Link>
        </Container>
      </div>

      {/* Hero */}
      <Section spacing="md">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs text-fg-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          <TextReveal
            as="h1"
            className="mt-7 max-w-4xl font-display text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[0.98] tracking-tight text-fg"
          >
            {project.title}
          </TextReveal>
          <FadeIn delay={0.15}>
            <p className="mt-5 max-w-2xl text-xl text-fg-secondary">
              {project.tagline}
            </p>
          </FadeIn>

          {/* meta row */}
          <FadeIn delay={0.25}>
            <div className="mt-12 flex flex-wrap gap-x-16 gap-y-6 border-t border-line pt-8">
              {metaItems.map((m) => (
                <div key={m.label}>
                  <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
                    {m.label}
                  </p>
                  <p className="mt-1.5 font-medium text-fg">{m.value}</p>
                </div>
              ))}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="group ml-auto inline-flex items-center gap-2 self-end text-sm font-medium text-m"
                >
                  Открыть сайт
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Cover */}
      <Container>
        <ClipReveal className="rounded-2xl border border-line bg-panel">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[16/8]">
            <Parallax speed={0.12} className="absolute inset-0 scale-110">
              <ProjectMedia project={project} priority live />
            </Parallax>
          </div>
        </ClipReveal>
      </Container>

      {/* Overview */}
      <Section className="theme-light border-y border-line">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
                О проекте
              </p>
              <p className="text-xl leading-relaxed text-fg sm:text-2xl">
                {project.overview}
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-fg-muted">
                  Стек
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line px-3 py-1 text-xs text-fg-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {project.services && (
                <div>
                  <p className="mb-3 font-mono text-xs uppercase tracking-widest text-fg-muted">
                    Услуги
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-m bg-m-softer px-3 py-1 text-xs text-m"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Gallery */}
      <Section spacing="sm">
        <Container>
          <ProjectGallery project={project} />
        </Container>
      </Section>

      {/* Results — dark peak */}
      <Section className="relative overflow-hidden border-y border-line">
        <div
          aria-hidden="true"
          className="accent-glow pointer-events-none absolute -top-20 left-1/3 h-144 w-144 opacity-30"
        />
        <Container className="relative">
          <p className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-m">
            Результаты
          </p>
          <StaggerGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {project.results.map((result) => (
              <div key={result.label} className="bg-bg p-8">
                <p className="font-display text-5xl font-semibold tracking-tight text-m sm:text-6xl">
                  {result.value}
                </p>
                <p className="mt-3 font-medium text-fg">{result.label}</p>
                <p className="mt-1 text-sm text-fg-muted">{result.description}</p>
              </div>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      {/* Goals / Challenges / Solutions */}
      <Section className="theme-light border-t border-line">
        <Container>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <GroupColumn title="Цели" items={project.goals} marker="→" muted />
            <GroupColumn title="Вызовы" items={project.challenges} marker="—" muted />
            <GroupColumn title="Решения" items={project.solutions} marker="✓" accent />
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="theme-light">
        <Container>
          <p className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Процесс
          </p>
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {project.process.map((step) => (
              <div
                key={step.phase}
                className="rounded-xl border border-line bg-surface/30 p-6"
              >
                <p className="font-display text-3xl font-semibold text-m">
                  {step.phase}
                </p>
                <h3 className="mt-4 font-semibold text-fg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {step.description}
                </p>
                <span className="mt-4 inline-block font-mono text-xs text-fg-faint">
                  {step.duration}
                </span>
              </div>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      {/* Next project */}
      {nextProject && (
        <Section
          className="relative border-t border-line"
          style={{ "--m-accent": nextProject.accent } as React.CSSProperties}
        >
          <Container>
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              Следующий проект
            </p>
            <Link
              href={`/portfolio/${nextProject.slug}`}
              data-cursor="card"
              data-cursor-label="КЕЙС"
              className="group grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
            >
              <div>
                <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[1.0] tracking-tight text-fg transition-colors duration-300 group-hover:text-m">
                  {nextProject.title}
                </h2>
                <p className="mt-4 max-w-md text-lg text-fg-secondary">
                  {nextProject.tagline}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-fg">
                  Смотреть кейс
                  <ArrowRight
                    size={18}
                    className="text-m transition-transform duration-300 group-hover:translate-x-2"
                  />
                </span>
              </div>
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-line bg-panel transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                <ProjectMedia project={nextProject} />
              </div>
            </Link>
          </Container>
        </Section>
      )}
    </div>
  );
}

function GroupColumn({
  title,
  items,
  marker,
  accent,
}: {
  title: string;
  items: string[];
  marker: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold tracking-tight text-fg">
        {title}
      </h2>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-fg-secondary">
            <span className={accent ? "text-m" : "text-fg-faint"}>{marker}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
