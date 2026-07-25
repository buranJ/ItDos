"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";

/** AI ops cockpit — three live processes at once: a streaming agent log,
 *  a ticking throughput counter, and a task queue that resolves in real time. */
const LOG = [
  "› запрос: счёт для заказа #1428",
  "› RAG: найдено 3 документа",
  "› tool: crm.createInvoice()",
  "✓ счёт создан и отправлен",
];

const QUEUE = ["Заявка #1431", "Счёт #872", "Отчёт Q2", "Заявка #1432"];

function group(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function CommandCenterMock({ accent, className }: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [kpi, setKpi] = useState(1284);
  const [resolved, setResolved] = useState(0);

  // streaming agent log (typewriter)
  useEffect(() => {
    if (reduced) {
      setLineIdx(LOG.length);
      setTyped("");
      return;
    }
    let li = 0;
    let ci = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (li >= LOG.length) {
        t = setTimeout(() => {
          li = 0;
          ci = 0;
          setLineIdx(0);
          setTyped("");
          tick();
        }, 2000);
        return;
      }
      const line = LOG[li];
      if (ci <= line.length) {
        setTyped(line.slice(0, ci));
        ci += 1;
        t = setTimeout(tick, 34);
      } else {
        li += 1;
        ci = 0;
        setLineIdx(li);
        setTyped("");
        t = setTimeout(tick, 380);
      }
    };
    t = setTimeout(tick, 300);
    return () => clearTimeout(t);
  }, [reduced]);

  // ticking throughput counter
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setKpi((k) => k + Math.ceil(Math.random() * 6)), 450);
    return () => clearInterval(id);
  }, [reduced]);

  // task queue resolving
  useEffect(() => {
    if (reduced) {
      setResolved(QUEUE.length);
      return;
    }
    const id = setInterval(() => setResolved((r) => (r + 1) % (QUEUE.length + 1)), 950);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <Frame accent={accent} variant="app" label="AI Command Center · ITDOS" className={className}>
      <div className="flex h-full flex-col gap-2.5 p-3">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="m-pulse h-2 w-2 rounded-full bg-m" />
            <span className="text-[11px] font-medium text-fg">Агенты в работе</span>
          </div>
          <span className="font-mono text-[10px] text-fg-muted">4 активны</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.5fr_1fr] gap-2.5">
          {/* live agent log */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-line bg-bg p-2.5">
            <span className="mb-1.5 font-mono text-[8px] uppercase tracking-widest text-fg-faint">
              лог агента
            </span>
            <div className="flex flex-col gap-1 font-mono text-[9.5px] leading-relaxed">
              {LOG.slice(0, lineIdx).map((l, i) => (
                <p key={i} className={l.startsWith("✓") ? "text-m" : "text-fg-secondary"}>
                  {l}
                </p>
              ))}
              {lineIdx < LOG.length && (
                <p className="text-fg-secondary">
                  {typed}
                  <span className="ml-0.5 inline-block w-1 animate-pulse text-m">▍</span>
                </p>
              )}
            </div>
          </div>

          {/* right column: KPI + queue */}
          <div className="flex min-h-0 flex-col gap-2.5">
            {/* throughput KPI */}
            <div className="rounded-lg border border-line bg-surface/40 p-2.5">
              <p className="font-mono text-[8px] uppercase tracking-widest text-fg-muted">
                обработано
              </p>
              <p className="mt-0.5 font-display text-xl font-semibold tabular-nums text-fg">
                {group(kpi)}
              </p>
              <p className="text-[9px] text-m">▲ +12% за час</p>
            </div>

            {/* resolving queue */}
            <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden rounded-lg border border-line bg-surface/40 p-2.5">
              <span className="font-mono text-[8px] uppercase tracking-widest text-fg-muted">
                очередь
              </span>
              {QUEUE.map((q, i) => {
                const done = reduced || i < resolved;
                const work = !reduced && i === resolved;
                return (
                  <div key={q} className="flex items-center gap-1.5">
                    {done ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-m text-[8px] font-bold text-accent-ink">
                        ✓
                      </span>
                    ) : work ? (
                      <span className="m-spin h-3.5 w-3.5 rounded-full border-2 border-m/25 border-t-m" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-line" />
                    )}
                    <span
                      className={`truncate text-[9.5px] transition-colors duration-300 ${
                        done ? "text-fg-secondary" : work ? "text-fg" : "text-fg-muted"
                      }`}
                    >
                      {q}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
