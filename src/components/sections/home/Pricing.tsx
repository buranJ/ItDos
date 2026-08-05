import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { buttonClass } from "@/components/ui/Button";
import { getPlans } from "@/server/content";
import { cn } from "@/lib/utils";

export async function Pricing() {
  const plans = await getPlans();

  return (
    <Section className="theme-light border-t border-line">
      <Container>
        {/* ── Header ── */}
        <div className="mb-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              Цены
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
                    plan.popular ? "bg-accent/12" : "bg-panel-2",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
                      plan.popular ? "text-accent-text" : "text-fg-muted",
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      plan.popular ? "text-accent-text" : "text-fg-secondary",
                    )}
                  >
                    {plan.name.split(" /")[0]}
                  </span>
                  {plan.popular && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent-text">
                      ТОП
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div
                  className={cn(
                    "overflow-hidden rounded-b-2xl rounded-tr-2xl transition-shadow duration-300",
                    plan.popular
                      ? "border-2 border-accent/20 bg-panel shadow-[0_8px_40px_rgba(110,86,255,0.09)] group-hover:shadow-[0_20px_60px_rgba(110,86,255,0.16)]"
                      : "border border-line bg-panel shadow-md group-hover:shadow-xl",
                  )}
                >
                  <div className="flex flex-col items-center p-7 text-center lg:p-8">
                    {/* Name & tagline */}
                    <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-fg">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-secondary">
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="mt-7 w-full border-t border-line pt-7">
                      <p className="font-display font-semibold leading-none tracking-tight text-fg text-[clamp(1.9rem,3.5vw,2.5rem)]">
                        {plan.price}
                      </p>
                      <p className="mt-2 text-xs text-fg-muted">
                        {plan.period}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="mt-6 flex w-full flex-col gap-2.5">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center justify-center gap-2.5 text-sm text-fg-secondary"
                        >
                          <span
                            className={cn(
                              "h-1 w-1 shrink-0 rounded-full",
                              plan.popular ? "bg-accent" : "bg-fg-muted",
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
                      className={buttonClass(
                        plan.popular ? "accent" : "outline",
                        "md",
                        "group/btn mt-9 w-full",
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
              className="text-accent-text transition-colors hover:text-accent-bright"
            >
              Бесплатная консультация →
            </Link>
          </p>
        </FadeIn>
      </Container>
    </Section>
  );
}
