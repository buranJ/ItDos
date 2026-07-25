"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { Container } from "@/components/layout/Container";

// const LEAD = "Мы не просто пишем код.";
const LEAD = 'Из идеи -'
const BODY =
  "в работающий продукт. Сайты, приложения, CRM и AI, которые делают бизнес быстрее и прибыльнее.";
  // const BODY2 = "Мы создаем продукты, которые удовлетворяют потребности людей, которые нуждаются в продуктах.";
const ACCENT_WORDS = new Set(["идеи", "продукт."]);

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
    <section className="theme-light border-t border-line py-28 md:py-40">
      <Container size="lg">
        {/* <p className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          {"// манифест"}
        </p> */}
        <div
          ref={ref}
          className="font-display text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium leading-[1.18] tracking-tight"
        >
          {[LEAD, BODY].map((sentence, si) => (
            <span key={si}>
              {sentence.split(" ").map((word, i) => (
                <span
                  key={`${si}-${i}`}
                  className={`mf-word inline-block ${
                    ACCENT_WORDS.has(word) ? "text-accent" : "text-fg"
                  }`}
                >
                  {word}
                  {" "}
                </span>
              ))}{" "}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
