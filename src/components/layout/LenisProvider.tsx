"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);

/** Access the live Lenis instance (null under reduced motion / before init). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion — fall back to native scroll, ScrollTrigger still works.
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    // ── The fix: keep ScrollTrigger in lockstep with Lenis' virtual scroll ──
    instance.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's single ticker (no competing rAF loop).
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // one-time: publish the client-only Lenis instance to context
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
