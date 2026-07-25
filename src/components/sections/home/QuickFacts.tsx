import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { TextReveal } from "@/components/motion/TextReveal";

const facts = [
  { label: "Сколько занимает разработка сайта", value: "от 7 дней" },
  { label: "Сколько стоит сайт", value: "от 300 $" },
];

export function QuickFacts() {
  return (
    <Section className="border-t border-line">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <FadeIn>
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
              Коротко о главном
            </p>
            <TextReveal
              as="h2"
              className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"Прозрачные\nусловия"}
            </TextReveal>
            <p className="mt-6 text-lg text-fg-secondary leading-relaxed max-w-sm">
              Сроки и стоимость — до старта. Никаких сюрпризов после подписания.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl border border-line bg-surface overflow-hidden">
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-8 ${
                    i < facts.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <p className="text-sm text-fg-secondary max-w-[14rem] leading-relaxed">
                    {f.label}
                  </p>
                  <p className="text-3xl font-semibold text-fg tracking-tight shrink-0">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
