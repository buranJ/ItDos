/**
 * Single source of truth for contact details. Edit these to update the
 * footer, contact page, floating buttons, and form everywhere at once.
 */
export const site = {
  name: "ITDOS",
  phoneDisplay: "+996 999 953 838",
  phoneRaw: "996999953838",
  /** ⚠ SET THE REAL MAILBOX HERE. Header, footer, contact page, the form's
   *  error text and the Schema.org markup all read this one value, so the
   *  visible address and the mailto: link can no longer disagree. */
  email: "zunusburan@gmail.com",
  /** WhatsApp number (digits only, with country code). */
  whatsapp: "996999953838",
  /** Telegram username without @. */
  telegram: "itdos",
  // address: "Бишкек, Кыргызстан",
  responseTime: "в течение часа",
} as const;

export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const telegramLink = `https://t.me/${site.telegram}`;
export const phoneLink = `tel:+${site.phoneRaw}`;
export const emailLink = `mailto:${site.email}`;

/** Default prefilled message for messenger CTAs. */
export const defaultInquiry =
  "Здравствуйте! Хочу обсудить проект с ITDOS.";
