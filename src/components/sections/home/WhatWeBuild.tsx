"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Mockup } from "@/components/portfolio/mockups";
import type { MockupKind } from "@/types/portfolio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
  /** Domain shown in the mock browser bar (kind="laptop-video"). */
  address?: string;
};

type WebsiteProject = {
  id: string;
  label: string;
  title: string;
  video: string;
  /** The live site's domain — shown as the "visit" link, and the video title. */
  address: string;
  accent: string;
  /** Text colour on a fill of `accent` (the active tag), picked for contrast. */
  ink: string;
  mobileScreens?: readonly {
    src?: string;
    width: number;
    height: number;
  }[];
};

const websiteProjects: WebsiteProject[] = [
  {
    id: "corporate",
    label: "Корпоративные сайты",
    title: "Avangard Style",
    video: "o1USBxQkmvU",
    address: "avangardstyle.kg",
    // Accents tint the tags, arrows and link on the dark canvas, so each is
    // its brand colour lifted until it reads on #08080a. Both brands are
    // blue, so they are kept apart by hue and weight: Avangard's bright
    // azure (its logo's #0090FC) against Toolor's deeper royal blue.
    accent: "#0090fc",
    ink: "#0a0a0a",
    mobileScreens: [
      { src: "/project/avangard-mob1.png", width: 430, height: 932 },
      { src: "/project/avangard-mob2.png", width: 370, height: 772 },
      { src: "/project/avangard-mob3.png", width: 370, height: 715 },
    ],
  },
  {
    id: "store",
    label: "Интернет-магазины",
    title: "Toolor",
    video: "nNYSL7SbYsM",
    address: "toolor.store",
    // Toolor's logo #0033a1, lifted — and dark enough to want white text.
    accent: "#3d63f5",
    ink: "#ffffff",
    // Hero in the middle of the fan, the purchase path fanning out around it.
    mobileScreens: [
      { src: "/pr/3.jpg", width: 1319, height: 2371 },
      { src: "/pr/5.jpg", width: 1319, height: 2336 },
      { src: "/pr/4.jpg", width: 1316, height: 2155 },
      { src: "/pr/2.jpg", width: 1269, height: 2560 },
      { src: "/pr/1.jpg", width: 1272, height: 2560 },
    ],
  },
  {
    id: "landing",
    label: "Лендинги",
    title: "Bilmont",
    video: "SO5efpX3Xw0",
    address: "bilmont.school",
    accent: "#9cba6e",
    ink: "#0a0a0a",
    mobileScreens: [
      { src: "/pr/8.jpg", width: 1305, height: 2560 },
      { src: "/pr/6.jpg", width: 1316, height: 2553 },
      { src: "/pr/10.jpg", width: 1316, height: 2560 },
      { src: "/pr/9.jpg", width: 1290, height: 2560 },
      { src: "/pr/7.jpg", width: 1280, height: 2560 },
    ],
  },
];

