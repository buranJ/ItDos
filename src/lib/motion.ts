"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Shared motion tokens so easing/pacing feels consistent across the site.
 * GSAP ease strings (registered by default in core) + matching CSS curves.
 */
export const EASE = {
  /** Signature expo-out — the house easing. */
  out: "power4.out",
  outExpo: "expo.out",
  inOut: "power3.inOut",
  /** CSS equivalents (mirror globals.css tokens). */
  cssOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  cssInOut: "cubic-bezier(0.83, 0, 0.17, 1)",
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.1,
  reveal: 1.2,
} as const;

/** Standard scroll-reveal start position for ScrollTrigger. */
export const REVEAL_START = "top 82%";

/**
 * Reduced-motion hook. Reuses the generic useMediaQuery so we don't
 * duplicate matchMedia logic. Heavy GSAP/WebGL effects gate on this.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Non-hook check for imperative code paths (SSR-safe). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
