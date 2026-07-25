"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Thin accent bar tracking page scroll progress. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            start: 0,
            end: () =>
              document.documentElement.scrollHeight - window.innerHeight,
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9990] h-[2px] origin-left scale-x-0 bg-accent"
      ref={ref}
      style={{ boxShadow: "0 0 12px var(--color-accent)" }}
    />
  );
}