const steps: Step[] = [
  {
    n: "01",
    label: "Сайты",
    title: "Лендинги, интернет-магазины и корпоративные сайты",
    desc: "Быстрые, отзывчивые и SEO-оптимизированные сайты, которые выглядят дорого и превращают посетителей в клиентов.",
    tags: ["Корпоративные сайты", "Интернет-магазины", "Лендинги"],
    // Video in a laptop instead of a live <iframe> of the client's site: the
    // embed pulled the whole site (plus its analytics) into this page.
    kind: "laptop-video",
    url: "o1USBxQkmvU",
    address: "avangardstyle.kg",
    accent: "#0090fc",
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
  // ── Шаг 04 (AI). Активен светлый редакционный вариант.
  //    Остальные варианты сохранены в комментариях для быстрого возврата. ──
  /* ── Варианты 04 и 04A (в резерве) ──
  {
    n: "04",
    label: "AI",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "assistant",
    accent: "#8b78ff",
  },
  {
    n: "04A",
    label: "AI · Помощник 2.0",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Чат-боты", "RAG-системы"],
    kind: "assistant-enhanced",
    accent: "#8b78ff",
  },
  */
  {
    n: "04",
    label: "AI-автоматизация",
    title: "AI-агенты и автоматизация",
    desc: "AI-помощник отвечает клиентам, назначает встречи, отправляет счета и обновляет CRM — 24/7, без ручной рутины.",
    tags: ["Ответы клиентам", "Встречи и счета", "CRM-интеграция"],
    kind: "assistant-editorial",
    accent: "#f0eee9",
  },
  /* ── Варианты 04B и 04C (в резерве) ──
  {
    n: "04B",
    label: "AI · Новый концепт",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Интеграции", "Автоматизация"],
    kind: "automation",
    accent: "#8b78ff",
  },
  {
    n: "04C",
    label: "AI · Сценарий",
    title: "AI-агенты и автоматизация",
    desc: "AI-агенты, чат-боты и умная автоматизация, которые работают за вас 24/7 и экономят часы рутины.",
    tags: ["AI-агенты", "Продажи", "Автоматизация"],
    kind: "journey",
    accent: "#8b78ff",
  },
  */
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
  const [websiteProjectIndex, setWebsiteProjectIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  // The mobile and the sticky desktop column used to BOTH sit in the DOM,
  // hidden from each other only by CSS — so every live-site iframe and the
  // video player were fetched twice on every visit. Mount one or the other.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const websiteProject = websiteProjects[websiteProjectIndex];

  const showPreviousWebsite = () => {
    setWebsiteProjectIndex((current) =>
      (current - 1 + websiteProjects.length) % websiteProjects.length,
    );
  };

  const showNextWebsite = () => {
    setWebsiteProjectIndex((current) =>
      (current + 1) % websiteProjects.length,
    );
  };

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

  // `overflow-x-clip` contains the laptop mock: its stage is deliberately
  // 175% of the column so the device reads larger than its slot, and that
  // overhang made the whole page scroll 58px sideways on desktop.
  // `clip` rather than `hidden` on purpose — paired with `overflow-y: visible`
  // it does not become a scroll container, so the sticky media column below
  // keeps working.
  return (
    <section className="relative overflow-x-clip border-t border-line">
      <Container>
        <div className="pt-24 md:pt-28">
          <Header />
        </div>

        <div className="grid lg:grid-cols-2 lg:gap-16">
          {/* Left: scrolling steps.
              `min-w-0`: a grid item defaults to min-width:auto, so it refuses
              to shrink below its content's intrinsic width. The device mockups
              are intrinsically ~375px wide, which pushed this column past the
              container on 320px phones. */}
          <div className="min-w-0">
            {steps.map((step, i) => {
              const isWebsiteStep = i === 0;
              const visualAccent = isWebsiteStep
                ? websiteProject.accent
                : step.accent;
              const visualKey = isWebsiteStep
                ? websiteProject.id
                : step.kind;

              return (
                <div
                  key={step.n}
                  data-index={i}
                  ref={(el) => {
                    blockRefs.current[i] = el;
                  }}
                  className="flex min-h-[68vh] flex-col justify-center gap-7 py-10 lg:min-h-screen lg:py-0"
                  style={{ "--m-accent": visualAccent } as React.CSSProperties}
                >
                  <StepCopy
                    step={step}
                    active={i === active}
                    websiteSlider={
                      isWebsiteStep
                        ? {
                            activeIndex: websiteProjectIndex,
                            onSelect: setWebsiteProjectIndex,
                            onPrevious: showPreviousWebsite,
                            onNext: showNextWebsite,
                          }
                        : undefined
                    }
                  />

                  {/* Mobile inline mockup (reveals on scroll) */}
                  {!isDesktop && (
                    <ClipReveal
                      className={cn(
                        "rounded-xl lg:hidden",
                        step.kind === "phone" &&
                          "-mr-5 rounded-r-none sm:-mr-8",
                        step.kind === "laptop-video" &&
                          "-mx-5 rounded-none sm:-mx-8",
                        step.kind !== "phone" &&
                          step.kind !== "laptop-video" &&
                          step.kind !== "assistant-enhanced" &&
                          step.kind !== "assistant-editorial" &&
                          step.kind !== "automation" &&
                          step.kind !== "journey" &&
                          "border border-line",
                      )}
                    >
                      <div
                        className={cn(
                          "relative w-full",
                          step.kind === "phone" && "aspect-[4/7]",
                          step.kind !== "phone" &&
                            (step.kind === "laptop-video" ||
                            step.kind === "assistant-enhanced" ||
                            step.kind === "assistant-editorial" ||
                            step.kind === "automation" ||
                            step.kind === "journey"
                              ? "aspect-square"
                              : "aspect-16/10"),
                        )}
                      >
                        <Mockup
                          key={visualKey}
                          kind={step.kind}
                          accent={visualAccent}
                          live={step.kind === "chat"}
                          url={
                            isWebsiteStep
                              ? websiteProject.video
                              : step.url
                          }
                          address={
                            isWebsiteStep
                              ? websiteProject.address
                              : step.address
                          }
                          projectTitle={
                            isWebsiteStep ? websiteProject.title : undefined
                          }
                          mobileScreens={
                            isWebsiteStep
                              ? websiteProject.mobileScreens
                              : undefined
                          }
                        />
                      </div>
                    </ClipReveal>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: sticky media (desktop) */}
          {isDesktop && (
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <div className="relative h-[65vh] w-full">
                {steps.map((step, i) => {
                  const isWebsiteStep = i === 0;
                  const visualAccent = isWebsiteStep
                    ? websiteProject.accent
                    : step.accent;

                  // `inert`, not just `pointer-events-none`: some mocks set
                  // `pointer-events: auto` on their own panels, which beats
                  // the inherited value — the invisible AI mock stacked on
                  // top swallowed clicks meant for the website phones.
                  return (
                    <div
                    key={step.n}
                    inert={i !== active}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out",
                      i === active
                        ? "scale-100 opacity-100 blur-0"
                        : "pointer-events-none scale-95 opacity-0 blur-sm",
                    )}
                    style={{ "--m-accent": visualAccent } as React.CSSProperties}
                  >
                    <Mockup
                      key={isWebsiteStep ? websiteProject.id : step.kind}
                      kind={step.kind}
                      accent={visualAccent}
                      live={i === active && step.kind === "chat"}
                      url={isWebsiteStep ? websiteProject.video : step.url}
                      address={
                        isWebsiteStep ? websiteProject.address : step.address
                      }
                      projectTitle={
                        isWebsiteStep ? websiteProject.title : undefined
                      }
                      mobileScreens={
                        isWebsiteStep
                          ? websiteProject.mobileScreens
                          : undefined
                      }
                    />
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}
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
          Что мы создаём
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

type WebsiteSliderControls = {
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

function StepCopy({
  step,
  active,
  websiteSlider,
}: {
  step: Step;
  active: boolean;
  websiteSlider?: WebsiteSliderControls;
}) {
  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        active ? "opacity-100" : "lg:opacity-40",
      )}
    >
      <div className="mb-5 flex items-center gap-4">
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
        {step.tags.map((t, index) =>
          websiteSlider ? (
            // Active = filled with the project colour, the rest = neutral
            // outlines. It used to be two shades of the same tint, and on
            // the dark canvas you couldn't tell which project was showing.
            <button
              key={t}
              type="button"
              onClick={() => websiteSlider.onSelect(index)}
              aria-pressed={websiteSlider.activeIndex === index}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-all duration-300",
                websiteSlider.activeIndex === index
                  ? "border-transparent bg-m font-medium shadow-[0_0_22px_color-mix(in_srgb,var(--m-accent)_35%,transparent)]"
                  : "border-line text-fg-secondary hover:border-m hover:text-m",
              )}
              style={
                websiteSlider.activeIndex === index
                  ? { color: websiteProjects[index].ink }
                  : undefined
              }
            >
              {t}
            </button>
          ) : (
            <span
              key={t}
              className="rounded-full border border-m bg-m-softer px-3 py-1 text-xs text-m"
            >
              {t}
            </span>
          ),
        )}
      </div>

      {websiteSlider && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={websiteSlider.onPrevious}
            aria-label="Предыдущий проект"
            className="grid h-9 w-9 place-items-center rounded-full border border-m/50 text-m transition-all duration-300 hover:border-m hover:bg-m-soft hover:-translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m"
          >
            <ArrowLeft size={15} />
          </button>
          {/* The project on screen, between the arrows, as a way to go and
              see it — the tags name the category, this names (and opens) the
              real site. Fixed width (the longest domain) so the «next» arrow
              doesn't jump under the pointer when the name changes. */}
          <a
            key={websiteSlider.activeIndex}
            href={`https://${websiteProjects[websiteSlider.activeIndex].address}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Открыть сайт ${websiteProjects[websiteSlider.activeIndex].address} в новой вкладке`}
            data-cursor="link"
            className="group/site inline-flex min-w-38 animate-[m-rise-in_400ms_ease-out] items-center justify-center gap-1.5 px-2 text-sm font-medium text-fg transition-colors duration-300 hover:text-m"
          >
            <span className="border-b border-m/40 pb-0.5 transition-colors duration-300 group-hover/site:border-m">
              {websiteProjects[websiteSlider.activeIndex].address}
            </span>
            <ArrowUpRight
              size={15}
              className="shrink-0 text-m transition-transform duration-300 group-hover/site:-translate-y-0.5 group-hover/site:translate-x-0.5"
            />
          </a>
          <button
            type="button"
            onClick={websiteSlider.onNext}
            aria-label="Следующий проект"
            className="grid h-9 w-9 place-items-center rounded-full border border-m/50 text-m transition-all duration-300 hover:border-m hover:bg-m-soft hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
