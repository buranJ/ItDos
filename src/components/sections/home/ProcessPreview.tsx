import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { getProcessPhases } from "@/server/content";

export async function ProcessPreview() {
  const processPhases = await getProcessPhases();
  return (
    <Section className="theme-light border-t border-line">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              Процесс
            </p> */}
            <TextReveal
              as="h2"
              className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"Как мы\nработаем"}
            </TextReveal>
          </div>
          <Link
            href="/process"
            className="group inline-flex shrink-0 items-center gap-2 self-start text-sm font-medium text-fg-secondary transition-colors hover:text-fg sm:self-auto"
          >
            Подробнее
            <ArrowUpRight
              size={16}
              className="text-accent-text transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <StaggerGroup className="relative mt-16">
          {/* timeline rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px bg-linear-to-b from-accent/70 via-line to-transparent"
          />

          {processPhases.map((phase) => (
            <div
              key={phase.number}
              className="group relative grid grid-cols-[auto_1fr] gap-6 pb-10 last:pb-0"
            >
              {/* node */}
              <div className="relative z-10 mt-1.5 h-4 w-4 rounded-full border-2 border-accent bg-bg transition-colors duration-300 group-hover:bg-accent" />

              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-xs text-accent-text">{phase.number}</span>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                    {phase.title}
                  </h3>
                  {/* Was sm:block-only, so the one thing every prospect wants
                      to know — how long each stage takes — was invisible on
                      phones, where most of the traffic is. */}
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted sm:ml-auto">
                    {phase.duration}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-secondary">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
