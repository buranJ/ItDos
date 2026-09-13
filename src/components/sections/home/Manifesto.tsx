"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FadeIn } from "@/components/motion/FadeIn";

// Прошлые варианты:
//   "Мы не просто пишем код."
//   "Из идеи - в работающий продукт. Сайты, приложения, CRM и AI, которые
//    делают бизнес быстрее и прибыльнее."
/** The statement, one sentence per line. The accent is per line, not per
 *  word — «бизнес» and «продукт» appear in both, and only the second
 *  sentence is the point. */
const STATEMENT: { text: string; accent?: boolean }[] = [
  { text: "Не подгоняем бизнес под готовый продукт." },
  { text: "Делаем продукт под бизнес.", accent: true },
];
const SCOPE = "Сайты, CRM, приложения, внутренние системы и автоматизация.";

export function Manifesto() {
  const ref = useRef<HTMLHeadingElement>(null);
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
        {/* Two levels instead of one run-on block:
              · the statement — large, one sentence per line, capped at 17em
                and balanced, so the first sentence breaks after «бизнес»
                (two even lines) instead of stranding «продукт.»;
              · the scope — a quiet second tier with air above it, marked
                with the same short rule the section labels use. */}
        <h2
          ref={ref}
          className="max-w-[17em] font-display text-[clamp(2rem,5.2vw,4.25rem)] font-semibold leading-[1.06] tracking-tight"
        >
          {/* The space goes BETWEEN the word boxes, not inside them: a
              trailing space inside an inline-block is dropped once the line
              is a block box, and every word ran into the next. */}
          {STATEMENT.map((line, li) => (
            <span
              key={li}
              className={`block text-balance ${li > 0 ? "mt-[0.12em]" : ""}`}
            >
              {line.text.split(" ").map((word, wi) => (
                <Fragment key={`${li}-${wi}`}>
                  <span
                    className={`mf-word inline-block ${
                      line.accent ? "text-accent-text" : "text-fg"
                    }`}
                  >
                    {word}
                  </span>{" "}
                </Fragment>
              ))}
            </span>
          ))}
        </h2>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex items-baseline gap-4 sm:mt-14 sm:gap-5">
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 translate-y-[-0.3em] bg-accent sm:w-10"
            />
            <p className="max-w-104 text-[clamp(1.05rem,1.5vw,1.3rem)] leading-relaxed text-fg-secondary text-pretty">
              {SCOPE}
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
