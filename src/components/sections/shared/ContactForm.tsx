"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { whatsappLink, telegramLink, defaultInquiry } from "@/lib/site";

const serviceOptions = [
  "Разработка сайта",
  "Веб-приложение",
  "CRM / ERP система",
  "AI-интеграция",
  "AI-агент",
  "Telegram-бот",
  "Автоматизация бизнеса",
  "Маркетплейс",
  "Другое",
];

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
    company: "", // honeypot — hidden from humans
  });
  const [status, setStatus] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.contact.submit(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Ваше имя" required>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Иван Иванов"
            required
            className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none"
          />
        </Field>
        <Field label="Телефон" required>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+996 700 000 000"
            required
            type="tel"
            className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none"
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="ivan@company.ru"
          type="email"
          className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="Услуга">
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="w-full appearance-none rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm text-fg transition-colors focus:border-accent focus:outline-none"
        >
          <option value="">Выберите услугу...</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label="Расскажите о задаче">
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Опишите что нужно сделать, сроки, бюджет..."
          rows={4}
          className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 text-sm text-fg placeholder-fg-muted transition-colors focus:border-accent focus:outline-none resize-none"
        />
      </Field>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Ошибка отправки. Напишите нам напрямую на itdos@gmail.com
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "w-full sm:w-auto self-start inline-flex items-center gap-2 bg-accent text-accent-ink px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-200",
          status === "loading"
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-accent-bright"
        )}
      >
        {status === "loading" ? "Отправка..." : "Получить бесплатную оценку"}
        {status !== "loading" && <ArrowRight size={16} />}
      </button>

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
        соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-fg">
        {label}
        {required && <span className="text-fg-muted ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
