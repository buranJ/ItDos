"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/motion";

type CountUpProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1.8,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [rendered, setRendered] = useState(0);
  const reduced = useReducedMotion();

  const display = reduced ? value : rendered;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: value,
        duration,
        ease: "power2.out",
        snap: { val: 1 },
        onUpdate: () => setRendered(Math.round(obj.val)),
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
