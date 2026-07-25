"use client";

import { useEffect, useRef, useState } from "react";
import { Frame } from "./Frame";
import type { MockupProps } from "./Frame";

const DESKTOP_W = 1440;
const DESKTOP_H = 1080;

// Below this container width we switch to native mobile rendering
const MOBILE_THRESHOLD = 600;

type Props = MockupProps & { url: string; className?: string };

export function IframeMock({ accent, url, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [iframeW, setIframeW] = useState(DESKTOP_W);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const cw = entry.contentRect.width;
      if (cw < MOBILE_THRESHOLD) {
        // Mobile: let the site render its own responsive layout
        setIframeW(cw);
        setScale(1);
      } else {
        // Desktop: force full desktop width and scale to fit
        setIframeW(DESKTOP_W);
        setScale(cw / DESKTOP_W);
      }
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
        <iframe
          src={url}
          style={{
            width: iframeW,
            height: DESKTOP_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "none",
          }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Авангард — живой кейс"
        />
      </div>
    </Frame>
  );
}
