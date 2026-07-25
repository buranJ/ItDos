"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ClipRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Inner zoom-out as the frame opens (the cinematic "settle"). */
  zoom?: boolean;
  start?: string;
};

/**
 * Unseen-style media reveal: a clip-path wipe opens upward while the inner
 * content settles from a slight zoom. Initial hidden state comes from the
 * `.clip-reveal` class (SSR-safe; auto-disabled under reduced motion in CSS).
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
  duration = 1.2,
  zoom = true,
  start = "top 85%",
}: ClipRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    if (reduced) {
      gsap.set(wrap, { clipPath: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: { trigger: wrap, start },
      });
      tl.fromTo(
        wrap,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration, ease: "power4.out" }
      );
      if (zoom) {
        tl.fromTo(
          inner,
          { scale: 1.18 },
          { scale: 1, duration, ease: "power4.out" },
          0
        );
      }
    });

    return () => ctx.revert();
  }, [delay, duration, zoom, start, reduced]);

  return (
    <div ref={wrapRef} className={cn("clip-reveal overflow-hidden", className)}>
      <div ref={innerRef} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
