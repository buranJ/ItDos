"use client";

import { useRef, useCallback } from "react";
import { lerp } from "@/lib/utils";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      pos.current.x = lerp(pos.current.x, dx, 0.15);
      pos.current.y = lerp(pos.current.y, dy, 0.15);
    },
    [strength]
  );

  const onMouseEnter = useCallback(() => {
    // hoisted declaration so the rAF loop can reference itself
    function tick() {
      if (ref.current) {
        ref.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    }
    tick();
  }, []);

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    pos.current = { x: 0, y: 0 };
    if (ref.current) {
      ref.current.style.transition = "transform 0.4s cubic-bezier(0.16,1,0.3,1)";
      ref.current.style.transform = "translate(0px, 0px)";
      setTimeout(() => {
        if (ref.current) ref.current.style.transition = "";
      }, 400);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ willChange: "transform", display: "inline-flex" }}
    >
      {children}
    </div>
  );
}
