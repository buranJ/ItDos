"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  FileText,
  MessageCircle,
  Send,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";
import type { MockupProps } from "./Frame";
import styles from "./AssistantEditorialMock.module.css";

const STEPS = [
  { label: "Диалог", icon: MessageCircle },
  { label: "Встреча", icon: Calendar },
  { label: "Счёт", icon: FileText },
  { label: "Готово", icon: UserCheck },
] as const;

function Conversation() {
  return (
    <div className={styles.conversation}>
      <div className={styles.contact}>
        <span>А</span>
        <p>
          <strong>Анна Петрова</strong>
          <small>Новая заявка с сайта</small>
        </p>
        <time>09:41</time>
      </div>
      <div className={styles.dialog}>
        <p>Здравствуйте! Можно записаться на консультацию в субботу?</p>
        <p>Добрый день, Анна. Да, в 14:00 есть свободное время. Записать вас?</p>
        <small>
          <Check size={11} /> Ответ отправлен за 0,8 сек
        </small>
      </div>
      <div className={styles.note}>
        Определено намерение: <strong>запись на консультацию</strong>
      </div>
    </div>
  );
}

function Appointment() {
  return (
    <div className={styles.appointment}>
      <div className={styles.appointmentHead}>
        <p>
          <small>Календарь команды</small>
          <strong>Свободное время найдено</strong>
        </p>
        <span>Июнь 2026</span>
      </div>
      <div className={styles.dateRow}>
        {[
          ["ПТ", "20"],
          ["СБ", "21"],
          ["ВС", "22"],
          ["ПН", "23"],
        ].map(([day, date], index) => (
          <div key={day} className={index === 1 ? styles.dateActive : undefined}>
            <span>{day}</span>
            <strong>{date}</strong>
          </div>
        ))}
      </div>
      <div className={styles.booking}>
        <span>
          <Calendar size={17} />
        </span>
        <p>
          <strong>Консультация с Анной</strong>
          <small>Суббота · 14:00–15:00</small>
        </p>
        <em>Подтверждено</em>
      </div>
    </div>
  );
}

function Invoice() {
  return (
    <div className={styles.invoice}>
      <div className={styles.invoiceTitle}>
        <div>
          <span>IT</span>
          <p>
            <strong>Счёт №1428</strong>
            <small>Для Анны Петровой</small>
          </p>
        </div>
        <time>21.06.2026</time>
      </div>
      <div className={styles.invoiceTable}>
        <p>
          <span>Консультация</span>
          <strong>14 000 сом</strong>
        </p>
        <p>
          <span>Разработка</span>
          <strong>10 000 сом</strong>
        </p>
      </div>
      <div className={styles.total}>
        <span>К оплате</span>
        <strong>24 000 сом</strong>
      </div>
      <div className={styles.delivery}>
        <Send size={13} />
        Отправлен в Telegram и на email
      </div>
    </div>
  );
}

function Complete() {
  return (
    <div className={styles.complete}>
      <span>
        <Check size={30} />
      </span>
      <p>
        <small>Сценарий завершён</small>
        <strong>Клиент записан, счёт отправлен</strong>
      </p>
      <div>
        {["CRM обновлена", "Менеджер уведомлён", "Задача создана"].map((item) => (
          <span key={item}>
            <Check size={11} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const PANELS = [Conversation, Appointment, Invoice, Complete] as const;

export function AssistantEditorialMock({
  className,
}: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [manualStep, setManualStep] = useState<number | null>(null);
  const activeStep = manualStep ?? (reduced ? STEPS.length - 1 : step);

  useEffect(() => {
    if (reduced || manualStep !== null) return;

    const timer = window.setTimeout(() => {
      setStep((current) => (current + 1) % STEPS.length);
    }, 4800);

    return () => window.clearTimeout(timer);
  }, [step, reduced, manualStep]);

  return (
    <div className={cn(styles.scene, className)}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>
            <Sparkles size={12} strokeWidth={1.8} />
            AI автоматизация
          </span>
          <h4>Помощник ведёт клиента сам</h4>
        </div>
      </header>

      <nav className={styles.steps} aria-label="Этапы работы помощника">
        {STEPS.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setManualStep(index)}
            aria-label={`Показать этап: ${label}`}
            aria-pressed={activeStep === index}
            className={cn(
              activeStep === index && styles.stepActive,
              index < activeStep && styles.stepDone,
            )}
          >
            <span>{index < activeStep ? <Check size={14} /> : <Icon size={14} />}</span>
            <p>
              <small>0{index + 1}</small>
              <strong>{label}</strong>
            </p>
          </button>
        ))}
      </nav>

      <div className={styles.content}>
        <main className={styles.workspace}>
          <div className={styles.workspaceTop}>
            <span>{STEPS[activeStep].label}</span>
            <strong>{activeStep + 1} из {STEPS.length}</strong>
          </div>
          <div className={styles.progress}>
            <span key={activeStep} />
          </div>
          <div className={styles.panels}>
            {PANELS.map((Panel, index) => (
              <section
                key={STEPS[index].label}
                className={cn(
                  styles.panel,
                  index === activeStep && styles.panelActive,
                )}
                aria-hidden={index !== activeStep}
              >
                <Panel />
              </section>
            ))}
          </div>
        </main>

        <aside className={styles.value}>
          <span className={styles.valueLabel}>РЕЗУЛЬТАТ ЗА ДЕНЬ</span>
          <div className={styles.mainMetric}>
            <strong>3 ч</strong>
            <span>экономии команды</span>
          </div>
          <div className={styles.metrics}>
            <p>
              <strong>24</strong>
              <span>диалога</span>
            </p>
            <p>
              <strong>6</strong>
              <span>встреч</span>
            </p>
            <p>
              <strong>12</strong>
              <span>счетов</span>
            </p>
          </div>
          <div className={styles.valueFoot}>
            <Clock size={13} />
            Первый ответ — 0,8 сек
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>Подключено:</span>
        {["Telegram", "Календарь", "CRM", "Платежи"].map((item) => (
          <span key={item}>
            <i />
            {item}
          </span>
        ))}
      </footer>
    </div>
  );
}
