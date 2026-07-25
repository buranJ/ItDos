"use client";

import { useEffect, useState } from "react";
import { Frame, type MockupProps } from "./Frame";
import { useReducedMotion } from "@/lib/motion";

/** Abstract neural network: a wave of activation sweeps through the layers,
 *  synapses flow, the output node fires the result. */
const IX = 50;
const HX = 160;
const OX = 262;
const IN = [44, 92, 132, 180];
const HID = [36, 80, 116, 152, 188];
const OUT = [88, 134];

// the "active" path that lights up through the net
const ACTIVE: [number, number, number, number][] = [
  [IX, IN[1], HX, HID[1]],
  [HX, HID[1], OX, OUT[0]],
  [IX, IN[2], HX, HID[3]],
  [HX, HID[3], OX, OUT[0]],
  [HX, HID[2], OX, OUT[0]],
];

export function NeuralMock({ accent, className }: MockupProps & { className?: string }) {
  const reduced = useReducedMotion();
  // layer: 0=input, 1=hidden, 2=output currently firing
  const [layer, setLayer] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setLayer((l) => (l + 1) % 3), 700);
    return () => clearInterval(id);
  }, [reduced]);

  const lit = (l: number) => (reduced ? 1 : layer === l ? 1 : 0.4);
  const nodeStyle = (l: number, delay = 0) => ({
    transition: `opacity .35s ease ${delay}ms`,
    opacity: lit(l),
  });

  return (
    <Frame accent={accent} variant="app" label="AI-агент · ITDOS" className={className}>
      <div className="relative h-full w-full overflow-hidden p-2">
        <svg viewBox="0 0 320 210" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
          <defs>
            <radialGradient id="nn-glow">
              <stop offset="0%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* faint full mesh */}
          <g className="stroke-line" strokeWidth="0.75" fill="none" opacity="0.5">
            {IN.map((iy, i) =>
              HID.map((hy, j) => <line key={`ih-${i}-${j}`} x1={IX} y1={iy} x2={HX} y2={hy} />)
            )}
            {HID.map((hy, i) =>
              OUT.map((oy, j) => <line key={`ho-${i}-${j}`} x1={HX} y1={hy} x2={OX} y2={oy} />)
            )}
          </g>

          {/* active flowing synapses */}
          <g className="m-flow stroke-m" strokeWidth="1.5" fill="none">
            {ACTIVE.map(([x1, y1, x2, y2], i) => (
              <line key={`a-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </g>

          {/* nodes — light up layer by layer */}
          {IN.map((y, i) => (
            <circle key={`i-${i}`} cx={IX} cy={y} r="5" className="fill-m" style={nodeStyle(0, i * 40)} />
          ))}
          {HID.map((y, i) => (
            <circle key={`h-${i}`} cx={HX} cy={y} r="5.5" className="fill-m" style={nodeStyle(1, i * 40)} />
          ))}
          <circle cx={OX} cy={OUT[1]} r="6" className="fill-m" style={nodeStyle(2)} />

          {/* output result node — glows when the output layer fires */}
          <circle cx={OX} cy={OUT[0]} r="24" fill="url(#nn-glow)" style={{ transition: "opacity .35s ease", opacity: lit(2) }} />
          <circle cx={OX} cy={OUT[0]} r="13" className="m-pulse stroke-m" strokeWidth="1.5" fill="none" />
          <circle cx={OX} cy={OUT[0]} r="8" className="fill-m" />

          {/* layer labels */}
          <text x={IX} y="16" textAnchor="middle" className="fill-fg-muted" fontSize="8">вход</text>
          <text x={HX} y="16" textAnchor="middle" className="fill-fg-muted" fontSize="8">скрытый слой</text>
          <text x={OX} y="16" textAnchor="middle" className="fill-fg-muted" fontSize="8">вывод</text>
        </svg>

        {/* result chip — appears when the output layer fires */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-m bg-m-soft px-2.5 py-1 text-[10px] text-m"
          style={{ transition: "opacity .4s ease", opacity: reduced || layer === 2 ? 1 : 0.35 }}
        >
          <span className="m-pulse h-1.5 w-1.5 rounded-full bg-m" />
          Готово ✓
        </div>
      </div>
    </Frame>
  );
}
