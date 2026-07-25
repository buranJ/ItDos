import { cn } from "@/lib/utils";

export type MockupProps = {
  accent?: string;
  className?: string;
};

type FrameProps = {
  children: React.ReactNode;
  accent?: string;
  label?: string;
  variant?: "browser" | "app";
  className?: string;
};

/** Shared window chrome for the generative product mockups. Sets the
 *  per-instance `--m-accent` var consumed by the .text-m / .bg-m helpers. */
export function Frame({
  children,
  accent,
  label,
  variant = "browser",
  className,
}: FrameProps) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel",
        className
      )}
      style={accent ? ({ "--m-accent": accent } as React.CSSProperties) : undefined}
    >
      {/* chrome */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-line bg-surface/70 px-3.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-m" />
        </span>
        {variant === "browser" ? (
          <span className="mx-auto flex h-5 w-[58%] items-center justify-center truncate rounded-full bg-bg px-3 text-[10px] text-fg-muted">
            {label ?? "itdos.ru"}
          </span>
        ) : (
          <span className="ml-1.5 text-[11px] font-medium text-fg-secondary">
            {label}
          </span>
        )}
      </div>
      <div className="relative flex-1">{children}</div>
    </div>
  );
}
