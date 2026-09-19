"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLenis } from "./LenisProvider";

/**
 * Every navigation starts at the top of the new page.
 *
 * This used to live in `app/template.tsx`, but the root template is keyed by
 * the top-level route segment: moving from /services to /services/<slug>
 * never remounted it, so the reset never ran and the new page opened wherever
 * the old one had been left — at its very bottom, if the list had been
 * scrolled far. Watching `usePathname()` catches every navigation.
 *
 * Lenis is stopped first: a click made mid-scroll leaves it animating towards
 * a position on the page you just left, and that animation would otherwise
 * run straight over the reset.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const firstRender = useRef(true);

  useEffect(() => {
    // The first paint is already at the top (or at a #hash the browser owns).
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const toTop = () => {
      if (lenis) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
    };

    toTop();
    // Once more on the next frame: the page's own height only settles after
    // this paint, and a stale scroll can survive that reflow.
    const raf = requestAnimationFrame(() => {
      toTop();
      lenis?.start();
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis?.start();
    };
  }, [pathname, lenis]);

  return null;
}
