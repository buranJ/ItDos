import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle, Send } from "lucide-react";
import { Container } from "./Container";
import {
  site,
  emailLink,
  phoneLink,
  telegramLink,
  whatsappLink,
  defaultInquiry,
} from "@/lib/site";
import logo from "../../../public/logo-wh.png";

const footerLinks = {
  Услуги: [
    { label: "Разработка сайтов", href: "/services/website-development" },
    { label: "Веб-приложения", href: "/services/web-applications" },
    { label: "CRM и ERP", href: "/services/crm-erp" },
    { label: "AI-интеграции", href: "/services/ai-integrations" },
    { label: "Telegram-боты", href: "/services/telegram-bots" },
    { label: "AI-автоматизация", href: "/services/ai-automation" },
  ],
  Компания: [
    { label: "О нас", href: "/about" },
    { label: "Портфолио", href: "/portfolio" },
    { label: "Процесс", href: "/process" },
    { label: "Отзывы", href: "/reviews" },
    { label: "Блог", href: "/blog" },
    { label: "Контакты", href: "/contact" },
  ],
};

/**
 * Three zones across: the brand, the site's links in two aligned columns,
 * and the ways to reach us. Deliberately short — no oversized wordmark.
 */
/** Год основания — вторая половина копирайта считается от текущего года. */
const FOUNDED = 2019;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg">
      {/* ambient bloom */}
      <div
        aria-hidden="true"
        className="accent-glow pointer-events-none absolute -bottom-48 left-1/2 h-160 w-160 -translate-x-1/2 opacity-20"
      />

      <Container className="relative">
        <div className="grid gap-8 py-12 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-block transition-opacity duration-200 hover:opacity-75"
            >
              <Image
                src={logo}
                alt="ITDOS"
                width={165}
                height={54}
                className="h-[3.375rem] w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-secondary">
              Сайты, мобильные приложения, CRM и автоматизация.
            </p>
          </div>

          {/* Two aligned columns, not one wrapped ribbon: a flex-wrap run of
              links broke at arbitrary points and read as a jumble. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:gap-x-12 lg:col-span-5">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  {title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-fg-secondary transition-colors hover:text-fg"
                      >
                        {link.label}
                        <ArrowUpRight
                          size={13}
                          className="-translate-x-1 text-accent-text opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 lg:col-span-3 lg:items-end">
            <a
              href={phoneLink}
              className="font-display text-lg font-semibold tracking-tight text-fg transition-colors hover:text-accent-text"
            >
              {site.phoneDisplay}
            </a>
            <a
              href={emailLink}
              className="text-sm text-fg-secondary transition-colors hover:text-accent-text"
            >
              {site.email}
            </a>
            <div className="mt-1 flex flex-wrap gap-2.5">
              <a
                href={whatsappLink(defaultInquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-fg transition-colors hover:border-line-strong hover:bg-surface"
              >
                <MessageCircle size={15} className="text-[#25d366]" />
                WhatsApp
              </a>
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] text-fg transition-colors hover:border-line-strong hover:bg-surface"
              >
                <Send size={15} className="text-[#229ed9]" />
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line py-6 text-xs text-fg-muted sm:flex-row">
          <p>
            © {FOUNDED}–{year} ITDOS. Все права защищены.
          </p>
          <Link href="/privacy" className="transition-colors hover:text-fg">
            Политика конфиденциальности
          </Link>
        </div>
      </Container>
    </footer>
  );
}
