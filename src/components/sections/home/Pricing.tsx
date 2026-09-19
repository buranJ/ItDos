import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { getPlans } from "@/server/content";
import { PricingPlans } from "./PricingPlans";

export async function Pricing() {
  const plans = await getPlans();

  return (
    <Section id="pricing" className="theme-light scroll-mt-24 border-t border-line">
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

        <PricingPlans plans={plans} />

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
