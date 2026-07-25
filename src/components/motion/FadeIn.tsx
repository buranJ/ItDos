"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  trigger?: "scroll" | "immediate";
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.7,
  trigger = "scroll",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return; // content already visible; skip animation

    const ctx = gsap.context(() => {
      if (trigger === "scroll") {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          { opacity: 1, y: 0, duration, delay, ease: "power3.out" }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [delay, duration, y, trigger, reduced]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
