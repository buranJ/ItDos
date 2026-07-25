"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { TextReveal } from "@/components/motion/TextReveal";
import { ChatMock } from "@/components/portfolio/mockups/ChatMock";
import { MagneticButton } from "@/components/motion/MagneticButton";

const ACCENT = "#6e56ff";

export function HeroAI() {
  return (
    <section className="relative border-t border-line bg-bg overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 lg:py-32">
          {/* Left — copy */}
          <div>
            <FadeIn>
              <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
                AI-автоматизация
              </p>
            </FadeIn>

            <TextReveal
              as="h2"
              className="text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"AI-агент, который\nработает за вас"}
            </TextReveal>

            <FadeIn delay={0.2}>
              <p className="mt-6 text-lg text-fg-secondary leading-relaxed max-w-md">
                Формирует счета, отвечает клиентам, обрабатывает заявки — пока вы
                занимаетесь бизнесом. Без найма, без пауз, без ошибок.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <MagneticButton>
                  <Link
                    href="/services/ai-integration"
                    className="inline-flex items-center gap-2 bg-accent text-accent-ink px-7 py-3.5 rounded-full text-sm font-medium hover:bg-accent-bright transition-colors"
                  >
                    Подробнее об AI
                    <ArrowRight size={16} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 border border-line text-fg px-7 py-3.5 rounded-full text-sm font-medium hover:bg-surface transition-colors"
                  >
                    Обсудить проект
                  </Link>
                </MagneticButton>
              </div>
            </FadeIn>
          </div>

          {/* Right — ChatMock */}
          <FadeIn delay={0.15}>
            <div className="relative h-[380px] sm:h-[440px] lg:h-[480px]">
              {/* ambient glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-20 blur-3xl"
                style={{ background: ACCENT }}
              />
              <ChatMock accent={ACCENT} typing className="h-full" />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
