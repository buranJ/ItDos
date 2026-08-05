"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { site, whatsappLink, telegramLink, defaultInquiry } from "@/lib/site";
import { validateLead, type LeadErrors } from "@/lib/validation";
import { trackLead } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

type FormState = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none";
const invalidClass = "border-red-500/70 focus:border-red-500";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    company: "", // honeypot — hidden from humans
  });
  const [status, setStatus] = useState<FormState>("idle");
  const [errors, setErrors] = useState<LeadErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the visitor starts correcting it.
    setErrors((prev) => (prev[name as keyof LeadErrors] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // `required` alone let "абвгд" through as a phone number — a lead we
    // could never call back. Validate before we touch the network.
    const found = validateLead(form);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      await api.contact.submit(form);
      trackLead({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-16 text-center gap-4"
      >
        <CheckCircle size={40} className="text-fg" />
        <h3 className="text-xl font-semibold text-fg">Заявка отправлена</h3>
        <p className="text-fg-secondary max-w-xs">
          Мы получили вашу заявку и свяжемся с вами в течение часа.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot — visually hidden, off-screen; bots fill it, humans don't */}
      <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Не заполняйте это поле
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Ваше имя" required error={errors.name} htmlFor="lead-name">
          <input
            id="lead-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Иван Иванов"
            required
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
            className={cn(inputClass, errors.name && invalidClass)}
          />
        </Field>
        <Field
          label="Телефон или email"
          required
          error={errors.contact}
          htmlFor="lead-contact"
        >
          <input
            id="lead-contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="+996 700 000 000 или name@example.com"
            required
            type="text"
            inputMode="text"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? "lead-contact-error" : undefined}
            className={cn(inputClass, errors.contact && invalidClass)}
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">
          Ошибка отправки. Напишите нам напрямую на {site.email}
        </p>
      )}

      {/* Permanently mounted live region — a region that is added to the DOM
          only when it has content is not reliably announced. */}
      <p role="status" aria-live="polite" className="sr-only">
        {status === "error"
          ? `Ошибка отправки. Напишите нам напрямую на ${site.email}`
          : Object.keys(errors).length
            ? "Проверьте отмеченные поля формы"
            : ""}
      </p>

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full self-start sm:w-auto"
      >
        {status === "loading" ? "Отправка..." : "Получить бесплатную оценку"}
        {status !== "loading" && <ArrowRight size={16} />}
      </Button>

      {/* Messenger fallback — многие охотнее напишут, чем заполнят форму */}
      <div className="flex items-center gap-3 pt-1 text-xs text-fg-muted">
        <span className="h-px flex-1 bg-line" />
        или напишите напрямую
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappLink(defaultInquiry)}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-fg/50"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: "#25d366" }} />
          WhatsApp
        </a>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-fg/50"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: "#229ed9" }} />
          Telegram
        </a>
      </div>

      <p className="text-xs text-fg-muted">
        Ответим в течение часа · работаем по договору · нажимая кнопку, вы
        соглашаетесь с{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
          политикой конфиденциальности
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg">
        {label}
        {required && <span className="text-fg-muted ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <span id={htmlFor ? `${htmlFor}-error` : undefined} className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
