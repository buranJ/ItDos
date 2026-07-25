import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CountUp } from "@/components/motion/CountUp";
import { FadeIn } from "@/components/motion/FadeIn";

const stats = [
  { value: 5, suffix: "+", label: "Лет на рынке", description: "Работаем с 2019 года" },
  { value: 50, suffix: "+", label: "Проектов", description: "Сайты, приложения, CRM, AI" },
  { value: 100, suffix: "%", label: "Довольных клиентов", description: "Без единой оценки ниже пяти" },
  { value: 70, suffix: "%", label: "Экономия времени", description: "Среднее после AI-автоматизации" },
];

export function Stats() {
  return (
    <Section spacing="md" className="border-y border-line">
      <Container>
        <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={i * 0.08}
              className="px-2 lg:border-l lg:border-line lg:px-10 lg:first:border-l-0 lg:first:pl-0"
            >
              <p className="font-display text-5xl font-semibold tracking-tight text-fg sm:text-6xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-sm font-medium text-fg">{stat.label}</p>
              <p className="mt-1 text-xs text-fg-muted">{stat.description}</p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
