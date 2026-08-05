"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, ArrowUpRight, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { useLenis } from "./LenisProvider";
import {
  site,
  emailLink,
  phoneLink,
  telegramLink,
  whatsappLink,
  defaultInquiry,
} from "@/lib/site";

const navLinks = [
  { label: "Услуги", href: "/services" },
  { label: "Портфолио", href: "/portfolio" },
  { label: "О нас", href: "/about" },
  { label: "Процесс", href: "/process" },
  { label: "Блог", href: "/blog" },
  { label: "Контакт", href: "/contact" },
];

export function Navigation({ onLight = false }: { onLight?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out", delay: 0.1 },
      );
      // Move focus into the panel so keyboard and screen-reader users land on
      // the close control instead of being left behind the overlay.
      closeRef.current?.focus();
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  // Escape closes the menu, and focus goes back to the trigger that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Widening past `lg` swaps in the inline nav; leaving the overlay open
  // would otherwise strand a locked scroll position behind a hidden layer.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  const overlay = (
    <div
      id="site-menu"
      // `inert` keeps the closed menu out of the tab order and off the
      // accessibility tree — without it, keyboard users tab through six
      // invisible links before reaching the page.
      inert={!open}
      aria-hidden={!open}
      data-lenis-prevent
      className={cn(
        "fixed inset-0 z-70 overflow-y-auto transition-opacity duration-500 lg:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {/* Light surface, layered rather than flat: a warm off-white base (the
          same #faf9f6 family as the hero), two soft accent blooms, a faint
          dot grid that echoes the hero's, and an oversized wordmark as a
          watermark. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#faf9f6]" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 75% at 100% 0%, rgba(110,86,255,0.16), transparent 62%), radial-gradient(85% 55% at 0% 100%, rgba(110,86,255,0.09), transparent 64%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-4 -right-3 select-none font-display text-[26vw] font-semibold leading-none tracking-tighter text-[#0a0a0a]/4"
      >
        ITDOS
      </span>

      {/* Close button lives inside the overlay.
          The trigger in the header cannot serve as the close control here: the
          header is a z-50 stacking context and this layer is portalled to
          <body> at z-70, so the header — and its X — sits underneath. */}
      <button
        ref={closeRef}
        type="button"
        onClick={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        aria-label="Закрыть меню"
        className="absolute right-5 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#0a0a0a] shadow-sm transition-colors hover:bg-black/5 sm:right-8"
      >
        <X size={18} />
      </button>

      <div className="relative flex min-h-full flex-col px-5 pb-8 pt-24 sm:px-8 sm:pt-28">
        <nav className="flex flex-col">
          {navLinks.map((link, i) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-item group flex items-center justify-between gap-4 border-b py-4 transition-colors duration-200",
                  active ? "border-accent/50" : "border-black/8",
                )}
              >
                <span className="flex items-baseline gap-4">
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      active ? "text-accent" : "text-[#0a0a0a]/30",
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      "font-display text-[clamp(1.9rem,8.5vw,3rem)] font-semibold leading-none tracking-tight transition-colors",
                      active
                        ? "text-[#0a0a0a]"
                        : "text-[#0a0a0a]/55 group-hover:text-[#0a0a0a]",
                    )}
                  >
                    {link.label}
                  </span>
                </span>
                <ArrowUpRight
                  size={22}
                  className={cn(
                    "shrink-0 text-accent transition-all duration-300",
                    active
                      ? "opacity-100"
                      : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* The primary action carries its own weight instead of being one more
            line in the list. */}
        <Link
          href="/contact"
          className="nav-item mt-8 flex items-center justify-between gap-3 rounded-2xl bg-accent px-5 py-4 text-accent-ink shadow-[0_10px_30px_-10px_rgba(110,86,255,0.6)] transition-colors hover:bg-accent-bright"
        >
          <span>
            <span className="block text-[15px] font-semibold">Обсудить проект</span>
            <span className="block text-xs text-white/75">Ответим в течение часа</span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <ArrowUpRight size={17} />
          </span>
        </Link>

        <div className="nav-item mt-3 grid grid-cols-2 gap-2.5">
          <a
            href={whatsappLink(defaultInquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-black/8 bg-white py-3 text-sm font-medium text-[#0a0a0a] shadow-sm transition-colors hover:border-black/20"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: "#25d366" }} />
            WhatsApp
          </a>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-black/8 bg-white py-3 text-sm font-medium text-[#0a0a0a] shadow-sm transition-colors hover:border-black/20"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: "#229ed9" }} />
            Telegram
          </a>
        </div>

        <div className="nav-item mt-auto flex flex-col gap-2.5 pt-10 text-sm">
          <a
            href={phoneLink}
            className="flex items-center gap-2.5 text-[#0a0a0a]/65 transition-colors hover:text-[#0a0a0a]"
          >
            <Phone size={14} className="text-accent" />
            {site.phoneDisplay}
          </a>
          <a
            href={emailLink}
            className="flex items-center gap-2.5 text-[#0a0a0a]/65 transition-colors hover:text-[#0a0a0a]"
          >
            <Mail size={14} className="text-accent" />
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Burger is a small-screen affordance only — on desktop the links are
          visible in the bar, so nothing is hidden behind an extra click. */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls="site-menu"
        className={cn(
          "relative z-80 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden",
          // The open menu is a light surface, so the trigger goes dark-on-light
          // while it is open regardless of the section underneath.
          open
            ? "border-black/10 bg-white text-[#0a0a0a] shadow-sm hover:bg-white/80"
            : onLight
              ? "border-black/10 bg-black/5 text-[#0a0a0a] hover:bg-black/10"
              : "border-white/12 bg-white/8 text-fg hover:bg-white/16",
        )}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Rendered into <body>: the header island uses backdrop-filter, which
          would otherwise become this fixed layer's containing block and shrink
          it to the island's own box. */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
