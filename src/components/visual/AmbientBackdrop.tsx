import { cn } from "@/lib/utils";

/** Dark immersive backdrop: masked dot-grid + drifting accent blooms + vignette.
 *  Pure CSS — reliable on every device; animation auto-pauses under reduced motion. */
export function AmbientBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* dot grid, faded toward the edges */}
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_38%,black,transparent_76%)]" />

      {/* accent bloom */}
      <div className="aurora-a accent-glow absolute -top-40 left-1/3 h-176 w-176 -translate-x-1/2 opacity-50" />

      {/* cool secondary bloom for depth */}
      <div
        className="aurora-b absolute right-0 top-1/4 h-144 w-144 opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, #3b82f6 34%, transparent), transparent 72%)",
          filter: "blur(44px)",
        }}
      />

      {/* vignette to seat content + fade into the page below */}
      <div className="absolute inset-0 [background:radial-gradient(120%_120%_at_50%_0%,transparent_45%,var(--color-bg)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
    </div>
  );
}
