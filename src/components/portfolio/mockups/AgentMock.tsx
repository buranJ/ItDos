"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";

const STEPS: { label: string; badge?: string }[] = [
  { label: "Анализирую запрос" },
  { label: "Поиск в базе знаний", badge: "RAG · 3" },
  { label: "Вызываю CRM API" },
  { label: "Формирую отчёт" },
];

function StepIcon({ state }: { state: "done" | "work" | "pending" }) {
  if (state === "done")
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-m text-[10px] font-bold text-accent-ink">
        ✓
      </span>
    );
  if (state === "work")
    return <span className="m-spin h-5 w-5 rounded-full border-2 border-m/25 border-t-m" />;
  return <span className="h-5 w-5 rounded-full border border-line" />;
}

/** AI agent executing a real task — steps run pending → working → done on a loop. */
export function AgentMock({ accent, className }: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  // step === STEPS.length means "all done" (brief hold before the loop restarts)
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(142);

  useEffect(() => {
    if (reduced) return;
    let phase = 0;
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      setStep(phase);
      const allDone = phase === STEPS.length;
      if (!allDone) setCount((c) => c + 1);
      phase = (phase + 1) % (STEPS.length + 1);
      t = setTimeout(run, allDone ? 1900 : 1100);
    };
    t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [reduced]);

  const activeStep = reduced ? STEPS.length : step;

  return (
    <Frame accent={accent} variant="app" label="AI-агент · ITDOS" className={className}>
      <div className="flex h-full flex-col gap-3 p-4">
        {/* goal */}
        <div className="flex items-center gap-2">
          <span className="rounded bg-m-soft px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-m">
            Задача
          </span>
          <span className="text-[11px] text-fg-secondary">Обработать 142 заявки</span>
        </div>

        {/* steps */}
        <div className="flex flex-1 flex-col">
          {STEPS.map((s, i) => {
            const state = activeStep > i ? "done" : activeStep === i ? "work" : "pending";
            const last = i === STEPS.length - 1;
            return (
              <div key={s.label} className="flex gap-3">
                {/* icon + connector column */}
                <div className="flex flex-col items-center">
                  <StepIcon state={state} />
                  {!last && (
                    <div
                      className={`my-1 w-px flex-1 transition-colors duration-500 ${
                        activeStep > i ? "bg-m" : "bg-line"
                      }`}
                    />
                  )}
                </div>

                {/* content */}
                <div className={`flex-1 ${last ? "" : "pb-3"}`}>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[11px] leading-snug transition-colors duration-300 ${
                        state === "pending" ? "text-fg-muted" : "text-fg"
                      }`}
                    >
                      {s.label}
                    </p>
                    {s.badge && state !== "pending" && (
                      <span className="rounded-full bg-m-soft px-2 py-0.5 text-[9px] text-m">
                        {s.badge}
                      </span>
                    )}
                  </div>

                  {/* progress bar fills while the step is active */}
                  {state === "work" && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-fg/10">
                      <div key={activeStep} className="m-fill h-full rounded-full bg-m" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* footer stats */}
        <div className="mt-auto flex items-center gap-2 border-t border-line pt-3 text-[10px] text-fg-muted">
          <span className="m-pulse h-1.5 w-1.5 rounded-full bg-m" />
          <span>{count} задач · 0 ошибок · работает 24/7</span>
        </div>
      </div>
    </Frame>
  );
}
