import Link from "next/link";
import { ArrowRight, Bot, Sparkles, Zap, MessageSquare, Brain, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { CountUp } from "@/components/motion/CountUp";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ChatMock } from "@/components/portfolio/mockups";

const capabilities = [
  { icon: Bot, label: "AI-агенты" },
  { icon: Sparkles, label: "ChatGPT и Claude" },
  { icon: Zap, label: "Автоматизация процессов" },
  { icon: MessageSquare, label: "Умные боты" },
  { icon: Brain, label: "RAG на ваших данных" },
  { icon: Clock, label: "Работает 24/7" },
];

export function AiSection() {
  return (
    <Section className="relative overflow-hidden border-t border-line">
      {/* accent bloom — the peak */}
      <div
        aria-hidden="true"
        className="accent-glow pointer-events-none absolute -top-24 right-1/4 h-176 w-176 opacity-40"
      />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left */}
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-accent-text">
              AI и автоматизация
            </p>

            <TextReveal
              as="h2"
              className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"AI, который\nработает\nвместо вас"}
            </TextReveal>

            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-fg-secondary">
                Пока конкуренты тратят часы на рутину — ваши AI-агенты работают
                круглосуточно. Мы строим системы, которые экономят время и деньги.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-10 flex items-end gap-5 border-t border-line pt-8">
                <p className="font-display text-6xl font-semibold tracking-tight text-fg sm:text-7xl">
                  <CountUp value={70} suffix="%" />
                </p>
                <p className="mb-2 max-w-[14rem] text-sm text-fg-muted">
                  среднее сокращение ручного труда после внедрения AI
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                {capabilities.map((c) => (
                  <div key={c.label} className="flex items-center gap-2.5">
                    <c.icon size={15} className="shrink-0 text-accent-text" />
                    <span className="text-sm text-fg-secondary">{c.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <MagneticButton className="mt-10">
                <Link
                  href="/services/ai-automation"
                  data-cursor="button"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-ink"
                >
                  Узнать об AI-услугах
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>
            </FadeIn>
          </div>

          {/* Right: live agent */}
          <FadeIn delay={0.2} y={40}>
            <div className="relative mx-auto w-full max-w-md">
              <div
                aria-hidden="true"
                className="accent-glow absolute inset-0 -z-10 scale-110 opacity-50"
              />
              <div className="m-float aspect-[4/5]">
                <ChatMock accent="#8b78ff" typing />
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
