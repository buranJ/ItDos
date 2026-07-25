import type { Metadata } from "next";
import { Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { reviews } from "@/data/reviews";

export const metadata: Metadata = {
  title: "Отзывы",
  description: "Что клиенты говорят о работе с ITDOS. Реальные отзывы реальных компаний.",
};

export default function ReviewsPage() {
  return (
    <>
      <Section spacing="lg" className="bg-bg pt-32!">
        <Container>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
            Отзывы
          </p>
          <TextReveal
            as="h1"
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-tight tracking-tight text-fg max-w-3xl"
          >
            {"Что говорят\nклиенты"}
          </TextReveal>
        </Container>
      </Section>

      <Section className="theme-light border-t border-line">
        <Container>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-8 rounded-xl border border-line flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-accent text-fg" />
                  ))}
                </div>

                <blockquote className="text-fg leading-relaxed flex-1">
                  «{review.text}»
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-line">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-ink text-sm font-semibold shrink-0">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-fg">{review.author}</p>
                    <p className="text-xs text-fg-muted">
                      {review.position}, {review.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
