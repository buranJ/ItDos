import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Parallax } from "@/components/motion/Parallax";
import { ProjectMedia } from "@/components/portfolio/ProjectMedia";
import { LiveWindow } from "@/components/portfolio/live/parts";
import { ShowcaseScreens } from "@/components/portfolio/ShowcaseScreens";
import { showcaseMedia } from "@/data/showcaseMedia";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { getProjects, getProjectBySlug } from "@/server/content";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";

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


  // Live projects: the cover already plays the recording, so the gallery is
  // their real phone screens (none for a desktop-only system).
  const media = showcaseMedia[project.slug];

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
      <Container className="pb-16 sm:pb-20 lg:pb-24">
        {media ? (
          // Запись на всю ширину: контейнер с параллаксом и зумом срезал
          // окно по краям, а сама запись — главное на странице кейса.
          <ClipReveal className="mx-auto w-[96%] rounded-2xl sm:w-[94%]">
            <LiveWindow item={{ project, media }} interactive />
          </ClipReveal>
        ) : (
          <ClipReveal className="rounded-2xl border border-line bg-panel">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[16/8]">
              <Parallax speed={0.12} className="absolute inset-0 scale-110">
                <ProjectMedia project={project} priority live />
              </Parallax>
            </div>
          </ClipReveal>
        )}
      </Container>

      {/* Overview */}
      <Section className="theme-light border-y border-line">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
                О проекте
              </p>
              <div className="flex flex-col gap-5">
                {project.overview.split("\n\n").map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-lg leading-relaxed text-fg-secondary sm:text-xl"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
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
      {media ? (
        media.mobileScreens?.length ? (
          <Section spacing="sm">
            <Container>
              <ShowcaseScreens
                screens={media.mobileScreens}
                title={project.title}
                accent={project.accent}
              />
            </Container>
          </Section>
        ) : null
      ) : (
        <Section spacing="sm">
          <Container>
            <ProjectGallery project={project} />
          </Container>
        </Section>
      )}

      {/* Results — dark peak (only when there are facts to show) */}
      {project.results.length > 0 && (
      <Section className="relative overflow-hidden border-y border-line">
        <div
          aria-hidden="true"
          className="accent-glow pointer-events-none absolute -top-20 left-1/3 h-144 w-144 opacity-30"
        />
        <Container className="relative">
          <p className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-m">
            Ключевые возможности
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
      )}

      {/* Goals / Challenges / Solutions */}
      <Section className="theme-light border-t border-line">
        <Container>
          {/* На телефоне три блока едут слайдером — иначе это одна очень
              длинная колонка текста. На планшете и шире — обычная сетка. */}
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-12 sm:overflow-visible sm:px-0">
            <GroupColumn title="Цели" items={project.goals} marker="→" />
            <GroupColumn title="Вызовы" items={project.challenges} marker="—" />
            <GroupColumn title="Решения" items={project.solutions} marker="✓" accent />
          </div>
          <p className="mt-5 text-sm text-fg-muted sm:hidden">
            Листайте вбок, чтобы увидеть вызовы и решения.
          </p>
        </Container>
      </Section>

      {/* Process */}
      <Section className="theme-light">
        <Container>
          <p className="mb-12 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Процесс
          </p>
          {/* Лента с точками вместо карточек с номерами: этапы читаются
              как последовательность, а не как четыре одинаковых блока. */}
          {/* На узком экране — вертикальная линия с точками, на широком —
              горизонтальная лента: точка без линии читалась как случайный
              кружок. */}
          <StaggerGroup className="relative grid grid-cols-1 gap-8 border-l border-line pl-7 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:pl-0">
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-[7px] hidden h-px bg-line lg:block"
            />
            {project.process.map((step) => (
              <div key={step.phase} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.06rem] top-1 z-10 block h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg lg:relative lg:left-0 lg:top-0"
                />
                <h3 className="font-display text-lg font-semibold tracking-tight text-fg lg:mt-5">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-base leading-relaxed text-fg-secondary">
                  {step.description}
                </p>
                {step.duration && (
                  <span className="mt-3 inline-block font-mono text-xs text-fg-faint">
                    {step.duration}
                  </span>
                )}
              </div>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      <CtaBanner />
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
}) {
  return (
    <div className="w-[85%] shrink-0 snap-start rounded-2xl border border-line bg-panel p-6 sm:w-auto sm:shrink sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
      <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-fg">
        {title}
      </h2>
      <ul className="flex flex-col gap-5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-base leading-relaxed text-fg-secondary sm:text-[1.0625rem]"
          >
            <span className={accent ? "text-m" : "text-fg-faint"}>{marker}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
