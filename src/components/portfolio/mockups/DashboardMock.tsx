import { Frame, type MockupProps } from "./Frame";

const kpis = [
  { label: "GMV", delta: "+12.4%" },
  { label: "TXN", delta: "+8.1%" },
  { label: "AOV", delta: "+3.6%" },
];

/** Fintech analytics dashboard placeholder. */
export function DashboardMock({ accent, className }: MockupProps & { className?: string }) {
  return (
    <Frame accent={accent} variant="app" label="LifePay · Дашборд" className={className}>
      <div className="flex h-full">
        {/* sidebar */}
        <div className="flex w-12 shrink-0 flex-col items-center gap-3.5 border-r border-line bg-surface/50 py-4">
          <div className="h-6 w-6 rounded-lg bg-m" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-5 rounded-md bg-fg/10" />
          ))}
        </div>

        {/* main */}
        <div className="flex flex-1 flex-col gap-3.5 p-4">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-3">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="rounded-lg border border-line bg-surface/40 p-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-fg-muted">{k.label}</span>
                  <span className="font-mono text-[9px] text-m">{k.delta}</span>
                </div>
                <div className="mt-2 h-2.5 w-2/3 rounded bg-fg/25" />
              </div>
            ))}
          </div>

          {/* line chart */}
          <div className="relative flex-1 overflow-hidden rounded-lg border border-line bg-surface/30 p-3">
            <svg viewBox="0 0 300 96" preserveAspectRatio="none" className="h-full w-full">
              {[24, 48, 72].map((y) => (
                <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              <defs>
                <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--m-accent, var(--color-accent))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,78 C40,70 60,40 96,44 C130,48 150,22 188,28 C224,34 250,12 300,8 L300,96 L0,96 Z"
                fill="url(#area-fill)"
              />
              <path
                className="m-draw stroke-m"
                d="M0,78 C40,70 60,40 96,44 C130,48 150,22 188,28 C224,34 250,12 300,8"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* mini bars */}
          <div className="flex h-10 items-end gap-1.5">
            {[0.5, 0.7, 0.4, 0.85, 0.6, 0.95, 0.7].map((h, i) => (
              <div
                key={i}
                className={`m-bar flex-1 rounded-sm ${i === 5 ? "bg-m" : "bg-m-soft"}`}
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}
