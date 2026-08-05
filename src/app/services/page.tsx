import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Monitor, Layout, Database, Sparkles, Bot, Zap, MessageSquare, Settings2, ShoppingBag, Link2, Headphones, TrendingUp, Package } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { getServices } from "@/server/content";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Услуги",
  description:
    "Полный спектр услуг: разработка сайтов, веб-приложений, CRM/ERP, AI-интеграции, Telegram-боты, автоматизация бизнеса.",
};

const iconMap: Record<string, LucideIcon> = {
  Monitor, Layout, Database, Sparkles, Bot, Zap,
  MessageSquare, Settings2, ShoppingBag, Link2,
  Headphones, TrendingUp, Package,
};

const categoryLabels = {
  development: "Разработка",
  ai: "Искусственный интеллект",
  automation: "Автоматизация",
  integration: "Интеграции",
  support: "Поддержка",
};

export default async function ServicesPage() {
  const services = await getServices();
  const grouped = services.reduce<Record<string, typeof services>>(
    (acc, s) => {
      (acc[s.category] ??= []).push(s);
      return acc;
    },
    {}
  );

  return (
    <>
      {/* Hero */}
      <Section spacing="lg" className="bg-bg pt-32!">
        <Container>
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-6">
            Услуги
          </p>
          <TextReveal
            as="h1"
            className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-tight tracking-tight text-fg max-w-3xl"
          >
            {"Что мы\nразрабатываем"}
          </TextReveal>
          <p className="mt-8 text-lg text-fg-secondary max-w-xl leading-relaxed">
            От простого сайта до полноценной AI-автоматизации. Выбирайте то, что нужно вашему бизнесу.
          </p>
        </Container>
      </Section>

      {/* Services by category */}
      {Object.entries(grouped).map(([category, items]) => (
        <Section key={category} className="theme-light border-t border-line">
          <Container>
            {/* Real heading, not a styled <p> — otherwise the page is a flat
                run of H2 service names with nothing grouping them. */}
            <h2 className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-10">
              {categoryLabels[category as keyof typeof categoryLabels] ?? category}
            </h2>
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((service) => {
                const Icon = iconMap[service.icon] ?? Monitor;
                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    data-cursor="card"
                    data-cursor-label="СМОТРЕТЬ"
                    className="group flex flex-col gap-6 p-7 rounded-xl border border-line hover:border-fg/50 transition-colors duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                        <Icon size={18} className="text-fg" />
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 text-fg"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fg mb-2">{service.title}</h3>
                      <p className="text-sm text-fg-secondary leading-relaxed">{service.description}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-fg-muted">{service.timeframe}</span>
                    </div>
                  </Link>
                );
              })}
            </StaggerGroup>
          </Container>
        </Section>
      ))}

      <CtaBanner />
    </>
  );
}
