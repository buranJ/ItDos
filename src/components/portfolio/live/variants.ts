"use client";

import { useUrlVariant } from "@/hooks/useUrlVariant";

/** The «Живые проекты» layouts on trial — `?v=1…5` on /portfolio. */
export const LIVE_VARIANTS = ["Сплит", "Сетка", "Кино", "Стопка", "Витрина"] as const;

export function useLiveVariant() {
  return useUrlVariant("v", LIVE_VARIANTS.length);
}
