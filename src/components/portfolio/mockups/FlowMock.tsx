"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";

/** Automation flow graph: trigger → glowing AI core → action nodes.
 *  Data flows along the edges; each action lights up + gets a ✓ in turn. */
const ACTIONS = [
  { x: 60, label: "CRM" },
  { x: 160, label: "Почта" },
  { x: 260, label: "Telegram" },
];

export function FlowMock({ accent, className }: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % ACTIONS.length), 1300);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <Frame accent={accent} variant="app" label="AI-агент · ITDOS" className={className}>
      <div className="relative h-full w-full overflow-hidden p-2">
        <svg viewBox="0 0 320 210" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
          <defs>
            <radialGradient id="flow-core-glow">
              <stop offset="0%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* trigger → core */}
          <line x1="160" y1="48" x2="160" y2="80" className="stroke-line" strokeWidth="1.5" />
          <line x1="160" y1="48" x2="160" y2="80" className="m-flow stroke-m" strokeWidth="1.5" />

          {/* core → actions (active edge is brighter + faster) */}
          {ACTIONS.map((a, i) => {
            const d = `M160,120 C160,146 ${a.x},134 ${a.x},160`;
            const on = i === active;
            return (
              <g key={`edge-${a.label}`}>
                <path d={d} className="stroke-line" strokeWidth="1.5" fill="none" />
                <path
                  d={d}
                  className="m-flow stroke-m"
                  strokeWidth={on ? 2.4 : 1.2}
                  fill="none"
                  style={{
                    opacity: reduced ? 1 : on ? 1 : 0.4,
                    transition: "opacity .4s ease, stroke-width .4s ease",
                    animationDuration: on ? "0.8s" : "1.5s",
                  }}
                />
              </g>
            );
          })}

          {/* trigger node */}
          <rect x="118" y="22" width="84" height="26" rx="8" className="fill-surface stroke-line" strokeWidth="1" />
          <circle cx="132" cy="35" r="3" className="m-pulse fill-m" />
          <text x="168" y="39" textAnchor="middle" className="fill-fg" fontSize="11">Заявка</text>

          {/* AI core */}
          <circle cx="160" cy="100" r="42" fill="url(#flow-core-glow)" />
          <circle cx="160" cy="100" r="30" className="m-signal stroke-m" strokeWidth="1" fill="none" />
          <circle cx="160" cy="100" r="24" className="m-pulse stroke-m" strokeWidth="1.5" fill="none" />
          <circle cx="160" cy="100" r="19" className="fill-m" />
          <text x="160" y="105" textAnchor="middle" className="fill-accent-ink" fontSize="13" fontWeight="700">
            AI
          </text>

          {/* action nodes — active one lights up */}
          {ACTIONS.map((a, i) => {
            const on = reduced || i === active;
            return (
              <g key={`node-${a.label}`} style={{ transition: "opacity .4s ease", opacity: on ? 1 : 0.55 }}>
                <rect
                  x={a.x - 38}
                  y="160"
                  width="76"
                  height="30"
                  rx="9"
                  className={on ? "stroke-m" : "stroke-line"}
                  strokeWidth="1"
                  style={{
                    fill: on
                      ? "color-mix(in oklab, var(--m-accent, var(--color-accent)) 14%, transparent)"
                      : "var(--color-surface)",
                    transition: "fill .4s ease",
                  }}
                />
                <text x={a.x - 4} y="179" textAnchor="middle" className={on ? "fill-m" : "fill-fg-secondary"} fontSize="10">
                  {a.label}
                </text>
                <text x={a.x + 26} y="180" textAnchor="middle" className="fill-m" fontSize="11" style={{ opacity: on ? 1 : 0 }}>
                  ✓
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Frame>
  );
}
