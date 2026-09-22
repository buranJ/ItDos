import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { getProjects } from "@/server/content";
import { showcaseMedia } from "@/data/showcaseMedia";
import { LiveShowcase } from "@/components/portfolio/live/LiveShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
  title: "Портфолио",
  description:
    "Кейсы ITDOS: сайты, веб-приложения, CRM, маркетплейсы, AI-интеграции — с реальными результатами.",
};

// Static on purpose: no `searchParams` here (the layout trial reads `?v=`
// in the browser) — a dynamic page renders on Netlify in a function without
// the database.
export default async function PortfolioPage() {
  const portfolioProjects = await getProjects();
  // Только проекты с записью реального интерфейса: остальные ждут своих
  // видео, а страницы их кейсов остаются доступными по прямым ссылкам.
  const live = portfolioProjects.flatMap((project) => {
    const media = showcaseMedia[project.slug];
    return media ? [{ project, media }] : [];
  });
  return (
    <>
      <Section spacing="lg" className="pt-36!">
        <Container>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Портфолио
          </p>
          {/* Заголовок держится в двух строках на любом экране, поэтому
              размер ниже прежнего, а колонка шире. */}
          <TextReveal
            as="h1"
            className="max-w-5xl font-display text-[clamp(2.2rem,5.5vw,4.6rem)] font-semibold leading-[1] tracking-tight text-fg"
          >
            {"Проекты,\nкоторыми гордимся"}
          </TextReveal>
          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-secondary">
              Сайты, мобильные приложения, CRM-системы и внутренние сервисы.
              Не просто красивые работы, а продукты, которыми действительно
              пользуются каждый день.
            </p>
          </FadeIn>
        </Container>
      </Section>

      {live.length > 0 && (
        <LiveShowcase items={live} />
      )}

      <CtaBanner />
    </>
  );
}
