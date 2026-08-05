"use client";

import { useEffect, useRef, useState } from "react";
import { Frame } from "./Frame";
import type { MockupProps } from "./Frame";
import { useInView } from "@/hooks/useInView";

const DESKTOP_W = 1440;
const DESKTOP_H = 1080;

// Below this container width we switch to native mobile rendering
const MOBILE_THRESHOLD = 600;

type Props = MockupProps & { url: string; className?: string };

export function IframeMock({ accent, url, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [viewRef, inView] = useInView<HTMLDivElement>();
  // `null` until the container has actually been measured. Rendering the
  // iframe before that gives it the 1440px desktop width, and a 1440px box
  // on a 390px phone blows the layout viewport wide open — the page then
  // renders zoomed out and the header controls land off-screen. So: measure
  // first, render second.
  const [box, setBox] = useState<{ width: number; scale: number } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const cw = entry.contentRect.width;
      if (!cw) return;
      setBox(
        cw < MOBILE_THRESHOLD
          ? // Mobile: let the site render its own responsive layout
            { width: cw, scale: 1 }
          : // Desktop: force full desktop width and scale to fit
            { width: DESKTOP_W, scale: cw / DESKTOP_W },
      );
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hostname = (() => {
    try { return new URL(url).hostname; } catch { return url; }
  })();

  return (
    <Frame accent={accent} variant="browser" label={hostname} className={className}>
      <div ref={wrapRef} className="relative h-full w-full overflow-hidden bg-white">
        <div ref={viewRef} className="absolute inset-0">
          {box && inView && (
            <iframe
              src={url}
              style={{
                // Absolutely positioned inside a clipped parent: the scaled
                // desktop viewport is painted but never contributes to the
                // page's layout width.
                position: "absolute",
                top: 0,
                left: 0,
                width: box.width,
                height: DESKTOP_H,
                transform: `scale(${box.scale})`,
                transformOrigin: "top left",
                border: "none",
              }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="Авангард — живой кейс"
            />
          )}
        </div>
      </div>
    </Frame>
  );
}
