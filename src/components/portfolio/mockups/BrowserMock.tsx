import { Frame, type MockupProps } from "./Frame";

/** Storefront / website placeholder. */
export function BrowserMock({ accent, className }: MockupProps & { className?: string }) {
  return (
    <Frame accent={accent} variant="browser" label="avangard.style" className={className}>
      <div className="flex h-full flex-col gap-4 p-4 sm:p-5">
        {/* site nav */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-fg/25" />
          <div className="flex items-center gap-3">
            <div className="h-2 w-9 rounded bg-fg/12" />
            <div className="h-2 w-9 rounded bg-fg/12" />
            <div className="h-2 w-9 rounded bg-fg/12" />
            <div className="h-6 w-16 rounded-full bg-m" />
          </div>
        </div>

        {/* hero */}
        <div className="grid grid-cols-5 items-center gap-4">
          <div className="col-span-3 space-y-2.5">
            <div className="m-float h-5 w-11/12 rounded bg-fg/30" />
            <div className="h-5 w-3/5 rounded bg-fg/18" />
            <div className="mt-1 h-2.5 w-4/5 rounded bg-fg/10" />
            <div className="mt-3 h-8 w-28 rounded-full bg-m" />
          </div>
          <div className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-lg border border-m bg-m-soft">
            <div className="absolute inset-0 m-shimmer" />
          </div>
        </div>

        {/* product grid */}
        <div className="mt-auto grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-surface">
                <div
                  className="absolute inset-0 m-shimmer"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
              </div>
              <div className="h-2 w-3/4 rounded bg-fg/15" />
              <div className="h-2 w-1/3 rounded bg-m" />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
