import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectFeatureRow } from "@/components/portfolio/ProjectFeatureRow";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { getProjects } from "@/server/content";
import { showcaseMedia } from "@/data/showcaseMedia";
import { LiveShowcase } from "@/components/portfolio/live/LiveShowcase";
import { VariantSwitcher } from "@/components/portfolio/live/VariantSwitcher";
import { LIVE_VARIANTS } from "@/components/portfolio/live/variants";
import type { PortfolioProject } from "@/types/portfolio";

/** «1 кейс · 3 кейса · 7 кейсов». */
function casesWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "кейс";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "кейса";
  return "кейсов";
}

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
  title: "Портфолио",
  description:
    "Кейсы ITDOS: сайты, веб-приложения, CRM, маркетплейсы, AI-интеграции — с реальными результатами.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const portfolioProjects = await getProjects();
  // Layout of the «Живые проекты» section while the options are compared.
  const requested = Number((await searchParams).v);
  const variant =
    Number.isInteger(requested) && requested >= 1 && requested <= LIVE_VARIANTS.length
      ? requested
      : 1;
  // Projects with a live demo (a screen recording, the same one as on the
  // home page) lead in their own section; the rest follow below until they
  // get their own recordings and move up.
  const live = portfolioProjects.flatMap((project) => {
    const media = showcaseMedia[project.slug];
    return media ? [{ project, media }] : [];
  });
  const more = portfolioProjects.filter((p) => !showcaseMedia[p.slug]);
  return (
    <>
      <Section spacing="lg" className="pt-36!">
        <Container>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            {"Портфолио · "}
            {String(portfolioProjects.length).padStart(2, "0")}
            {" "}
            {casesWord(portfolioProjects.length)}
          </p>
          <TextReveal
            as="h1"
            className="max-w-4xl font-display text-[clamp(2.6rem,8vw,6.5rem)] font-semibold leading-[0.98] tracking-tight text-fg"
          >
            {"Продукты,\nкоторыми гордимся"}
          </TextReveal>
          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-secondary">
              Сайты, маркетплейсы, финтех и корпоративные системы. Каждый проект —
              продуманный продукт с измеримым результатом.
            </p>
          </FadeIn>
        </Container>
      </Section>

      {live.length > 0 && (
        <>
          <LiveShowcase items={live} variant={variant} />
          <VariantSwitcher current={variant} />
        </>
      )}

      {more.length > 0 && (
        <ProjectGroup
          label="Ещё проекты"
          projects={more}
          startIndex={live.length}
        />
      )}

      <CtaBanner />
    </>
  );
}

function ProjectGroup({
  label,
  note,
  projects,
  startIndex,
}: {
  label: string;
  note?: string;
  projects: PortfolioProject[];
  startIndex: number;
}) {
  return (
    <Section className="border-t border-line">
      <Container>
        <div className="mb-16 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-24">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-accent" />
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              {label} · {String(projects.length).padStart(2, "0")}
            </h2>
          </div>
          {note && (
            <p className="max-w-sm text-sm leading-relaxed text-fg-secondary">
              {note}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-24 lg:gap-36">
          {projects.map((project, i) => (
            <ProjectFeatureRow
              key={project.slug}
              project={project}
              index={startIndex + i}
              reversed={(startIndex + i) % 2 === 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
