"use client";

/**
 * Provider-agnostic conversion tracking.
 *
 * The site currently ships no analytics at all, so a submitted lead is
 * invisible: there is no way to tell how many visitors reach the form or
 * which page produced the request. This emits the event in the two shapes
 * every common tool understands, and stays a no-op until one is installed:
 *
 *   • `window.dataLayer` — Google Tag Manager / GA4 / Yandex via GTM
 *   • a `itdos:lead` DOM event — for anything wired up by hand
 *
 * Drop GTM or Metrika into app/layout.tsx (next/script, `afterInteractive`)
 * and the events below start counting with no further changes here.
 */

type LeadPayload = { service?: string; value?: number };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackLead(payload: LeadPayload = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "generate_lead",
    form: "contact",
    service: payload.service ?? "не указана",
    ...(payload.value !== undefined ? { value: payload.value } : {}),
  });

  window.dispatchEvent(new CustomEvent("itdos:lead", { detail: payload }));
}
