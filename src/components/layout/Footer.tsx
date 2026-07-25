import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./Container";

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
    { label: "Контакт", href: "/contact" },
  ],
};
import logo from "../../../public/logo-wh.png";
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-bg overflow-hidden">
      {/* ambient bloom */}
      <div
        aria-hidden="true"
        className="accent-glow pointer-events-none absolute -bottom-48 left-1/2 -translate-x-1/2 h-160 w-160 opacity-20"
      />

      <Container className="relative">
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block transition-opacity duration-200 hover:opacity-75">
              <Image
                src={logo}
                alt="ITDOS"
                width={110}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 text-fg-secondary text-sm leading-relaxed max-w-xs">
              Технологическая компания из Бишкека. Строим сайты, приложения, CRM
              и автоматизируем бизнес с помощью AI.
            </p>
            <div className="mt-6 flex flex-col gap-1 text-sm text-fg-secondary">
              <a href="mailto:zunusburan@gmail.com" className="hover:text-accent transition-colors">
                itdos@gmail.com
              </a>
              <a href="tel:+996999953838" className="hover:text-accent transition-colors">
                +996 999 953 838
              </a>
              {/* <span className="text-fg-muted">Бишкек, Кыргызстан</span> */}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="font-mono text-xs font-semibold text-fg-muted uppercase tracking-wider mb-4">
                {title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-fg-secondary hover:text-fg transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={13}
                        className="text-accent opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized wordmark */}
        <div
          aria-hidden="true"
          className="select-none pointer-events-none border-t border-line pt-10"
        >
          <p className="font-display font-semibold tracking-tighter leading-none text-[18vw] lg:text-[15vw] text-fg/4">
            ITDOS
          </p>
        </div>

        <div className="border-t border-line py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-muted">
          <p>© {year} ITDOS. Все права защищены.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-fg transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
