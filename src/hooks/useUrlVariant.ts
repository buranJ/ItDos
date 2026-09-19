"use client";

import { useSyncExternalStore } from "react";

/* A layout on trial, chosen with a query parameter (`?p=2`). The value is
   read in the browser only: reading `searchParams` on the server would make
   the page dynamic, and on Netlify a dynamic page renders in a function
   that has no database. */

const CHANGE = "url-variant-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

/** The variant in `?<param>=`; 1 in the prerendered HTML. */
export function useUrlVariant(param: string, count: number) {
  return useSyncExternalStore(
    subscribe,
    () => {
      const v = Number(new URLSearchParams(window.location.search).get(param));
      return Number.isInteger(v) && v >= 1 && v <= count ? v : 1;
    },
    () => 1,
  );
}

export function setUrlVariant(param: string, variant: number) {
  const url = new URL(window.location.href);
  url.searchParams.set(param, String(variant));
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(CHANGE));
}
