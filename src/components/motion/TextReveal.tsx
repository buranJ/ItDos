"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: "scroll" | "immediate";
};

/**
 * Line-mask reveal. Renders React-managed line spans (no innerHTML mutation,
 * so React reconciliation/unmount stays safe) and animates them with GSAP.
 */
export function TextReveal({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.08,
  trigger = "scroll",
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const lines = children.split("\n").filter(Boolean);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return;

    const inners = el.querySelectorAll<HTMLElement>(".tr-inner");

    const ctx = gsap.context(() => {
      // Attach the ScrollTrigger directly to the timeline instead of pausing it
      // and playing via a standalone onEnter. A standalone onEnter never fires
      // when the element is already in view at mount (e.g. after a Fast Refresh
      // hot reload), which left the text stuck hidden at yPercent:110. A
      // timeline-bound trigger plays the reveal in that case too.
      const tl = gsap.timeline({
        delay,
        scrollTrigger:
          trigger === "scroll" ? { trigger: el, start: "top 85%" } : undefined,
      });

      tl.fromTo(
        inners,
        { yPercent: 110, skewY: 4 },
        {
          yPercent: 0,
          skewY: 0,
          stagger,
          duration: 0.9,
          ease: "power4.out",
        }
      );
    }, el);

    return () => ctx.revert();
  }, [children, delay, stagger, trigger, reduced]);

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={cn(className)}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span className="tr-inner block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
