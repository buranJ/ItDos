"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// iPhone 15 Pro logical resolution
const PHONE_W = 393;
const PHONE_H = 852;

type Props = { url: string; accent?: string; className?: string };

export function PhoneMock({ url, accent = "#2bd4c4", className }: Props) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / PHONE_W);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl",
        className,
      )}
      style={{
        background: `radial-gradient(ellipse at 50% 65%, ${accent}28 0%, ${accent}0a 45%, transparent 70%)`,
      }}
    >
      {/* Intermediate layer: absolute inset-0 gives a definite height so that
          the phone body's height:96% resolves correctly on iOS Safari */}
      <div className="absolute inset-0 flex items-center justify-center">
      {/* Phone shell */}
      <div
        className="relative"
        style={{
          height: "96%",
          aspectRatio: `${PHONE_W} / ${PHONE_H}`,
          filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.85)) drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
        }}
      >
        {/* ── Titanium frame ── */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "14.5%",
            background:
              "linear-gradient(145deg, #5a5a5e 0%, #3a3a3c 25%, #242426 55%, #3c3c3e 80%, #5a5a5e 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.1)",
          }}
        >
          {/* ── Screen glass (inset = bezel) ── */}
          <div
            className="absolute overflow-hidden bg-black"
            style={{
              inset: "2%",
              borderRadius: "13%",
            }}
          >
            {/* Glass sheen */}
            <div
              className="pointer-events-none absolute inset-0 z-30"
              style={{
                borderRadius: "13%",
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.07) 0%, transparent 40%)",
              }}
            />

            {/* Dynamic Island */}
            <div
              className="absolute left-1/2 z-20 -translate-x-1/2 bg-black"
              style={{
                top: "2.2%",
                width: "32%",
                height: "4.1%",
                borderRadius: "999px",
                boxShadow: "0 0 0 1.5px #1c1c1e",
              }}
            />

            {/* Status bar spacer so page content doesn't hide under island */}
            <div className="absolute inset-0 z-10 overflow-hidden" ref={screenRef}>
              <iframe
                src={url}
                style={{
                  width: PHONE_W,
                  height: PHONE_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  border: "none",
                  display: "block",
                }}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                title="Имбирь — мобильное приложение"
              />
            </div>

            {/* Home indicator */}
            <div
              className="pointer-events-none absolute bottom-[2%] left-1/2 z-20 -translate-x-1/2 rounded-full"
              style={{
                width: "27%",
                height: "0.55%",
                background: "rgba(255,255,255,0.42)",
              }}
            />
          </div>
        </div>

        {/* ── Physical buttons ── */}

        {/* Silent toggle */}
        <div
          className="absolute rounded-l-sm"
          style={{
            left: "-1.6%",
            top: "11.5%",
            width: "1.6%",
            height: "3.2%",
            background: "linear-gradient(to right, #2a2a2c, #3e3e40)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            borderRadius: "2px 0 0 2px",
          }}
        />
        {/* Volume + */}
        <div
          className="absolute"
          style={{
            left: "-1.6%",
            top: "18.5%",
            width: "1.6%",
            height: "6.8%",
            background: "linear-gradient(to right, #2a2a2c, #3e3e40)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            borderRadius: "2px 0 0 2px",
          }}
        />
        {/* Volume − */}
        <div
          className="absolute"
          style={{
            left: "-1.6%",
            top: "27.5%",
            width: "1.6%",
            height: "6.8%",
            background: "linear-gradient(to right, #2a2a2c, #3e3e40)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            borderRadius: "2px 0 0 2px",
          }}
        />
        {/* Power */}
        <div
          className="absolute"
          style={{
            right: "-1.6%",
            top: "20%",
            width: "1.6%",
            height: "10.5%",
            background: "linear-gradient(to left, #2a2a2c, #3e3e40)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>
      </div>
    </div>
  );
}
