"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

// Прошлые варианты:
//   "Мы не просто пишем код."
//   "Из идеи - в работающий продукт. Сайты, приложения, CRM и AI, которые
//    делают бизнес быстрее и прибыльнее."
/** Lines of phrases. The accent is per phrase, not per word — «бизнес» and
 *  «продукт» appear in both sentences, and only the second pair is the
 *  point. */
const LINES: { text: string; accent?: boolean }[][] = [
  [
    { text: "Не подгоняем бизнес под готовый продукт." },
    { text: "Делаем продукт под бизнес.", accent: true },
  ],
  [{ text: "Сайты, CRM, приложения, внутренние системы и автоматизация." }],
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".mf-word"),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 62%",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section spacing="lg" className="theme-light border-t border-line">
      {/* Default container so the left edge lines up with every other
          section; the old `size="lg"` pushed this block ~64px in. The
          measure stays the same via max-w on the text itself. */}
      <Container>
        {/* <p className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Манифест
        </p> */}
        <div
          ref={ref}
          className="max-w-264 font-display text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium leading-[1.18] tracking-tight"
        >
          {/* The space goes BETWEEN the word boxes, not inside them: a
              trailing space inside an inline-block is dropped once the line
              is a block box, and every word ran into the next. */}
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.map((phrase, pi) =>
                phrase.text.split(" ").map((word, wi) => (
                  <Fragment key={`${li}-${pi}-${wi}`}>
                    <span
                      className={`mf-word inline-block ${
                        phrase.accent ? "text-accent-text" : "text-fg"
                      }`}
                    >
                      {word}
                    </span>{" "}
                  </Fragment>
                )),
              )}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  );
}
