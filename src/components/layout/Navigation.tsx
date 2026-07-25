"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { useLenis } from "./LenisProvider";

const navLinks = [
  { label: "Услуги", href: "/services" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "О нас", href: "/about" },
  { label: "Процесс", href: "/process" },
  { label: "Блог", href: "/blog" },
  { label: "Контакт", href: "/contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // close the menu whenever the route changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      // Lenis owns the scroll position — body overflow alone won't stop it.
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: 40, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: "power4.out",
          delay: 0.15,
        }
      );
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        className="relative z-60 flex items-center gap-2 text-sm font-medium text-fg hover:text-accent transition-colors duration-200"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
        <span className="hidden sm:inline">{open ? "Закрыть" : "Меню"}</span>
      </button>

      {/* Full-screen overlay */}
      <div
        data-lenis-prevent
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-between gap-12 overflow-y-auto bg-bg px-5 pb-12 pt-28 transition-all duration-500 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* ambient accent bloom */}
        <div
          aria-hidden="true"
          className="accent-glow pointer-events-none absolute -top-40 right-0 h-160 w-160 opacity-30"
        />

        <nav className="relative flex flex-col mt-8" style={{ perspective: 800 }}>
          {navLinks.map((link, i) => (
            <div
              key={link.href}
              className="nav-item overflow-hidden border-b border-line"
            >
              <Link
                href={link.href}
                className={cn(
                  "group flex items-center justify-between py-4 sm:py-5 transition-colors duration-200",
                  pathname === link.href ? "text-fg" : "text-fg-secondary hover:text-fg"
                )}
              >
                <span className="flex items-baseline gap-4 sm:gap-6">
                  <span className="font-mono text-xs text-accent w-6">
                    0{i + 1}
                  </span>
                  <span className="font-display text-4xl sm:text-6xl font-semibold tracking-tight">
                    {link.label}
                  </span>
                </span>
                <ArrowUpRight
                  size={32}
                  className="text-accent opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>
            </div>
          ))}
        </nav>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="nav-item">
            <p className="text-fg-muted text-sm mb-1">Готовы начать?</p>
            <Link
              href="/contact"
              className="text-lg font-medium text-fg hover:text-accent transition-colors"
            >
              Начать проект →
            </Link>
          </div>
          <div className="nav-item text-sm text-fg-muted">
            {/* <p>Бишкек, Кыргызстан</p> */}
            <a
              href="mailto:zunusburan@gmail.com"
              className="hover:text-fg transition-colors"
            >
              itdos@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
