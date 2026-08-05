"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Container } from "@/components/layout/Container";
import { buttonClass } from "@/components/ui/Button";
import { lerp } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";
import { ChatMock } from "@/components/portfolio/mockups/ChatMock";
import {
  squares,
  mobileSquares,
  chips,
  mobileChips,
  variantStyles,
  iconColor,
  squareKeyframes,
  chatFloatKf,
  chipFloatKf,
  CHAT_DEPTH,
} from "./heroGeometric.data";

export function HeroGeometric() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const lerped = useRef({ x: 0, y: 0 });
  const chipsRef = useRef<(HTMLDivElement | null)[]>([]);
  const chatWrapRef = useRef<HTMLDivElement>(null);
  const chatTiltRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const mobileChatRef = useRef<HTMLDivElement>(null);
  const mobileChipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileRafRef = useRef<number>(0);
  const reduced = useReducedMotion();

  /* ── Entrance animations ── */
  useEffect(() => {
    const root = sectionRef.current;
    // Everything below is decorative motion. Under reduced-motion the hero
    // renders in its final state instead — the CSS safety net alone left the
    // GSAP timelines running.
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.1 })
        .fromTo(
          ".hg-line",
          { yPercent: 115, skewY: 3 },
          {
            yPercent: 0,
            skewY: 0,
            stagger: 0.09,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.3",
        )
        // NB: `.hg-badge` and `.hg-sub` are commented out in the markup; the
        // timeline steps that animated them were logging "GSAP target not
        // found" on every load. Re-add them together with the elements.
        .fromTo(
          ".hg-cta",
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .fromTo(
          ".hg-chip, .hg-chip-m",
          { opacity: 0, scale: 0.75, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.055,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.3",
        )
        .fromTo(
          ".hg-chat, .hg-chat-m",
          { opacity: 0, scale: 0.88, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.35",
        )
        .fromTo(
          ".hg-sq",
          { opacity: 0 },
          { opacity: 1, stagger: 0.03, duration: 0.4, ease: "none" },
          "-=0.4",
        );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  /* ── Mouse parallax ── */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root || reduced) return;
    // Pointer parallax is meaningless without a fine pointer, and the loop
    // used to run forever — burning a frame's worth of work per tick long
    // after the hero had scrolled away.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      mouse.current.x = (e.clientX - r.left - r.width / 2) / r.width;
      mouse.current.y = (e.clientY - r.top - r.height / 2) / r.height;
    };
    root.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      lerped.current.x = lerp(lerped.current.x, mouse.current.x, 0.065);
      lerped.current.y = lerp(lerped.current.y, mouse.current.y, 0.065);

      chipsRef.current.forEach((el, i) => {
        if (!el) return;
        const chip = chips[i];
        if (!chip) return;
        const dx = lerped.current.x * chip.depth * 460;
        const dy = lerped.current.y * chip.depth * 280;
        el.style.setProperty("--px", `${dx}px`);
        el.style.setProperty("--py", `${dy}px`);
      });

      if (chatWrapRef.current) {
        const dx = lerped.current.x * CHAT_DEPTH * 420;
        const dy = lerped.current.y * CHAT_DEPTH * 260;
        chatWrapRef.current.style.setProperty("--px", `${dx}px`);
        chatWrapRef.current.style.setProperty("--py", `${dy}px`);
      }
      if (chatTiltRef.current) {
        const rx = lerped.current.y * 7;
        const ry = lerped.current.x * -9;
        chatTiltRef.current.style.transform = `rotateX(${2 + rx}deg) rotateY(${-11 + ry}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Only spin the loop while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
        } else if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      root.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [reduced]);

  /* ── Scatter for the < lg composition ──
     Two inputs, summed: how far the hero has scrolled (the only "pointer" a
     phone has) and, where a pointer exists, repulsion away from it. Each chip
     carries its own depth and a deterministic jitter angle derived from its
     id, so the group breaks apart unevenly instead of sliding as one block.
     Offsets are lerped towards their target and rounded to whole pixels —
     fractional translations blur the pill's text. */
  useEffect(() => {
    const stage = mobileStageRef.current;
    if (!stage || reduced) return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;

    const MAX_SCATTER = 18;
    const current = mobileChips.map(() => ({ x: 0, y: 0 }));
    const pointer = { x: 0, y: 0, active: false };
    let running = false;

    // Deterministic per-chip angle — random enough to read as chaos, stable
    // between renders so nothing jumps on a re-render.
    const jitter = mobileChips.map((c, i) => {
      const a = ((c.id * 97 + i * 53) % 360) * (Math.PI / 180);
      return { cos: Math.cos(a), sin: Math.sin(a) };
    });

    const frame = () => {
      const rect = stage.getBoundingClientRect();
      // -1 → below the fold, 0 → centred, 1 → scrolled past.
      const p = Math.max(
        -1,
        Math.min(
          1,
          (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
            (window.innerHeight / 2 + rect.height / 2),
        ),
      );

      let moving = false;

      mobileChipRefs.current.forEach((el, i) => {
        const chip = mobileChips[i];
        const j = jitter[i];
        if (!el || !chip || !j) return;

        // scroll component — each chip drifts along its own angle
        let tx = p * MAX_SCATTER * chip.depth * j.cos;
        let ty = p * -MAX_SCATTER * 1.6 * chip.depth + p * 6 * j.sin;

        // pointer component — push away, falling off with distance
        if (pointer.active) {
          const b = el.getBoundingClientRect();
          const cx = b.left + b.width / 2 - rect.left;
          const cy = b.top + b.height / 2 - rect.top;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const falloff = Math.max(0, 1 - dist / 220);
          const push = falloff * 16 * (0.6 + chip.depth * 0.6);
          tx += (dx / dist) * push;
          ty += (dy / dist) * push;
        }

        const c = current[i];
        c.x = lerp(c.x, tx, 0.12);
        c.y = lerp(c.y, ty, 0.12);
        if (Math.abs(c.x - tx) > 0.2 || Math.abs(c.y - ty) > 0.2) moving = true;

        el.style.setProperty("--px", `${Math.round(c.x)}px`);
        el.style.setProperty("--py", `${Math.round(c.y)}px`);
      });

      if (mobileChatRef.current) {
        mobileChatRef.current.style.setProperty("--py", `${Math.round(p * -12)}px`);
      }

      // Keep ticking while anything is still settling or the pointer is down.
      if (moving || pointer.active) {
        mobileRafRef.current = requestAnimationFrame(frame);
      } else {
        mobileRafRef.current = 0;
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      mobileRafRef.current = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      kick();
    };
    const onPointerLeave = () => {
      pointer.active = false;
      kick();
    };

    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    kick();

    return () => {
      if (mobileRafRef.current) cancelAnimationFrame(mobileRafRef.current);
      mobileRafRef.current = 0;
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [reduced]);

  return (
    <>
      {/* ── Injected keyframes ── */}
      <style>{squareKeyframes + chipFloatKf + chatFloatKf}</style>

      {/* ── Comparison label ── */}

      <section
        ref={sectionRef}
        className="relative min-h-screen overflow-hidden bg-white"
      >
        {/* ── Background: subtle dot grid ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* ── Chaotic small squares ──
            Two passes: the full field on desktop, a thinned one below `lg`
            that keeps clear of the headline. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
        >
          {squares.map((sq) => (
            <div
              key={sq.id}
              className="hg-sq absolute"
              style={{
                left: sq.x,
                top: sq.y,
                width: sq.size,
                height: sq.size,
                border: sq.filled ? "none" : "1.5px solid #0a0a0a",
                background: sq.filled ? "#0a0a0a" : "transparent",
                opacity: sq.opacity,
                animationName: `sq-${sq.id}`,
                animationDuration: `${sq.duration}s`,
                animationDelay: `${sq.delay}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDirection: "alternate",
                willChange: "transform",
              }}
            />
          ))}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
        >
          {mobileSquares.map((sq) => (
            <div
              key={sq.id}
              className="hg-sq absolute"
              style={{
                left: sq.x,
                top: sq.y,
                width: sq.size,
                height: sq.size,
                border: sq.filled ? "none" : "1.5px solid #0a0a0a",
                background: sq.filled ? "#0a0a0a" : "transparent",
                opacity: sq.opacity,
                animationName: `sq-${sq.animId ?? sq.id}`,
                animationDuration: `${sq.duration}s`,
                animationDelay: `${sq.delay}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDirection: "alternate",
                willChange: "transform",
              }}
            />
          ))}
        </div>

        {/* ── Service chips ── */}
        <div aria-hidden className="hidden lg:block pointer-events-none absolute inset-0">
          {chips.map((chip, i) => (
            <div
              key={chip.id}
              ref={(el) => {
                chipsRef.current[i] = el;
              }}
              className="hg-chip absolute"
              style={
                {
                  left: chip.x,
                  top: chip.y,
                  /* base centering + mouse offset via CSS vars */
                  transform:
                    "translate(calc(-50% + var(--px, 0px)), calc(-50% + var(--py, 0px)))",
                  animation: `chip-float-${chip.id} ${chip.floatDur} ${chip.floatDelay} ease-in-out infinite`,
                  willChange: "transform",
                } as React.CSSProperties
              }
            >
              <div
                className={`
                  flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                  transition-shadow duration-300
                  ${variantStyles[chip.variant]}
                `}
              >
                <chip.Icon
                  size={15}
                  className={iconColor[chip.variant]}
                  strokeWidth={1.75}
                />
                <span>{chip.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── ChatMock card ── */}
        <div
          ref={chatWrapRef}
          className="hg-chat hidden lg:block pointer-events-none absolute z-10"
          style={
            {
              left: "72%",
              top: "48%",
              width: 300,
              height: 244,
              transform:
                "translate(calc(-50% + var(--px, 0px)), calc(-50% + var(--py, 0px)))",
              animation: "chat-float 12s 0.6s ease-in-out infinite",
              perspective: "900px",
              willChange: "transform",
            } as React.CSSProperties
          }
        >
          <div
            ref={chatTiltRef}
            style={{
              width: "100%",
              height: "100%",
              transform: "rotateX(2deg) rotateY(-11deg)",
              transformStyle: "preserve-3d",
              willChange: "transform",
              filter:
                "drop-shadow(0 16px 48px rgba(0,0,0,0.13)) drop-shadow(0 2px 10px rgba(0,0,0,0.07))",
            }}
          >
            <ChatMock accent="#6e56ff" typing className="h-full rounded-2xl" />
          </div>
        </div>

        {/* ── Content layout: stacked on mobile, centered on desktop ── */}
        {/* `pb-16` on small screens: the buttons and the scroll hint used to
            end flush against the next section's dark edge. */}
        <div className="relative z-10 flex min-h-screen flex-col pb-16 pt-28 sm:pb-20 sm:pt-32 lg:justify-center lg:pb-24 lg:pt-36">
          <Container>
            <div className="max-w-208">
              {/* Badge */}
              {/* <div className="hg-badge inline-flex items-center gap-2.5 rounded-full border border-[#e8e8e8] bg-white px-4 py-1.5 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0a0a0a] opacity-35" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
                </span>
                <span className="font-mono text-xs tracking-wider text-[#525252]">
                  студия разработки ·
                </span>
              </div> */}

              {/* Heading */}
              {/* The home page's only <h1>. It used to be an <h2>, which left
                  the most important page on the site without one. */}
              {/* Two clamps rather than one: a single 7.5vw curve was still
                  growing past 76px at 1023px while the layout was the stacked
                  mobile one. The small/tablet band gets its own curve with a
                  4.5rem ceiling; desktop keeps its original scale. */}
              <h1 className="mt-6 font-semibold leading-[1.05] tracking-tight text-[#0a0a0a] text-[clamp(2.6rem,9.5vw,4.5rem)] lg:mt-8 lg:text-[clamp(3.5rem,7.5vw,6.8rem)] lg:leading-[1.02]">
                <span className="block overflow-hidden">
                  <span className="hg-line block">Создаем</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hg-line block">сайты</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="hg-line block text-[#8f8f8f]">и приложения</span>
                </span>
              </h1>

              {/* Subtitle */}
              {/* <p className="hg-sub mt-6 max-w-md text-base sm:text-lg leading-relaxed text-[#525252]">
                Из идеи — в работающий продукт. Сайты, приложения, CRM и AI, которые
                делают бизнес быстрее и прибыльнее.
              </p> */}

              {/* CTAs — desktop only; below `lg` they render after the
                  visual block so the eye reaches the AI card first. */}
              <div className="mt-10 hidden gap-3 lg:flex">
                <MagneticButton>
                  <Link
                    href="/contact"
                    data-cursor="button"
                    className={buttonClass("dark", "md", "hg-cta")}
                  >
                    Обсудить проект <ArrowRight size={15} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/portfolio"
                    data-cursor="link"
                    className={buttonClass("outlineLight", "md", "hg-cta")}
                  >
                    Смотреть работы
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </Container>

          {/* ── Card + chips (< lg) ── */}
          <div className="mt-auto px-5 pb-2 pt-10 sm:px-8 lg:hidden">
            <div
              ref={mobileStageRef}
              className="relative mx-auto h-[380px] w-full max-w-[360px] sm:h-[440px] sm:max-w-[520px]"
            >
              {/* ambient glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-6 rounded-[40px] opacity-15 blur-3xl"
                style={{ background: "#6e56ff" }}
              />

              {/* ChatMock with the 3D tilt restored.
                  A rotated element is rasterised once and then resampled, which
                  is what smeared the 11px text. Three things keep it legible:
                    · the shadow lives on this outer, untransformed node, so the
                      rotated layer carries no filter (a filter forces a second,
                      lower-quality raster pass);
                    · `transform-style: flat` — no preserve-3d chain, so there
                      is exactly one composite step;
                    · modest angles, and the type inside ChatMock went up from
                      11px to 12px so the same resampling costs less.
                  `--px/--py` are rounded to whole pixels for the same reason. */}
              <div
                ref={mobileChatRef}
                className="hg-chat-m absolute left-1/2 top-1/2 shadow-[0_22px_50px_-14px_rgba(10,10,10,0.24),0_4px_12px_-4px_rgba(10,10,10,0.1)]"
                style={{
                  width: "min(82%, 310px)",
                  height: "min(74%, 310px)",
                  borderRadius: 16,
                  perspective: "1200px",
                  transform:
                    "translate(calc(-50% + var(--px, 0px)), calc(-50% + var(--py, 0px)))",
                }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    transform: "rotateY(-6deg) rotateX(1.5deg)",
                    transformStyle: "flat",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <ChatMock accent="#6e56ff" typing className="h-full rounded-2xl" />
                </div>
              </div>

              {/* Chips — positioned by percentage so the arrangement survives
                  every width from 320px to the lg breakpoint. */}
              {/* Three nested layers, each owning one transform, because they
                  would otherwise overwrite each other:
                    outer — scatter offset driven by JS (scroll + pointer)
                    middle — GSAP entrance tween (this is why the scatter
                             stopped working when both lived on one element)
                    inner  — idle CSS float
              */}
              {mobileChips.map((chip, i) => (
                <div
                  key={chip.id}
                  ref={(el) => {
                    mobileChipRefs.current[i] = el;
                  }}
                  className="absolute"
                  style={{
                    left: chip.x,
                    top: chip.y,
                    transform: "translate(var(--px, 0px), var(--py, 0px))",
                    willChange: "transform",
                  }}
                >
                  <div className="hg-chip-m">
                    <div
                      style={{
                        animation: `chip-float-${chip.floatId} ${9 + i * 1.3}s ${i * 0.45}s ease-in-out infinite`,
                      }}
                    >
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium sm:px-3.5 sm:py-2 sm:text-sm ${variantStyles[chip.variant]}`}
                      >
                        <chip.Icon
                          size={12}
                          className={iconColor[chip.variant]}
                          strokeWidth={1.75}
                        />
                        <span>{chip.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs on small screens — after the visual, side by side */}
          <Container className="pt-8 lg:hidden">
            <div className="flex flex-row gap-2.5">
              <Link
                href="/contact"
                data-cursor="button"
                className={buttonClass(
                  "dark",
                  "md",
                  "hg-cta flex-1 px-4 text-[13px] sm:px-7 sm:text-sm",
                )}
              >
                Обсудить проект <ArrowRight size={14} />
              </Link>
              <Link
                href="/portfolio"
                data-cursor="link"
                className={buttonClass(
                  "outlineLight",
                  "md",
                  "hg-cta flex-1 px-4 text-[13px] sm:px-7 sm:text-sm",
                )}
              >
                Смотреть работы
              </Link>
            </div>

            {/* Label for the client strip directly below, in the flow on small
                screens — the absolutely-positioned version would collide with
                the buttons, which sit at the bottom of the hero here. The rule
                underneath points at the marquee. */}
            <div className="mt-9 flex flex-col items-center gap-2 lg:hidden">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#0a0a0a]/55">
                Нам доверяют
              </span>
              <span className="h-8 w-px bg-linear-to-b from-[#0a0a0a]/45 to-transparent" />
            </div>
          </Container>
        </div>

        {/* Same label on desktop, where the buttons sit up top */}
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 lg:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black">
            Нам доверяют
          </span>
          <span className="h-10 w-px bg-linear-to-b from-black to-transparent" />
        </div>
        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent" />
      </section>
    </>
  );
}
