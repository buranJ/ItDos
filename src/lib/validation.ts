/**
 * Lead-form validation shared by the client form and the API route, so the
 * browser and the server can never disagree about what a valid lead is.
 */

/** Tolerates +, spaces, dashes and brackets — checks the digits only. */
export function isValidPhone(raw: string | undefined): boolean {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function isValidName(raw: string | undefined): boolean {
  return (raw ?? "").trim().length >= 2;
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
  if (!isValidName(input.name)) errors.name = "Укажите имя";
  if (!isValidContact(input.contact)) {
    errors.contact = "Укажите корректный телефон или email";
  }
  return errors;
}
