"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/layout/LenisProvider";
import { useReducedMotion } from "@/lib/motion";

// Tracks whether the app has mounted once, so the very first load doesn't
// hide the LCP behind an opaque cover — only client navigations animate.
let appMounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  // once-only: true only on the very first app mount (not client navigations)
  const [isInitial] = useState(() => !appMounted);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const initial = isInitial;
    appMounted = true;

    // Reset scroll to top for the new route.
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    if (reduced || !overlay || !content) {
      ScrollTrigger.refresh();
      return;
    }

    const ctx = gsap.context(() => {
      if (initial) {
        // First load: gentle content settle, no covering panel.
        gsap.set(overlay, { scaleY: 0 });
        gsap.fromTo(
          content,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.05 }
        );
      } else {
        // Navigation: panel covers instantly, then wipes up to reveal.
        const tl = gsap.timeline({
          onComplete: () => ScrollTrigger.refresh(),
        });
        tl.set(overlay, { scaleY: 1, transformOrigin: "top" })
          .set(content, { autoAlpha: 0, y: 28 })
          .to(overlay, {
            scaleY: 0,
            transformOrigin: "top",
            duration: 0.7,
            ease: "power4.inOut",
          })
          .to(
            content,
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.35"
          );
      }
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
    // run once per route mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        id="transition-overlay"
        ref={overlayRef}
        aria-hidden="true"
        // On a client navigation the panel must already cover on first paint
        // (no flash of the new page before the effect runs). Initial load = open.
        style={
          isInitial || reduced
            ? undefined
            : { transform: "scaleY(1)", transformOrigin: "top" }
        }
      >
        <span className="font-display text-2xl font-semibold tracking-tight text-fg">
          ITDOS
        </span>
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  );
}
