import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { getProcessPhases } from "@/server/content";

export const metadata: Metadata = {
  alternates: { canonical: "/process" },
  title: "Процесс",
  description:
    "Как ITDOS ведёт проекты: от брифинга до запуска. Прозрачный процесс разработки за 6 этапов.",
};

export default async function ProcessPage() {
  const processPhases = await getProcessPhases();
  return (
    <>
      <Section spacing="lg" className="bg-bg pt-32!">
        <Container>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
            Процесс
          </p>
          <TextReveal
            as="h1"
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-tight tracking-tight text-fg max-w-3xl"
          >
            {"Как мы\nработаем"}
          </TextReveal>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-lg text-fg-secondary max-w-xl leading-relaxed">
              Прозрачный процесс от первого звонка до поддержки после запуска. Никаких сюрпризов.
            </p>
          </FadeIn>
        </Container>
      </Section>

      <Section className="theme-light border-t border-line">
        <Container>
          <div className="flex flex-col gap-0">
            {processPhases.map((phase, index) => (
              <FadeIn key={phase.number} delay={index * 0.08}>
                <div className="grid grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1fr_1fr_auto] gap-8 py-10 border-b border-line">
                  <span className="text-2xl font-semibold text-fg-faint font-mono pt-1">
                    {phase.number}
                  </span>

                  <div>
                    <h2 className="text-xl font-semibold text-fg mb-3">
                      {phase.title}
                    </h2>
                    <p className="text-fg-secondary leading-relaxed">{phase.description}</p>
                  </div>

                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
                      Что делаем
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {phase.activities.map((a) => (
                        <li key={a} className="text-sm text-fg-secondary">
                          — {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="hidden lg:flex items-start">
                    <span className="text-sm text-fg-muted border border-line rounded-full px-4 py-1.5 whitespace-nowrap">
                      {phase.duration}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
