"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Mockup } from "@/components/portfolio/mockups";
import type { MockupKind } from "@/types/portfolio";
import { cn } from "@/lib/utils";

type Step = {
  n: string;
  label: string;
  title: string;
  desc: string;
  tags: string[];
  kind: MockupKind;
  accent: string;
  url?: string;
};

const steps: Step[] = [
  {
    n: "01",
    label: "Сайты",
    title: "Лендинги и корпоративные сайты",
    desc: "Быстрые, отзывчивые и SEO-оптимизированные сайты, которые выглядят дорого и превращают посетителей в клиентов.",
    tags: ["Корпоративные сайты", "Лендинги", "Интернет-магазины"],
    kind: "iframe",
    url: "https://avangardstyle.kg/",
    accent: "#6e56ff",
  },
  {
    n: "01",
    label: "Сайты · Видео",
    title: "Лендинги и корпоративные сайты",
    desc: "Быстрые, отзывчивые и SEO-оптимизированные сайты, которые выглядят дорого и превращают посетителей в клиентов.",
    tags: ["Корпоративные сайты", "Лендинги", "Интернет-магазины"],
    kind: "showcase",
    url: "Bz8LB_lNQJA",
    accent: "#6e56ff",
  },
  {
    n: "02",
    label: "Приложения",
    title: "Мобильные приложения",
    desc: "Современные и быстрые приложения для iOS и Android, которые помогают автоматизировать процессы, улучшать клиентский опыт и масштабировать бизнес.",
    tags: ["iOS", "Android"],
    kind: "phone",
    url: "https://imbir.netlify.app/",
    accent: "#e0b341",
  },
  {
    n: "03",
    label: "CRM / ERP",
    title: "CRM и ERP-системы ",
    desc: "Автоматизируем процессы, документооборот и продажи в единой системе, заточенной под ваш бизнес.",
    tags: ["CRM", "ERP", "AIS"],
    kind: "portal",
    accent: "#2bd4c4",
  },
  // ── Шаг 04 (AI). Активен вариант «Помощник». Остальные мокапы сохранены
  //    в резерве ниже (виды и компоненты на месте — можем вернуть в будущем). ──
  {
    n: "04",
    label: "AI",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "assistant",
    accent: "#8b78ff",
  },
  /* ── Альтернативные AI-мокапы (в резерве, kind'ы определены в types/portfolio.ts) ──
  {
    n: "04",
    label: "AI · Поток",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "flow",
    accent: "#8b78ff",
  },
  {
    n: "04",
    label: "AI · Агент",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "agent",
    accent: "#8b78ff",
  },
  {
    n: "04",
    label: "AI · Нейросеть",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "neural",
    accent: "#8b78ff",
  },
  {
    n: "04",
    label: "AI · Центр",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "command",
    accent: "#8b78ff",
  },
  {
    n: "04",
    label: "AI · Всё-в-одном",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "unified",
    accent: "#8b78ff",
  },
  ──────────────────────────────────────────────────────────────────────────── */
];

export function WhatWeBuild() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drive the active step from which block is centered in the viewport.
  // CSS sticky handles the visual — no fragile ScrollTrigger pin.
  useEffect(() => {
    const els = blockRefs.current.filter((el): el is HTMLDivElement =>
      Boolean(el),
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(Number((e.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative border-t border-line">
      <Container>
        <div className="pt-24 md:pt-28">
          <Header />
        </div>

        <div className="grid lg:grid-cols-2 lg:gap-16">
          {/* Left: scrolling steps */}
          <div>
            {steps.map((step, i) => (
              <div
                key={step.n}
                data-index={i}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className="flex min-h-[68vh] flex-col justify-center gap-7 py-10 lg:min-h-screen lg:py-0"
                style={{ "--m-accent": step.accent } as React.CSSProperties}
              >
                <StepCopy step={step} active={i === active} />

                {/* Mobile inline mockup (reveals on scroll) */}
                <ClipReveal
                  className={cn(
                    "rounded-xl lg:hidden",
                    step.kind !== "phone" && "border border-line",
                  )}
                >
                  {step.kind === "phone" ? (
                    // Fixed-size phone centered in the step.
                    // w-[72vw] max-w-[260px] caps phone width on any screen.
                    // paddingBottom 216.8% of that width = correct portrait height.
                    <div className="flex w-full justify-center py-4">
                      <div
                        className="relative w-[72vw] max-w-65"
                        style={{
                          paddingBottom: "min(calc(72vw * 2.168), 563px)",
                        }}
                      >
                        <div className="absolute inset-0 pointer-events-none">
                          <Mockup
                            kind={step.kind}
                            accent={step.accent}
                            url={step.url}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-16/10">
                      <Mockup
                        kind={step.kind}
                        accent={step.accent}
                        live={step.kind === "chat"}
                        url={step.url}
                      />
                    </div>
                  )}
                </ClipReveal>
              </div>
            ))}
          </div>

          {/* Right: sticky media (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <div className="relative h-[65vh] w-full">
                {steps.map((step, i) => (
                  <div
                    key={step.n}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out",
                      i === active
                        ? "scale-100 opacity-100 blur-0"
                        : "pointer-events-none scale-95 opacity-0 blur-sm",
                    )}
                    style={{ "--m-accent": step.accent } as React.CSSProperties}
                  >
                    <Mockup
                      kind={step.kind}
                      accent={step.accent}
                      live={i === active && step.kind === "chat"}
                      url={step.url}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {/* <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          {"// что мы создаем"}
        </p> */}
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-tight tracking-tight text-fg">
          {/* Один партнёр — от сайта до
          AI-системы */}
          Наше портфолио
          <br className="hidden sm:block" /> внедренных решений
          {/* От первого лендинга до масштабных AI-систем для вашего бизнеса. */}
        </h2>
      </div>
      <p className="max-w-xs text-sm leading-relaxed text-fg-secondary">
        Полный цикл: проектирование, дизайн, разработка, тестирование и
        автоматизация.
      </p>
    </div>
  );
}

function StepCopy({ step, active }: { step: Step; active: boolean }) {
  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        active ? "opacity-100" : "lg:opacity-40",
      )}
    >
      <div className="mb-5 flex items-center gap-4">
        <span className="font-mono text-sm text-m">{step.n}</span>
        <span className="h-px w-10 bg-m" />
        <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          {step.label}
        </span>
      </div>
      <h3 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {step.title}
      </h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-fg-secondary">
        {step.desc}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {step.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-m bg-m-softer px-3 py-1 text-xs text-m"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
