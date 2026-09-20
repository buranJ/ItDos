"use client";

import { useSyncExternalStore } from "react";

/**
 * Country dialling code for the phone field, guessed from the browser's own
 * time zone. No geo-IP service, no extra request, nothing to consent to —
 * and it is only a prefilled hint the visitor can overwrite.
 *
 * Kyrgyzstan is the default: it is where most enquiries come from, and it is
 * also what a visitor sees if their zone is unknown.
 */
const DEFAULT_DIAL = "+996";

const BY_ZONE: Record<string, string> = {
  "Asia/Bishkek": "+996",
  "Asia/Almaty": "+7",
  "Asia/Aqtau": "+7",
  "Asia/Aqtobe": "+7",
  "Asia/Atyrau": "+7",
  "Asia/Oral": "+7",
  "Asia/Qostanay": "+7",
  "Asia/Qyzylorda": "+7",
  "Europe/Moscow": "+7",
  "Europe/Samara": "+7",
  "Europe/Volgograd": "+7",
  "Europe/Kaliningrad": "+7",
  "Asia/Yekaterinburg": "+7",
  "Asia/Omsk": "+7",
  "Asia/Novosibirsk": "+7",
  "Asia/Krasnoyarsk": "+7",
  "Asia/Irkutsk": "+7",
  "Asia/Yakutsk": "+7",
  "Asia/Vladivostok": "+7",
  "Asia/Tashkent": "+998",
  "Asia/Samarkand": "+998",
  "Asia/Dushanbe": "+992",
  "Asia/Ashgabat": "+993",
  "Asia/Baku": "+994",
  "Asia/Tbilisi": "+995",
  "Asia/Yerevan": "+374",
  "Europe/Kyiv": "+380",
  "Europe/Kiev": "+380",
  "Europe/Minsk": "+375",
  "Europe/Chisinau": "+373",
  "Europe/Istanbul": "+90",
  "Asia/Dubai": "+971",
  "Asia/Riyadh": "+966",
  "Asia/Karachi": "+92",
  "Asia/Kolkata": "+91",
  "Asia/Shanghai": "+86",
  "Asia/Seoul": "+82",
  "Asia/Tokyo": "+81",
  "Europe/Berlin": "+49",
  "Europe/Warsaw": "+48",
  "Europe/Prague": "+420",
  "Europe/London": "+44",
  "Europe/Paris": "+33",
  "Europe/Madrid": "+34",
  "Europe/Rome": "+39",
  "America/New_York": "+1",
  "America/Chicago": "+1",
  "America/Denver": "+1",
  "America/Los_Angeles": "+1",
  "America/Toronto": "+1",
};

function detect(): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return BY_ZONE[zone] ?? DEFAULT_DIAL;
  } catch {
    return DEFAULT_DIAL;
  }
}

const noop = () => () => {};

/** The visitor's dialling code; the default until the client takes over. */
export function useDialCode(): string {
  return useSyncExternalStore(noop, detect, () => DEFAULT_DIAL);
}

/** «+996 700 000 000» for Kyrgyzstan, a neutral shape for everyone else. */
export function phonePlaceholder(dial: string): string {
  return dial === "+996" ? "+996 700 000 000" : `${dial} 000 000 000`;
}
