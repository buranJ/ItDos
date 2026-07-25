import { Frame, type MockupProps } from "./Frame";

/** Marketplace catalogue placeholder. */
export function MarketplaceMock({ accent, className }: MockupProps & { className?: string }) {
  return (
    <Frame accent={accent} variant="browser" label="distore.kg" className={className}>
      <div className="flex h-full flex-col gap-3.5 p-4 sm:p-5">
        {/* search + filters */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-3">
            <div className="h-2.5 w-2.5 rounded-full border border-fg/30" />
            <div className="h-2 w-2/5 rounded bg-fg/12" />
          </div>
          <div className="h-8 w-8 rounded-lg bg-m" />
        </div>
        <div className="flex gap-2">
          {["w-16", "w-12", "w-20", "w-14"].map((w, i) => (
            <div
              key={i}
              className={`h-6 ${w} rounded-full ${i === 0 ? "bg-m text-m" : "border border-line bg-surface/50"}`}
            />
          ))}
        </div>

        {/* product grid */}
        <div className="mt-1 grid flex-1 grid-cols-4 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="relative flex-1 overflow-hidden rounded-lg border border-line bg-surface">
                <div
                  className="absolute inset-0 m-shimmer"
                  style={{ animationDelay: `${(i % 4) * 0.4}s` }}
                />
                {i === 2 && (
                  <div className="absolute left-1 top-1 h-3 w-6 rounded-full bg-m" />
                )}
              </div>
              <div className="h-1.5 w-4/5 rounded bg-fg/15" />
              <div className="h-1.5 w-1/2 rounded bg-m" />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
