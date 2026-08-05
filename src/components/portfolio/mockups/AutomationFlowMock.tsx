import {
  BadgeCheck,
  BrainCircuit,
  ClipboardCheck,
  Database,
  Globe2,
  MessageCircle,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockupProps } from "./Frame";
import styles from "./AutomationFlowMock.module.css";

const SOURCES = [
  {
    icon: Globe2,
    title: "Форма сайта",
    detail: "Новая заявка",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    detail: "Вопрос клиента",
  },
  {
    icon: Database,
    title: "CRM",
    detail: "Новый лид",
  },
] as const;

const ACTIONS = [
  {
    icon: BadgeCheck,
    title: "Lead score",
    detail: "87 / 100",
  },
  {
    icon: Send,
    title: "Ответ клиенту",
    detail: "< 1 секунды",
  },
  {
    icon: ClipboardCheck,
    title: "Задача в CRM",
    detail: "Назначена",
  },
] as const;

const PIPELINE = ["Триггер", "Контекст", "Решение", "Действие"] as const;

export function AutomationFlowMock({
  accent = "#8b78ff",
  className,
}: MockupProps & { className?: string }) {
  return (
    <div
      className={cn(styles.scene, className)}
      style={{ "--flow-accent": accent } as React.CSSProperties}
    >
      <div aria-hidden="true" className={styles.grid} />
      <div aria-hidden="true" className={styles.ambient} />

      <header className={styles.topbar}>
        <div className={styles.live}>
          <span />
          AUTOMATION LIVE
        </div>
        <div className={styles.topMetric}>
          <strong>148</strong>
          <span>процессов сегодня</span>
        </div>
        <div className={styles.success}>
          <BadgeCheck size={13} />
          99.2% success
        </div>
      </header>

      <div className={styles.workflow}>
        <div aria-hidden="true" className={styles.routes}>
          <i className={cn(styles.route, styles.routeInOne)}>
            <span />
          </i>
          <i className={cn(styles.route, styles.routeInTwo)}>
            <span />
          </i>
          <i className={cn(styles.route, styles.routeInThree)}>
            <span />
          </i>
          <i className={cn(styles.route, styles.routeOutOne)}>
            <span />
          </i>
          <i className={cn(styles.route, styles.routeOutTwo)}>
            <span />
          </i>
          <i className={cn(styles.route, styles.routeOutThree)}>
            <span />
          </i>
          <i className={cn(styles.spine, styles.spineLeft)} />
          <i className={cn(styles.spine, styles.spineRight)} />
          <i className={cn(styles.bridge, styles.bridgeLeft)}>
            <span />
          </i>
          <i className={cn(styles.bridge, styles.bridgeRight)}>
            <span />
          </i>
        </div>

        <div className={styles.sourceColumn}>
          <p className={styles.columnLabel}>ВХОДЯЩИЕ СОБЫТИЯ</p>
          {SOURCES.map(({ icon: Icon, title, detail }, index) => (
            <div
              key={title}
              className={styles.node}
              style={{ "--delay": `${index * 1.05}s` } as React.CSSProperties}
            >
              <span className={styles.nodeIcon}>
                <Icon size={15} strokeWidth={1.7} />
              </span>
              <span className={styles.nodeCopy}>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
              <span aria-hidden="true" className={styles.nodeStatus} />
            </div>
          ))}
        </div>

        <div className={styles.core}>
          <span aria-hidden="true" className={styles.coreOrbit} />
          <span aria-hidden="true" className={styles.coreOrbitInner} />
          <div className={styles.coreBody}>
            <BrainCircuit size={25} strokeWidth={1.45} />
            <strong>AI CORE</strong>
            <small>orchestrator</small>
          </div>
          <div className={styles.reasoning}>
            <Sparkles size={10} />
            Контекст найден · 96%
          </div>
        </div>

        <div className={styles.actionColumn}>
          <p className={styles.columnLabel}>ДЕЙСТВИЯ AI</p>
          {ACTIONS.map(({ icon: Icon, title, detail }, index) => (
            <div
              key={title}
              className={styles.node}
              style={{
                "--delay": `${(index + 3) * 1.05}s`,
              } as React.CSSProperties}
            >
              <span className={styles.nodeIcon}>
                <Icon size={15} strokeWidth={1.7} />
              </span>
              <span className={styles.nodeCopy}>
                <strong>{title}</strong>
                <small>{detail}</small>
              </span>
              <span aria-hidden="true" className={styles.nodeStatus} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.pipeline}>
        <div className={styles.pipelineTitle}>
          <span>
            <Zap size={11} fill="currentColor" />
            Workflow
          </span>
          <small>цикл 4.8 сек</small>
        </div>
        <div className={styles.pipelineSteps}>
          {PIPELINE.map((step, index) => (
            <div
              key={step}
              className={styles.pipelineStep}
              style={{
                "--step-delay": `${index * 1.2}s`,
              } as React.CSSProperties}
            >
              <span>0{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
