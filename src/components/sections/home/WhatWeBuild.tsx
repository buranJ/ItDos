"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useLenis } from "@/components/layout/LenisProvider";
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
  /** Several projects behind one step: its tags become a slider. */
  projects?: readonly ShowcaseProject[];
};

type ShowcaseProject = {
  id: string;
  label: string;
  title: string;
  /** YouTube id; empty → the mockup's placeholder UI. */
  video: string;
  /** Text in the mockup's address bar / laptop label. */
  address?: string;
  /** Public domain, if any — shown between the arrows as a "visit" link.
   *  Internal systems have none, and show their name instead. */
  site?: string;
  /** Crop for a recording that isn't a clean 16:9 capture (browser-video). */
  videoCrop?: { scale: number; top: number };
  accent: string;
  /** Text colour on a fill of `accent` (the active tag), picked for contrast. */
  ink: string;
  mobileScreens?: readonly {
    src?: string;
    width: number;
    height: number;
  }[];
};

const websiteProjects: ShowcaseProject[] = [
  {
    id: "corporate",
    label: "Корпоративные сайты",
    title: "Avangard Style",
    video: "o1USBxQkmvU",
    address: "avangardstyle.kg",
    site: "avangardstyle.kg",
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
    site: "toolor.store",
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
    site: "bilmont.school",
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

// CRM / ERP work: internal systems — no public site, no phone version, so
// they play in a browser window and the slider names them instead of
// linking out. The last two are placeholders until their recordings exist.
const systemProjects: ShowcaseProject[] = [
  {
    id: "vodokanal",
    label: "AIS",
    title: "Бишкек суу Водоканал",
    video: "z5q2Siv12X0",
    // The recording is ~16:10 and includes the recorder's own Chrome tab
    // and address bar: scaled 1.21× and lifted 19.6%, the window shows only
    // the app — no pillarbox bars, no browser-inside-a-browser.
    videoCrop: { scale: 1.21, top: 19.6 },
    accent: "#2bd4c4",
    ink: "#0a0a0a",
  },
  {
    id: "crm",
    label: "CRM",
    title: "CRM-система",
    video: "",
    accent: "#7aa2ff",
    ink: "#0a0a0a",
  },
  {
    id: "erp",
    label: "ERP",
    title: "ERP-система",
    video: "",
    accent: "#ff8a5b",
    ink: "#0a0a0a",
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
    projects: websiteProjects,
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
    // Tags map to `systemProjects` by position — AIS first (Водоканал).
    tags: ["AIS", "CRM", "ERP"],
    kind: "browser-video",
    accent: "#2bd4c4",
    projects: systemProjects,
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
  // Which project each slider step is showing, keyed by step number.
  const [projectIndexByStep, setProjectIndexByStep] = useState<
    Record<string, number>
  >({});
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  // The mobile and the sticky desktop column used to BOTH sit in the DOM,
  // hidden from each other only by CSS — so every live-site iframe and the
  // video player were fetched twice on every visit. Mount one or the other.
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const projectOf = (step: Step) =>
    step.projects?.[projectIndexByStep[step.n] ?? 0];

  const sliderFor = (step: Step): SliderState | undefined => {
    const projects = step.projects;
    if (!projects?.length) return undefined;
    const n = projects.length;
    const activeIndex = projectIndexByStep[step.n] ?? 0;
    const select = (index: number) =>
      setProjectIndexByStep((current) => ({ ...current, [step.n]: index }));
    return {
      projects,
      activeIndex,
      onSelect: select,
      onPrevious: () => select((activeIndex - 1 + n) % n),
      onNext: () => select((activeIndex + 1) % n),
    };
  };

  // Horizontal swipe on an inline (phone/tablet) mockup changes project.
  // `pan-y` keeps vertical scrolling native while handing horizontal
  // gestures to us; a mostly-vertical drag or a tap (e.g. opening a phone
  // screenshot) is ignored.
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swipeFor = (slider: SliderState) => ({
    style: { touchAction: "pan-y" } as React.CSSProperties,
    onPointerDown: (event: React.PointerEvent) => {
      swipeStart.current = { x: event.clientX, y: event.clientY };
    },
    onPointerUp: (event: React.PointerEvent) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) slider.onNext();
      else slider.onPrevious();
    },
    onPointerCancel: () => {
      swipeStart.current = null;
    },
  });

  // ── Step paging (desktop) ──
  // Free scrolling could leave the page between two steps: last step's copy
  // dimmed, the sticky device mid-swap. Here one wheel/trackpad gesture
  // glides to the next (or previous) step and the page never rests between
  // them. It acts only between the first and the last step: the way in and
  // out is ordinary scrolling, and scrolling up from the first or down from
  // the last carries on as normal, so the section never traps you. Lenis owns the scroll, so this is desktop-only — touch keeps
  // native scrolling (Lenis is off there, and `lenis` is null).
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis || !isDesktop) return;

    const DURATION = 1.15;
    const QUIET_MS = 180;
    // Upper bound on that wait. Without it, a steady wheel (a free-spinning
    // mouse wheel, or just scrolling on without pausing) never goes quiet,
    // every event was swallowed, and the section froze.
    const MAX_HOLD_MS = 350;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Scroll positions that centre each step block in the viewport.
    const points = () =>
      blockRefs.current
        .filter((el): el is HTMLDivElement => Boolean(el))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return Math.round(
            window.scrollY + r.top + r.height / 2 - window.innerHeight / 2,
          );
        });

    let animating = false;
    // After a glide, a trackpad keeps emitting inertia for a moment; wait for
    // a short silence (at most MAX_HOLD_MS) so one swipe can't page twice.
    let waitForQuiet = false;
    let glideEndedAt = 0;
    let lastWheel = 0;
    let settleTimer = 0;

    const glide = (y: number) => {
      animating = true;
      lenis.scrollTo(y, {
        duration: DURATION,
        easing: easeInOutCubic,
        lock: true,
        onComplete: () => {
          animating = false;
          waitForQuiet = true;
          glideEndedAt = performance.now();
        },
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // pinch-zoom
      const now = performance.now();
      const sinceLast = now - lastWheel;
      lastWheel = now;

      const pts = points();
      if (!pts.length) return;
      const first = pts[0];
      const last = pts[pts.length - 1];
      const y = lenis.scroll;
      // Only inside the projects block — between the first and the last
      // step. Reaching out to catch the page on its way in (it used to grab
      // from 60% of a screen away, over the manifesto) felt like the site
      // jerking; outside the block, scrolling is left alone.
      if (y < first - 2 || y > last + 2) return;

      const swallow = () => {
        event.preventDefault();
        event.stopImmediatePropagation();
      };
      if (animating) return swallow();
      if (waitForQuiet) {
        if (sinceLast < QUIET_MS && now - glideEndedAt < MAX_HOLD_MS) {
          return swallow();
        }
        waitForQuiet = false;
      }
      if (Math.abs(event.deltaY) < 2) return;

      const target =
        event.deltaY > 0
          ? pts.find((p) => p > y + 4)
          : [...pts].reverse().find((p) => p < y - 4);
      // Past the last step going down, or before the first going up.
      if (target === undefined) return;
      swallow();
      glide(target);
    };

    // Scrollbar drags and keyboard scrolling bypass the wheel: if they stop
    // between two steps, ease to the nearest one.
    const offScroll = lenis.on("scroll", () => {
      if (animating) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        const pts = points();
        if (pts.length < 2) return;
        const y = lenis.scroll;
        if (y <= pts[0] || y >= pts[pts.length - 1]) return;
        const nearest = pts.reduce((a, b) =>
          Math.abs(b - y) < Math.abs(a - y) ? b : a,
        );
        if (Math.abs(nearest - y) > 6) glide(nearest);
      }, 220);
    });

    // Capture on window: runs before Lenis' own wheel listener, so a
    // swallowed event never reaches it.
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      offScroll();
      window.clearTimeout(settleTimer);
    };
  }, [lenis, isDesktop]);

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
        {/* Below lg the title leads the section on its own. On desktop it
            moves into the first step (below): each step is a screen tall
            with its copy centred, so a standalone title sat half a screen
            above the first project, with nothing in between. */}
        <div className="pt-24 md:pt-28 lg:hidden">
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
              const project = projectOf(step);
              const slider = sliderFor(step);
              const visualAccent = project?.accent ?? step.accent;
              const visualKey = project ? `${step.n}-${project.id}` : step.kind;

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
                  {i === 0 && (
                    <div className="hidden lg:mb-5 lg:block">
                      <Header />
                    </div>
                  )}
                  <StepCopy
                    step={step}
                    active={i === active}
                    slider={slider}
                  />

                  {/* Mobile inline mockup (reveals on scroll) */}
                  {!isDesktop && (
                    // Swipe the mockup to change project (slider steps).
                    <div {...(slider ? swipeFor(slider) : {})}>
                    <ClipReveal
                      className={cn(
                        "rounded-xl lg:hidden",
                        step.kind === "phone" &&
                          "-mr-5 rounded-r-none sm:-mr-8",
                        step.kind === "laptop-video" &&
                          "-mx-5 rounded-none sm:-mx-8",
                        step.kind !== "phone" &&
                          step.kind !== "laptop-video" &&
                          step.kind !== "browser-video" &&
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
                          step.kind === "phone" && "aspect-4/7",
                          // Tab strip + toolbar over a 16:9 viewport.
                          step.kind === "browser-video" && "aspect-9/7",
                          step.kind !== "phone" &&
                            step.kind !== "browser-video" &&
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
                          url={project ? project.video : step.url}
                          address={project ? project.address : step.address}
                          projectTitle={project?.title}
                          mobileScreens={project?.mobileScreens}
                          videoCrop={project?.videoCrop}
                        />
                      </div>
                    </ClipReveal>
                    </div>
                  )}

                  {/* Below lg the project controls sit under the mockup,
                      centred on it — right next to what they change. */}
                  {!isDesktop && slider && (
                    <SliderControls
                      controls={slider}
                      className="-mt-2 justify-center lg:hidden"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: sticky media (desktop) */}
          {isDesktop && (
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              {/* 74vh (was 65): room for the devices to read at laptop size. */}
              <div className="relative h-[74vh] w-full">
                {steps.map((step, i) => {
                  const project = projectOf(step);
                  const visualAccent = project?.accent ?? step.accent;

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
                      key={project ? `${step.n}-${project.id}` : step.kind}
                      kind={step.kind}
                      accent={visualAccent}
                      live={i === active && step.kind === "chat"}
                      url={project ? project.video : step.url}
                      address={project ? project.address : step.address}
                      projectTitle={project?.title}
                      mobileScreens={project?.mobileScreens}
                      videoCrop={project?.videoCrop}
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
  // One line: a short section title alone, left-aligned with the grid. The
  // "Полный цикл…" aside is gone — it competed with the title for a job
  // the steps below already do.
  return (
    <div>
      {/* <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
        Что мы создаём
      </p> */}
      <h2 className="text-balance font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-tight tracking-tight text-fg">
        Наши проекты
      </h2>
    </div>
  );
}

type SliderState = {
  projects: readonly ShowcaseProject[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

function StepCopy({
  step,
  active,
  slider,
}: {
  step: Step;
  active: boolean;
  slider?: SliderState;
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
          slider ? (
            // Active = filled with the project colour, the rest = neutral
            // outlines. It used to be two shades of the same tint, and on
            // the dark canvas you couldn't tell which project was showing.
            <button
              key={t}
              type="button"
              onClick={() => slider.onSelect(index)}
              aria-pressed={slider.activeIndex === index}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-all duration-300",
                slider.activeIndex === index
                  ? "border-transparent bg-m font-medium shadow-[0_0_22px_color-mix(in_srgb,var(--m-accent)_35%,transparent)]"
                  : "border-line text-fg-secondary hover:border-m hover:text-m",
              )}
              style={
                slider.activeIndex === index
                  ? { color: slider.projects[index]?.ink }
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

      {/* Desktop: under the tags. Below lg the same controls sit under the
          laptop instead (see WhatWeBuild), next to the thing they change. */}
      {slider && (
        <SliderControls controls={slider} className="mt-4 hidden lg:flex" />
      )}
    </div>
  );
}

/** Prev / project / next. The middle names the project on screen — a
 *  "visit" link when it has a public site, its name when it doesn't. */
function SliderControls({
  controls,
  className,
}: {
  controls: SliderState;
  className?: string;
}) {
  const project = controls.projects[controls.activeIndex];
  // Fixed width so the «next» arrow doesn't jump under the pointer when
  // the name changes length.
  const middle =
    "inline-flex min-w-44 animate-[m-rise-in_400ms_ease-out] items-center justify-center gap-1.5 px-2 text-sm font-medium text-fg";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={controls.onPrevious}
        aria-label="Предыдущий проект"
        className="grid h-9 w-9 place-items-center rounded-full border border-m/50 text-m transition-all duration-300 hover:border-m hover:bg-m-soft hover:-translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m"
      >
        <ArrowLeft size={15} />
      </button>
      {project?.site ? (
        <a
          key={controls.activeIndex}
          href={`https://${project.site}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Открыть сайт ${project.site} в новой вкладке`}
          data-cursor="link"
          className={cn(middle, "group/site transition-colors duration-300 hover:text-m")}
        >
          <span className="border-b border-m/40 pb-0.5 transition-colors duration-300 group-hover/site:border-m">
            {project.site}
          </span>
          <ArrowUpRight
            size={15}
            className="shrink-0 text-m transition-transform duration-300 group-hover/site:-translate-y-0.5 group-hover/site:translate-x-0.5"
          />
        </a>
      ) : (
        <span key={controls.activeIndex} aria-live="polite" className={middle}>
          {project?.title}
        </span>
      )}
      <button
        type="button"
        onClick={controls.onNext}
        aria-label="Следующий проект"
        className="grid h-9 w-9 place-items-center rounded-full border border-m/50 text-m transition-all duration-300 hover:border-m hover:bg-m-soft hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-m"
      >
        <ArrowRight size={15} />
      </button>
    </div>
  );
}
