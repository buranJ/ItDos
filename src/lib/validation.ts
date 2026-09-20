/**
 * Lead-form validation shared by the client form and the API route, so the
 * browser and the server can never disagree about what a valid lead is.
 */

/** Tolerates +, spaces, dashes and brackets — checks the digits only. */
export function isValidPhone(raw: string | undefined): boolean {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

/** Letters, spaces, hyphens and apostrophes — any alphabet. */
export function isValidName(raw: string | undefined): boolean {
  const value = (raw ?? "").trim();
  return value.length >= 2 && /^\p{L}[\p{L}\s'’-]*$/u.test(value);
}

/* ── Input filters: keep impossible characters out while typing, so the
   error message is the last resort rather than the first thing seen. ── */

export function sanitizeName(raw: string): string {
  return raw.replace(/[^\p{L}\s'’-]/gu, "").slice(0, 60);
}

export function sanitizePhone(raw: string): string {
  return raw.replace(/[^\d+\s()-]/g, "").slice(0, 20);
}

export function sanitizeEmail(raw: string): string {
  return raw.replace(/\s/g, "").slice(0, 100);
}

export function isValidEmail(raw: string | undefined): boolean {
  const v = (raw ?? "").trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function isValidContact(raw: string | undefined): boolean {
  const value = (raw ?? "").trim();
  return value.includes("@") ? isValidEmail(value) : isValidPhone(value);
}

export type LeadErrors = Partial<Record<"name" | "contact", string>>;

export function validateLead(input: {
  name?: string;
  contact?: string;
}): LeadErrors {
  const errors: LeadErrors = {};
  if (!isValidName(input.name)) errors.name = "Укажите имя буквами";
  if (!isValidContact(input.contact)) {
    errors.contact = "Укажите корректный телефон или email";
  }
  return errors;
}
