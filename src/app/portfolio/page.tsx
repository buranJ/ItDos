import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectFeatureRow } from "@/components/portfolio/ProjectFeatureRow";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { portfolioProjects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Портфолио",
  description:
    "Кейсы ITDOS: сайты, веб-приложения, CRM, маркетплейсы, AI-интеграции — с реальными результатами.",
};

export default function PortfolioPage() {
  return (
    <>
      <Section spacing="lg" className="pt-36!">
        <Container>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            {"// портфолио · "}
            {String(portfolioProjects.length).padStart(2, "0")}
            {" кейса"}
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

      <Section spacing="none" className="border-t border-line py-20 md:py-28">
        <Container>
          <div className="flex flex-col gap-24 lg:gap-36">
            {portfolioProjects.map((project, i) => (
              <ProjectFeatureRow
                key={project.slug}
                project={project}
                index={i}
                reversed={i % 2 === 1}
              />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
