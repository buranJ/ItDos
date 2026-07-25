import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { Team } from "@/components/sections/about/Team";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "ITDOS — технологическая компания из Бишкека. Разрабатываем сайты, приложения, CRM и AI-решения с 2019 года.",
};

const values = [
  {
    title: "Результат важнее процесса",
    description:
      "Мы не продаём часы — мы продаём результат. Каждое решение оцениваем по бизнес-эффекту, не по красоте кода.",
  },
  {
    title: "Прозрачность",
    description:
      "Клиент всегда знает, что происходит. Еженедельные отчёты, доступ к задачам, честные оценки сроков и бюджета.",
  },
  {
    title: "Технологии по назначению",
    description:
      "Не гонимся за хайпом. AI, Three.js, микросервисы — только когда это реально нужно задаче.",
  },
  {
    title: "Долгосрочные отношения",
    description:
      "80% наших клиентов возвращаются с новыми проектами. Это лучший показатель качества.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section spacing="lg" className="bg-bg pt-32!">
        <Container>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
            О компании
          </p>
          <TextReveal
            as="h1"
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-tight tracking-tight text-fg max-w-4xl"
          >
            {"Мы строим цифровые\nпродукты, которые\nработают"}
          </TextReveal>
        </Container>
      </Section>

      {/* Mission */}
      <Section className="theme-light border-t border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <FadeIn>
              <p className="text-xl text-fg-secondary leading-relaxed">
                ITDOS — технологическая компания из Бишкека. С 2019 года мы помогаем бизнесу решать реальные задачи с помощью современных технологий: от корпоративных сайтов до AI-агентов и автоматизации сложных бизнес-процессов.
              </p>
              <p className="mt-6 text-xl text-fg-secondary leading-relaxed">
                Мы не просто подрядчик — мы технологический партнёр, который думает вместе с вами о росте и эффективности бизнеса.
              </p>
            </FadeIn>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "5+", label: "Лет на рынке" },
                { value: "50+", label: "Проектов" },
                { value: "100%", label: "Довольных клиентов" },
                { value: "6", label: "В команде" },
              ].map((stat) => (
                <FadeIn key={stat.label}>
                  <div className="p-6 rounded-xl bg-surface border border-line">
                    <p className="text-3xl font-semibold text-fg">{stat.value}</p>
                    <p className="text-sm text-fg-secondary mt-1">{stat.label}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section className="bg-surface border-y border-line">
        <Container>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-10">
            Ценности
          </p>
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-7 rounded-xl bg-bg border border-line">
                <h3 className="font-semibold text-fg mb-3">{v.title}</h3>
                <p className="text-sm text-fg-secondary leading-relaxed">{v.description}</p>
              </div>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      {/* Team — the human signal */}
      <Team />

      <CtaBanner />
    </>
  );
}
