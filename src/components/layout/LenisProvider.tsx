"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    // Momentum scrolling belongs on the marketing site, not over an admin
    // table where people expect the scrollbar to behave like a scrollbar.
    if (isAdmin) return;
    // Respect reduced motion — fall back to native scroll, ScrollTrigger still works.
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    // Touch devices keep native scrolling. Hijacked momentum on a phone reads
    // as lag or as the page "not following the finger", and iOS Safari loses
    // its scroll-to-top-on-status-bar-tap and address-bar collapse.
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
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
  }, [isAdmin]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
