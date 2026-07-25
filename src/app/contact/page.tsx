import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/sections/shared/ContactForm";

export const metadata: Metadata = {
  title: "Контакт",
  description:
    "Свяжитесь с ITDOS. Обсудим ваш проект и предложим оптимальное решение в течение часа.",
};

const contacts = [
  { label: "Email", value: "itdos@gmail.com", href: "mailto:zunusburan@gmail.com" },
  { label: "Телефон", value: "+996 999 953 838", href: "tel:+996999953838" },
  { label: "Telegram", value: "@itdos", href: "https://t.me/itdos" },
  // { label: "Адрес", value: "Бишкек, Кыргызстан", href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <Section spacing="lg" className="bg-bg pt-32!">
        <Container>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
            Контакт
          </p>
          <TextReveal
            as="h1"
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-tight tracking-tight text-fg max-w-3xl"
          >
            {"Начнём\nпроект"}
          </TextReveal>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-fg-secondary max-w-md leading-relaxed">
              Расскажите о задаче — ответим в течение часа и предложим решение.
            </p>
          </FadeIn>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
            {/* Form */}
            <FadeIn>
              <ContactForm />
            </FadeIn>

            {/* Contacts */}
            <FadeIn delay={0.2}>
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
                    Реквизиты
                  </p>
                  <div className="flex flex-col gap-5">
                    {contacts.map((c) => (
                      <div key={c.label}>
                        <p className="text-xs text-fg-muted mb-1">{c.label}</p>
                        {c.href ? (
                          <a
                            href={c.href}
                            className="text-sm font-medium text-fg hover:opacity-60 transition-opacity"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-fg">{c.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-surface border border-line">
                  <p className="text-sm font-medium text-fg mb-2">
                    Время ответа
                  </p>
                  <p className="text-sm text-fg-secondary">
                    Отвечаем в течение часа в рабочее время (Пн–Пт, 9:00–18:00 по Бишкеку). В выходные — на следующий рабочий день.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </>
  );
}
