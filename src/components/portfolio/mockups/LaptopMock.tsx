"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

type Props = { url: string; accent?: string; className?: string };

/** Pull an 11-char YouTube id out of a full link, or pass through an id. */
function ytId(input: string): string {
  if (!/[/.]/.test(input)) return input;
  const m = input.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);
  return m ? m[1] : input;
}

/** Laptop device mock with an autoplaying looping video on screen.
 *  The clip is embedded from the privacy domain with chrome/branding removed
 *  and slightly zoomed + click-locked so it reads as a plain product video,
 *  not a YouTube embed. */
export function LaptopMock({ url, accent = "#6e56ff", className }: Props) {
  // The YouTube player pulls ~1.1MB of third-party JS, so it only mounts
  // once the visitor scrolls the device into view.
  const [viewRef, inView] = useInView<HTMLDivElement>();
  const id = ytId(url);
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`;

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden rounded-xl", className)}
      style={{
        background: `radial-gradient(ellipse at 50% 55%, ${accent}26 0%, ${accent}0a 45%, transparent 70%)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-[600px]"
          style={{ filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.8)) drop-shadow(0 8px 16px rgba(0,0,0,0.5))" }}
        >
          {/* ── Lid / screen ── */}
          <div
            className="relative rounded-t-xl p-[1.4%]"
            style={{
              background: "linear-gradient(150deg,#4a4a4e 0%,#2a2a2c 40%,#202022 70%,#3a3a3e 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
            }}
          >
            {/* camera */}
            <div className="absolute left-1/2 top-[3px] z-20 h-1 w-1 -translate-x-1/2 rounded-full bg-white/25" />

            {/* screen glass */}
            <div ref={viewRef} className="relative aspect-video overflow-hidden rounded-md bg-black">
              {inView && (
                <iframe
                  src={src}
                  title="Обзор проекта"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="pointer-events-none absolute left-1/2 top-1/2"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: 0,
                    transform: "translate(-50%,-50%) scale(1.2)",
                  }}
                />
              )}
              {/* mask any residual top strip + add a subtle glass sheen */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[14%]"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }}
              />
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, transparent 42%)" }}
              />
            </div>
          </div>

          {/* ── Base / keyboard deck ── */}
          <div
            className="relative mx-auto"
            style={{
              width: "112%",
              marginLeft: "-6%",
              height: "13px",
              background: "linear-gradient(180deg,#3c3c40 0%,#242427 60%,#15151700 100%)",
              clipPath: "polygon(1.5% 0, 98.5% 0, 100% 100%, 0 100%)",
              borderRadius: "0 0 10px 10px",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {/* trackpad lip notch */}
            <div className="absolute left-1/2 top-0 h-[3px] w-[13%] -translate-x-1/2 rounded-b-md bg-black/35" />
          </div>
        </div>
      </div>
    </div>
  );
}
