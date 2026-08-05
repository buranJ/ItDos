import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  FileText,
  MessageCircle,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockupProps } from "./Frame";
import styles from "./AutomationJourneyMock.module.css";

const STEPS = [
  {
    icon: MessageCircle,
    label: "Ответ клиенту",
    meta: "< 1 сек",
    kind: "chat",
  },
  {
    icon: Calendar,
    label: "Запись на встречу",
    meta: "Сб · 14:00",
    kind: "calendar",
  },
  {
    icon: FileText,
    label: "Выставление счёта",
    meta: "24 000 ₽",
    kind: "invoice",
  },
  {
    icon: UserCheck,
    label: "Обновление CRM",
    meta: "Готово",
    kind: "crm",
  },
] as const;

function StepPreview({ kind }: { kind: (typeof STEPS)[number]["kind"] }) {
  if (kind === "chat") {
    return (
      <div className={styles.chatPreview}>
        <p>Работаете в субботу?</p>
        <p>Да! Есть время в 14:00</p>
      </div>
    );
  }

  if (kind === "calendar") {
    return (
      <div className={styles.calendarPreview}>
        <div>
          <span>СБ</span>
          <strong>21</strong>
        </div>
        <p>
          <strong>14:00</strong>
          Консультация
        </p>
        <Check size={11} />
      </div>
    );
  }

  if (kind === "invoice") {
    return (
      <div className={styles.invoicePreview}>
        <span>Счёт №1428</span>
        <strong>24 000 ₽</strong>
        <small>
          <Check size={9} />
          отправлен
        </small>
      </div>
    );
  }

  return (
    <div className={styles.crmPreview}>
      <span>А</span>
      <p>
        <strong>Анна · Qualified</strong>
        <small>Менеджер уведомлён</small>
      </p>
      <Check size={11} />
    </div>
  );
}

export function AutomationJourneyMock({
  accent = "#8b78ff",
  className,
}: MockupProps & { className?: string }) {
  return (
    <div
      className={cn(styles.scene, className)}
      style={{ "--journey-accent": accent } as React.CSSProperties}
    >
      <div aria-hidden="true" className={styles.grid} />
      <div aria-hidden="true" className={styles.glow} />

      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            <i />
            AI SALES AGENT
          </span>
          <h4>От сообщения до сделки</h4>
        </div>
        <span className={styles.mode}>
          <Sparkles size={12} />
          <span>Работает 24/7</span>
        </span>
      </header>

      <div className={styles.trigger}>
        <span className={styles.avatar}>А</span>
        <p>
          <small>Новое сообщение · Анна</small>
          «Можно записаться на консультацию?»
        </p>
        <span className={styles.accepted}>
          AI принял задачу
          <ArrowRight size={11} />
        </span>
      </div>

      <div className={styles.journey}>
        <div aria-hidden="true" className={styles.rail}>
          <span />
        </div>

        {STEPS.map(({ icon: Icon, label, meta, kind }, index) => (
          <article
            key={label}
            className={styles.step}
            style={
              {
                "--phase-delay": `${index * 2}s`,
              } as React.CSSProperties
            }
          >
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <span className={styles.stepIcon}>
                <Icon size={14} strokeWidth={1.7} />
              </span>
              <span className={styles.stepState}>
                <i />
                AUTO
              </span>
            </div>
            <div className={styles.stepTitle}>
              <strong>{label}</strong>
              <span>{meta}</span>
            </div>
            <div className={styles.preview}>
              <StepPreview kind={kind} />
            </div>
          </article>
        ))}
      </div>

      <div className={styles.benefits}>
        <div>
          <MessageCircle size={13} />
          <p>
            <strong>&lt; 1 сек</strong>
            <span>первый ответ</span>
          </p>
        </div>
        <div>
          <Zap size={13} />
          <p>
            <strong>4 действия</strong>
            <span>без участия команды</span>
          </p>
        </div>
        <div>
          <Clock size={13} />
          <p>
            <strong>3 часа</strong>
            <span>экономии ежедневно</span>
          </p>
        </div>
      </div>
    </div>
  );
}
