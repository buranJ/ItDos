"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import {
  whatsappLink,
  telegramLink,
  phoneLink,
  defaultInquiry,
} from "@/lib/site";
import { cn } from "@/lib/utils";

const WHATSAPP_PATH =
  "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.49-8.41";
const TELEGRAM_PATH =
  "M9.78 18.65l.28-4.23 7.68-6.92c.34-.3-.07-.45-.52-.18L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z";

const OPTIONS = [
  {
    label: "WhatsApp",
    href: whatsappLink(defaultInquiry),
    color: "#25d366",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d={WHATSAPP_PATH} />
      </svg>
    ),
    external: true,
  },
  {
    label: "Telegram",
    href: telegramLink,
    color: "#229ed9",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d={TELEGRAM_PATH} />
      </svg>
    ),
    external: true,
  },
  {
    label: "Позвонить",
    href: phoneLink,
    color: "#3a3a44",
    icon: <Phone size={18} color="#fff" strokeWidth={2} aria-hidden="true" />,
    external: false,
  },
] as const;

/**
 * Quick contact: ONE button that opens the messenger options, instead of two
 * bubbles parked bottom-right. At 390px the pair sat on top of the pricing
 * cards, the "why us" grid and the footer; one smaller target covers half as
 * much, and the options only take space while someone asked for them.
 *
 * Hidden over the first screen: the hero ends with its own CTAs at the
 * bottom on phones. It fades in once the visitor scrolls past, which is also
 * when a persistent shortcut starts earning its place. Sits below the nav
 * overlay (z-30), so the open menu hides it.
 */
export function FloatingContact() {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isOpen = open && shown;

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close on a tap/click elsewhere or Escape (focus back to the button).
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={cn(
        // Clear of the iPhone home indicator.
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex flex-col items-end gap-2.5 transition-all duration-300 sm:bottom-6 sm:right-6",
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-hidden={!shown}
      inert={!shown}
    >
      <ul
        id="quick-contact-options"
        inert={!isOpen}
        className={cn(
          "flex flex-col items-end gap-2.5",
          !isOpen && "pointer-events-none",
        )}
      >
        {OPTIONS.map((option, index) => (
          <li
            key={option.label}
            className="transition-all duration-300 ease-out"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "none" : "translateY(0.75rem) scale(0.9)",
              // Fan out from the button upwards, collapse top-down.
              transitionDelay: `${(isOpen ? OPTIONS.length - 1 - index : index) * 45}ms`,
            }}
          >
            <a
              href={option.href}
              {...(option.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              onClick={() => setOpen(false)}
              data-cursor="link"
              className="group flex items-center gap-2.5"
            >
              <span className="rounded-full border border-white/10 bg-[#141418]/90 px-3 py-1.5 text-sm font-medium text-fg shadow-lg shadow-black/30 backdrop-blur-md transition-colors group-hover:bg-[#1f1f25]">
                {option.label}
              </span>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg shadow-black/40 transition-transform duration-200 group-hover:scale-105"
                style={{ background: option.color }}
              >
                {option.icon}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="quick-contact-options"
        aria-label={isOpen ? "Закрыть варианты связи" : "Связаться с нами"}
        data-cursor="button"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_8px_28px_-6px_rgba(110,86,255,0.7)] transition-transform duration-200 hover:scale-105"
      >
        {!isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-accent opacity-25 [animation-duration:2.4s]"
          />
        )}
        <span
          className={cn(
            "relative transition-transform duration-300",
            isOpen ? "rotate-90" : "rotate-0",
          )}
        >
          {isOpen ? (
            <X size={20} strokeWidth={2} aria-hidden="true" />
          ) : (
            <MessageCircle size={21} strokeWidth={2} aria-hidden="true" />
          )}
        </span>
      </button>
    </div>
  );
}
