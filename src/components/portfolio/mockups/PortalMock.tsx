import { Frame, type MockupProps } from "./Frame";

const rows = [
  { w: "w-28", status: "ok" },
  { w: "w-20", status: "wait" },
  { w: "w-32", status: "ok" },
  { w: "w-24", status: "wait" },
  { w: "w-28", status: "ok" },
];

/** Corporate portal / document workflow placeholder. */
export function PortalMock({ accent, className }: MockupProps & { className?: string }) {
  return (
    <Frame accent={accent} variant="app" label="Бишкек суу Водоканал" className={className}>
      <div className="flex h-full flex-col gap-3 p-4">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-32 rounded bg-fg/25" />
          <div className="flex items-center gap-2">
            <div className="h-7 w-28 rounded-full border border-line bg-surface/60" />
            <div className="h-7 w-7 rounded-full bg-m" />
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-5 border-b border-line pb-2">
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-14 rounded bg-fg/30" />
            <div className="h-0.5 w-full rounded bg-m" />
          </div>
          <div className="h-2 w-16 rounded bg-fg/12" />
          <div className="h-2 w-12 rounded bg-fg/12" />
        </div>

        {/* table */}
        <div className="flex flex-1 flex-col">
          {rows.map((r, i) => (
            <div
              key={i}
              className="m-sweep flex items-center gap-3 border-b border-line/60 py-2"
              style={{ animationDelay: `${i * 0.5}s`, animationDuration: "6s" }}
            >
              <div className="h-6 w-6 shrink-0 rounded-full bg-fg/10" />
              <div className={`h-2.5 ${r.w} rounded bg-fg/18`} />
              <div className="ml-auto flex items-center gap-3">
                {r.status === "ok" ? (
                  <div className="h-5 w-14 rounded-full bg-m-soft" />
                ) : (
                  <div className="h-5 w-14 rounded-full border border-line bg-surface/50" />
                )}
                <div className="h-2 w-10 rounded bg-fg/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
