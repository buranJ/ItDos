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
                {/* Точка вместо номера — тот же приём, что в таймлайне на
                    главной и в шагах на странице контактов. */}
                <div className="grid grid-cols-[1.5rem_1fr] gap-x-6 gap-y-8 border-b border-line py-10 lg:grid-cols-[1.5rem_1fr_1fr_auto] lg:gap-8">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-3 w-3 rounded-full border-2 border-accent"
                  />

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
