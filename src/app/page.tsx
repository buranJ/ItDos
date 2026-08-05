import type { Metadata } from "next";
import { HeroGeometric } from "@/components/sections/home/HeroGeometric";
import { ClientMarquee } from "@/components/sections/home/ClientMarquee";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { WhatWeBuild } from "@/components/sections/home/WhatWeBuild";
import { Pricing } from "@/components/sections/home/Pricing";
import { Team } from "@/components/sections/about/Team";
import { WhyUs } from "@/components/sections/home/WhyUs";
import { ProcessPreview } from "@/components/sections/home/ProcessPreview";
import { CtaBanner } from "@/components/sections/shared/CtaBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "ITDOS — Разработка сайтов, AI-интеграции и автоматизация бизнеса",
  description:
    "Технологическая компания из Бишкека. Строим сайты, веб-приложения, CRM/ERP, AI-агентов и автоматизируем бизнес-процессы.",
};

export default function HomePage() {
  return (
    <>
      {/* FAQ structured data must describe FAQ content that is actually on
          the page — Google treats a mismatch as a violation. Re-enable this
          together with <Faq /> below, on the same line of the checklist. */}
      {/* <JsonLd data={await getFaqLd()} /> */}

      {/* 01 — Вход (версия A — текущая) */}
      {/* <Hero /> */}

      {/* 01B — Геометрический Hero (для сравнения, удалить после выбора) */}
      <HeroGeometric />

      {/* Доверие сразу — бегущая строка с логотипами клиентов.
          Альтернатива — <TrustWall />: та же выборка сеткой, все 12 сразу. */}
      <ClientMarquee />
      {/* <TrustWall /> */}
      {/* <TechMarquee /> */}
      {/* <ClientLogos /> */}

      {/* 02 — Манифест (valley) */}
      <Manifesto />

      {/* 03 — Что мы строим */}
      <WhatWeBuild />
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
