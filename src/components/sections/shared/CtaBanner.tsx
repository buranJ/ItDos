import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { buttonClass } from "@/components/ui/Button";

type CtaBannerProps = {
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Kept for API compatibility; the whole site is dark now. */
  dark?: boolean;
};

export function CtaBanner({
  title = "Готовы начать\nпроект?",
  description = "Расскажите о задаче — ответим в течение часа и предложим оптимальное решение.",
  primaryCta = { label: "Начать проект", href: "/contact" },
  secondaryCta = { label: "Смотреть работы", href: "/portfolio" },
}: CtaBannerProps) {
  return (
    <Section spacing="lg" className="relative overflow-hidden border-t border-line">
      {/* signature accent bloom */}
      <div
        aria-hidden="true"
        className="accent-glow pointer-events-none absolute left-1/2 top-1/2 h-176 w-176 -translate-x-1/2 -translate-y-1/2 opacity-30"
      />
      <Container size="lg" className="relative text-center">
        <TextReveal
          as="h2"
          className="mx-auto max-w-3xl font-display text-[clamp(2.6rem,6.5vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-fg"
        >
          {title}
        </TextReveal>

        <FadeIn delay={0.15}>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-fg-secondary">
            {description}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <Link
                href={primaryCta.href}
                data-cursor="button"
                className={buttonClass("accent", "lg")}
              >
                {primaryCta.label}
                <ArrowRight size={16} />
              </Link>
            </MagneticButton>

            {secondaryCta && (
              <MagneticButton>
                <Link
                  href={secondaryCta.href}
                  data-cursor="link"
                  className={buttonClass("outline", "lg")}
                >
                  {secondaryCta.label}
                </Link>
              </MagneticButton>
            )}
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
