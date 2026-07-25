"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";

/** Everything in one synchronized scene: a pulsing AI core with neural synapses
 *  routes a request to action nodes (flow), while an agent runs the steps and a
 *  throughput counter ticks — all driven by one shared beat. */
const ACTIONS = [
  { x: 34, label: "CRM" },
  { x: 85, label: "Почта" },
  { x: 136, label: "Чат" },
];
const STEPS = ["Принял заявку", "Нашёл данные", "Выполнил действие", "Готово"];

export function UnifiedMock({ accent, className }: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(142);

  useEffect(() => {
    if (reduced) {
      setStep(STEPS.length - 1);
      return;
    }
    const id = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
      setCount((c) => c + 1);
    }, 1150);
    return () => clearInterval(id);
  }, [reduced]);

  const activeAction = step % ACTIONS.length;

  return (
    <Frame accent={accent} variant="app" label="AI-агент · ITDOS" className={className}>
      <div className="flex h-full">
        {/* ── left: AI core + neural/flow graph ── */}
        <div className="relative w-[54%] border-r border-line">
          <svg viewBox="0 0 170 210" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
            <defs>
              <radialGradient id="uni-glow">
                <stop offset="0%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* request → core */}
            <line x1="85" y1="30" x2="85" y2="66" className="stroke-line" strokeWidth="1.5" />
            <line x1="85" y1="30" x2="85" y2="66" className="m-flow stroke-m" strokeWidth="1.5" />
            <rect x="55" y="14" width="60" height="18" rx="6" className="fill-surface stroke-line" strokeWidth="1" />
            <text x="85" y="26" textAnchor="middle" className="fill-fg-secondary" fontSize="9">запрос</text>

            {/* core → actions */}
            {ACTIONS.map((a, i) => {
              const d = `M85,108 C85,140 ${a.x},150 ${a.x},168`;
              const on = i === activeAction;
              return (
                <g key={a.label}>
                  <path d={d} className="stroke-line" strokeWidth="1.2" fill="none" />
                  <path
                    d={d}
                    className="m-flow stroke-m"
                    strokeWidth={on ? 2.2 : 1}
                    fill="none"
                    style={{
                      opacity: reduced ? 1 : on ? 1 : 0.35,
                      transition: "opacity .4s ease, stroke-width .4s ease",
                      animationDuration: on ? "0.8s" : "1.5s",
                    }}
                  />
                </g>
              );
            })}

            {/* AI core */}
            <circle cx="85" cy="88" r="38" fill="url(#uni-glow)" />
            <circle cx="85" cy="88" r="26" className="m-signal stroke-m" strokeWidth="1" fill="none" />
            <circle cx="85" cy="88" r="21" className="m-pulse stroke-m" strokeWidth="1.5" fill="none" />
            <circle cx="85" cy="88" r="16" className="fill-m" />
            <text x="85" y="92" textAnchor="middle" className="fill-accent-ink" fontSize="11" fontWeight="700">
              AI
            </text>

            {/* action nodes */}
            {ACTIONS.map((a, i) => {
              const on = reduced || i === activeAction;
              return (
                <g key={`n-${a.label}`} style={{ transition: "opacity .4s ease", opacity: on ? 1 : 0.5 }}>
                  <rect
                    x={a.x - 22}
                    y="168"
                    width="44"
                    height="22"
                    rx="7"
                    className={on ? "stroke-m" : "stroke-line"}
                    strokeWidth="1"
                    style={{
                      fill: on
                        ? "color-mix(in oklab, var(--m-accent, var(--color-accent)) 14%, transparent)"
                        : "var(--color-surface)",
                      transition: "fill .4s ease",
                    }}
                  />
                  <text x={a.x} y="182" textAnchor="middle" className={on ? "fill-m" : "fill-fg-secondary"} fontSize="8">
                    {a.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── right: agent run + counter ── */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <span className="font-mono text-[8px] uppercase tracking-widest text-fg-faint">агент</span>

          <div className="flex flex-1 flex-col justify-center gap-2">
            {STEPS.map((label, i) => {
              const state = step > i ? "done" : step === i ? "work" : "pending";
              return (
                <div key={label} className="flex items-center gap-2">
                  {state === "done" ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-m text-[8px] font-bold text-accent-ink">
                      ✓
                    </span>
                  ) : state === "work" ? (
                    <span className="m-spin h-4 w-4 rounded-full border-2 border-m/25 border-t-m" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-line" />
                  )}
                  <span
                    className={`text-[10px] transition-colors duration-300 ${
                      state === "pending" ? "text-fg-muted" : "text-fg"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-line bg-surface/40 px-2.5 py-2">
            <p className="font-mono text-[8px] uppercase tracking-widest text-fg-muted">обработано</p>
            <p className="font-display text-base font-semibold tabular-nums text-fg">
              {count} <span className="text-[9px] font-normal text-m">▲ 24/7</span>
            </p>
          </div>
        </div>
      </div>
    </Frame>
  );
}
