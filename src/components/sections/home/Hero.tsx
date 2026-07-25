"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Container } from "@/components/layout/Container";
import { AmbientBackdrop } from "@/components/visual/AmbientBackdrop";
import { HeroShowcase } from "./HeroShowcase";

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35 });
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          ".hero-line",
          { yPercent: 115, skewY: 4 },
          {
            yPercent: 0,
            skewY: 0,
            stagger: 0.1,
            duration: 1.1,
            ease: "power4.out",
          },
          "-=0.25"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.45"
        );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-24 lg:pt-32"
    >
      <AmbientBackdrop />

      <Container className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Text */}
          <div>
            <div className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/40 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-xs tracking-wide text-fg-secondary">
                Технологическая студия · Бишкек
              </span>
            </div>

            <h1 className="mt-7 font-display text-[clamp(2.9rem,6.4vw,5.6rem)] font-semibold leading-[1.02] tracking-tight text-fg">
              <span className="block overflow-hidden">
                <span className="hero-line block">Строим цифровые</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">
                  <span className="text-accent">продукты</span> мирового
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block">уровня.</span>
              </span>
            </h1>

            <p className="hero-sub mt-7 max-w-xl text-lg leading-relaxed text-fg-secondary sm:text-xl">
              Сайты, веб-приложения, CRM/ERP и AI-агенты. Проектируем,
              разрабатываем и автоматизируем — от идеи до запуска.
            </p>

            <div className="hero-cta mt-10 flex flex-col gap-4 sm:flex-row">
              <MagneticButton>
                <Link
                  href="/contact"
                  data-cursor="button"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-ink transition-transform duration-200"
                >
                  Начать проект
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  href="/portfolio"
                  data-cursor="link"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg/50"
                >
                  Смотреть работы
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Living product composition */}
          <div className="hero-cta">
            <HeroShowcase />
          </div>
        </div>
      </Container>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 sm:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fg-muted">
          Скролл
        </span>
        <span className="h-10 w-px bg-linear-to-b from-fg/50 to-transparent" />
      </div>
    </section>
  );
}
