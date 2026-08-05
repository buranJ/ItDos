"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once, the first time the element comes near the viewport.
 *
 * Used to defer expensive third-party embeds (live-site iframes, video
 * players) until the visitor actually scrolls to them — otherwise every
 * embed loads on first paint and drags megabytes of foreign JS onto the
 * critical path.
 */
export function useInView<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    // No IntersectionObserver (very old browsers): degrade to loading it.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setInView(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView] as const;
}
