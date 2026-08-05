import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Политика конфиденциальности",
  description: "Как ITDOS обрабатывает и защищает персональные данные.",
  robots: { index: true, follow: true },
};

const sections = [
  {
    h: "1. Какие данные мы собираем",
    p: "Через формы на сайте мы собираем данные, которые вы предоставляете добровольно: имя и номер телефона или адрес электронной почты. Дополнительно автоматически могут собираться обезличенные данные о посещении (тип устройства, источник перехода) через сервисы аналитики.",
  },
  {
    h: "2. Цели обработки",
    p: "Данные используются исключительно для обработки вашей заявки, связи с вами, подготовки коммерческого предложения и улучшения качества сервиса. Мы не используем ваши данные для рассылок без вашего согласия.",
  },
  {
    h: "3. Правовое основание",
    p: "Обработка осуществляется на основании вашего согласия, которое вы даёте, отправляя форму на сайте. Вы можете отозвать согласие в любой момент, написав нам.",
  },
  {
    h: "4. Передача третьим лицам",
    p: "Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением сервисов, технически необходимых для работы сайта и обработки заявок (например, мессенджеры и системы аналитики), и только в объёме, необходимом для оказания услуги.",
  },
  {
    h: "5. Хранение и защита",
    p: "Данные хранятся не дольше, чем это необходимо для целей обработки. Мы принимаем разумные технические и организационные меры для защиты данных от несанкционированного доступа.",
  },
  {
    h: "6. Ваши права",
    p: "Вы вправе запросить доступ к своим данным, их исправление или удаление, а также отозвать согласие на обработку. Для этого свяжитесь с нами по контактам ниже.",
  },
];

export default function PrivacyPage() {
  return (
    <Section spacing="lg" className="theme-light pt-32!">
      <Container size="md">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Документ
        </p>
        <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg">
          Политика конфиденциальности
        </h1>
        <p className="mt-4 text-fg-muted">
          Последнее обновление: 30.07.2026
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
                {s.h}
              </h2>
              <p className="mt-3 leading-relaxed text-fg-secondary">{s.p}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-line bg-surface p-7">
            <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
              Контакты
            </h2>
            <p className="mt-3 leading-relaxed text-fg-secondary">
              По вопросам обработки персональных данных:{" "}
              <a href={`mailto:${site.email}`} className="text-accent-text hover:underline">
                {site.email}
              </a>
              , {site.phoneDisplay}.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
