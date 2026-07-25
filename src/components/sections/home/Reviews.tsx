"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { reviews } from "@/data/reviews";
import { cn } from "@/lib/utils";

export function Reviews() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  const next = () => setCurrent((c) => (c + 1) % reviews.length);

  const review = reviews[current];

  return (
    <Section className="theme-light relative overflow-hidden border-t border-line">
      <Container size="lg" className="relative">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              {"// отзывы"}
            </p>
            <TextReveal
              as="h2"
              className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"Что говорят\nклиенты"}
            </TextReveal>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <button
              onClick={prev}
              aria-label="Предыдущий отзыв"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-all duration-200 hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Следующий отзыв"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-all duration-200 hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <FadeIn key={current}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <span className="font-display text-7xl leading-none text-accent">“</span>
              <blockquote className="-mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-fg sm:text-3xl lg:text-4xl">
                {review.text}
              </blockquote>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-base font-semibold text-accent-ink">
                  {review.author[0]}
                </div>
                <div>
                  <p className="font-medium text-fg">{review.author}</p>
                  <p className="text-sm text-fg-muted">
                    {review.position}, {review.company}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 lg:flex-col lg:items-end">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Отзыв ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === current ? "h-1.5 w-7 bg-accent lg:h-7 lg:w-1.5" : "h-1.5 w-1.5 bg-fg-faint"
                  )}
                />
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
