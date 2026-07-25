"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Monitor,
  Layout,
  Database,
  Sparkles,
  Bot,
  Zap,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { services } from "@/data/services";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Layout,
  Database,
  Sparkles,
  Bot,
  Zap,
  MessageSquare,
  ShoppingBag,
};

const featuredSlugs = [
  "website-development",
  "web-applications",
  "crm-erp",
  "ai-agents",
  "ai-automation",
  "telegram-bots",
  "marketplace",
];

export function ServicesGrid() {
  const list = featuredSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  return (
    <Section id="services" className="theme-light border-t border-line">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              {"// услуги"}
            </p>
            <TextReveal
              as="h2"
              className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
            >
              {"Что мы\nразрабатываем"}
            </TextReveal>
          </div>
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 self-start text-sm font-medium text-fg-secondary transition-colors hover:text-fg sm:self-auto"
          >
            Все услуги
            <ArrowUpRight
              size={16}
              className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <StaggerGroup className="mt-14 border-t border-line">
          {list.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Monitor;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-cursor="link"
                className="group relative -mx-4 grid grid-cols-[2rem_1fr_auto] items-center gap-5 rounded-xl border-b border-line px-4 py-6 transition-colors duration-300 hover:bg-surface/40 sm:gap-8 sm:py-7"
              >
                <span className="font-mono text-sm text-fg-faint transition-colors duration-300 group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className="shrink-0 text-fg-muted transition-colors duration-300 group-hover:text-accent"
                    />
                    <h3 className="font-display text-xl font-semibold tracking-tight text-fg transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                      {service.title}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <span className="hidden font-mono text-xs text-fg-muted sm:block">
                    {service.timeframe}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="shrink-0 text-fg-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                  />
                </div>
              </Link>
            );
          })}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
