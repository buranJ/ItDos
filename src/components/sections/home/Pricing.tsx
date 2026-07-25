"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { plans } from "@/data/pricing";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section className="theme-light border-t border-line py-24 lg:py-32">
      <Container>
        {/* ── Header ── */}
        <div className="mb-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              {"// цены"}
            </p> */}
            <TextReveal
              as="h2"
              className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"Честные\nцены"}
            </TextReveal>
          </div>
          <FadeIn delay={0.2}>
            <p className="max-w-xs text-sm leading-relaxed text-fg-secondary">
              Точную смету называем после бесплатной консультации и фиксируем в
              договоре.
            </p>
          </FadeIn>
        </div>

        {/* ── Folder cards ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-5 lg:items-end">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <div className="group relative">
                {/* Folder tab */}
                <div
                  className={cn(
                    "ml-5 inline-flex items-center gap-2.5 rounded-t-xl px-5 py-2.5",
                    plan.popular ? "bg-[#ede9ff]" : "bg-[#e8e8e8]",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
                      plan.popular ? "text-accent" : "text-[#a1a1aa]",
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      plan.popular ? "text-accent" : "text-[#3f3f46]",
                    )}
                  >
                    {plan.name.split(" /")[0]}
                  </span>
                  {plan.popular && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                      ТОП
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div
                  className={cn(
                    "overflow-hidden rounded-b-2xl rounded-tr-2xl transition-shadow duration-300",
                    plan.popular
                      ? "border-2 border-accent/20 bg-white shadow-[0_8px_40px_rgba(110,86,255,0.09)] group-hover:shadow-[0_20px_60px_rgba(110,86,255,0.16)]"
                      : "border border-[#e4e4e7] bg-white shadow-md group-hover:shadow-xl",
                  )}
                >
                  <div className="flex flex-col items-center p-7 text-center lg:p-8">
                    {/* Name & tagline */}
                    <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-[#0a0a0a]">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#71717a]">
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="mt-7 w-full border-t border-[#e8e8e8] pt-7">
                      <p className="font-display font-semibold leading-none tracking-tight text-[#0a0a0a] text-[clamp(1.9rem,3.5vw,2.5rem)]">
                        {plan.price}
                      </p>
                      <p className="mt-2 text-xs text-[#a1a1aa]">
                        {plan.period}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="mt-6 flex w-full flex-col gap-2.5">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center justify-center gap-2.5 text-sm text-[#52525b]"
                        >
                          <span
                            className={cn(
                              "h-1 w-1 shrink-0 rounded-full",
                              plan.popular ? "bg-accent" : "bg-[#a1a1aa]",
                            )}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href="/contact"
                      data-cursor="button"
                      className={cn(
                        "group/btn mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300",
                        plan.popular
                          ? "bg-accent text-white shadow-[0_4px_20px_rgba(110,86,255,0.28)] hover:bg-accent-bright hover:shadow-[0_6px_32px_rgba(110,86,255,0.48)]"
                          : "border border-[#e2e2e6] text-[#0a0a0a] hover:border-[#0a0a0a]/30 hover:bg-[#0a0a0a]/3",
                      )}
                    >
                      Обсудить проект
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <p className="mt-12 text-center text-sm text-fg-muted">
            Не уверены, что нужно?{" "}
            <Link
              href="/contact"
              className="text-accent transition-colors hover:text-accent-bright"
            >
              Бесплатная консультация →
            </Link>
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
