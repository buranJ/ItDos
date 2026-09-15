"use client";

import { useSyncExternalStore } from "react";

/** The «Живые проекты» layouts on trial — `?v=1…5` on /portfolio. */
export const LIVE_VARIANTS = ["Сплит", "Сетка", "Кино", "Стопка", "Витрина"] as const;

/* The choice lives in the URL but is read in the browser only: reading
   `searchParams` on the server would make /portfolio a dynamic page, and on
   Netlify that renders in a function that has no database — the page broke
   there. So the page stays static and this store picks the layout. */

const CHANGE = "live-variant-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

function readVariant() {
  const v = Number(new URLSearchParams(window.location.search).get("v"));
  return Number.isInteger(v) && v >= 1 && v <= LIVE_VARIANTS.length ? v : 1;
}

/** The layout in `?v=`; 1 in the prerendered HTML. */
export function useLiveVariant() {
  return useSyncExternalStore(subscribe, readVariant, () => 1);
}

export function setLiveVariant(variant: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("v", String(variant));
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(CHANGE));
}
