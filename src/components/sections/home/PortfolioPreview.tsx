import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { ProjectFeatureRow } from "@/components/portfolio/ProjectFeatureRow";
import { portfolioProjects } from "@/data/portfolio";

export function PortfolioPreview() {
  const featured = portfolioProjects.slice(0, 3);

  return (
    <Section className="relative border-t border-line">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              {"// избранные работы"}
            </p>
            <TextReveal
              as="h2"
              className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"Кейсы, которые\nговорят за нас"}
            </TextReveal>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex shrink-0 items-center gap-2 self-start text-sm font-medium text-fg-secondary transition-colors hover:text-fg sm:self-auto"
          >
            Все проекты
            <ArrowUpRight
              size={16}
              className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="mt-16 flex flex-col gap-24 lg:mt-24 lg:gap-36">
          {featured.map((project, i) => (
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
  );
}
