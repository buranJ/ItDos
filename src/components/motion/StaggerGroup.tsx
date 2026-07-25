"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerGroupProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: number;
};

export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  y = 24,
}: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return; // items already visible; skip stagger

    const items = el.children;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          stagger,
          duration: 0.7,
          ease: "power3.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, y, reduced]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
