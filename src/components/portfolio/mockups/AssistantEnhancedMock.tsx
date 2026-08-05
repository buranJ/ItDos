"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Database,
  FileText,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";
import type { MockupProps } from "./Frame";
import styles from "./AssistantEnhancedMock.module.css";

const PHASES = [
  {
    title: "Диалог",
    status: "Отвечаю клиенту",
    icon: MessageCircle,
  },
  {
    title: "Встреча",
    status: "Бронирую время",
    icon: Calendar,
  },
  {
    title: "Счёт",
    status: "Формирую документ",
    icon: FileText,
  },
  {
    title: "Результат",
    status: "Всё готово",
    icon: Check,
  },
] as const;

function ChatPanel() {
  return (
    <div className={styles.chatPanel}>
      <div className={styles.customer}>
        <span>А</span>
        <p>
          <strong>Анна</strong>
          <small>Telegram · сейчас</small>
        </p>
        <i />
      </div>
      <div className={styles.messages}>
        <p className={styles.incoming}>Здравствуйте! Вы работаете в субботу?</p>
        <p className={styles.outgoing}>
          Да, конечно! Есть свободное время в 14:00. Записать вас?
        </p>
        <small className={styles.sent}>
          <Check size={10} />
          отправлено · 9:41
        </small>
      </div>
      <div className={styles.intent}>
        <Sparkles size={11} />
        Намерение определено: запись на консультацию
      </div>
    </div>
  );
}

function CalendarPanel() {
  return (
    <div className={styles.calendarPanel}>
      <div className={styles.panelLead}>
        <p>
          <small>Подобрано свободное окно</small>
          <strong>Суббота, 21 июня</strong>
        </p>
        <span>14:00</span>
      </div>
      <div className={styles.week}>
        {[
          ["Пн", "16"],
          ["Вт", "17"],
          ["Ср", "18"],
          ["Чт", "19"],
          ["Пт", "20"],
          ["Сб", "21"],
        ].map(([day, date], index) => (
          <div key={day} className={index === 5 ? styles.daySelected : undefined}>
            <span>{day}</span>
            <strong>{date}</strong>
            <i />
          </div>
        ))}
      </div>
      <div className={styles.eventCard}>
        <span>
          <Calendar size={14} />
        </span>
        <p>
          <strong>Консультация с Анной</strong>
          <small>Суббота · 14:00–15:00</small>
        </p>
        <Check size={14} />
      </div>
    </div>
  );
}

function InvoicePanel() {
  return (
    <div className={styles.invoicePanel}>
      <div className={styles.invoicePaper}>
        <div className={styles.invoiceHead}>
          <span>IT</span>
          <p>
            <strong>Счёт №1428</strong>
            <small>21 июня 2026</small>
          </p>
          <small>Анна П.</small>
        </div>
        <div className={styles.invoiceRows}>
          <p>
            <span>Консультация</span>
            <strong>14 000 ₽</strong>
          </p>
          <p>
            <span>Разработка</span>
            <strong>10 000 ₽</strong>
          </p>
        </div>
        <div className={styles.invoiceTotal}>
          <span>Итого</span>
          <strong>24 000 ₽</strong>
        </div>
      </div>
      <div className={styles.invoiceSent}>
        <span>
          <Send size={13} />
        </span>
        <p>
          <strong>Счёт отправлен клиенту</strong>
          <small>Email + Telegram</small>
        </p>
        <Check size={13} />
      </div>
    </div>
  );
}

function ResultPanel() {
  return (
    <div className={styles.resultPanel}>
      <div className={styles.resultHero}>
        <span>
          <Check size={25} />
        </span>
        <p>
          <small>Заявка обработана полностью</small>
          <strong>AI сделал всё за вас</strong>
        </p>
      </div>
      <div className={styles.resultMetrics}>
        <div>
          <strong>24</strong>
          <span>диалога</span>
        </div>
        <div>
          <strong>6</strong>
          <span>встреч</span>
        </div>
        <div>
          <strong>12</strong>
          <span>счетов</span>
        </div>
      </div>
      <div className={styles.savedTime}>
        <Clock size={14} />
        <span>
          Сегодня команда сэкономила <strong>3 часа</strong>
        </span>
      </div>
    </div>
  );
}

const PANELS = [ChatPanel, CalendarPanel, InvoicePanel, ResultPanel] as const;

export function AssistantEnhancedMock({
  accent = "#8b78ff",
  className,
}: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [manualPhase, setManualPhase] = useState<number | null>(null);
  const activePhase = manualPhase ?? (reduced ? PHASES.length - 1 : phase);

  useEffect(() => {
    if (reduced || manualPhase !== null) return;

    const timer = window.setTimeout(() => {
      setPhase((current) => (current + 1) % PHASES.length);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [phase, reduced, manualPhase]);

  return (
    <div
      className={cn(styles.scene, className)}
      style={{ "--assistant-accent": accent } as React.CSSProperties}
    >
      <div aria-hidden="true" className={styles.grid} />
      <div aria-hidden="true" className={styles.aurora} />

      <header className={styles.header}>
        <div className={styles.agent}>
          <span className={styles.agentCore}>
            <Sparkles size={15} />
            <i />
          </span>
          <p>
            <strong>AI-помощник</strong>
            <small>{PHASES[activePhase].status}…</small>
          </p>
        </div>
        <span className={styles.live}>
          <i />
          LIVE · 24/7
        </span>
      </header>

      <div className={styles.body}>
        <nav className={styles.phaseNav} aria-label="Этапы работы AI-помощника">
          {PHASES.map(({ title, icon: Icon }, index) => (
            <button
              key={title}
              type="button"
              onClick={() => setManualPhase(index)}
              aria-label={`Показать этап: ${title}`}
              aria-pressed={activePhase === index}
              className={cn(
                styles.phaseButton,
                activePhase === index && styles.phaseButtonActive,
                index < activePhase && styles.phaseButtonDone,
              )}
            >
              <span>
                {index < activePhase ? (
                  <Check size={12} />
                ) : (
                  <Icon size={12} strokeWidth={1.7} />
                )}
              </span>
              <p>
                <small>0{index + 1}</small>
                <strong>{title}</strong>
              </p>
            </button>
          ))}
        </nav>

        <section className={styles.stage} aria-live="polite">
          <div className={styles.stageTop}>
            <span>ВЫПОЛНЕНИЕ СЦЕНАРИЯ</span>
            <strong>{activePhase + 1} / {PHASES.length}</strong>
          </div>
          <div className={styles.progress}>
            <span key={activePhase} />
          </div>

          <div className={styles.panels}>
            {PANELS.map((Panel, index) => (
              <div
                key={PHASES[index].title}
                className={cn(
                  styles.panel,
                  activePhase === index && styles.panelActive,
                )}
                aria-hidden={activePhase !== index}
              >
                <Panel />
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className={styles.integrations}>
        <span>
          <i />
          INTEGRATIONS
        </span>
        {["Telegram", "Календарь", "CRM", "Платежи"].map((service) => (
          <span key={service} className={styles.service}>
            <i />
            {service}
          </span>
        ))}
        <span className={styles.synced}>
          <Database size={10} />
          synced
        </span>
      </footer>
    </div>
  );
}
