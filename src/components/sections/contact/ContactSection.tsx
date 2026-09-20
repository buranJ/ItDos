"use client";

import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/sections/shared/ContactForm";
import {
  site,
  emailLink,
  phoneLink,
  telegramLink,
  whatsappLink,
  defaultInquiry,
} from "@/lib/site";

/**
 * Contact page: what happens after the form on the left, the form itself on
 * the right (sticky on desktop).
 */
export function ContactSection() {
  const steps = [
    { title: "Ответим", text: "Свяжемся в рабочее время и уточним детали задачи." },
    { title: "Обсудим", text: "Созвонимся или спишемся: цели, сроки, бюджет, примеры." },
    { title: "Предложим", text: "Пришлём решение, оценку и план работ. Смету зафиксируем в договоре." },
  ];
  return (
    // `theme-light` re-themes every colour token inside it, so the form,
    // the rules and the muted text are light together.
    <Section id="contact-top" spacing="lg" className="theme-light pt-32!">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-fg-muted">
              Контакты
            </p>
            <TextReveal
              as="h1"
              className="text-[clamp(2.2rem,4.5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"Расскажите\nо задаче"}
            </TextReveal>

            <FadeIn delay={0.2}>
              {/* Линия с точками вместо номеров: последовательность читается
                  сама, без «01 02 03». */}
              <ol className="mt-10 flex flex-col gap-7 border-l border-line pl-7 pt-1">
                {steps.map((step) => (
                  <li key={step.title} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[2.05rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg"
                    />
                    <span className="block text-sm font-semibold text-fg">
                      {step.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-fg-secondary">
                      {step.text}
                    </span>
                  </li>
                ))}
              </ol>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8">
                <a
                  href={phoneLink}
                  className="inline-flex items-center gap-2.5 text-sm text-fg-secondary transition-colors hover:text-fg"
                >
                  <Phone size={15} className="text-accent-text" />
                  {site.phoneDisplay}
                </a>
                <a
                  href={emailLink}
                  className="inline-flex items-center gap-2.5 text-sm text-fg-secondary transition-colors hover:text-fg"
                >
                  <Mail size={15} className="text-accent-text" />
                  {site.email}
                </a>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  <a
                    href={whatsappLink(defaultInquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-fg transition-colors hover:border-line-strong hover:bg-surface"
                  >
                    <MessageCircle size={15} className="text-[#25d366]" />
                    WhatsApp
                  </a>
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-fg transition-colors hover:border-line-strong hover:bg-surface"
                  >
                    <Send size={15} className="text-[#229ed9]" />
                    Telegram
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} className="lg:col-span-7">
            <div className="rounded-2xl border border-line bg-panel p-6 shadow-lg sm:p-8 lg:sticky lg:top-28">
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
