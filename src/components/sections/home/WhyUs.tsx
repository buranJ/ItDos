import {
  FileSignature,
  KeyRound,
  Headphones,
  CalendarCheck,
  Wallet,
  MessageCircle,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

const reasons = [
  {
    icon: FileSignature,
    title: "Договор и поэтапная оплата",
    desc: "Работаем официально. Платите по мере готовности этапов, а не всё вперёд.",
  },
  {
    icon: KeyRound,
    title: "Код и доступы — у вас",
    desc: "После оплаты передаём исходники, доступы и документацию. Вы ни от кого не зависите.",
  },
  {
    icon: CalendarCheck,
    title: "Прозрачные сроки и демо",
    desc: "Фиксируем план, показываем прогресс на еженедельных демо. Без «исчезновений».",
  },
  {
    icon: Wallet,
    title: "Фиксированная смета",
    desc: "Называем стоимость до старта и держим её. Никаких сюрпризов по ходу проекта.",
  },
  {
    icon: Headphones,
    title: "Поддержка после запуска",
    desc: "Не пропадаем: сопровождаем, обновляем и развиваем продукт после сдачи.",
  },
  {
    icon: MessageCircle,
    title: "На связи в мессенджерах",
    desc: "WhatsApp и Telegram, ответ в течение часа. Общаетесь напрямую с командой.",
  },
];

export function WhyUs() {
  return (
    <Section className="border-t border-line">
      <Container>
        <div className="max-w-2xl">
          {/* <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Почему ITDOS
          </p> */}
          <TextReveal
            as="h2"
            className="font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-tight tracking-tight text-fg"
          >
            {"Почему ITDOS"}
          </TextReveal>
          <p className="mt-5 text-lg leading-relaxed text-fg-secondary">
           С нами спокойно, разработка не должна превращаться в стресс. Мы выстраиваем
            прозрачный процесс, держим слово и берем ответственность за
            результат, чтобы вы могли сосредоточиться на развитии бизнеса.
          </p>
        </div>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="bg-bg p-7">
              <r.icon size={22} className="text-accent-text" />
              <h3 className="mt-5 font-semibold text-fg">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {r.desc}
              </p>
            </div>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
