import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { faq } from "@/data/faq";

export function Faq() {
  return (
    <Section className="border-t border-line">
      <Container size="lg">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          {"// вопросы"}
        </p>
        <TextReveal
          as="h2"
          className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
        >
          {"Частые вопросы"}
        </TextReveal>

        <div className="mt-12 border-t border-line">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary
                data-cursor="link"
                className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden"
              >
                <span className="font-display text-lg font-medium text-fg sm:text-xl">
                  {item.q}
                </span>
                <Plus
                  size={20}
                  className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-fg-secondary">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-sm text-fg-muted">
          Не нашли ответ?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Напишите — ответим в течение часа →
          </Link>
        </p>
      </Container>
    </Section>
  );
}
