"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { buttonClass } from "@/components/ui/Button";
import { useDialCode, phonePlaceholder } from "@/hooks/useDialCode";
import { api } from "@/lib/api";
import { trackLead } from "@/lib/analytics";
import {
  isValidContact,
  isValidName,
  sanitizeEmail,
  sanitizeName,
  sanitizePhone,
  validateLead,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import { telegramLink, whatsappLink, defaultInquiry } from "@/lib/site";

type CtaBannerProps = {
  /** Link shown beside the messengers; defaults to the portfolio. */
  secondaryCta?: { label: string; href: string };
};

const PROMISES = ["Бесплатная консультация", "Ответим быстро", "Смета в договоре"];

/**
 * Closing call to action: the enquiry is sent from here, without sending the
 * visitor to another page first.
 */
export function CtaBanner({
  secondaryCta = { label: "Смотреть работы", href: "/portfolio" },
}: CtaBannerProps) {
  return (
    // `theme-light` re-themes every colour token inside it, so the heading,
    // the form and the muted text are light together.
    <Section
      id="cta-banner"
      spacing="lg"
      className="theme-light relative overflow-hidden border-t border-line"
    >
      <div
        aria-hidden="true"
        className="accent-glow pointer-events-none absolute -right-20 top-0 h-140 w-140 opacity-15"
      />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <TextReveal
              as="h2"
              className="font-display text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.03] tracking-tight text-fg"
            >
              {"Получите оценку\nпроекта сегодня"}
            </TextReveal>
            <FadeIn delay={0.15}>
              <p className="mt-4 max-w-md text-base leading-relaxed text-fg-secondary">
                Оставьте контакт — свяжемся, зададим пару вопросов и назовём
                сроки со стоимостью. Это бесплатно и ни к чему не обязывает.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                {PROMISES.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-fg-secondary"
                  >
                    <Check size={14} strokeWidth={2.5} className="text-accent-text" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="lg:col-span-6">
            <QuickForm secondaryCta={secondaryCta} />
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}

/** Two fields and a button — the least we need to call someone back. */
function QuickForm({ secondaryCta }: { secondaryCta?: { label: string; href: string } }) {
  const dial = useDialCode();
  const [form, setForm] = useState({ name: "", contact: "" });
  // Phone or email: the field swaps type, keyboard and placeholder, so a
  // number is typed on a numeric keypad instead of a full text keyboard.
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; contact?: string }>({});

  /** Checked when the field loses focus, so nothing is flagged mid-typing. */
  const checkName = () =>
    setFieldErrors((prev) => ({
      ...prev,
      name: form.name && !isValidName(form.name) ? "Имя от двух букв" : undefined,
    }));

  const checkContact = () =>
    setFieldErrors((prev) => ({
      ...prev,
      contact:
        form.contact && !isValidContact(form.contact)
          ? mode === "phone"
            ? "Номер от 9 цифр, например +996 700 000 000"
            : "Адрес вида name@example.com"
          : undefined,
    }));

  const switchMode = (next: "phone" | "email") => {
    setMode(next);
    setError(null);
    setFieldErrors((prev) => ({ ...prev, contact: undefined }));
    setForm((prev) => {
      const fits = next === "email" ? prev.contact.includes("@") : !prev.contact.includes("@");
      if (fits) return prev;
      // Switching to the phone field hands over the country code already.
      return { ...prev, contact: next === "phone" ? `${dial} ` : "" };
    });
  };

  /** The dialling code is waiting in the field the moment it is focused. */
  const prefillDial = () => {
    if (mode !== "phone" || form.contact) return;
    setForm((prev) => ({ ...prev, contact: `${dial} ` }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateLead(form);
    if (Object.keys(found).length) {
      setFieldErrors(found);
      setError(null);
      return;
    }
    setFieldErrors({});
    setError(null);
    setStatus("loading");
    try {
      await api.contact.submit({ ...form, company: "" });
      trackLead({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-m bg-m-softer p-8 text-center">
        <Check size={28} className="mx-auto text-accent-text" />
        <p className="mt-4 font-display text-xl font-semibold text-fg">
          Заявка отправлена
        </p>
        <p className="mt-2 text-sm text-fg-secondary">
          Свяжемся с вами в ближайшее рабочее время.
        </p>
      </div>
    );
  }

  const invalidClass = "border-red-500/70 focus:border-red-500";
  const inputClass =
    "h-13 w-full rounded-full border border-line bg-panel px-5 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none";

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-panel p-6 shadow-lg shadow-black/5 sm:p-8"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
          Как с вами связаться
        </span>
        <div
          role="group"
          aria-label="Способ связи"
          className="flex items-center gap-0.5 rounded-full border border-line p-0.5"
        >
          {(["phone", "email"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => switchMode(value)}
              aria-pressed={mode === value}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                mode === value
                  ? "bg-accent text-accent-ink"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {value === "phone" ? "Телефон" : "Email"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="w-full">
          <input
            name="name"
            value={form.name}
            // Цифры и символы в поле имени просто не набираются.
            onChange={(e) => {
              setForm((p) => ({ ...p, name: sanitizeName(e.target.value) }));
              setFieldErrors((p) => ({ ...p, name: undefined }));
            }}
            onBlur={checkName}
            placeholder="Ваше имя"
            autoComplete="name"
            required
            aria-label="Ваше имя"
            aria-invalid={!!fieldErrors.name}
            className={cn(inputClass, fieldErrors.name && invalidClass)}
          />
          {fieldErrors.name && (
            <p className="mt-1.5 pl-5 text-xs text-red-400">{fieldErrors.name}</p>
          )}
        </div>
        <div className="w-full">
          <input
            name="contact"
            value={form.contact}
            // Телефон принимает только цифры и + ( ) -, почта — без пробелов.
            onChange={(e) => {
              const value =
                mode === "phone"
                  ? sanitizePhone(e.target.value)
                  : sanitizeEmail(e.target.value);
              setForm((p) => ({ ...p, contact: value }));
              setFieldErrors((p) => ({ ...p, contact: undefined }));
            }}
            onFocus={prefillDial}
            onBlur={checkContact}
            placeholder={mode === "phone" ? phonePlaceholder(dial) : "name@example.com"}
            type={mode === "phone" ? "tel" : "email"}
            inputMode={mode === "phone" ? "tel" : "email"}
            autoComplete={mode === "phone" ? "tel" : "email"}
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-label={mode === "phone" ? "Телефон" : "Email"}
            aria-invalid={!!fieldErrors.contact}
            className={cn(inputClass, fieldErrors.contact && invalidClass)}
          />
          {fieldErrors.contact && (
            <p className="mt-1.5 pl-5 text-xs text-red-400">{fieldErrors.contact}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        data-cursor="button"
        className={cn(
          buttonClass("accent", "lg", "mt-3 w-full"),
          status === "loading" && "opacity-70",
        )}
      >
        {status === "loading" ? "Отправляем…" : "Получить бесплатную оценку"}
        {status !== "loading" && <ArrowRight size={16} />}
      </button>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">
          Не отправилось. Напишите нам в WhatsApp — ответим там же.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5 text-sm">
        <span className="text-fg-muted">Или сразу:</span>
        <a
          href={whatsappLink(defaultInquiry)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-fg transition-colors hover:text-accent-text"
        >
          <MessageCircle size={15} className="text-[#25d366]" />
          WhatsApp
        </a>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-fg transition-colors hover:text-accent-text"
        >
          <Send size={15} className="text-[#229ed9]" />
          Telegram
        </a>
        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className="ml-auto inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg"
          >
            {secondaryCta.label}
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </form>
  );
}
