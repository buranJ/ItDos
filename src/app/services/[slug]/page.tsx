import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { getServices, getServiceBySlug } from "@/server/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    alternates: { canonical: `/services/${slug}` },
    title: service.title,
    description: service.longDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      {/* Back */}
      <div className="pt-28 pb-0">
        <Container>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
          >
            <ArrowLeft size={14} />
            Все услуги
          </Link>
        </Container>
      </div>

      {/* Hero */}
      <Section className="bg-bg">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
              Услуга
            </p>
            <TextReveal
              as="h1"
              className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {service.title}
            </TextReveal>
            <FadeIn delay={0.2}>
              <p className="mt-6 text-lg text-fg-secondary leading-relaxed">
                {service.longDescription}
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="mt-8 flex items-center gap-3">
                <Clock size={14} className="text-fg-muted" />
                <span className="text-sm text-fg-secondary">{service.timeframe}</span>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Content grid */}
      <Section className="bg-surface border-y border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Features */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-fg mb-6">Что входит</h2>
              <StaggerGroup className="flex flex-col gap-3">
                {service.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-fg shrink-0 mt-0.5" />
                    <span className="text-sm text-fg-secondary">{f}</span>
                  </div>
                ))}
              </StaggerGroup>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-4">
                  Технологии
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs border border-line rounded-full px-3 py-1 text-fg-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-4">
                  Результат
                </h3>
                <ul className="flex flex-col gap-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="text-sm text-fg-secondary">
                      — {d}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/contact"
                data-cursor="button"
                className="inline-flex items-center gap-2 bg-accent text-accent-ink px-6 py-3 rounded-full text-sm font-medium hover:bg-accent-bright transition-colors w-fit"
              >
                Обсудить проект
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBanner />
    </>
  );
}
