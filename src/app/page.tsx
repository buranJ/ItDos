import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { HeroGeometric } from "@/components/sections/home/HeroGeometric";
import { TechMarquee } from "@/components/sections/home/TechMarquee";
import { ClientLogos } from "@/components/sections/home/ClientLogos";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { WhatWeBuild } from "@/components/sections/home/WhatWeBuild";
import { Stats } from "@/components/sections/home/Stats";
import { QuickFacts } from "@/components/sections/home/QuickFacts";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { Pricing } from "@/components/sections/home/Pricing";
import { PortfolioPreview } from "@/components/sections/home/PortfolioPreview";
import { AiSection } from "@/components/sections/home/AiSection";
import { HeroAI } from "@/components/sections/home/HeroAI";
import { Team } from "@/components/sections/about/Team";
import { WhyUs } from "@/components/sections/home/WhyUs";
import { ProcessPreview } from "@/components/sections/home/ProcessPreview";
import { Reviews } from "@/components/sections/home/Reviews";
import { Faq } from "@/components/sections/shared/Faq";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ITDOS — Разработка сайтов, AI-интеграции и автоматизация бизнеса",
  description:
    "Технологическая компания из Бишкека. Строим сайты, веб-приложения, CRM/ERP, AI-агентов и автоматизируем бизнес-процессы.",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqLd} />

      {/* 01 — Вход (версия A — текущая) */}
      {/* <Hero /> */}

      {/* 01B — Геометрический Hero (для сравнения, удалить после выбора) */}
      <HeroGeometric />
      <TechMarquee />

      {/* Доверие сразу */}
      {/* <ClientLogos /> */}

      {/* 02 — Манифест (valley) */}
      <Manifesto />

      {/* 03 — Что мы строим */}
      {/* <WhatWeBuild /> */}
      <Team />
      {/* <Stats /> */}
      {/* <QuickFacts /> */}

      {/* 04 — Услуги + цены */}
      {/* <ServicesGrid /> */}
      <Pricing />

      {/* 05 — Доказательство */}
      {/* <PortfolioPreview /> */}

      {/* 06 — AI peak */}
      {/* <HeroAI /> */}
      {/* <AiSection /> */}

      {/* 07 — Почему мы / процесс / отзывы */}
      <WhyUs />
      <ProcessPreview />
      {/* <Reviews /> */}

      {/* 08 — Снятие возражений */}
      {/* <Faq /> */}

      {/* 09 — CTA */}
      <CtaBanner />
    </>
  );
}
